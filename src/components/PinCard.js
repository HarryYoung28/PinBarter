'use client'
import { useRouter } from "next/navigation"

export default function PinCard({ pin, showTradeButton, onTradeClick }) {
    const router = useRouter()

    return (
        <div
            data-testid="pin-card"
            onClick={() => router.push(`/pins/${pin.id}${showTradeButton ? '?from=collection' : ''}`)}
            className="
            bg-white 
            dark:bg-neutral-800 
            border 
            border-gray-500
            dark:border-gray-200 
            rounded-lg p-3 
            cursor-pointer 
            hover:shadow-md 
            transition-shadow
            hover:ring">
            <img
                src={pin.imageUrl || `https://placehold.co/200x200?text=${encodeURIComponent(pin.name)}`}
                alt={pin.name}
                className="w-full aspect-square object-cover rounded-md mb-2"
            />
            <p className="
            text-sm 
            font-semibold 
            text-gray-900 
            dark:text-gray-100 
            truncate">{pin.name}</p>
            <p className="
            text-xs 
            text-gray-500 
            dark:text-gray-300 
            truncate">{pin.series}</p>
            <p className="
            text-xs 
            text-disney-dark-blue 
            dark:text-disney-light-blue 
            font-medium mt-1">
                {pin.credits} {pin.credits === 1 ? "credit" : "credits"}
            </p>
            {showTradeButton && (
                <button
                    data-testid="trade-button"
                    onClick={(e) => {
                        e.stopPropagation()
                        onTradeClick(pin)
                    }}
                    className="
                    mt-2 
                    w-full 
                    px-2 
                    py-1 
                    text-xs 
                    bg-disney-light-blue 
                    text-disney-dark-blue 
                    rounded 
                    hover:bg-disney-dark-blue 
                    hover:text-white 
                    dark:hover:bg-white 
                    dark:hover:text-disney-dark-blue">
                    Post to Trading Post
                </button>
            )}
        </div>
    )
}