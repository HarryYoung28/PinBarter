// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// DELETE removes a trade listing and all associated trades and trade items
export async function DELETE(request, { params }) {
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

    // find the listing to confirm it exists
    const listing = await prisma.tradeListing.findUnique({
        where: { id }
    })

    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    // only the owner of the listing can delete it
    if (listing.userId !== user.id) {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 })
    }

    // find all trades associated with this listing
    const trades = await prisma.trade.findMany({
        where: { listingId: id }
    })

    // delete trade items first due to foreign key constraints
    // trade items reference trades so they must go before trades
    for (const trade of trades) {
        await prisma.tradeItem.deleteMany({
            where: { tradeId: trade.id }
        })
    }

    // delete all trades associated with this listing
    await prisma.trade.deleteMany({
        where: { listingId: id }
    })

    // finally delete the listing itself
    await prisma.tradeListing.delete({
        where: { id }
    })

    return NextResponse.json({ message: "Listing deleted" })
}