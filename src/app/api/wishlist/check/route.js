// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET checks whether a specific pin is in the current user's wishlist
// returns a boolean inWishlist rather than the full entry
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

    // pull the pinId from the query string
    const { searchParams } = new URL(request.url)
    const pinId = searchParams.get("pinId")

    // check if a wishlist entry exists for this user and pin combination
    const entry = await prisma.wishlist.findFirst({
        where: { userId: user.id, pinId: pinId }
    })

    // convert to boolean so the frontend gets a simple true or false
    return NextResponse.json({ inWishlist: !!entry })
}