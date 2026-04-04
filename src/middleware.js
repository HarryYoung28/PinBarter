export { default } from "next-auth/middleware"

// if not authed as signed in in these routes, redirect to sign in (/login)
export const config = {
    matcher: [
        "/home/:path*",
        "/collection/:path*",
        "/profile/:path*",
        "/trades/:path*",
        "/wishlist/:path*",
        "/pins/:path*",
    ]
}