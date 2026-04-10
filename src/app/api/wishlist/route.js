import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// GET ALL PINS IN WISHLIST FOR USER
export async function GET(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { searchParams } = new URL(request.url)
    const isExport = searchParams.get("export") === "true"
    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12
    const total = await prisma.wishlist.count({
        where: { userId: user.id }
    })
    const wishlist = await prisma.wishlist.findMany({
        where: { userId: user.id },
        include: { pin: true },
        // this is essential for the printing of the wishlist (ignore pagnation and get everything)
        ...(isExport ? {} : { skip: (page - 1) * pageSize, take: pageSize })
    })
    return NextResponse.json({ wishlist, total })
}

// ADD PIN TO WISHLIST
export async function POST(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { pinId } = await request.json()
    const existing = await prisma.wishlist.findFirst({
        where: { userId: user.id, pinId: pinId }
    })
    if (existing) {
        return NextResponse.json({ error: "Pin already in wishlist" }, { status: 400 })
    }
    const wishlistEntry = await prisma.wishlist.create({
        data: { userId: user.id, pinId: pinId }
    })
    return NextResponse.json(wishlistEntry, { status: 201 })
}

// REMOVE PIN FROM WISHLIST
export async function DELETE(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })
    const { pinId } = await request.json()
    await prisma.wishlist.deleteMany({
        where: { userId: user.id, pinId: pinId }
    })
    return NextResponse.json({ message: "Pin removed from wishlist" })
}