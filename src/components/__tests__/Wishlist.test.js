import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WishlistPage from '../../../src/app/(auth)/wishlist/page'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush })
}))

// Mock next-auth
jest.mock("next-auth/react", () => ({
    useSession: () => ({ data: { user: { username: 'testuser' } } }),
    signOut: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

// Mock window.open for export tests
global.open = jest.fn(() => ({
    document: {
        write: jest.fn(),
        close: jest.fn()
    },
    print: jest.fn()
}))

// Testing wishlist data
const mockWishlist = {
    wishlist: [
        {
            id: 'wish-1',
            pinId: 'pin-1',
            pin: {
                id: 'pin-1',
                name: 'Kermit the Frog',
                series: 'Muppets Christmas Carol',
                imageUrl: null,
                credits: 3,
                rarity: 'Limited Edition',
                editionSize: 3500,
            }
        }
    ],
    total: 1
}

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 10 AC-5: Wishlist page displays pins in a pin grid
describe("Ticket 10 AC-5 Wishlist page renders pins", () => {
    test("displays pins in the wishlist", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockWishlist
        })
        render(<WishlistPage />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
    })
})

// Ticket 10 AC-6: Empty wishlist shows "No wishes to grant!" and Browse Pins button
describe("Ticket 10 AC-6 Empty wishlist state", () => {
    test("shows empty message and browse pins button when wishlist is empty", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({ wishlist: [], total: 0 })
        })
        render(<WishlistPage />)
        await waitFor(() => {
            expect(screen.getByText("No wishes to grant!")).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /browse pins/i })).toBeInTheDocument()
        })
    })
})

// Ticket 10 AC-7: Export Wishlist button opens a print friendly view
describe("Ticket 10 AC-7 Export Wishlist button", () => {
    test("clicking Export Wishlist opens a new print window", async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: async () => mockWishlist
            })
            .mockResolvedValueOnce({
                json: async () => mockWishlist
            })
        render(<WishlistPage />)
        await waitFor(() => {
            expect(screen.getByTestId("export-wishlist-button")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByTestId("export-wishlist-button"))
        await waitFor(() => {
            expect(global.open).toHaveBeenCalledWith('', '_blank')
        })
    })
})

// Ticket 10 AC-8: Snapshot testing of the wishlist page
describe("Ticket 10 AC-8 Wishlist page snapshot", () => {
    test("wishlist page matches snapshot", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockWishlist
        })
        const { container } = render(<WishlistPage />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
        expect(container).toMatchSnapshot()
    })
})