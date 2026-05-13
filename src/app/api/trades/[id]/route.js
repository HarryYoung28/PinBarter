// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// POST handles all trade actions for a specific trade by id
// actions: accept, decline, withdraw, dismiss, complete
export async function POST(request, { params }) {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { action } = await request.json()

    // find the trade including its listing and items
    const trade = await prisma.trade.findUnique({
        where: { id },
        include: { listing: true, items: true }
    })

    if (!trade) {
        return NextResponse.json({ error: "Trade not found" }, { status: 404 })
    }

    // accept: receiver accepts the offer and closes the listing
    if (action === "accept") {
        // only the receiver can accept an offer
        if (trade.receiverId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        await prisma.trade.update({
            where: { id: trade.id },
            data: { status: "accepted" }
        })
        // close the listing so no more offers can be made on it
        await prisma.tradeListing.update({
            where: { id: trade.listingId },
            data: { status: "closed" }
        })
        return NextResponse.json({ message: "Offer accepted" })
    }

    // decline: receiver declines the offer
    if (action === "decline") {
        // only the receiver can decline an offer
        if (trade.receiverId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        await prisma.trade.update({
            where: { id: trade.id },
            data: { status: "declined" }
        })
        return NextResponse.json({ message: "Offer declined" })
    }

    // withdraw: offerer withdraws their pending offer
    if (action === "withdraw") {
        // only the offerer can withdraw their own offer
        if (trade.offererId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        // cannot withdraw an offer that has already been accepted
        if (trade.status !== "pending") {
            return NextResponse.json({ error: "Cannot withdraw an accepted trade" }, { status: 400 })
        }
        await prisma.trade.update({
            where: { id: trade.id },
            data: { status: "withdrawn" }
        })
        return NextResponse.json({ message: "Offer withdrawn" })
    }

    // dismiss: offerer removes a declined offer from their view
    if (action === "dismiss") {
        // only the offerer can dismiss their own declined offer
        if (trade.offererId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }
        // delete trade items first due to foreign key constraints
        await prisma.tradeItem.deleteMany({
            where: { tradeId: trade.id }
        })
        await prisma.trade.delete({
            where: { id: trade.id }
        })
        return NextResponse.json({ message: "Offer dismissed" })
    }

    // complete: both users confirm the trade has happened in person
    if (action === "complete") {
        // both the offerer and receiver can confirm completion
        if (trade.offererId !== user.id && trade.receiverId !== user.id) {
            return NextResponse.json({ error: "Not authorised" }, { status: 403 })
        }

        // set the confirmation flag for whichever user is confirming
        const isOfferer = trade.offererId === user.id
        await prisma.trade.update({
            where: { id: trade.id },
            data: isOfferer ? { offererConfirmed: true } : { receiverConfirmed: true }
        })

        // refetch the trade to check if both users have now confirmed
        const updatedTrade = await prisma.trade.findUnique({
            where: { id: trade.id },
            include: { items: true }
        })

        // if both users have confirmed, swap the pins between collections
        if (updatedTrade.offererConfirmed && updatedTrade.receiverConfirmed) {
            const offeredPin = updatedTrade.items.find(i => i.direction === "offered")
            const incomingPins = updatedTrade.items.filter(i => i.direction === "incoming")

            // move the receiver's pin to the offerer's collection
            await prisma.collection.updateMany({
                where: { userId: trade.receiverId, pinId: offeredPin.pinId },
                data: { userId: trade.offererId }
            })

            // move each of the offerer's pins to the receiver's collection
            for (const item of incomingPins) {
                await prisma.collection.updateMany({
                    where: { userId: trade.offererId, pinId: item.pinId },
                    data: { userId: trade.receiverId }
                })
            }

            // mark the trade as completed
            await prisma.trade.update({
                where: { id: trade.id },
                data: { status: "completed" }
            })
        }

        return NextResponse.json({
            message: updatedTrade.offererConfirmed && updatedTrade.receiverConfirmed
                ? "Trade completed!"
                : "Completion confirmed"
        })
    }

    // if the action does not match any known action, return an error
    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}