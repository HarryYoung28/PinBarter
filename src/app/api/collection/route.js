// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET all pins in the user's collection with pagination
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

    // pull page number from query string, defaulting to page 1
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const search = searchParams.get("search") || ""
    const pageSize = 12
    

    // count total collection entries for pagination calculation
    const total = await prisma.collection.count({
        where: {
            userId: user.id,
            pin: {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        }
    })

    // fetch the collection entries for the current page
    // include the full pin data so the frontend can display it
    const collection = await prisma.collection.findMany({
        where: {
            userId: user.id,
            pin: {
                name: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        },
        include: { pin: true },
        skip: (page - 1) * pageSize,
        take: pageSize
    })

    return NextResponse.json({ collection, total })
}

// POST adds a pin to the user's collection
export async function POST(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { pinId } = await request.json()

    // check if the pin is already in the collection to prevent duplicates
    const existing = await prisma.collection.findFirst({
        where: { userId: user.id, pinId: pinId }
    })

    if (existing) {
        return NextResponse.json({ error: "Pin already in collection" }, { status: 400 })
    }

    // add the pin to the collection
    const collectionEntry = await prisma.collection.create({
        data: { userId: user.id, pinId: pinId }
    })

    // if the pin is on the wishlist, remove it automatically
    // a pin you own should not also be on your wishlist
    let removedFromWishlist = false
    const wishlistEntry = await prisma.wishlist.findFirst({
        where: { userId: user.id, pinId: pinId }
    })

    if (wishlistEntry) {
        await prisma.wishlist.delete({
            where: { id: wishlistEntry.id }
        })
        removedFromWishlist = true
    }

    // return the collection entry and whether the wishlist was updated
    return NextResponse.json({ ...collectionEntry, removedFromWishlist }, { status: 201 })
}

// DELETE removes a pin from the user's collection
export async function DELETE(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { pinId } = await request.json()

    // remove the pin from the collection
    await prisma.collection.deleteMany({
        where: { userId: user.id, pinId: pinId }
    })

    return NextResponse.json({ message: "Pin removed from collection" })
}