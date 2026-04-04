import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request) {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
        return NextResponse.json(
            { error: "All fields are required to register!"},
            { status: 400 }
        )
    }

    const existingUser = await prisma.user.findUnique({
        where: { username }
    })

    if (existingUser) {
        return NextResponse.json(
            { error: "Username already taken"},
            { status: 400 }
        )
    }

    // 10 salt rounds, secure industry standard
    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash
        }
    })

    return NextResponse.json(
        { message: "Account created successfully!", userId: user.id},
        { status: 201 }
    )
}