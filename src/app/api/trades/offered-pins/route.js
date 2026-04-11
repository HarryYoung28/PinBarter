import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const pendingTrades = await prisma.trade.findMany({
        where: {
            offererId: user.id,
            status: "pending"
        },
        include: {
            items: true
        }
    })

    const pinIds = pendingTrades
        .flatMap(trade => trade.items)
        .filter(item => item.direction === "incoming")
        .map(item => item.pinId)

    return NextResponse.json({ pinIds })
}