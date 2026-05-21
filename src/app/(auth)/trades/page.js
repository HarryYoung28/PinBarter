'use client'
// imports
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useSession } from "next-auth/react"

export default function MyTradesPage() {

    // state
    // all trade data split into four cateogries
    const [myListings, setMyListings] = useState([])
    const [myOffers, setMyOffers] = useState([])
    const [pendingTrades, setPendingTrades] = useState([])
    const [completedTrades, setCompletedTrades] = useState([])
    const [loading, setLoading] = useState(true)

    // tracks which trade is waiting to complete
    const [confirmingTradeId, setConfirmingTradeId] = useState(null)

    // hooks
    const router = useRouter()
    const { data: session } = useSession()

    // functions
    // fetch all trade data from API
    async function fetchTrades() {
        setLoading(true)
        const response = await fetch('/api/trades')
        const data = await response.json()
        setMyListings(data.myListings)
        setMyOffers(data.myOffers)
        setPendingTrades(data.pendingTrades)
        setCompletedTrades(data.completedTrades)
        setLoading(false)
    }

    useEffect(() => {
        fetchTrades()
    }, [])

    // deletes a listing by id and refrehses trade data
    async function handleDeleteListing(listingId) {
        await fetch(`/api/trade-listings/${listingId}`, { method: 'DELETE' })
        await fetchTrades()
        toast("Listing removed!")
    }

    // handles trade actions, accept, decline, withdraw, complete 
    async function handleTradeAction(tradeId, action) {
        const response = await fetch(`/api/trades/${tradeId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action })
        })
        const data = await response.json()
        if (response.ok) {
            if (action === "accept") toast("Offer accepted! Visit r/PinBarter to organise your meetup!")
            if (action === "decline") toast("Offer declined.")
            if (action === "withdraw") toast("Offer withdrawn — your pins are now free!")
            if (action === "complete") toast(data.message === "Trade completed!" ? "Trade completed! Pins have been swapped!" : "Marked as complete! Waiting for the other user...")
            fetchTrades()
        } else {
            toast(data.error || "Something went wrong!")
        }
        setConfirmingTradeId(null)
    }

    // check if user has trade acitivity to show
    const hasActivity = myListings.length > 0 || myOffers.length > 0 || pendingTrades.length > 0 || completedTrades.length > 0

    // loading state whilst waiting for data
    if (loading) return <div className="
    p-6 
    text-sm 
    text-gray-500 
    dark:text-gray-300">Loading your trades...</div>

    // return tag
    return (
        <div className="p-6 max-w-4xl">
            <h1 className="
            text-2xl 
            font-bold 
            text-gray-900 
            dark:text-gray-100 
            mb-2">My Trades</h1>
            <p className="
            text-sm 
            text-gray-500 
            dark:text-gray-300 
            mb-6">Manage your listings, offers and trades.</p>

            {/* empty state when no activity */}
            {!hasActivity && (
                <div className="text-center mt-12">
                    <p className="
                    text-sm 
                    text-gray-500 
                    dark:text-gray-300 
                    mb-4">No trade activity yet!</p>
                    <button
                        onClick={() => router.push('/trading-post')}
                        className="
                        px-4 
                        py-2 
                        text-sm 
                        bg-disney-light-blue 
                        text-disney-dark-blue 
                        rounded-md 
                        hover:bg-disney-dark-blue 
                        hover:text-white 
                        dark:hover:bg-white 
                        dark:hover:text-disney-dark-blue">
                        Browse Trading Post
                    </button>
                </div>
            )}

            {/* My Listings */}
            {myListings.length > 0 && (
                <section className="mb-8">
                    <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-800 
                    dark:text-gray-100 
                    mb-4">My Listings</h2>
                    <div className="flex flex-col gap-4">
                        {myListings.map(listing => (
                            <div key={listing.id} data-testid="my-listing-card" className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="
                                        text-sm 
                                        font-bold 
                                        text-gray-900 
                                        dark:text-gray-100">{listing.pin.name}</p>
                                        <p className="
                                        text-xs 
                                        text-gray-500 
                                        dark:text-gray-300">{listing.pin.series}</p>
                                        <p className="
                                        text-xs 
                                        text-disney-dark-blue 
                                        dark:text-disney-light-blue 
                                        font-medium 
                                        mt-1">{listing.pin.credits} {listing.pin.credits === 1 ? "credit" : "credits"}</p>
                                        <p className="
                                        text-xs 
                                        text-gray-500 
                                        dark:text-gray-300 
                                        mt-1">Looking for: {listing.wantsDescription}</p>
                                        <p className="
                                        text-xs 
                                        text-gray-500 
                                        dark:text-gray-300">Current offers: {listing.trades.length}</p>
                                    </div>
                                    <button
                                        data-testid="delete-listing-button"
                                        onClick={() => handleDeleteListing(listing.id)}
                                        className="
                                        text-xs 
                                        text-red-500 
                                        hover:text-red-600 
                                        dark:hover:text-red-500
                                        dark:text-red-600
                                        hover:underline">
                                        Remove Listing
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Offers Received */}
            {myListings.some(l => l.trades.length > 0) && (
                <section className="mb-8">
                    <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-800 
                    dark:text-gray-100 
                    mb-4">Offers Received</h2>
                    <div className="flex flex-col gap-4">
                        {myListings.flatMap(listing =>
                            listing.trades.map(trade => (
                                <div key={trade.id} 
                                data-testid="offer-received-card" 
                                className="
                                bg-white 
                                dark:bg-neutral-800 
                                border 
                                border-gray-300 
                                dark:border-gray-600 
                                rounded-lg p-4">
                                    <p className="
                                    text-sm 
                                    font-bold 
                                    text-gray-900 
                                    dark:text-gray-100">Offer for: {listing.pin.name}</p>
                                    <p className="
                                    text-xs 
                                    text-gray-500 
                                    dark:text-gray-300 
                                    mb-2">From: <span className="font-medium">{trade.offerer.username}</span></p>
                                    <div className="mb-3">
                                        <p className="
                                        text-xs 
                                        font-medium 
                                        text-gray-700 
                                        dark:text-gray-300 
                                        mb-1">Offering:</p>
                                        {trade.items.filter(i => i.direction === "incoming").map(item => (
                                            <p key={item.id} className="
                                            text-xs 
                                            text-gray-600 
                                            dark:text-gray-400">— {item.pin.name} ({item.pin.credits} {item.pin.credits === 1 ? "credit" : "credits"})</p>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            data-testid="accept-offer-button"
                                            onClick={() => handleTradeAction(trade.id, "accept")}
                                            className="
                                            px-3 
                                            py-1 
                                            text-xs 
                                            bg-disney-light-blue 
                                            text-disney-dark-blue 
                                            rounded 
                                            hover:bg-disney-dark-blue 
                                            hover:text-white 
                                            dark:hover:bg-white 
                                            dark:hover:text-disney-dark-blue">
                                            Accept
                                        </button>
                                        <button
                                            data-testid="decline-offer-button"
                                            onClick={() => handleTradeAction(trade.id, "decline")}
                                            className="
                                            px-3 
                                            py-1 
                                            text-xs 
                                            bg-red-500 
                                            dark:bg-red-600
                                            text-black
                                            rounded 
                                            hover:bg-red-600
                                            dark:hover:bg-red-500">
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            )}

            {/* My Offers, shows offers the user has on other listings */}
            {myOffers.length > 0 && (
                <section className="mb-8">
                    <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-800 
                    dark:text-gray-100 
                    mb-4">My Offers</h2>
                    <div className="
                    flex 
                    flex-col 
                    gap-4">
                        {myOffers.map(trade => (
                            <div key={trade.id}
                            data-testid="my-offer-card" 
                            className="
                            bg-white 
                            dark:bg-neutral-800 
                            border 
                            border-gray-300 
                            dark:border-gray-600 
                            rounded-lg p-4">
                                <p className="
                                text-sm 
                                font-bold 
                                text-gray-900 
                                dark:text-gray-100">Offer on: {trade.listing.pin.name}</p>
                                <p className="
                                text-xs 
                                text-gray-500 
                                dark:text-gray-300 
                                mb-2">Listed by: <span className="font-medium">{trade.listing.user.username}</span></p>
                                <div className="mb-3">
                                    <p className="
                                    text-xs 
                                    font-medium 
                                    text-gray-700 
                                    dark:text-gray-300 mb-1">Your offer:</p>
                                    {trade.items.filter(i => i.direction === "incoming").map(item => (
                                        <p key={item.id} className="text-xs text-gray-600 dark:text-gray-400">— {item.pin.name} ({item.pin.credits} {item.pin.credits === 1 ? "credit" : "credits"})</p>
                                    ))}
                                </div>
                                {trade.status === "declined" ? (
                                    <div className="flex items-center gap-3">
                                        <p className="text-xs text-red-500 font-medium">Offer declined</p>
                                        <button
                                            onClick={() => handleTradeAction(trade.id, "dismiss")}
                                            className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
                                            Hide
                                        </button>
                                    </div>
                                ) : trade.status !== "declined" ? (
                                    <button
                                        data-testid="withdraw-offer-button"
                                        onClick={() => handleTradeAction(trade.id, "withdraw")}
                                        className="
                                        px-3 
                                        py-1 
                                        text-xs 
                                        bg-red-500 
                                        dark:bg-red-600
                                        text-white 
                                        rounded 
                                        hover:bg-red-600
                                        dark:hover:bg-red-500">
                                        Withdraw Offer
                                    </button>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Pending Trades */}
            {pendingTrades.length > 0 && (
                <section className="mb-8">
                    <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-800 
                    dark:text-gray-100 
                    mb-4">Pending Trades</h2>
                    <p className="
                    text-xs 
                    text-gray-500 
                    dark:text-gray-300 
                    mb-3">
                        Need to arrange a meetup? Visit{" "}<a 
                        href="https://reddit.com/r/PinBarter" 
                        rel="noopener noreferrer" 
                        target="_blank" 
                        className="
                        text-disney-dark-blue 
                        dark:text-disney-light-blue 
                        hover:underline">r/PinBarter</a>
                    </p>
                    <div className="flex flex-col gap-4">
                        {pendingTrades.map(trade => (
                            <div key={trade.id} 
                            data-testid="pending-trade-card" 
                            className="
                            bg-white 
                            dark:bg-neutral-800 
                            border 
                            border-gray-300 
                            dark:border-gray-600 
                            rounded-lg 
                            p-4">
                                <p className="
                                text-sm 
                                font-bold 
                                text-gray-900 
                                dark:text-gray-100">{trade.listing.pin.name}</p>
                                <p className="
                                text-xs 
                                text-gray-500 
                                dark:text-gray-300 
                                mb-2">
                                    Between:{" "} <span className="font-medium"> {trade.offerer.username}</span> and <span className="font-medium">{trade.receiver.username}</span>
                                </p>
                                <div className="mb-3">
                                    <p className="
                                    text-xs 
                                    text-gray-600 
                                    dark:text-gray-400">
                                        Offerer confirmed: <span className={trade.offererConfirmed ? "text-green-500 font-medium" : "text-red-500 font-medium"}>{trade.offererConfirmed ? "Yes" : "No"}</span>
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Receiver confirmed: <span className={trade.receiverConfirmed ? "text-green-500 font-medium" : "text-red-500 font-medium"}>{trade.receiverConfirmed ? "Yes" : "No"}</span>
                                    </p>
                                </div>
                                {confirmingTradeId === trade.id ? (
                                    <div className="
                                    flex 
                                    gap-2 
                                    items-center">
                                        <p className="
                                        text-xs 
                                        text-gray-600 
                                        dark:text-gray-300">Are you sure?</p>
                                        <button
                                            onClick={() => handleTradeAction(trade.id, "complete")}
                                            className="
                                            px-3 
                                            py-1 
                                            text-xs 
                                            bg-green-500 
                                            text-white 
                                            rounded hover:bg-green-600
                                            dark:bg-green-600
                                            dark:hover:bg-green-500">
                                            Yes, confirm
                                        </button>
                                        <button
                                            onClick={() => setConfirmingTradeId(null)}
                                            className="
                                            px-3 
                                            py-1 
                                            text-xs 
                                            bg-gray-200 
                                            dark:bg-neutral-600 
                                            text-gray-700 
                                            dark:text-gray-200 
                                            dark:hover:text-gray-700
                                            rounded 
                                            hover:bg-gray-300">
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        data-testid="mark-complete-button"
                                        onClick={() => setConfirmingTradeId(trade.id)}
                                        disabled={trade.offerer.username === session?.user?.username ? trade.offererConfirmed : trade.receiverConfirmed}
                                        className="
                                        px-3 
                                        py-1 
                                        text-xs 
                                        bg-disney-light-blue 
                                        text-disney-dark-blue 
                                        rounded 
                                        hover:bg-disney-dark-blue 
                                        hover:text-white 
                                        dark:hover:bg-white 
                                        dark:hover:text-disney-dark-blue
                                        disabled:opacity-50
                                        disabled:cursor-not-allowed">
                                        {trade.offerer.username === session?.user?.username 
                                            ? trade.offererConfirmed ? "Marked as Complete" : "Mark as Complete"
                                            : trade.receiverConfirmed ? "Marked as Complete" : "Mark as Complete"}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Completed Trades */}
            {completedTrades.length > 0 && (
                <section className="mb-8">
                    <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-800 
                    dark:text-gray-100 
                    mb-4">Completed Trades</h2>
                    <p className="
                    text-xs 
                    text-gray-500 
                    dark:text-gray-300 
                    mb-3">
                        Need to arrange another meetup? Visit:{" "}
                        <a 
                        // <a> tag instead of <Link> for external links as it can't prefetch anyway
                        href="https://reddit.com/r/PinBarter" 
                        target="_blank" 
                        className="
                        text-disney-dark-blue 
                        dark:text-disney-light-blue 
                        hover:underline">r/PinBarter</a>
                    </p>
                    <div className="
                    flex 
                    flex-col 
                    gap-4">
                        {completedTrades.map(trade => (
                            <div key={trade.id} 
                            data-testid="completed-trade-card" 
                            className="
                            bg-white 
                            dark:bg-neutral-800 
                            border 
                            border-gray-300 
                            dark:border-gray-600 rounded-lg p-4">
                                <p className="
                                text-sm 
                                font-bold 
                                text-gray-900 
                                dark:text-gray-100">{trade.listing.pin.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-300">
                                    Between:{" "}
                                    <span 
                                    className="font-medium">
                                        {trade.offerer.username}</span> and <span className="font-medium">{trade.receiver.username}    
                                    </span>
                                </p>
                                <p className="
                                text-xs 
                                text-green-500 
                                font-medium 
                                mt-1">Completed</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}