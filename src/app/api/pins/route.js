import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request) {
    // pull search and page from the query string, defaulting to empty search and page 1
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12

    // only return approved pins, filtered by search term if provided
    const pins = await prisma.pin.findMany({
        where: {
            isApproved: true,
            name: {
                contains: search,
                mode: "insensitive"
            }
        },
        // oldest first so the catalogue order is consistent
        orderBy: {
            name: "asc"
        },
        // pagination, skip past previous pages and take one page worth
        take: pageSize,
        skip: (page - 1) * pageSize
    })

    // count total matching pins so the frontend knows how many pages there are
    const total = await prisma.pin.count({
        where: { isApproved: true, name: { contains: search, mode: "insensitive" } }
    })

    return NextResponse.json({ pins, total, page, pageSize })
}

export async function POST(request) {
    // get the current logged in user's session on the server side
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { name, series, description, rarity, editionSize } = await request.json()

    // basic validation, name and rarity are required
    if (!name || !rarity) {
        return NextResponse.json({ error: "Name and rarity are required." }, { status: 400 })
    }

    // calculate credits automatically based on rarity and edition size
    // this matches the established credit system in the platform
    function calculateCredits(rarity, editionSize) {
        if (rarity === "Standard") return 1
        if (rarity === "Limited Run") return 2
        if (rarity === "Limited Edition") {
            if (!editionSize) return 3
            if (editionSize >= 3000) return 3
            if (editionSize >= 2000) return 4
            if (editionSize >= 1000) return 5
            if (editionSize >= 500) return 6
            return 8
        }
        return 1
    }

    const credits = calculateCredits(rarity, editionSize)

    // check if a pin with this name already exists to prevent duplicates
    const existing = await prisma.pin.findFirst({
        where: { 
            name: { equals: name, mode: "insensitive" },
            series: series || null
        }
    })

    if (existing) {
        return NextResponse.json({ error: "A pin with this name and series combination already exists." }, { status: 400 })
    }

    // create the pin with isApproved false so it goes to admin review
    const pin = await prisma.pin.create({
        data: {
            name,
            series: series || null,
            description: description || null,
            rarity,
            editionSize: editionSize ? parseInt(editionSize) : null,
            credits,
            isApproved: false
        }
    })

    return NextResponse.json(pin, { status: 201 })
}