import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username }
                })
                if (!user) return null
                // Use bcrypt compare to compare hash, hash is one way, returns true or false
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                )
                if (!passwordMatch) return null
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            }
        })
    ],
    // store the session as a JWT token cookie, select signIn page as /login for redirection
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username
            }
            return token
        },
        async session({ session, token }) {
            session.user.username = token.username
            return session
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }