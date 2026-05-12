'use client'
import { useState } from "react"

// list of help articles and FAQs with their content
const helpItems = [
    {
        question: "What is PinBarter?",
        answer: "PinBarter is a Disney pin trading platform. You can browse a catalogue of Disney pins, build your own collection, create a wishlist of pins you want, and trade pins with other users through the Trading Post."
    },
    {
        question: "How do I add a pin to my collection?",
        answer: "Navigate to All Pins from the sidebar. Click on any pin to open its info page. Select Add to My Collection. The pin will appear in your My Pins page."
    },
    {
        question: "How do I add a pin to my wishlist?",
        answer: "Navigate to All Pins and click on a pin to open its info page. Select Add to Wishlist. You can view all your wishlisted pins on the My Wishlist page. Note that pins already in your collection cannot be added to your wishlist."
    },
    {
        question: "How do I post a pin for trade?",
        answer: "Navigate to My Pins. Click Post to Trading Post on any pin in your collection. Fill in what you are looking for in return and optionally set a credit flexibility. Your listing will appear on the Trading Post for other users to see."
    },
    {
        question: "How do I make an offer on a trade?",
        answer: "Navigate to the Trading Post from the sidebar. Find a listing you are interested in and click Make an Offer. Select up to four pins from your collection to offer. You will see a running credit total to help you meet the minimum offer value. Click Send Offer when you are ready."
    },
    {
        question: "How do I update my password?",
        answer: "Navigate to My Profile from the sidebar. In the Change Password section, enter your current password, your new password, and confirm your new password. Click Update Password. You will see a confirmation message if it is successful."
    },
    {
        question: "How do I delete my account?",
        answer: "Navigate to My Profile from the sidebar. Scroll to the Danger Zone section at the bottom of the page. Click Delete Account and confirm when prompted. This action is permanent and cannot be undone. All your pins, trades, and listings will be removed."
    }
]

// individual accordion item that tracks its own open and closed state
function HelpItem({ question, answer }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="
            border
            border-gray-500
            dark:border-gray-200
            rounded-lg
            overflow-hidden">
            {/* clickable header that toggles the answer visibility */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
                    w-full
                    flex
                    items-center
                    justify-between
                    px-6
                    py-4
                    bg-white
                    dark:bg-neutral-800
                    text-left
                    text-sm
                    font-semibold
                    text-gray-900
                    dark:text-gray-100
                    hover:bg-disney-light-blue
                    dark:hover:bg-neutral-700">
                <span>{question}</span>
                {/* arrow rotates 180 degrees when the item is open */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className={`
                        w-4
                        h-4
                        text-disney-dark-blue
                        dark:text-disney-light-blue
                        transition-transform
                        duration-200
                        ${isOpen ? "rotate-180" : ""}
                    `}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {/* answer only renders in the dom when the item is open */}
            {isOpen && (
                <div className="
                    px-6
                    py-4
                    bg-white
                    dark:bg-neutral-800
                    border-t
                    border-gray-200
                    dark:border-gray-600">
                    <p className="
                        text-sm
                        text-gray-700
                        dark:text-gray-300
                        leading-relaxed">
                        {answer}
                    </p>
                </div>
            )}
        </div>
    )
}

export default function Help() {
    return (
        <div className="p-6 max-w-2xl">
            <h1 className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-gray-100
                mb-2">
                Help
            </h1>
            <p className="
                text-sm
                text-gray-500
                dark:text-gray-300
                mb-8">
                Everything you need to know about using PinBarter.
            </p>

            {/* map over help items and render each as an accordion */}
            <div className="flex flex-col gap-3">
                {helpItems.map((item, index) => (
                    <HelpItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                    />
                ))}
            </div>
        </div>
    )
}