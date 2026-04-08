import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET ALL PINS FOR USER
export async function GET(request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12

    const total = await prisma.collection.count({
        where: { userId: user.id }
    })

    const collection = await prisma.collection.findMany({
        where: { userId: user.id },
        include: { pin: true },
        skip: (page - 1) * pageSize,
        take: pageSize
    })

    return NextResponse.json({ collection, total })
}

// ADD PIN TO COLLECTION
export async function POST(request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { pinId } = await request.json()

    const existing = await prisma.collection.findFirst({
        where: { userId: user.id, pinId: pinId }
    })

    if (existing) {
        return NextResponse.json({ error: "Pin already in collection" }, { status: 400 })
    }

    const collectionEntry = await prisma.collection.create({
        data: { userId: user.id, pinId: pinId }
    })

    return NextResponse.json(collectionEntry, { status: 201 })
}

// REMOVE PIN FROM COLLECTION
export async function DELETE(request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    const { pinId } = await request.json()

    await prisma.collection.deleteMany({
        where: { userId: user.id, pinId: pinId }
    })

    return NextResponse.json({ message: "Pin removed from collection" })
}