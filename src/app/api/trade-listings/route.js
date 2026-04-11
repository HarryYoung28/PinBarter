import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function POST(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { pinId, wantsDescription, creditFlexibility } = await request.json()

    const existing = await prisma.tradeListing.findFirst({
        where: { userId: user.id, pinId: pinId, status: "open" }
    })
    if (existing) {
        return NextResponse.json({ error: "You already have an open listing for this pin!" }, { status: 400 })
    }

    const listing = await prisma.tradeListing.create({
        data: {
            userId: user.id,
            pinId: pinId,
            wantsDescription,
            creditFlexibility
        }
    })
    return NextResponse.json(listing, { status: 201 })
}