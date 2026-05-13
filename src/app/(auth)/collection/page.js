'use client'

// imports
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import TradeListing from "@/components/TradeListing"
import PinGrid from "@/components/PinGrid"
import toast from "react-hot-toast"

export default function Collection() {

    // state
    // collection data, loading, pagination and selected pin for trading
    const [collection, setCollection] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [selectedPin, setSelectedPin] = useState(null)

    // hooks
    const router = useRouter()

    // fetch collection from API whenever the page number changes
    useEffect(() => {
        async function fetchCollection() {
            setLoading(true)
            const response = await fetch(`/api/collection?page=${page}`)
            const data = await response.json()
            setCollection(data.collection)
            setTotal(data.total)
            setLoading(false)
        }
        fetchCollection()
    }, [page])

    // extract just the pin objects from the collection entries
    const pins = collection.map(entry => entry.pin)

    // calculate total pages based on 12 pins per page
    const totalPages = Math.ceil(total / 12)

    // return
    return (
        <div className="p-6">
            <h1 className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-2">
                My Pins
            </h1>
            <p className="
                text-sm
                text-gray-500
                dark:text-gray-300
                mb-6">
                Your personal pin collection.
            </p>

            {/* loading feedback for the user */}
            {loading && (
                <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-300
                    text-center">
                    Loading your collection...
                </p>
            )}

            {/* empty state when the user has no pins */}
            {!loading && pins.length === 0 && (
                <div className="text-center mt-12">
                    <p className="
                        text-sm
                        text-gray-500
                        dark:text-gray-300
                        mb-4">
                        You haven't added any pins yet!
                    </p>
                    <button
                        onClick={() => router.push('/pins')}
                        className="
                            px-4
                            py-2
                            text-sm
                            bg-disney-light-blue
                            text-disney-dark-blue
                            hover:text-white
                            rounded-md
                            hover:bg-disney-dark-blue
                            dark:hover:bg-white
                            dark:hover:text-disney-dark-blue">
                        Browse Pins
                    </button>
                </div>
            )}

            {/* render the pin grid and pagination when the user has pins */}
            {!loading && pins.length > 0 && (
                <>
                    {/* pass showTradeButton to show post to trading post on each card */}
                    <PinGrid
                        pins={pins}
                        showTradeButton={true}
                        onTradeClick={(pin) => setSelectedPin(pin)}
                        from="collection"
                    />

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
                            <span className="
                                text-sm
                                text-gray-600
                                dark:text-gray-300">
                                Page {page} of {totalPages}
                            </span>
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
                                    disabled:opacity-50
                                    dark:hover:bg-white
                                    dark:hover:text-disney-dark-blue
                                    disabled:hover:bg-disney-light-blue
                                    disabled:cursor-not-allowed
                                    disabled:hover:text-disney-dark-blue">
                                Next Page
                            </button>
                        </div>
                    )}

                    {/* browse more pins button at the bottom of the collection */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={() => router.push('/pins')}
                            className="
                                px-4
                                py-2
                                text-sm
                                bg-disney-light-blue
                                text-disney-dark-blue
                                rounded-md
                                hover:bg-disney-dark-blue
                                dark:hover:bg-white
                                dark:hover:text-disney-dark-blue
                                hover:text-white">
                            Browse More Pins
                        </button>
                    </div>
                </>
            )}

            {/* trade listing modal, only renders when a pin is selected for trading */}
            {selectedPin && (
                <TradeListing
                    pin={selectedPin}
                    onClose={() => setSelectedPin(null)}
                    onSuccess={() => {
                        setSelectedPin(null)
                        toast("Pin posted to Trading Post!")
                    }}
                />
            )}
        </div>
    )
}