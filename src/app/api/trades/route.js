import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const myListings = await prisma.tradeListing.findMany({
        where: { userId: user.id, status: "open" },
        include: { pin: true, trades: {
            where: { status: "pending" },
            include: {
                offerer: { select: { username: true } },
                items: { include: { pin: true } }
            }
        }}
    })

    const pendingTrades = await prisma.trade.findMany({
        where: {
            OR: [{ offererId: user.id }, { receiverId: user.id }],
            status: "accepted"
        },
        include: {
            listing: { include: { pin: true } },
            offerer: { select: { username: true } },
            receiver: { select: { username: true } },
            items: { include: { pin: true } }
        }
    })

    const completedTrades = await prisma.trade.findMany({
        where: {
            OR: [{ offererId: user.id }, { receiverId: user.id }],
            status: "completed"
        },
        include: {
            listing: { include: { pin: true } },
            offerer: { select: { username: true } },
            receiver: { select: { username: true } },
            items: { include: { pin: true } }
        }
    })

    const myOffers = await prisma.trade.findMany({
        where: { offererId: user.id, status: "pending" },
        include: {
            listing: { include: { pin: true, user: { select: { username: true } } } },
            items: { include: { pin: true } }
        }
    })

    return NextResponse.json({ myListings, pendingTrades, completedTrades, myOffers })
}

export async function POST(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { listingId, offerPinIds } = await request.json()

    const listing = await prisma.tradeListing.findUnique({
        where: { id: listingId },
        include: { pin: true }
    })

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }
    if (listing.userId === user.id) {
        return NextResponse.json({ error: "You cannot offer on your own listing!" }, { status: 400 })
    }
    if (listing.status !== "open") {
        return NextResponse.json({ error: "This listing is no longer available" }, { status: 400 })
    }

    const existingOffer = await prisma.trade.findFirst({
        where: { listingId, offererId: user.id }
    })
    if (existingOffer) {
        return NextResponse.json({ error: "You have already made an offer on this listing!" }, { status: 400 })
    }

    const offeredPins = await prisma.pin.findMany({
        where: { id: { in: offerPinIds } }
    })
    const totalCredits = offeredPins.reduce((sum, pin) => sum + pin.credits, 0)
    const minimumCredits = listing.pin.credits - listing.creditFlexibility

    if (totalCredits < minimumCredits) {
        return NextResponse.json({ error: `Your offer must be worth at least ${minimumCredits} credits!` }, { status: 400 })
    }

    const trade = await prisma.trade.create({
        data: {
            listingId,
            offererId: user.id,
            receiverId: listing.userId,
            status: "pending",
            items: {
                create: [
                    { pinId: listing.pinId, direction: "offered" },
                    ...offerPinIds.map(pinId => ({ pinId, direction: "incoming" }))
                ]
            }
        }
    })

    return NextResponse.json(trade, { status: 201 })
}