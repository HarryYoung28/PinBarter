'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PinGrid from "@/components/PinGrid"
import SearchBar from "@/components/SearchBar"

export default function PinsPage() {
    // Hooks
    const [pins, setPins] = useState([])
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Functions
    async function fetchPins() {
        setLoading(true)
        // url pattern for searches in API
        const response = await fetch(`/api/pins?search=${search}&page=${page}`)
        // data will recieve the response in json
        const data = await response.json()
        setPins(data.pins)
        setTotal(data.total)
        setLoading(false)
    }

    useEffect(() => {
        fetchPins()
    }, [search, page])

    const totalPages = Math.ceil(total / 12)

    // Tag return
    return(
        <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">All Pins</h1>
            <p className="text-sm text-gray-500 mb-6">Browse and discover our catalogue of pins!</p>

            {/* Search Bar */}
            <SearchBar
            value={search}
            onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
            }}/>

            {/* Loading feedback for user */}
            {loading && (
                <p className="text-sm text-gray-500 text-center">
                    Searching for pins...
                </p>
            )}

            {/* Pin Grid */}
            {/* No pins found */}
            {!loading && pins.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                    Uh-oh, no pins found, sorry!
                </p>
            )}

            {/* Pins found */}
            {/* breakpoints for various sizes */}
            {!loading && <PinGrid pins={pins} />}
            

            {/* Page separations */}
            {!loading && totalPages > 1 && (
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
                    disabled:opacity-50 
                    disabled:hover:bg-disney-light-blue 
                    disabled:hover:text-disney-dark-blue">
                        Previous Page
                    </button>
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
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
                    disabled:hover:bg-disney-light-blue 
                    disabled:hover:text-disney-dark-blue">
                        Next Page
                    </button>
                </div>
            )
            }

        </div>
    )
}


