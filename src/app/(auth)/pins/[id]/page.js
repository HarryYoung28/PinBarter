'use client'
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function PinfoPage({ params }) {
    // Hooks
    const { id } = useParams()
    const [pin, setPin] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchPin() {
            const response = await fetch(`/api/pins/${id}`)
            const data = await response.json()
            setPin(data)
            setLoading(false)
        }
        fetchPin()
    }, [id])

    if (loading) return <div
    className="p-6 text-sm text-gray-500">Loading pinfo...</div>
    if (!pin) return <div
    className="p-6 text-sm text-gray-500">Uh-oh, this pin has not been found, sorry!</div>

    return(
        <div className="p-6 max-w-2xl">
            <button
            onClick={() => router.back()}
            className="text-sm text-disney-dark-blue hover:userline mb-6 block">
                Return to All Pins
            </button>

            <div
            className="
            bg-white
            border
            border-gray-200
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
                    <h1 className="text-2xl font-bold text-gray-900">{pin.name}</h1>
                    <p className="text-sm text-gray-500">{pin.series}</p>
                    <p className="text-sm text-gray-700 mt-2">{pin.description}</p>

                    <div className="mt-4 flex flex-col gap-1">
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Rarity:</span> {pin.rarity}
                        </p>
                        {pin.editionSize && (
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Edition Size:</span> {pin.editionSize}
                            </p>
                        )}
                        <p className="text-sm text-disney-dark-blue font-semibold mt-1">
                            {pin.credits} {pin.credits === 1 ? "credit": "credits"}
                        </p>
                    </div>
                </div>
            
            </div>
        </div>
    )
}