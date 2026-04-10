import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// CHECK A PIN IS IN WISHLIST OR NOT
export async function GET(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { searchParams } = new URL(request.url)
    const pinId = searchParams.get("pinId")
    const entry = await prisma.wishlist.findFirst({
        where: { userId: user.id, pinId: pinId }
    })
    return NextResponse.json({ inWishlist: !!entry })
}