import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// POST A TRADE
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

// GET ALL TRADES
export async function GET(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "newest"
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12

    // Search funcitonality to find a trade you want
    const where = {
        status: "open",
        pin: {
            name: {
                contains: search,
                mode: "insensitive"
            }
        }
    }

    const total = await prisma.tradeListing.count({ where })
    const listings = await prisma.tradeListing.findMany({
        where,
        include: {
            pin: true,
            user: {
                select: { username: true }
            }
        },
        orderBy: { createdAt: sort === "newest" ? "desc" : "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize
    })
    return NextResponse.json({ listings, total })
}