'use client'
import { useRouter } from "next/navigation"

export default function PinCard({ pin }) {
    const router = useRouter()

    return (
        <div
            data-testid="pin-card"
            onClick={() => router.push(`/pins/${pin.id}`)}
            className="bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
            <img
                src={pin.imageUrl || `https://placehold.co/200x200?text=${encodeURIComponent(pin.name)}`}
                alt={pin.name}
                className="w-full aspect-square object-cover rounded-md mb-2"
            />
            <p className="text-sm font-semibold text-gray-900 truncate">{pin.name}</p>
            <p className="text-xs text-gray-500 truncate">{pin.series}</p>
            <p className="text-xs text-disney-dark-blue font-medium mt-1">
                {pin.credits} {pin.credits === 1 ? "credit" : "credits"}
            </p>
        </div>
    )
}