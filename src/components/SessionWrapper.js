'use client'

// imports
import { SessionProvider } from "next-auth/react"

// SessionWrapper wraps the entire app so that any component inside it
// can access the current user's session using the useSession hook
// without this wrapper, NextAuth session data would not be available
// to client side components anywhere in the app (important for veriifcation)
export default function SessionWrapper({ children }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}