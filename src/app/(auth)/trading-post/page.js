'use client'

// imports
import { useState, useEffect } from "react"
import SearchBar from "@/components/SearchBar"
import { useSession } from "next-auth/react"
import MakeOfferForm from "@/components/MakeOfferForm"
import toast from "react-hot-toast"

export default function TradingPostPage() {

    // state
    // listings data, loading, search, sort and pagination
    const [listings, setListings] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [sort, setSort] = useState("newest")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    // tracks which listing the user has selected to make an offer on
    const [selectedListing, setSelectedListing] = useState(null)

    // hooks
    const { data: session } = useSession()

    // fetch listings from API whenever search, sort or page changes
    useEffect(() => {
        async function fetchListings() {
            setLoading(true)
            const response = await fetch(`/api/trade-listings?search=${search}&sort=${sort}&page=${page}`)
            const data = await response.json()
            setListings(data.listings)
            setTotal(data.total)
            setLoading(false)
        }
        fetchListings()
    }, [search, sort, page])

    // calculate total pages based on 12 listings per page
    const totalPages = Math.ceil(total / 12)

    // return
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Trading Post</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Browse pins available for trade!</p>

            {/* search bar and sort dropdown */}
            <div className="flex flex-col gap-2 mb-2">
                <div className="flex-1">
                    <SearchBar
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1)
                        }}
                    />
                </div>
                <select
                    data-testid="sort-select"
                    value={sort}
                    onChange={(e) => {
                        setSort(e.target.value)
                        setPage(1)
                    }}
                    className="
                    px-4 
                    py-2 
                    text-sm 
                    bg-disney-light-blue 
                    text-disney-dark-blue 
                    rounded-md 
                    border-none 
                    cursor-pointer 
                    hover:bg-disney-dark-blue 
                    hover:text-white 
                    dark:hover:bg-white 
                    dark:hover:text-disney-dark-blue 
                    font-medium
                    max-w-xs">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>

            {/* loading feedback for the user */}
            {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center">Loading listings...</p>
            )}

            {/* empty state when no listings are found */}
            {!loading && listings.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center">No listings found!</p>
            )}

            {/* listings grid and pagination */}
            {!loading && listings.length > 0 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listings.map((listing) => (
                            <div
                                key={listing.id}
                                data-testid="trade-listing-card"
                                className="
                                bg-white 
                                dark:bg-neutral-800 
                                border 
                                border-gray-500 
                                dark:border-gray-200 
                                rounded-lg 
                                p-4 
                                flex 
                                flex-col 
                                gap-2">

                                {/* pin image and basic info */}
                                <div className="flex gap-4">
                                    <img
                                        src={listing.pin.imageUrl || `https://placehold.co/80x80?text=${encodeURIComponent(listing.pin.name)}`}
                                        alt={listing.pin.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                    <div className="flex flex-col gap-1">
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
                                        font-medium">
                                            {listing.pin.credits} {listing.pin.credits === 1 ? "credit" : "credits"}
                                        </p>
                                        <p className="
                                        text-xs 
                                        text-gray-500 
                                        dark:text-gray-300">
                                            Posted by <span className="font-medium">{listing.user.username}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* what the lister is looking for and minimum offer */}
                                <div className="
                                border-t 
                                border-gray-200 
                                dark:border-gray-600 pt-2">
                                    <p className="
                                    text-xs 
                                    text-gray-600 
                                    dark:text-gray-300">
                                        <span className="font-medium">Looking for:</span> {listing.wantsDescription}
                                    </p>
                                    <p className="
                                    text-xs 
                                    text-gray-600 
                                    dark:text-gray-300 mt-1">
                                        Minimum offer:
                                            <span> {listing.creditFlexibility > 0 
                                            ? `${listing.pin.credits - listing.creditFlexibility} ${listing.pin.credits - listing.creditFlexibility === 1 ? "credit" : "credits"}` 
                                            : `${listing.pin.credits} ${listing.pin.credits === 1 ? "credit" : "credits"}`}</span>
                                    </p>
                                </div>

                                {/* make an offer button, hidden for the listing owner */}
                                {listing.user.username !== session?.user?.username && ( 
                                    <button
                                        data-testid="make-offer-button"
                                        className="
                                        mt-auto 
                                        w-full 
                                        px-4 
                                        py-2 
                                        text-sm 
                                        bg-disney-light-blue 
                                        text-disney-dark-blue 
                                        rounded 
                                        hover:bg-disney-dark-blue 
                                        hover:text-white 
                                        dark:hover:bg-white 
                                        dark:hover:text-disney-dark-blue"
                                        onClick={() => setSelectedListing(listing)}>
                                        Make an Offer
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* pagination buttons only show if there is more than one page */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 mt-8">
                            <button
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
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
                                dark:hover:text-disney-dark-blue 
                                disabled:opacity-50 
                                disabled:hover:bg-disney-light-blue 
                                disabled:cursor-not-allowed 
                                disabled:hover:text-disney-dark-blue">
                                Previous Page
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-300">Page {page} of {totalPages}</span>
                            <button
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages}
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
                                dark:hover:text-disney-dark-blue 
                                disabled:opacity-50 
                                disabled:hover:bg-disney-light-blue 
                                disabled:cursor-not-allowed 
                                disabled:hover:text-disney-dark-blue">
                                Next Page
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* make offer modal, only renders when a listing is selected */}
            {selectedListing && (
                <MakeOfferForm
                    listing={selectedListing}
                    onClose={() => setSelectedListing(null)}
                    onSuccess={() => {
                        setSelectedListing(null)
                        toast("Offer sent!")
                    }}
                />
            )}
        </div>
    )
}