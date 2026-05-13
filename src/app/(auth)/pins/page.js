import { Suspense } from "react"
import PinsPage from "@/components/PinsPage"

export default function Page() {
    return (
        <Suspense fallback={null}>
            <PinsPage />
        </Suspense>
    )
}