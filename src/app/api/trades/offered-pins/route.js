// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET returns all pin IDs that are currently committed to a pending trade
// used by the make offer form to disable pins that cannot be offered again
export async function GET(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    // find all trades where the user is the offerer and the trade is still pending
    const pendingTrades = await prisma.trade.findMany({
        where: {
            offererId: user.id,
            status: "pending"
        },
        include: {
            items: true
        }
    })

    // extract the pin IDs from the incoming items of each pending trade
    // incoming means the pin is being offered by the user
    const pinIds = pendingTrades
        .flatMap(trade => trade.items)
        .filter(item => item.direction === "incoming")
        .map(item => item.pinId)

    return NextResponse.json({ pinIds })
}