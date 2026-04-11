'use client'
import { useState } from "react"

export default function TradeListing({ pin, onClose, onSuccess }) {
    const [wantsDescription, setWantsDescription] = useState("")
    const [acceptBelow, setAcceptBelow] = useState(false)
    const [creditFlexibility, setCreditFlexibility] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit() {
        if (!wantsDescription.trim()) {
            setError("Please describe what you are looking for!")
            return
        }
        setLoading(true)
        const response = await fetch('/api/trade-listings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pinId: pin.id,
                wantsDescription,
                creditFlexibility: acceptBelow ? creditFlexibility : 0
            })
        })
        const data = await response.json()
        setLoading(false)
        if (response.ok) {
            onSuccess()
        } else {
            setError(data.error || "Something went wrong, please try again!")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">Post to Trading Post</h2>
                <p className="
                text-sm 
                text-gray-500 
                dark:text-gray-300 
                mb-4">Posting: <span className="
                font-medium 
                text-disney-dark-blue 
                dark:text-disney-light-blue">{pin.name}</span> ({pin.credits} {pin.credits === 1 ? "credit" : "credits"})</p>

                {/* What are you looking for */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    What are you looking for?
                </label>
                <textarea
                    data-testid="wants-description"
                    value={wantsDescription}
                    onChange={(e) => setWantsDescription(e.target.value)}
                    placeholder="e.g. Goofy pins, Mickey Christmas series..."
                    rows={3}
                    className="
                    w-full 
                    border 
                    border-gray-300 
                    dark:border-gray-600 
                    rounded-md 
                    p-2 
                    text-sm 
                    bg-white 
                    dark:bg-neutral-700 
                    text-gray-900 
                    dark:text-gray-100 mb-4"
                />

                {/* Accept below credit value */}
                {/* Only shows for pins that are greater than 1 credit in value */}
                {pin.credits > 1 && (
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="checkbox"
                            id="acceptBelow"
                            data-testid="accept-below-checkbox"
                            checked={acceptBelow}
                            onChange={(e) => setAcceptBelow(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="acceptBelow" className="text-sm text-gray-700 dark:text-gray-300">
                            Willing to accept below credit value?
                        </label>
                    </div>
                )}

                {/* Credit flexibility slider */}
                {acceptBelow && (
                    <div className="mb-4">
                        <label className="
                        block 
                        text-sm 
                        font-medium 
                        text-gray-700 
                        dark:text-gray-300 
                        mb-1">
                            How many credits below will you accept? <span className="
                            text-disney-dark-blue 
                            dark:text-disney-light-blue 
                            font-bold">{creditFlexibility}</span>
                        </label>
                        <input
                            type="range"
                            data-testid="credit-flexibility-slider"
                            min={1}
                            max={Math.max(1, pin.credits - 1)}
                            value={creditFlexibility}
                            onChange={(e) => setCreditFlexibility(parseInt(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>1 credit</span>
                            <span>10 credits</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Minimum offer accepted: <span className="font-medium">{Math.max(1, pin.credits - creditFlexibility)} credits</span>
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <p className="text-sm text-red-500 mb-3">{error}</p>
                )}

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        data-testid="cancel-button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-red-500 hover:underline">
                        Cancel
                    </button>
                    <button
                        data-testid="submit-trade-listing"
                        onClick={handleSubmit}
                        disabled={loading}
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
                        {loading ? "Posting..." : "Post to Trading Post"}
                    </button>
                </div>
            </div>
        </div>
    )
}