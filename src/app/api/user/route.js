import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(request) {
    // get the current logged in user's session on the server side
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in - reject the request
    if (!session) {
        return Response.json({ error: "Unauthorised" }, { status: 401 })
    }

    // pull the passwords out of the request body
    const { currentPassword, newPassword } = await request.json()

    // find the user in the database using their username from the session
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 })
    }

    // verify the current password against the stored hash using bcrypt
    // bcrypt.compare returns true if they match, false if not
    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash)

    if (!passwordMatch) {
        return Response.json({ error: "Current password is incorrect." }, { status: 400 })
    }

    // hash the new password before saving - never store plain text passwords
    const newHash = await bcrypt.hash(newPassword, 10)

    // update the user's password hash in the database
    await prisma.user.update({
        where: { username: session.user.username },
        data: { passwordHash: newHash }
    })

    return Response.json({ success: true })
}

export async function DELETE() {
    // get the current logged in user's session on the server side
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in - reject the request
    if (!session) {
        return Response.json({ error: "Unauthorised" }, { status: 401 })
    }

    // find the user so we have their id for deleting related records
    const user = await prisma.user.findUnique({
        where: { username: session.user.username }
    })

    if (!user) {
        return Response.json({ error: "User not found" }, { status: 404 })
    }

    // delete trade items first - they reference trades
    await prisma.tradeItem.deleteMany({ where: { trade: { offererId: user.id } } })
    await prisma.tradeItem.deleteMany({ where: { trade: { receiverId: user.id } } })

    // delete trades where user is offerer or receiver
    await prisma.trade.deleteMany({ where: { offererId: user.id } })
    await prisma.trade.deleteMany({ where: { receiverId: user.id } })

    // delete trade listings
    await prisma.tradeListing.deleteMany({ where: { userId: user.id } })

    // delete collection and wishlist
    await prisma.collection.deleteMany({ where: { userId: user.id } })
    await prisma.wishlist.deleteMany({ where: { userId: user.id } })

    // finally delete the user
    await prisma.user.delete({ where: { id: user.id } })

    // finally delete the user themselves
    await prisma.user.delete({
        where: { id: user.id }
    })

    return Response.json({ success: true })
}