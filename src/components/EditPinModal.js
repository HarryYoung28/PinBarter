'use client'
import { useState } from "react"

export default function EditPinModal({ pin, onClose, onSuccess }) {

    // pre fill the form fields with the existing pin data
    const [name, setName] = useState(pin.name)
    const [series, setSeries] = useState(pin.series || "")
    const [description, setDescription] = useState(pin.description || "")
    const [rarity, setRarity] = useState(pin.rarity)
    const [editionSize, setEditionSize] = useState(pin.editionSize || "")

    // feedback state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit() {
        // reset error before trying again
        setError("")

        // name is required before sending to the API
        if (!name.trim()) {
            setError("Pin name is required.")
            return
        }

        setLoading(true)

        // send the updated pin fields to the API
        const response = await fetch(`/api/pins/${pin.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                series: series || null,
                description: description || null,
                rarity,
                editionSize: rarity === "Limited Edition" && editionSize ? parseInt(editionSize) : null
            })
        })

        const data = await response.json()
        setLoading(false)

        if (response.ok) {
            // tell the parent the edit was successful and pass back the updated pin
            onSuccess(data)
        } else {
            setError(data.error || "Something went wrong, please try again.")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="
                bg-white
                dark:bg-neutral-800
                rounded-lg
                p-6
                w-full
                max-w-md
                mx-4
                shadow-xl">
                <h2 className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-gray-100
                    mb-1">
                    Edit Pin
                </h2>
                <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-300
                    mb-4">
                    Update the details for this pin before approving.
                </p>

                {/* pin name - required */}
                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-1">
                    Pin Name *
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        dark:text-gray-100
                        mb-4"
                />

                {/* series - optional */}
                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-1">
                    Series
                </label>
                <input
                    type="text"
                    value={series}
                    onChange={(e) => setSeries(e.target.value)}
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
                        dark:text-gray-100
                        mb-4"
                />

                {/* description - optional */}
                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-1">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
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
                        dark:text-gray-100
                        mb-4"
                />

                {/* rarity dropdown */}
                <label className="
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                    mb-1">
                    Rarity
                </label>
                <select
                    value={rarity}
                    onChange={(e) => {
                        setRarity(e.target.value)
                        // reset edition size if user switches away from limited edition
                        if (e.target.value !== "Limited Edition") setEditionSize("")
                    }}
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
                        dark:text-gray-100
                        mb-4">
                    <option value="Standard">Standard</option>
                    <option value="Limited Run">Limited Run</option>
                    <option value="Limited Edition">Limited Edition</option>
                </select>

                {/* edition size only shows when limited edition is selected */}
                {rarity === "Limited Edition" && (
                    <>
                        <label className="
                            block
                            text-sm
                            font-medium
                            text-gray-700
                            dark:text-gray-300
                            mb-1">
                            Edition Size (optional)
                        </label>
                        <input
                            type="number"
                            placeholder="e.g. 2500 (leave blank if unknown)"
                            value={editionSize}
                            onChange={(e) => setEditionSize(e.target.value)}
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
                                dark:text-gray-100
                                mb-4"
                        />
                    </>
                )}

                {/* error message */}
                {error && (
                    <p className="text-sm text-red-500 mb-3">{error}</p>
                )}

                {/* action buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-red-500 hover:underline">
                        Cancel
                    </button>
                    <button
                        type="button"
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
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    )
}