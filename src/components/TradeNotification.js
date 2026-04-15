'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function TradeNotification() {
    const [hasActivity, setHasActivity] = useState(false)
    const { data: session } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname === '/trades') {
            setHasActivity(false)
            return
        }
        async function checkActivity() {
            const response = await fetch('/api/trades')
            const data = await response.json()
            const offersReceived = data.myListings.flatMap(l => l.trades).length
            setHasActivity(offersReceived > 0)
        }
        if (session) checkActivity()
    }, [session, pathname])

    if (!hasActivity) return null

    return (
        <span data-testid="trade-notification-dot" className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500"></span>
    )
}