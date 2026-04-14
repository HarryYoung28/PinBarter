import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function DELETE(request, { params }) {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const listing = await prisma.tradeListing.findUnique({
        where: { id }
    })
    if (!listing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }
    if (listing.userId !== user.id) {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 })
    }
    await prisma.tradeListing.delete({
        where: { id }
    })
    return NextResponse.json({ message: "Listing deleted" })
}