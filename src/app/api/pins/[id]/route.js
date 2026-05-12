import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
    const { id } = await params

    // find the pin by its id
    const pin = await prisma.pin.findUnique({
        where: { id }
    })

    // if no pin found return a 404
    if (!pin) {
        return NextResponse.json({ error: "Pin not found" }, { status: 404 })
    }

    return NextResponse.json(pin)
}

export async function PATCH(request, { params }) {
    const { id } = await params

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

    // only admin users can edit or approve pins
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 })
    }

    const body = await request.json()

    // if approve is in the body just set isApproved to true
    // otherwise update the pin fields that were passed in
    if (body.approve) {
        const pin = await prisma.pin.update({
            where: { id },
            data: { isApproved: true }
        })
        return NextResponse.json(pin)
    }

    // calculate credits automatically based on updated rarity and edition size
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

    const credits = calculateCredits(body.rarity, body.editionSize)

    // update the pin with the new fields sent from the edit modal
    const pin = await prisma.pin.update({
        where: { id },
        data: {
            name: body.name,
            series: body.series || null,
            description: body.description || null,
            rarity: body.rarity,
            editionSize: body.editionSize ? parseInt(body.editionSize) : null,
            credits
        }
    })

    return NextResponse.json(pin)
}

export async function DELETE(request, { params }) {
    const { id } = await params

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

    // only admin users can delete pins
    if (!user || user.role !== "admin") {
        return NextResponse.json({ error: "Not authorised" }, { status: 403 })
    }

    // delete the pin from the database
    await prisma.pin.delete({
        where: { id }
    })

    return NextResponse.json({ success: true })
}