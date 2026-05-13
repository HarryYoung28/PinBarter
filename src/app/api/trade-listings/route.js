// imports
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// POST creates a new trade listing for a pin in the user's collection
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

    const { pinId, wantsDescription, creditFlexibility } = await request.json()

    // check if the user already has an open listing for this pin
    const existing = await prisma.tradeListing.findFirst({
        where: { userId: user.id, pinId: pinId, status: "open" }
    })

    if (existing) {
        return NextResponse.json({ error: "You already have an open listing for this pin!" }, { status: 400 })
    }

    // check if the pin is already offered in a pending trade
    // this prevents the same pin being committed to two trades at once
    const pendingOffer = await prisma.trade.findFirst({
        where: {
            offererId: user.id,
            status: "pending",
            items: {
                some: {
                    pinId: pinId,
                    direction: "incoming"
                }
            }
        }
    })

    if (pendingOffer) {
        return NextResponse.json({ error: "This pin is already offered in a pending trade!" }, { status: 400 })
    }

    // create the trade listing
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

// GET returns all open trade listings with search, sort and pagination
export async function GET(request) {
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // pull search, sort and page from the query string
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "newest"
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12

    // filter to only open listings matching the search term
    const where = {
        status: "open",
        pin: {
            name: {
                contains: search,
                mode: "insensitive"
            }
        }
    }

    // count total matching listings for pagination calculation
    const total = await prisma.tradeListing.count({ where })

    // fetch the listings for the current page including pin and username
    const listings = await prisma.tradeListing.findMany({
        where,
        include: {
            pin: true,
            user: {
                select: { username: true }
            }
        },
        // sort by newest or oldest based on the sort query param
        orderBy: { createdAt: sort === "newest" ? "desc" : "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize
    })

    return NextResponse.json({ listings, total })
}