// imports
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

            // authorize runs when the user submits the login form
            // returns the user object if credentials are valid, null if not
            async authorize(credentials) {
                // find the user in the database by username
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username }
                })

                // if no user found, return null to fail authentication
                if (!user) return null

                // bcrypt compare checks the plain text password against
                // the stored hash, returns true if they match
                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.passwordHash
                )

                // if passwords do not match, return null to fail authentication
                if (!passwordMatch) return null

                // return the user object to be packed into the JWT token
                return {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],

    // store the session as a JWT token cookie
    // select /login as the sign in page for redirection
    session: {
        strategy: "jwt"
    },

    pages: {
        signIn: "/login"
    },

    callbacks: {
        // jwt runs when the token is created or updated
        // pack the user data into the token here so it persists
        async jwt({ token, user }) {
            if (user) {
                token.username = user.username
                token.email = user.email
                token.role = user.role
            }
            return token
        },

        // session runs when the session is accessed on the client
        // unpack the token data onto the session here so components can read it
        async session({ session, token }) {
            session.user.username = token.username
            session.user.email = token.email
            session.user.role = token.role
            return session
        }
    }
}

// export the handler for both GET and POST as required by Next.js App Router
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }