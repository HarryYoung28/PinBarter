'use client'
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react"
import TradeNotification from "./TradeNotification";

export default function SideBar() {

    // hooks

    const [isOpen, setIsOpen] = useState(false);
    
    // get current pathname
    const pathname = usePathname()
    // variable to hold link class (preventing repeated code)
    // using block enables the whole link to become a clickable block 'button' style
    const linkTagClassNameVariable = "block px-6 py-3 text-gray-700 hover:bg-white dark:hover:bg-neutral-800 dark:hover:text-disney-light-blue hover:text-disney-dark-blue"
    // variable to hold user feedback link class (highlights what page the user currently is at)
    const userCurrentLinkClassNameVariable = "block px-6 py-3 text-disney-dark-blue bg-white font-semibold dark:text-disney-light-blue dark:bg-neutral-800"

    const { data: session } = useSession()

    function closeSideBar() {
        setIsOpen(false);
    }


    
    return(
        <>
            {/* MOBILE TOP NAVBAR */}
            <div className="
            md:hidden 
            fixed 
            top-0 
            left-0 
            right-0 
            z-50 
            bg-disney-light-blue
            px-4 
            py-3 
            flex 
            items-center 
            justify-between">
                <Link 
                href={'/home'} 
                onClick={closeSideBar}
                data-testid="logo-link"><h1 className="text-xl font-bold">
                    <span className="text-gray-900">Pin</span>
                    <span className="text-disney-dark-blue">Barter</span>
                </h1>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    data-testid="burger-menu-button"
                    className="text-disney-dark-blue p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>
            {/* MOBILE OVERLAY (dims background) */}
            {isOpen && (
                <div
                data-testid="mobile-overlay"
                className="md:hidden fixed inset-0 z-40 bg-gray-600/60"
                onClick={closeSideBar}>
                </div>
            )}
            {/* SIDE BAR DIV */}
            <div data-testid="sidebar-div"
            className={`
                fixed
                top-14
                bottom-0
                md:relative
                md:top-0
                z-50
                w-64
                transition-transform
                duration-300
                bg-disney-light-blue
                flex
                flex-col
                overflow-y-auto
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0
            `}>
                {/* div for TOP of sidebar for LOGO */}
                <div className="hidden md:flex p-6 flex items-center justify-between">
                    {/* text-2xl ensures WCAG compliance with contrast at 6.9:1 for disney-dark-blue on 
                    disney-light-blue, with bold font as it is the Logo */}
                    <Link href={'/home'}><h1 className="text-2xl font-bold">
                        <span className="text-gray-900">Pin</span>
                        <span className="text-disney-dark-blue">Barter</span>
                    </h1>
                    </Link>
                </div>
                {/* div for LINKS to pages */}
                <div className="flex-1 flex flex-col">
                    <Link data-testid="home" href="/home" onClick={closeSideBar}
                    className={pathname === "/home" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        Home
                    </Link>
                    <Link data-testid="collection" href="/collection" onClick={closeSideBar}
                    className={pathname === "/collection" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Pins
                    </Link>
                    <Link data-testid="pins" href="/pins" onClick={closeSideBar}
                    className={pathname === "/pins" || pathname.startsWith("/pins/") ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        All Pins
                    </Link>
                    <Link data-testid="trading-post" href="/trading-post" onClick={closeSideBar}
                    className={pathname === "/trading-post" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        Trading Post
                    </Link>
                    <Link data-testid="profile" href="/profile" onClick={closeSideBar}
                    className={pathname === "/profile" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Profile
                    </Link>
                    <Link data-testid="trades" href="/trades" onClick={closeSideBar}
                    className={pathname === "/trades" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Trades <TradeNotification />
                    </Link>
                    <Link data-testid="wishlist" href="/wishlist" onClick={closeSideBar}
                    className={pathname === "/wishlist" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Wishlist
                    </Link>
                </div>
                {/* div for BOTTOM of sidebar signout and user info */}
                <div className="items-center border-gray-200 flex flex-col pb-6">
                    <div className="flex flex-col items-center gap-3 mb-4">
                        {/*  username of signed in user */}
                        <span className="text-sm text-gray-700">{session?.user?.username}</span>
                        {/* help link */}
                        <Link href={'/help'} data-testid="help-link" onClick={closeSideBar} className="
                        w-8 
                        h-8 
                        rounded-full 
                        bg-disney-dark-blue 
                        text-white 
                        flex 
                        items-center 
                        justify-center 
                        text-sm 
                        font-bold
                        hover:ring-2">
                            ?
                        </Link>
                    </div>
                    {/* Sign Out -- using signOut from NextAuth destroys the JWT, redirects to Login */}
                    <div>
                        <button className="text-sm text-gray-600 hover:underline hover:text-red-500"
                        onClick={() => signOut({ callbackUrl: '/login' })}>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}