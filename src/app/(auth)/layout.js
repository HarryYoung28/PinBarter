// Layout.js for sidebar navigation across the (auth) group
import SideBar from "@/components/SideBar";

export default function Layout({ children }){
    return (
        <div className="flex h-screen">
            <SideBar />
            <main className="flex-1 bg-white">
                {children}
            </main>
        </div>
    )
}