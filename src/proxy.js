export { default as proxy } from "next-auth/middleware"

// if not authenticated, redirect to /login for all protected routes
export const config = {
    matcher: [
        "/home/:path*",
        "/collection/:path*",
        "/profile/:path*",
        "/trades/:path*",
        "/wishlist/:path*",
        "/pins/:path*",
        "/trading-post/:path*",
        "/admin/:path*",
        "/help/:path*",
    ]
}