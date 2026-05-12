'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

export default function Home() {

    // get the current logged in user's session for the welcome message
    const { data: session } = useSession()

    // state for the dashboard metrics fetched from the API
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // fetch the user's stats from the home API route on page load
        async function fetchStats() {
            const response = await fetch('/api/home')
            const data = await response.json()
            setStats(data)
            setLoading(false)
        }
        fetchStats()
    }, [])

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="
                text-2xl 
                font-bold 
                text-gray-900 
                dark:text-gray-100 
                mb-2">
                Welcome back, {session?.user?.username}!
            </h1>
            <p className="
                text-sm 
                text-gray-500 
                dark:text-gray-300 
                mb-8">
                Here's a summary of your PinBarter activity.
            </p>

            {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-300">Loading your stats...</p>
            )}

            {/* STATS GRID - shows five metric cards once loaded */}
            {!loading && stats && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                    {/* pins in collection */}
                    <div className="
                        bg-white 
                        dark:bg-neutral-800 
                        border 
                        border-gray-500 
                        dark:border-gray-200 
                        rounded-lg 
                        p-5">
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Pins in Collection
                        </p>
                        <p className="
                            text-3xl 
                            font-bold 
                            text-disney-dark-blue 
                            dark:text-disney-light-blue">
                            {stats.collectionCount}
                        </p>
                    </div>

                    {/* pins on wishlist */}
                    <div className="
                        bg-white 
                        dark:bg-neutral-800 
                        border 
                        border-gray-500 
                        dark:border-gray-200 
                        rounded-lg 
                        p-5">
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Pins in Wishlist
                        </p>
                        <p className="
                            text-3xl 
                            font-bold 
                            text-disney-dark-blue 
                            dark:text-disney-light-blue">
                            {stats.wishlistCount}
                        </p>
                    </div>

                    {/* completed trades */}
                    <div className="
                        bg-white 
                        dark:bg-neutral-800 
                        border 
                        border-gray-500 
                        dark:border-gray-200 
                        rounded-lg 
                        p-5">
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Completed Trades
                        </p>
                        <p className="
                            text-3xl 
                            font-bold 
                            text-disney-dark-blue 
                            dark:text-disney-light-blue">
                            {stats.completedTradesCount}
                        </p>
                    </div>

                    {/* pending offers */}
                    <div className="
                        bg-white 
                        dark:bg-neutral-800 
                        border 
                        border-gray-500 
                        dark:border-gray-200 
                        rounded-lg 
                        p-5">
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Pending Offers
                        </p>
                        <p className="
                            text-3xl 
                            font-bold 
                            text-disney-dark-blue 
                            dark:text-disney-light-blue">
                            {stats.pendingOffersCount}
                        </p>
                    </div>

                    {/* active listings on trading post */}
                    <div className="
                        bg-white 
                        dark:bg-neutral-800 
                        border 
                        border-gray-500 
                        dark:border-gray-200 
                        rounded-lg 
                        p-5">
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Active Listings
                        </p>
                        <p className="
                            text-3xl 
                            font-bold 
                            text-disney-dark-blue 
                            dark:text-disney-light-blue">
                            {stats.activeListingsCount}
                        </p>
                    </div>

                </div>
            )}
        </div>
    )
}