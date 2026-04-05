import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request, { params }) {
    const { id } = await params
    const pin = await prisma.pin.findUnique({
        where: { id }
    })

    if (!pin) {
        return NextResponse.json({ error: "Pin not found" }, { status: 404 })
    }

    return NextResponse.json(pin)
}