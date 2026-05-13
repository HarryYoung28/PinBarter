// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET returns all pins in the user's wishlist with pagination
// if export=true is passed, pagination is skipped and all pins are returned for printing
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

    // pull export flag and page number from the query string
    const { searchParams } = new URL(request.url)
    const isExport = searchParams.get("export") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12

    // count total wishlist entries for pagination calculation
    const total = await prisma.wishlist.count({
        where: { userId: user.id }
    })

    // fetch wishlist entries including the full pin data
    // if export is true, skip pagination and return everything for the print view
    const wishlist = await prisma.wishlist.findMany({
        where: { userId: user.id },
        include: { pin: true },
        ...(isExport ? {} : { skip: (page - 1) * pageSize, take: pageSize })
    })

    return NextResponse.json({ wishlist, total })
}

// POST adds a pin to the user's wishlist
export async function POST(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { pinId } = await request.json()

    // check if the pin is already on the wishlist to prevent duplicates
    const existing = await prisma.wishlist.findFirst({
        where: { userId: user.id, pinId: pinId }
    })

    if (existing) {
        return NextResponse.json({ error: "Pin already in wishlist" }, { status: 400 })
    }

    // add the pin to the wishlist
    const wishlistEntry = await prisma.wishlist.create({
        data: { userId: user.id, pinId: pinId }
    })

    return NextResponse.json(wishlistEntry, { status: 201 })
}

// DELETE removes a pin from the user's wishlist
export async function DELETE(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { pinId } = await request.json()

    // remove the pin from the wishlist
    await prisma.wishlist.deleteMany({
        where: { userId: user.id, pinId: pinId }
    })

    return NextResponse.json({ message: "Pin removed from wishlist" })
}