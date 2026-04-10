// Layout.js for sidebar navigation across the (auth) group
import SideBar from "@/components/SideBar";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }){
    return (
        <div className="flex min-h-screen">
            <SideBar />
            <main className="flex-1 bg-white pt-16 md:pt-0 dark:bg-neutral-800">
                <Toaster />
                {children}
            </main>
        </div>
    )
}