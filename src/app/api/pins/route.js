import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const page = parseInt(searchParams.get("page") || "1")
    const pageSize = 12

    const pins = await prisma.pin.findMany({
        where: {
        isApproved: true,
        name: {
            contains: search,
            mode: "insensitive"
        }
        },
        orderBy: {
        createdAt: "asc"
        },
        take: pageSize,
        skip: (page - 1) * pageSize
    })

    const total = await prisma.pin.count({
        where: { isApproved: true, name: { contains : search, mode: "insensitive" } }
    })

    return NextResponse.json({ pins, total, page, pageSize} )
}