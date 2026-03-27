import { render, screen, fireEvent } from '@testing-library/react'
import SideBar from '../SideBar'
import '@testing-library/jest-dom'

// function to mock push, usePathname will automatically return /home for testing ease of use.
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/home"
}))

// render the sidebar before each test
beforeEach(() => {
    render(<SideBar />)
  })

// AC 1 - Desktop sidebar visibility
describe("AC-1 Sidebar renders all navigation links", () => {
    test("renders all navigation links", () => {
        expect(screen.getByTestId("home")).toBeInTheDocument()
        expect(screen.getByTestId("collection")).toBeInTheDocument()
        expect(screen.getByTestId("pins")).toBeInTheDocument()
        expect(screen.getByTestId("profile")).toBeInTheDocument()
        expect(screen.getByTestId("trades")).toBeInTheDocument()
        expect(screen.getByTestId("wishlist")).toBeInTheDocument()
    })
})

// AC 2 - Desktop link navigation confirmation
describe("AC-2 Sidebar navigation links go to correct routes", () => {
    it("checks the home link navigates to /home", () => {
        expect(screen.getByTestId("home")).toHaveAttribute("href", "/home")
    })
    it("checks the collection link navigates to /collection", () => {
        expect(screen.getByTestId("collection")).toHaveAttribute("href", "/collection")
    })
    it("checks the pins link navigates to /pins", () => {
        expect(screen.getByTestId("pins")).toHaveAttribute("href", "/pins")
    })
    it("checks the profile link navigates to /profile", () => {
        expect(screen.getByTestId("profile")).toHaveAttribute("href", "/profile")
    })
    it("checks the trades link navigates to /trades", () => {
        expect(screen.getByTestId("trades")).toHaveAttribute("href", "/trades")
    })
    it("checks the wishlist link navigates to /wishlist", () => {
        expect(screen.getByTestId("wishlist")).toHaveAttribute("href", "/wishlist")
    })
})


// AC 3 - Mobile sidebar hidden, manual test needed as purely CSS elements, as Jest unable to verify 
// media sizes for TailwindCSS elements md:hidden md:translate-x-0
// Testing confirmed on an iPhone 15 Pro Max through FireFox and Safari browsers

// AC 4 - Mobile Sidebar opens when burger menu button pressed
describe("AC-4 Burger menu opens sidebar", () => {
    test("sidebar opens when burger button is clicked", () => {
        fireEvent.click(screen.getByTestId("burger-menu-button"))
        expect(screen.getByTestId("x-close-button")).toBeInTheDocument()
    })
})

// AC 5 - Mobile Sidebar closes when X button pressed

// AC 6 - Mobile Sidebar closing when redirecting to new link

// AC 7 - Highlighting on current page on navigation menu

// AC 8 - Snapshot Testing