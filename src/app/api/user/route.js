import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function PATCH(request) {
    // get the current logged in user's session on the server side
    const session = await getServerSession(authOptions)

    // if no session, user is not logged in, reject the request
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

    // hash the new password before saving, never store plain text passwords
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

    // if no session, user is not logged in, reject the request
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

    // find all trades the user is involved in as offerer or receiver
    const userTrades = await prisma.trade.findMany({
        where: {
            OR: [
                { offererId: user.id },
                { receiverId: user.id }
            ]
        },
        select: { id: true }
    })

    const tradeIds = userTrades.map(t => t.id)

    // delete trade items belonging to those trades first
    // tradeItems must go before trades due to foreign key constraints
    await prisma.tradeItem.deleteMany({
        where: { tradeId: { in: tradeIds } }
    })

    // now delete the trades themselves
    await prisma.trade.deleteMany({
        where: { id: { in: tradeIds } }
    })

    // delete trade listings, collection, and wishlist
    await prisma.tradeListing.deleteMany({ where: { userId: user.id } })
    await prisma.collection.deleteMany({ where: { userId: user.id } })
    await prisma.wishlist.deleteMany({ where: { userId: user.id } })

    // finally delete the user, this must come last as all related records
    // must be removed first due to foreign key constraints in the database
    await prisma.user.delete({ where: { id: user.id } })

    return Response.json({ success: true })
}