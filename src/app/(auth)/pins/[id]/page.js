'use client'

// imports
import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

export default function PinfoPage({ params }) {

    // hooks
    // get the pin id from the url params
    const { id } = useParams()
    const router = useRouter()

    // read the from query param to know where the user came from
    const searchParams = useSearchParams()
    const from = searchParams.get('from')

    // state
    // pin data and loading state
    const [pin, setPin] = useState(null)
    const [loading, setLoading] = useState(true)

    // collection state for the add and remove button
    const [inCollection, setInCollection] = useState(false)
    const [collectionLoading, setCollectionLoading] = useState(true)

    // wishlist state for the add and remove button
    const [inWishlist, setInWishlist] = useState(false)
    const [wishlistLoading, setWishlistLoading] = useState(true)

    // fetch the pin data by id when the component mounts
    useEffect(() => {
        async function fetchPin() {
            const response = await fetch(`/api/pins/${id}`)
            const data = await response.json()
            setPin(data)
            setLoading(false)
        }
        fetchPin()
    }, [id])

    // check if this pin is already in the user's collection
    useEffect(() => {
        async function checkCollection() {
            const response = await fetch('/api/collection')
            const data = await response.json()
            // check if any entry in the collection matches this pin id
            const found = data.collection.some(entry => entry.pinId === id)
            setInCollection(found)
            setCollectionLoading(false)
        }
        checkCollection()
    }, [id])

    // check if this pin is already in the user's wishlist
    useEffect(() => {
        async function checkWishlist() {
            const response = await fetch(`/api/wishlist/check?pinId=${id}`)
            const data = await response.json()
            setInWishlist(data.inWishlist)
            setWishlistLoading(false)
        }
        checkWishlist()
    }, [id])

    // show loading state while pin data is being fetched
    if (loading) return (
        <div className="p-6 text-sm text-gray-500">
            Loading pinfo...
        </div>
    )

    // show error state if pin is not found
    if (!pin) return (
        <div className="p-6 text-sm text-gray-500">
            Uh-oh, this pin has not been found, sorry!
        </div>
    )

    // functions
    // handles adding and removing a pin from the collection
    async function handleCollection() {
        if (inCollection) {
            // remove the pin from the collection
            await fetch('/api/collection', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            setInCollection(false)
        } else {
            // add the pin to the collection
            const response = await fetch('/api/collection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            const data = await response.json()
            setInCollection(true)
            // if the pin was on the wishlist it gets removed automatically
            if (data.removedFromWishlist) {
                setInWishlist(false)
                toast('Wish Granted! Pin added to collection, and removed from Wishlist!')
            }
        }
    }

    // handles adding and removing a pin from the wishlist
    async function handleWishlist() {
        if (inWishlist) {
            // remove the pin from the wishlist
            await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            setInWishlist(false)
        } else {
            // add the pin to the wishlist
            await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pinId: id })
            })
            setInWishlist(true)
        }
    }

    // return
    return (
        <div className="p-6 max-w-2xl">

            {/* back button uses from param to show the correct label */}
            <button
                onClick={() => router.back()}
                className="
                    text-sm
                    text-disney-dark-blue
                    dark:text-disney-light-blue
                    hover:underline
                    mb-6
                    block">
                Return to {from === 'collection' ? 'My Pins' : from === 'wishlist' ? 'My Wishlist' : 'All Pins'}
            </button>

            <h2 className="
                text-lg
                font-semibold
                text-gray-700
                dark:text-gray-300
                mb-4">
                Pin Info
            </h2>

            {/* pin detail card */}
            <div className="
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

                {/* pin image, falls back to placeholder if no image url */}
                <img
                    src={pin.imageUrl || `https://placehold.co/300x300?text=${encodeURIComponent(pin.name)}`}
                    alt={pin.name}
                    className="
                        w-full
                        md:w-64
                        aspect-square
                        object-cover
                        rounded-md">
                </img>

                <div className="flex flex-col gap-2">
                    <h1 className="
                        text-2xl
                        font-bold
                        dark:text-gray-100
                        text-gray-900">
                        {pin.name}
                    </h1>
                    <p className="text-sm dark:text-gray-300 text-gray-500">{pin.series}</p>
                    <p className="text-sm dark:text-gray-100 text-gray-700 mt-2">{pin.description}</p>

                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-sm dark:text-gray-300 text-gray-600">
                            <span className="font-medium">Rarity:</span> {pin.rarity}
                        </p>

                        {/* only show edition size if it exists */}
                        {pin.editionSize && (
                            <p className="text-sm dark:text-gray-300 text-gray-600">
                                <span className="font-medium">Edition Size:</span> {pin.editionSize}
                            </p>
                        )}

                        <p className="
                            text-sm
                            text-disney-dark-blue
                            dark:text-disney-light-blue
                            font-semibold
                            mt-1">
                            {pin.credits} {pin.credits === 1 ? "credit" : "credits"}
                        </p>

                        {/* add and remove collection button, only shows once collection check is done */}
                        {/* long lines but ternary operator difficult to split up code in */}
                        {!collectionLoading && !wishlistLoading && (
                            <button
                                onClick={handleCollection}
                                className={`mt-4 px-4 py-2 rounded text-sm font-medium ${
                                    inCollection
                                        ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white'
                                        : 'bg-disney-light-blue text-disney-dark-blue dark:hover:bg-white dark:hover:text-disney-dark-blue hover:bg-disney-dark-blue hover:text-white'
                                }`}>
                                {inCollection ? 'Remove from Collection' : 'Add to My Collection'}
                            </button>
                        )}

                        {/* add and remove wishlist button, disabled if pin is already in collection */}
                        {!wishlistLoading && !collectionLoading && (
                            <button
                                data-testid="wishlist-button"
                                onClick={handleWishlist}
                                disabled={inCollection}
                                className={`mt-2 px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                                    inWishlist
                                        ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white'
                                        : 'bg-disney-light-blue text-disney-dark-blue dark:hover:bg-white dark:hover:text-disney-dark-blue hover:bg-disney-dark-blue hover:text-white'
                                }`}>
                                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}