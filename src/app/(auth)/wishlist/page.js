'use client'

// imports
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import PinGrid from "@/components/PinGrid"

export default function WishlistPage() {

    // state
    // wishlist data, loading state and pagination
    const [wishlist, setWishlist] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    // hooks
    const router = useRouter()

    // fetch wishlist from API whenever the page number changes
    useEffect(() => {
        async function fetchWishlist() {
            setLoading(true)
            const response = await fetch(`/api/wishlist?page=${page}`)
            const data = await response.json()
            setWishlist(data.wishlist)
            setTotal(data.total)
            setLoading(false)
        }
        fetchWishlist()
    }, [page])

    // extract just the pin objects from the wishlist entries
    const pins = wishlist.map(entry => entry.pin)

    // calculate total pages based on 12 pins per page
    const totalPages = Math.ceil(total / 12)

    // functions
    // opens a print window with a formatted wishlist table
    async function handleExport() {
        // fetch all wishlist pins without pagination for the export
        const response = await fetch('/api/wishlist?export=true')
        const data = await response.json()
        const pins = data.wishlist.map(entry => entry.pin)

        // open a new window and write a formatted HTML table for printing
        const printWindow = window.open('', '_blank')
        printWindow.document.write(`
            <html>
                <head>
                    <title>My PinBarter Wishlist</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 32px; color: #111; }
                        h1 { color: #113ccf; margin-bottom: 4px; }
                        p.subtitle { color: #555; font-size: 14px; margin-bottom: 24px; }
                        table { width: 100%; border-collapse: collapse; }
                        th { background: #bff5fd; color: #113ccf; text-align: left; padding: 10px; font-size: 14px; }
                        td { padding: 10px; font-size: 13px; border-bottom: 1px solid #ddd; }
                        tr:nth-child(even) { background: #f9f9f9; }
                    </style>
                </head>
                <body>
                    <h1>PinBarter — My Wishlist</h1>
                    <p class="subtitle">Printed on ${new Date().toLocaleDateString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Pin Name</th>
                                <th>Series</th>
                                <th>Rarity</th>
                                <th>Credits</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pins.map(pin => `
                                <tr>
                                    <td>${pin.name}</td>
                                    <td>${pin.series || 'N/A'}</td>
                                    <td>${pin.rarity || 'N/A'}</td>
                                    <td>${pin.credits}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `)
        printWindow.document.close()
        printWindow.print()
    }

    // return
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">My Wishlist</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Pins you're looking for.</p>

            {/* loading feedback for the user */}
            {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-300 text-center">Loading your wishlist...</p>
            )}

            {/* empty state when the user has no pins on their wishlist */}
            {!loading && pins.length === 0 && (
                <div className="text-center mt-12">
                    <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">No wishes to grant!</p>
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

            {/* render pin grid and pagination when the user has wishlist pins */}
            {!loading && pins.length > 0 && (
                <>
                    {/* export button to print the wishlist as a formatted table */}
                    <div className="mb-4 flex justify-start">
                        <button
                            data-testid="export-wishlist-button"
                            onClick={handleExport}
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
                            Export Wishlist
                        </button>
                    </div>

                    <PinGrid pins={pins} />

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
        </div>
    )
}