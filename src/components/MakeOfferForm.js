'use client'
import { useState, useEffect } from "react"

export default function MakeOfferForm({ listing, onClose, onSuccess }) {
    const [collection, setCollection] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPins, setSelectedPins] = useState([null])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [overValueWarning, setOverValueWarning] = useState(false)

    useEffect(() => {
        async function fetchAvailablePins() {
            const collectionRes = await fetch('/api/collection')
            const collectionData = await collectionRes.json()

            const listingsRes = await fetch('/api/trade-listings/mine')
            const listingsData = await listingsRes.json()

            const offeredRes = await fetch('/api/trades/offered-pins')
            const offeredData = await offeredRes.json()


            const listedPinIds = listingsData.listings.map(l => l.pinId)
            const offeredPinIds = offeredData.pinIds

            const available = collectionData.collection
                .map(entry => entry.pin)
                .filter(pin => !listedPinIds.includes(pin.id) && !offeredPinIds.includes(pin.id))

            setCollection(available)
            setLoading(false)
        }
        fetchAvailablePins()
    }, [])

    const totalCredits = selectedPins.reduce((sum, pinId) => {
        const pin = collection.find(p => p.id === pinId)
        return sum + (pin ? pin.credits : 0)
    }, 0)

    const minimumCredits = listing.pin.credits - listing.creditFlexibility
    const meetsMinimum = totalCredits >= minimumCredits
    const hasSelection = selectedPins.some(p => p !== null)

    function handlePinChange(index, pinId) {
        const updated = [...selectedPins]
        updated[index] = pinId || null
        setSelectedPins(updated)
    }

    function addSlot() {
        if (selectedPins.length < 4) {
            setSelectedPins([...selectedPins, null])
        }
    }

    function removeSlot(index) {
        const updated = selectedPins.filter((_, i) => i !== index)
        setSelectedPins(updated.length === 0 ? [null] : updated)
    }

    function getAvailableForSlot(index) {
        const otherSelected = selectedPins.filter((p, i) => i !== index && p !== null)
        return collection.filter(pin => !otherSelected.includes(pin.id))
    }

    async function handleSubmit() {
        if (!hasSelection) {
            setError("Please select at least one pin to offer!")
            return
        }
        if (!meetsMinimum) {
            setError(`Your offer must be worth at least ${minimumCredits} credits!`)
            return
        }
        // checks if the user is going to offer more than the value of the pin to confirm
        if (totalCredits > listing.pin.credits && !overValueWarning) {
            setOverValueWarning(true)
            return
        }
        setSubmitting(true)
        const offerPinIds = selectedPins.filter(p => p !== null)
        const response = await fetch('/api/trades', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                listingId: listing.id,
                offerPinIds
            })
        })
        const data = await response.json()
        setSubmitting(false)
        if (response.ok) {
            onSuccess()
        } else {
            setError(data.error || "Something went wrong, please try again!")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Make an Offer</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                    Offering for: <span className="
                    font-medium 
                    text-disney-dark-blue 
                    dark:text-disney-light-blue">{listing.pin.name}</span> ({listing.pin.credits} {listing.pin.credits === 1 ? "credit" : "credits"})
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                    Minimum offer: <span className="font-medium">{minimumCredits} credits</span>
                </p>

                {loading && (
                    <p className="
                    text-sm 
                    text-gray-500 
                    dark:text-gray-300 
                    text-center 
                    py-4">Loading your collection...</p>
                )}

                {!loading && collection.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-300 text-center py-4">You have no pins available to offer!</p>
                )}

                {!loading && collection.length > 0 && (
                    <>
                        <div className="flex flex-col gap-3 mb-4">
                            {selectedPins.map((selectedPinId, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <select
                                        data-testid={`pin-select-${index}`}
                                        value={selectedPinId || ""}
                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                        className="
                                        flex-1 
                                        border 
                                        border-gray-300 
                                        dark:border-gray-600 
                                        rounded-md 
                                        p-2 
                                        text-sm 
                                        bg-white 
                                        dark:bg-neutral-700 
                                        text-gray-900 
                                        dark:text-gray-100">
                                        <option value="">Select a pin...</option>
                                        {getAvailableForSlot(index).map(pin => (
                                            <option key={pin.id} value={pin.id}>
                                                {pin.name} ({pin.credits} {pin.credits === 1 ? "credit" : "credits"})
                                            </option>
                                        ))}
                                    </select>
                                    {selectedPins.length > 1 && (
                                        <button
                                            onClick={() => removeSlot(index)}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium">
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {selectedPins.length < 4 && (
                            <button
                                onClick={addSlot}
                                className="
                                text-sm 
                                text-disney-dark-blue 
                                dark:text-disney-light-blue 
                                hover:underline 
                                mb-4 
                                block">
                                + Add another pin
                            </button>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mb-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Your offer total: <span data-testid="offer-total" className={`font-bold ${meetsMinimum ? 'text-green-500' : 'text-red-500'}`}>{totalCredits} credits</span>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Minimum required: <span className="font-medium">{minimumCredits} credits</span>
                            </p>
                        </div>
                    </>
                )}

                {overValueWarning && (
                    <div className="
                    bg-yellow-50 
                    dark:bg-yellow-900/20 
                    border 
                    border-yellow-300 
                    dark:border-yellow-600 
                    rounded-md 
                    p-3 
                    mb-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
                            You are offering more than the pin's credit value! Are you happy to continue?
                        </p>
                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => setOverValueWarning(false)}
                                className="
                                px-3 
                                py-1 
                                text-xs 
                                rounded 
                                bg-gray-200 
                                dark:bg-neutral-600 
                                text-gray-700 
                                dark:text-gray-200 
                                hover:bg-gray-300 
                                dark:hover:bg-neutral-500">
                                Go back
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-3 py-1 text-xs rounded bg-yellow-400 hover:bg-yellow-500 text-stone-950 font-medium">
                                Yes, send offer anyway
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="text-sm text-red-500 mb-3">{error}</p>
                )}

                <div className="flex gap-3 justify-end">
                    <button
                        data-testid="cancel-offer-button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:underline">
                        Cancel
                    </button>
                    <button
                        data-testid="submit-offer-button"
                        onClick={handleSubmit}
                        disabled={submitting || !hasSelection || !meetsMinimum || overValueWarning}
                        className="
                        px-4 
                        py-2 
                        text-sm 
                        bg-disney-light-blue 
                        text-disney-dark-blue 
                        rounded 
                        hover:bg-disney-dark-blue 
                        hover:text-white 
                        dark:hover:bg-white 
                        dark:hover:text-disney-dark-blue 
                        disabled:opacity-50 
                        disabled:cursor-not-allowed">
                        {submitting ? "Sending..." : "Send Offer"}
                    </button>
                </div>
            </div>
        </div>
    )
}