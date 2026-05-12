'use client'
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

export default function PinfoPage({ params }) {
    // Hooks
    const { id } = useParams()
    const [pin, setPin] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const [inCollection, setInCollection] = useState(false)
    const [collectionLoading, setCollectionLoading] = useState(true)
    const [inWishlist, setInWishlist] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(true)
    const searchParams = useSearchParams()
    const from = searchParams.get('from')

    useEffect(() => {
        async function fetchPin() {
            const response = await fetch(`/api/pins/${id}`)
            const data = await response.json()
            setPin(data)
            setLoading(false)
        }
        fetchPin()
    }, [id])

    useEffect(() => {
        async function checkCollection() {
            const response = await fetch('/api/collection')
            const data = await response.json()
            const found = data.collection.some(entry => entry.pinId === id)
            setInCollection(found)
            setCollectionLoading(false)
        }
        checkCollection()
    }, [id])

    useEffect(() => {
        async function checkWishlist() {
            const response = await fetch(`/api/wishlist/check?pinId=${id}`)
            const data = await response.json()
            setInWishlist(data.inWishlist)
            setWishlistLoading(false)
        }
        checkWishlist()
    }, [id])

    if (loading) return <div
    className="p-6 text-sm text-gray-500">Loading pinfo...</div>
    if (!pin) return <div
    className="p-6 text-sm text-gray-500">Uh-oh, this pin has not been found, sorry!</div>

    async function handleCollection() {
        if (inCollection) {
            await fetch('/api/collection', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            setInCollection(false)
        } else {
            const response = await fetch('/api/collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            const data = await response.json()
            setInCollection(true)
            if (data.removedFromWishlist) {
                setInWishlist(false)
                toast('Wish Granted! Pin added to collection, and removed from Wishlist!')
            }
        }
    }

    async function handleWishlist() {
        if (inWishlist) {
            await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            setInWishlist(false)
        } else {
            await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            setInWishlist(true)
        }
    }

    return(
        <div className="p-6 max-w-2xl">
            <button
            onClick={() => router.back()}
            className="text-sm text-disney-dark-blue dark:text-disney-light-blue hover:underline mb-6 block">
                {/* checks where the user came from for appropriate return */}
                Return to {from === 'collection' ? 'My Pins' : 'All Pins'}
            </button>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Pin Info</h2>
            <div
            className="
            bg-white
            dark:bg-neutral-800
            border
            border-gray-500
            dark:border-gray-200
            rounded-lg
            p-6
            flex
            flex-col
            md:flex-row
            gap-6">
                <img
                src={pin.imageUrl || `https://placehold.co/300x300?text=${encodeURIComponent(pin.name)}`}
                alt={pin.name}
                className="w-full md:w-64 aspect-square object-cover rounded-md">
                </img>
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold dark:text-gray-100 text-gray-900">{pin.name}</h1>
                    <p className="text-sm dark:text-gray-300 text-gray-500">{pin.series}</p>
                    <p className="text-sm dark:text-gray-100 text-gray-700 mt-2">{pin.description}</p>

                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-sm dark:text-gray-300 text-gray-600">
                            <span className="font-medium">Rarity:</span> {pin.rarity}
                        </p>
                        {pin.editionSize && (
                            <p className="text-sm dark:text-gray-300 text-gray-600">
                                <span className="font-medium">Edition Size:</span> {pin.editionSize}
                            </p>
                        )}
                        <p className="text-sm text-disney-dark-blue dark:text-disney-light-blue font-semibold mt-1">
                            {pin.credits} {pin.credits === 1 ? "credit": "credits"}
                        </p>
                        {!collectionLoading && (
                            <button
                            onClick={handleCollection}
                            className={`mt-4 px-4 py-2 rounded text-sm font-medium ${
                                inCollection ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white' : 
                                'bg-disney-light-blue text-disney-dark-blue dark:hover:bg-white dark:hover:text-disney-dark-blue hover:bg-disney-dark-blue hover:text-white'}`}>
                                    {inCollection ? 'Remove from Collection' : 'Add to My Collection'}
                            </button>
                        )}
                        {!wishlistLoading && (
                            <button
                            data-testid="wishlist-button"
                            onClick={handleWishlist}
                            disabled={inCollection}
                            className={`mt-2 px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                inWishlist ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white' :
                                'bg-disney-light-blue text-disney-dark-blue dark:hover:bg-white dark:hover:text-disney-dark-blue hover:bg-disney-dark-blue hover:text-white'}`}>
                                    {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </button>
                        )}
                    </div>
                </div>
            
            </div>
        </div>
    )
}