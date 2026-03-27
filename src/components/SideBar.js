'use client'
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {

    // hooks

    const [isOpen, setIsOpen] = useState(false);
    
    // get current pathname
    const pathname = usePathname()
    // variable to hold link class (preventing repeated code)
    const linkTagClassNameVariable = "block px-6 py-3 text-gray-700 hover:bg-white hover:text-disney-dark-blue"
    // variable to hold user feedback link class (highlights what page the user currently is at)
    const userCurrentLinkClassNameVariable = "block px-6 py-3 text-disney-dark-blue bg-white font-semibold"


    
    return(
        <>
            {/* BURGER BUTTON */}
            {/* md is a media breakpoint that is dynamic and uses 768px  */}
            {/* conditional render if menu is open or not */}
            {!isOpen && (<button 
            onClick={() => setIsOpen(true)}
            data-testid="burger-menu-button"  
            className="
            fixed 
            top-4 
            left-4 
            z-50 
            md:hidden 
            bg-disney-light-blue 
            text-disney-dark-blue 
            p-2 
            rounded-md">
                {/* (SVG from https://heroicons.com, by TailwindCSS devs, mobile use only) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        )}
            {/* SIDE BAR DIV */}
            <div className={`
            fixed 
            md:relative 
            h-screen 
            w-64 
            transition-transform 
            duration-300
            bg-disney-light-blue
            flex
            flex-col
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0
            `}>
                {/* div for TOP of sidebar for LOGO */}
                <div className="p-6 flex items-center justify-between">
                    {/* text-2xl ensures WCAG compliance with contrast at 6.9:1 for disney-dark-blue on 
                    disney-light-blue, with bold font as it is the Logo */}
                    <h1 className="text-2xl font-bold">
                        <span className="text-gray-900">Pin</span>
                        <span className="text-disney-dark-blue">Barter</span>
                    </h1>
                    {/* Close X button (mobile only) SVG from https://heroicons.com  */}
                    <button
                    onClick={() => setIsOpen(false)}
                    data-testid="x-close-button"
                    className="md:hidden text-disney-dark-blue">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/* div for LINKS to pages */}
                <div className="flex-1 flex flex-col">
                    {/* using block enables the whole link to become a clickable block 'button' style */}
                    <Link data-testid="home" href="/home" 
                    className={pathname === "/home" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        Home
                    </Link>
                    <Link data-testid="collection" href="/collection" 
                    className={pathname === "/collection" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Pins
                    </Link>
                    <Link data-testid="pins" href="/pins" 
                    className={pathname === "/pins" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        All Pins
                    </Link>
                    <Link data-testid="profile" href="/profile" 
                    className={pathname === "/profile" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Profile
                    </Link>
                    <Link data-testid="trades" href="/trades" 
                    className={pathname === "/trades" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Trades
                    </Link>
                    <Link data-testid="wishlist" href="/wishlist" 
                    className={pathname === "/wishlist" ? userCurrentLinkClassNameVariable : linkTagClassNameVariable}>
                        My Wishlist
                    </Link>
                </div>
                {/* div for BOTTOM of sidebar signout and user info */}
                <div className="items-center border-gray-200 flex flex-col pb-6">
                    {/* pre-set avatars and username section */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="
                        w-8 
                        h-8 
                        rounded-full 
                        bg-disney-dark-blue 
                        text-white 
                        flex 
                        items-center 
                        justify-center 
                        text-sm 
                        font-bold">
                            ?
                        </div>
                        {/* replace with username of signed in user */}
                        <span className="text-sm text-gray-700">Username</span>
                    </div>
                    {/* Sign Out */}
                    <div>
                        <button className="text-sm text-gray-600 hover:text-red-500">
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}