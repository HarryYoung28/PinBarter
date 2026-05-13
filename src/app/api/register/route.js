// imports
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

// POST registers a new user account
export async function POST(request) {
    const { username, email, password } = await request.json()

    // validate that all fields are present before proceeding
    if (!username || !email || !password) {
        return NextResponse.json(
            { error: "All fields are required to register!" },
            { status: 400 }
        )
    }

    // check if the username is already taken
    const existingUser = await prisma.user.findUnique({
        where: { username }
    })

    if (existingUser) {
        return NextResponse.json(
            { error: "Username already taken" },
            { status: 400 }
        )
    }

    // hash the password before storing, 10 salt rounds is a secure industry standard
    const passwordHash = await bcrypt.hash(password, 10)

    // create the new user in the database
    const user = await prisma.user.create({
        data: {
            username,
            email,
            passwordHash
        }
    })

    return NextResponse.json(
        { message: "Account created successfully!", userId: user.id },
        { status: 201 }
    )
}