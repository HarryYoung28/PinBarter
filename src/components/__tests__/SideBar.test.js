import { render, screen, fireEvent } from '@testing-library/react'
import SideBar from '../SideBar'
import '@testing-library/jest-dom'

// function to mock push, usePathname will automatically return /home for testing ease of use.
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/profile"
}))

// function to fix the useSession errors thrown during ticket 7.1
jest.mock("next-auth/react", () => ({
    useSession: () => ({ data: { user: { username: 'testuser' } } }),
    signOut: jest.fn()
}))

// render the sidebar before each test
beforeEach(() => {
    render(<SideBar />)
  })

// AC 1 - Desktop sidebar visibility
describe("Ticket 2 C-1 Sidebar renders all navigation links", () => {
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
describe("Ticket 2 AC-2 Sidebar navigation links go to correct routes", () => {
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
describe("Ticket 2 (updated Ticket 7.1) AC-4 Burger menu opens sidebar", () => {
    test("sidebar opens when burger button is clicked", () => {
        fireEvent.click(screen.getByTestId("burger-menu-button"))
        // expect(screen.getByTestId("x-close-button")).toBeInTheDocument()
        // This has been added in Ticket 7.1 to address the fact the X button was removed
        expect(screen.getByTestId("mobile-overlay")).toBeInTheDocument()
    })
})

// AC 5 - Mobile Sidebar closes when burger menu button pressed (updated from X button removal)
// describe("AC-5 Burger menu closes when X is clicked", () => {
describe("Ticket 2 (updated Ticket 7.1)  AC-5 Burger menu closes when Burger button is clicked whilst open", () => {
    test("sidebar closes when X button is clicked", () => {
        fireEvent.click(screen.getByTestId("burger-menu-button"))
        // This has been added in Ticket 7.1 to address the fact the X button was removed
        fireEvent.click(screen.getByTestId("burger-menu-button"))
        expect(screen.queryByTestId("sidebar-div")).toHaveClass("translate-x-full")
    })
})

// AC 6 - Mobile Sidebar closes when navigation link is selected
describe("Ticket 2 AC-6 Mobile Sidebar navigation link is selected", () => {
    test("sidebar closes when X button is clicked", () => {
        fireEvent.click(screen.getByTestId("burger-menu-button"))
        fireEvent.click(screen.getByTestId("profile"))
        expect(screen.queryByTestId("sidebar-div")).toHaveClass("translate-x-full")
    })
})

// AC 7 - Highlighting on current page on navigation menu
describe("Ticket 2 AC-7 Highlighting on current page link", () => {
    test("profile link is highlighted as it is the current page", () => {
        // text-disney-dark-blue is only on the Links that have been highlighted
        expect(screen.getByTestId("profile")).toHaveClass("text-disney-dark-blue")
    })
    test("home link is not highlighted as it is not the current page", () => {
        expect(screen.getByTestId("home")).not.toHaveClass("text-disney-dark-blue")
    })
})

// AC 8 - Snapshot Testing
describe("Ticket 2 AC-8 SideBar.js snapshot testing", () => {
    it("matches snapshot", () => {
        const { container } = render(<SideBar />)
        expect(container).toMatchSnapshot()
    })
})


// ----------------------- TICKET 7.1 ----------------------- 
// AC-1 Username in navbar
describe("Ticket 7.1 AC-1 Username displays in sidebar", () => {
    it("displays the logged in username", () => {
        expect(screen.getByText("testuser")).toBeInTheDocument()
    })
})

// AC-2 PinBarter logo directs to /home
describe("Ticket 7.1 AC-2 PinBarter logo links to home", () => {
    test("desktop logo navigates to /home", () => {
        expect(screen.getByTestId("logo-link")).toHaveAttribute("href", "/home")
    })
})

// AC-3 help icon directs to /help
describe("Ticket 7.1 AC-3 Help icon links to help page", () => {
    test("help icon navigates to /help", () => {
        expect(screen.getByTestId("help-link")).toHaveAttribute("href", "/help")
    })
})