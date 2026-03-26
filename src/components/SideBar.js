'use client'
import { useState } from "react";

export default function SideBar() {

    // hooks

    const [isOpen, setIsOpen] = useState(false);

    return(
        // md is a media breakpoint that is dynamic and uses 768px
        <div className="
        fixed 
        md:relative 
        h-screen 
        w-64 
        -translate-x-full 
        md:translate-x-0 
        transition-transform 
        duration-300
        bg-white">
            {/* div for TOP of sidebar */}
            <div className="p-6">
                {/* text-2xl ensures WCAG compliance with contrast at 6.9:1 for disney-dark-blue on 
                disney-light-blue, with bold font as it is the Logo */}
                <h1 className="text-2xl font-bold">
                    <span className="text-gray-900">Pin</span>
                    <span className="text-disney-dark-blue">Barter</span>
                </h1>

            </div>
        </div>
    )
}