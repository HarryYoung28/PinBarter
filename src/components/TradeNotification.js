'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function TradeNotification() {
    const [hasActivity, setHasActivity] = useState(false)
    const { data: session } = useSession()
    const pathname = usePathname()

    useEffect(() => {
        async function checkActivity() {
            const response = await fetch('/api/trades')
            const data = await response.json()

            const offersReceived = data.myListings.flatMap(l => l.trades).length

            const pendingConfirmation = data.pendingTrades.filter(trade => 
                !trade.offererConfirmed || !trade.receiverConfirmed
            ).length

            setHasActivity(offersReceived + pendingConfirmation > 0)
        }
        if (session) checkActivity()
    }, [session, pathname])

    if (!hasActivity) return null

    return (
        <span className="ml-2 inline-block w-2 h-2 rounded-full bg-red-500"></span>
    )
}