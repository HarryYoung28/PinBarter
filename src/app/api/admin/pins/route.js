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

    // find the user to check their role
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    // only admin users can view pending pins
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 })
    }

    // fetch all pins that are pending approval
    const pins = await prisma.pin.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: "asc" }
    })

    return NextResponse.json({ pins })
}