'use client'
import { useState } from "react"

export default function SuggestPinModal({ onClose, onSuccess }) {

    // form field state
    const [name, setName] = useState("")
    const [series, setSeries] = useState("")
    const [description, setDescription] = useState("")
    const [rarity, setRarity] = useState("Standard")
    const [editionSize, setEditionSize] = useState("")

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

        const response = await fetch('/api/pins', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                series: series || null,
                description: description || null,
                rarity,
                // only send edition size if limited edition is selected
                editionSize: rarity === "Limited Edition" && editionSize ? parseInt(editionSize) : null
            })
        })

        const data = await response.json()
        setLoading(false)

        if (response.ok) {
            // tell the parent the submission was successful
            onSuccess()
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
                    Suggest a Pin
                </h2>
                <p className="
                    text-sm
                    text-gray-500
                    dark:text-gray-300
                    mb-4">
                    Submit a pin to be reviewed by our team. It will appear in the catalogue once approved.
                </p>

                {/* pin name (required) */}
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
                    data-testid="pin-name"
                    type="text"
                    placeholder="e.g. Kermit the Frog"
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

                {/* series (optional) */}
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
                    data-testid="pin-series"
                    type="text"
                    placeholder="e.g. Muppets Christmas Carol"
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

                {/* description (optional) */}
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
                    data-testid="pin-description"
                    placeholder="Describe the pin..."
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

                {/* rarity dropdown (optional defaults to not rare)*/}
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
                    data-testid="pin-rarity"
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
                            Edition Size (if known)
                        </label>
                        <input
                            data-testid="pin-edition-size"
                            type="number"
                            placeholder="e.g. 2500"
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
                        data-testid="cancel-suggest"
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-red-500 hover:underline">
                        Cancel
                    </button>
                    <button
                        data-testid="submit-suggest"
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
                        {loading ? "Submitting..." : "Submit Pin"}
                    </button>
                </div>
            </div>
        </div>
    )
}