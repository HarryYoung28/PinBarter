import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Offer logic
export async function POST(request, { params }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { action } = await request.json()
    const trade = await prisma.trade.findUnique({
        where: { id },
        include: { listing: true, items: true }
    })
    if (!trade) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 })
    }

    if (action === "accept") {
        if (trade.receiverId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        await prisma.trade.update({
            where: { id: trade.id },
            data: { status: "accepted" }
        })
        await prisma.tradeListing.update({
            where: { id: trade.listingId },
            data: { status: "closed" }
        })
        return NextResponse.json({ message: "Offer accepted" })
    }

    if (action === "decline") {
        if (trade.receiverId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        await prisma.trade.update({
            where: { id: trade.id },
            data: { status: "declined" }
        })
        return NextResponse.json({ message: "Offer declined" })
    }

    if (action === "withdraw") {
        if (trade.offererId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        if (trade.status !== "pending") {
            return NextResponse.json({ error: "Cannot withdraw an accepted trade" }, { status: 400 })
        }
        await prisma.trade.update({
            where: { id: trade.id },
            data: { status: "withdrawn" }
        })
        return NextResponse.json({ message: "Offer withdrawn" })
    }

    if (action === "dismiss") {
        if (trade.offererId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        await prisma.tradeItem.deleteMany({
            where: { tradeId: trade.id }
        })
        await prisma.trade.delete({
            where: { id: trade.id }
        })
        return NextResponse.json({ message: "Offer dismissed" })
    }

    if (action === "complete") {
        if (trade.offererId !== user.id && trade.receiverId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        const isOfferer = trade.offererId === user.id
        await prisma.trade.update({
            where: { id: trade.id },
            data: isOfferer ? { offererConfirmed: true } : { receiverConfirmed: true }
        })
        const updatedTrade = await prisma.trade.findUnique({
            where: { id: trade.id },
            include: { items: true }
        })
        if (updatedTrade.offererConfirmed && updatedTrade.receiverConfirmed) {
            const offeredPin = updatedTrade.items.find(i => i.direction === "offered")
            const incomingPins = updatedTrade.items.filter(i => i.direction === "incoming")
            await prisma.collection.updateMany({
                where: { userId: trade.receiverId, pinId: offeredPin.pinId },
                data: { userId: trade.offererId }
            })
            for (const item of incomingPins) {
                await prisma.collection.updateMany({
                    where: { userId: trade.offererId, pinId: item.pinId },
                    data: { userId: trade.receiverId }
                })
            }
            await prisma.trade.update({
                where: { id: trade.id },
                data: { status: "completed" }
            })
        }
        return NextResponse.json({ message: "Completion confirmed" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}