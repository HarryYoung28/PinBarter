'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminPage() {

    // get the current logged in user's session
    const { data: session, status } = useSession()
    const router = useRouter()

    // state for pending pins fetched from the API
    const [pendingPins, setPendingPins] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // wait until session has loaded before checking role
        if (status === "loading") return

        // if user is not an admin redirect them away
        if (!session || session.user.role !== "admin") {
            router.push("/home")
            return
        }

        fetchPendingPins()
    }, [session, status])

    async function fetchPendingPins() {
        setLoading(true)
        const response = await fetch('/api/admin/pins')
        const data = await response.json()
        setPendingPins(data.pins)
        setLoading(false)
    }

    async function handleApprove(id) {
        // send PATCH request to approve the pin by its id
        const response = await fetch(`/api/pins/${id}`, {
            method: 'PATCH'
        })

        if (response.ok) {
            // remove the approved pin from the pending list without refetching
            setPendingPins(pendingPins.filter(pin => pin.id !== id))
        }
    }

    // show nothing while session is loading to avoid flash of content
    if (status === "loading") return null

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-2">
                Admin Panel
            </h1>
            <p className="
                text-sm
                text-gray-500
                dark:text-gray-300
                mb-8">
                Review and approve pins submitted by users.
            </p>

            {loading && (
                <p className="text-sm text-gray-500 dark:text-gray-300">Loading pending pins...</p>
            )}

            {/* no pending pins message */}
            {!loading && pendingPins.length === 0 && (
                <div className="
                    bg-white
                    dark:bg-neutral-800
                    border
                    border-gray-500
                    dark:border-gray-200
                    rounded-lg
                    p-6
                    text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        No pins pending approval right now.
                    </p>
                </div>
            )}

            {/* list of pending pins */}
            {!loading && pendingPins.length > 0 && (
                <div className="flex flex-col gap-4">
                    {pendingPins.map(pin => (
                        <div
                            key={pin.id}
                            className="
                                bg-white
                                dark:bg-neutral-800
                                border
                                border-gray-500
                                dark:border-gray-200
                                rounded-lg
                                p-5
                                flex
                                flex-col
                                md:flex-row
                                md:items-center
                                justify-between
                                gap-4">
                            <div className="flex flex-col gap-1">
                                <p className="
                                    text-sm
                                    font-semibold
                                    text-gray-900
                                    dark:text-gray-100">
                                    {pin.name}
                                </p>
                                {pin.series && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {pin.series}
                                    </p>
                                )}
                                {pin.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                        {pin.description}
                                    </p>
                                )}
                                <div className="flex gap-3 mt-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Rarity: {pin.rarity}
                                    </p>
                                    {pin.editionSize && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Edition: {pin.editionSize}
                                        </p>
                                    )}
                                    <p className="
                                        text-xs
                                        text-disney-dark-blue
                                        dark:text-disney-light-blue
                                        font-medium">
                                        {pin.credits} {pin.credits === 1 ? "credit" : "credits"}
                                    </p>
                                </div>
                            </div>

                            {/* approve button */}
                            <button
                                data-testid={`approve-${pin.id}`}
                                type="button"
                                onClick={() => handleApprove(pin.id)}
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
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}