// imports
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import SessionWrapper from "@/components/SessionWrapper"
import Link from "next/link"

// load Geist fonts with CSS variable names for use in Tailwind
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

// metadata for the app including PWA manifest and Apple web app support
export const metadata = {
    title: "PinBarter",
    description: "Disney pin trading platform",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "PinBarter"
    }
}

// RootLayout wraps every page in the app
// SessionWrapper makes NextAuth session available to all client components
export default function RootLayout({ children }) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="min-h-full flex flex-col">
                <SessionWrapper>
                    {children}
                </SessionWrapper>
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
                      hover:ring-2
                      z-50">
                        ?
                  </Link>
            </body>
        </html>
    )
}