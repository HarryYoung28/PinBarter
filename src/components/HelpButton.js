'use client'

// imports
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"

export default function HelpButton() {

    const { data: session } = useSession()
    const pathname = usePathname()

    // only show on authenticated pages, not login or register
    if (!session) return null
    if (pathname === '/login' || pathname === '/register') return null

    return (
        <Link
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="
                fixed
                bottom-6
                right-6
                md:left-6
                md:right-auto
                w-10
                h-10
                rounded-full
                bg-disney-dark-blue
                text-white
                flex
                items-center
                justify-center
                text-sm
                font-bold
                ring-1
                ring-white
                hover:ring-3
                z-50">
            ?
        </Link>
    )
}