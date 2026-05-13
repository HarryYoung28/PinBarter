// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET returns all trade data for the current user split into four categories
// my listings, pending trades, completed trades and my offers
export async function GET() {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    // fetch open listings owned by the user including any pending offers on them
    const myListings = await prisma.tradeListing.findMany({
        where: { userId: user.id, status: "open" },
        include: {
            pin: true,
            trades: {
                where: { status: "pending" },
                include: {
                    offerer: { select: { username: true } },
                    items: { include: { pin: true } }
                }
            }
        }
    })

    // fetch accepted trades where the user is involved and both need to confirm
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

    // fetch completed trades where the user was involved
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

    // fetch offers the user has made that are still pending or have been declined
    const myOffers = await prisma.trade.findMany({
        where: { offererId: user.id, status: { in: ["pending", "declined"] } },
        include: {
            listing: { include: { pin: true, user: { select: { username: true } } } },
            items: { include: { pin: true } }
        }
    })

    return NextResponse.json({ myListings, pendingTrades, completedTrades, myOffers })
}

// POST creates a new trade offer on an existing listing
export async function POST(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { listingId, offerPinIds } = await request.json()

    // find the listing the user wants to offer on
    const listing = await prisma.tradeListing.findUnique({
        where: { id: listingId },
        include: { pin: true }
    })

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // users cannot offer on their own listings
    if (listing.userId === user.id) {
        return NextResponse.json({ error: "You cannot offer on your own listing!" }, { status: 400 })
    }

    // listing must still be open to accept offers
    if (listing.status !== "open") {
        return NextResponse.json({ error: "This listing is no longer available" }, { status: 400 })
    }

    // check for an existing pending offer from this user on this listing
    // only checking pending status so cancelled trades do not block future offers
    const existingOffer = await prisma.trade.findFirst({
        where: { listingId, offererId: user.id, status: "pending" }
    })

    if (existingOffer) {
        return NextResponse.json({ error: "You have already made an offer on this listing!" }, { status: 400 })
    }

    // calculate the total credit value of the pins being offered
    const offeredPins = await prisma.pin.findMany({
        where: { id: { in: offerPinIds } }
    })
    const totalCredits = offeredPins.reduce((sum, pin) => sum + pin.credits, 0)

    // calculate the minimum credit value the listing owner will accept
    const minimumCredits = listing.pin.credits - listing.creditFlexibility

    if (totalCredits < minimumCredits) {
        return NextResponse.json({ error: `Your offer must be worth at least ${minimumCredits} credits!` }, { status: 400 })
    }

    // create the trade with the offered pins as trade items
    // offered means the listing owner's pin, incoming means the offerer's pins
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