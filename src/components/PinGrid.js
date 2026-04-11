import PinCard from "./PinCard"

export default function PinGrid({ pins, showTradeButton, onTradeClick }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pins.map((pin) => (
                <PinCard
                    key={pin.id}
                    pin={pin}
                    showTradeButton={showTradeButton}
                    onTradeClick={onTradeClick}
                />
            ))}
        </div>
    )
}