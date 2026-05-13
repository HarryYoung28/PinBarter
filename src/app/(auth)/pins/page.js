'use client'
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import PinGrid from "@/components/PinGrid"
import SearchBar from "@/components/SearchBar"
import SuggestPinModal from "@/components/SuggestPinModal"
import toast from "react-hot-toast"
import { useSearchParams } from "next/navigation"

export default function PinsPage() {
    // hooks
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // read page from URL on load, defaulting to 1
    const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))
    const [pins, setPins] = useState([])
    const [search, setSearch] = useState("")
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)


    // controls whether the suggest a pin modal is open
    const [showSuggestModal, setShowSuggestModal] = useState(false)

    // function to fetch all pins
    async function fetchPins() {
        setLoading(true)
        // url pattern for searches in API
        const response = await fetch(`/api/pins?search=${search}&page=${page}`)
        // data will receive the response in json
        const data = await response.json()
        setPins(data.pins)
        setTotal(data.total)
        setLoading(false)
    }

    // updates page state and reflects it in the URL so returning preserves position
    function handlePageChange(newPage) {
        setPage(newPage)
        router.push(`${pathname}?page=${newPage}`, { scroll: false })
    }

    useEffect(() => {
        fetchPins()
    }, [search, page])

    const totalPages = Math.ceil(total / 12)

    return (
        <div className="p-6">
            {/* title */}
            <h1 className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-2">
                All Pins
            </h1>
            <p className="
                text-sm
                text-gray-500
                dark:text-gray-300
                mb-6">
                Browse and discover our catalogue of pins!
            </p>

            {/* search bar */}
            <SearchBar
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
                    handlePageChange(1)
                }}
            />

            {/* loading feedback for user */}
            {loading && (
                <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-300
                    text-center">
                    Searching for pins...
                </p>
            )}

            {/* no pins found */}
            {!loading && pins.length === 0 && (
                <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-300
                    text-center">
                    Uh-oh, no pins found, sorry!
                </p>
            )}

            {/* pin grid */}
            {!loading && <PinGrid pins={pins} />}

            {/* pagination buttons only show if there is more than one page */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                        onClick={() => handlePageChange(page - 1)}
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
                            disabled:opacity-50
                            disabled:hover:bg-disney-light-blue
                            disabled:hover:text-disney-dark-blue
                            disabled:cursor-not-allowed
                            dark:hover:bg-white
                            dark:hover:text-disney-dark-blue">
                        Previous Page
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
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
                            disabled:hover:bg-disney-light-blue
                            disabled:hover:text-disney-dark-blue
                            disabled:cursor-not-allowed
                            dark:hover:bg-white
                            dark:hover:text-disney-dark-blue">
                        Next Page
                    </button>
                </div>
            )}

            {/* suggest a pin banner at the bottom of the page */}
            <div className="
                mt-12
                border
                border-gray-500
                dark:border-gray-200
                rounded-lg
                p-6
                bg-white
                dark:bg-neutral-800
                flex
                flex-col
                md:flex-row
                items-center
                justify-between
                gap-4">
                <div>
                    <p className="
                        text-sm
                        font-semibold
                        text-gray-900
                        dark:text-gray-100
                        mb-1">
                        Have a pin that is not in our catalogue?
                    </p>
                    <p className="
                        text-sm
                        text-gray-500
                        dark:text-gray-300">
                        Help us grow the PinBarter collection by suggesting a new pin for review.
                    </p>
                </div>
                <button
                    data-testid="suggest-pin-button"
                    type="button"
                    onClick={() => setShowSuggestModal(true)}
                    className="
                        px-4
                        py-2
                        text-sm
                        font-medium
                        bg-disney-light-blue
                        text-disney-dark-blue
                        rounded
                        hover:bg-disney-dark-blue
                        hover:text-white
                        dark:hover:bg-white
                        dark:hover:text-disney-dark-blue
                        whitespace-nowrap">
                    Suggest a Pin
                </button>
            </div>

            {/* suggest a pin modal, only renders when open */}
            {showSuggestModal && (
                <SuggestPinModal
                    onClose={() => setShowSuggestModal(false)}
                    onSuccess={() => {
                        setShowSuggestModal(false)
                        toast("Pin submitted! It will appear in the catalogue once approved.")
                    }}
                />
            )}
        </div>
    )
}