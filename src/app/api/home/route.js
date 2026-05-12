import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET() {
    // get the current logged in user's session on the server side
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    // count all pins in the user's collection
    const collectionCount = await prisma.collection.count({
        where: { userId: user.id }
    })

    // count all pins on the user's wishlist
    const wishlistCount = await prisma.wishlist.count({
        where: { userId: user.id }
    })

    // count all trades the user has completed as either offerer or receiver
    const completedTradesCount = await prisma.trade.count({
        where: {
            OR: [
                { offererId: user.id },
                { receiverId: user.id }
            ],
            status: "completed"
        }
    })

    // count all pending offers the user is involved in
    const pendingOffersCount = await prisma.trade.count({
        where: {
            OR: [
                { offererId: user.id },
                { receiverId: user.id }
            ],
            status: "pending"
        }
    })

    // count all open listings the user has on the trading post
    const activeListingsCount = await prisma.tradeListing.count({
        where: { userId: user.id, status: "open" }
    })

    return NextResponse.json({
        collectionCount,
        wishlistCount,
        completedTradesCount,
        pendingOffersCount,
        activeListingsCount
    })
}