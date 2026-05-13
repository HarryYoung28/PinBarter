'use client'

// imports
import { useRouter } from "next/navigation"

export default function PinCard({ pin, showTradeButton, onTradeClick }) {

    // hooks
    const router = useRouter()

    // return
    return (
        <div
            data-testid="pin-card"
            // if showTradeButton is true the card came from My Pins so pass from=collection
            onClick={() => router.push(`/pins/${pin.id}${showTradeButton ? '?from=collection' : ''}`)}
            className="
                bg-white
                dark:bg-neutral-800
                border
                border-gray-500
                dark:border-gray-200
                rounded-lg
                p-3
                cursor-pointer
                hover:shadow-md
                transition-shadow
                hover:ring">

            {/* pin image, falls back to placeholder if no image url, for new pins or broken links*/}
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
                truncate">
                {pin.name}
            </p>
            <p className="
                text-xs
                text-gray-500
                dark:text-gray-300
                truncate">
                {pin.series}
            </p>
            <p className="
                text-xs
                text-disney-dark-blue
                dark:text-disney-light-blue
                font-medium
                mt-1">
                {pin.credits} {pin.credits === 1 ? "credit" : "credits"}
            </p>

            {/* post to trading post button, only shows on My Pins page */}
            {showTradeButton && (
                <button
                    data-testid="trade-button"
                    onClick={(e) => {
                        // stop click propagating to the card so it doesnt navigate to pin info
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