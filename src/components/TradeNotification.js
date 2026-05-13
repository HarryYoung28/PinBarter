'use client'

// imports
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

// TradeNotification shows a small red dot next to My Trades in the sidebar
// when the user has pending offers received on their listings
export default function TradeNotification() {

    // state
    // tracks whether there is any unread trade activity
    const [hasActivity, setHasActivity] = useState(false)

    // hooks
    const { data: session } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        // if the user is already on the trades page, clear the notification
        if (pathname === '/trades') {
            setHasActivity(false)
            return
        }

        // check if the user has any pending offers on their listings
        async function checkActivity() {
            const response = await fetch('/api/trades')
            const data = await response.json()

            // count all pending offers across all of the user's listings
            const offersReceived = data.myListings.flatMap(l => l.trades).length
            setHasActivity(offersReceived > 0)
        }

        // only check if the user is logged in
        if (session) checkActivity()
    }, [session, pathname])

    // return null if there is no activity so nothing renders
    if (!hasActivity) return null

    // return
    return (
        <span
            data-testid="trade-notification-dot"
            className="
                ml-2
                inline-block
                w-2
                h-2
                rounded-full
                bg-red-500">
        </span>
    )
}