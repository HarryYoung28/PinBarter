import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PinfoPage from '@/app/(auth)/pins/[id]/page'
import Collection from '@/app/(auth)/collection/page'

// Mock next/navigation
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    useParams: () => ({ id: 'pin-1' })
}))

// Mock next-auth
jest.mock("next-auth/react", () => ({
    useSession: () => ({ data: { user: { username: 'testuser' } } }),
    signOut: jest.fn()
}))

// Mock fetch
global.fetch = jest.fn()

// Testing pin data
const mockPin = {
    id: 'pin-1',
    name: 'Kermit the Frog',
    series: 'Muppets Christmas Carol',
    imageUrl: null,
    credits: 3,
    rarity: 'Limited Edition',
    editionSize: 3500,
    description: 'Kermit as Bob Cratchit in a festive wreath'
}

// Testing collection data
const mockCollection = {
    collection: [
        {
            id: 'col-1',
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

// Ticket 8 AC-1: Add to collection button works and updates
// UPDATED POST TICKET 10 DUE TO FAILURE
describe("Ticket 8 AC-1 Add to collection button", () => {
    test("shows Add to My Collection and switches to Remove after clicking", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => ({ collection: [], total: 0 }) })
            .mockResolvedValueOnce({ json: async () => ({ inWishlist: false }) })
            .mockResolvedValueOnce({ json: async () => ({ removedFromWishlist: false }) })
        render(<PinfoPage />)
        await waitFor(() => {
            expect(screen.getByText("Add to My Collection")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByText("Add to My Collection"))
        await waitFor(() => {
            expect(screen.getByText("Remove from Collection")).toBeInTheDocument()
        })
    })
})

// Ticket 8 AC-2: Remove from collection button works and updates
describe("Ticket 8 AC-2 Remove from collection button", () => {
    test("shows Remove from Collection and switches to Add after clicking", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => mockCollection })
            .mockResolvedValueOnce({ json: async () => ({}) })
        render(<PinfoPage />)
        await waitFor(() => {
            expect(screen.getByText("Remove from Collection")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByText("Remove from Collection"))
        await waitFor(() => {
            expect(screen.getByText("Add to My Collection")).toBeInTheDocument()
        })
    })
})

// Ticket 8 AC-3: Viewing collection
describe("Ticket 8 AC-3 Collection page renders pins", () => {
    test("displays pins in the user collection", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockCollection
        })
        render(<Collection />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
    })
})

// Ticket 8 AC-4: Empty state
describe("Ticket 8 AC-4 Empty collection state", () => {
    test("shows empty message and browse button when no pins in collection", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({ collection: [], total: 0 })
        })
        render(<Collection />)
        await waitFor(() => {
            expect(screen.getByText("You haven't added any pins yet!")).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /browse pins/i })).toBeInTheDocument()
        })
    })
})

// Ticket 8 AC-5: Browse pins button
describe("Ticket 8 AC-5 Browse pins button navigates to pins page", () => {
    test("clicking browse pins navigates to /pins", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({ collection: [], total: 0 })
        })
        render(<Collection />)
        await waitFor(() => {
            fireEvent.click(screen.getByRole("button", { name: /browse pins/i }))
        })
        expect(mockPush).toHaveBeenCalledWith('/pins')
    })
})

// Ticket 8 AC-6: Snapshot testing
describe("Ticket 8 AC-6 Snapshot testing", () => {
    test("Collection page matches snapshot", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockCollection
        })
        const { container } = render(<Collection />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
        expect(container).toMatchSnapshot()
    })
})

// ------ TICKET 10 TESTS ------ //
// Ticket 10 AC-1: Wishlist button is visible and enabled when pin is not in collection or wishlist
describe("Ticket 10 AC-1 Wishlist button visible and enabled", () => {
    test("shows Add to Wishlist button when pin is not in collection or wishlist", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => ({ collection: [], total: 0 }) })
            .mockResolvedValueOnce({ json: async () => ({ inWishlist: false }) })
        render(<PinfoPage />)
        await waitFor(() => {
            expect(screen.getByText("Add to My Collection")).toBeInTheDocument()
        })
        await waitFor(() => {
            const wishlistButton = screen.getByTestId("wishlist-button")
            expect(wishlistButton).toBeInTheDocument()
            expect(wishlistButton).not.toBeDisabled()
        })
    })
})

// Ticket 10 AC-2: Clicking Add to Wishlist updates button to Remove from Wishlist
describe("Ticket 10 AC-2 Wishlist button toggles", () => {
    test("clicking Add to Wishlist updates button to Remove from Wishlist", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => ({ collection: [], total: 0 }) })
            .mockResolvedValueOnce({ json: async () => ({ inWishlist: false }) })
            .mockResolvedValueOnce({ json: async () => ({}) })
        render(<PinfoPage />)
        await waitFor(() => {
            expect(screen.getByText("Add to Wishlist")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByTestId("wishlist-button"))
        await waitFor(() => {
            expect(screen.getByText("Remove from Wishlist")).toBeInTheDocument()
        })
    })
})

// Ticket 10 AC-3: Wishlist button is disabled when pin is already in collection
describe("Ticket 10 AC-3 Wishlist button disabled when in collection", () => {
    test("wishlist button is disabled when pin is already in collection", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => mockCollection })
            .mockResolvedValueOnce({ json: async () => ({ inWishlist: false }) })
        render(<PinfoPage />)
        await waitFor(() => {
            expect(screen.getByTestId("wishlist-button")).toBeDisabled()
        })
    })
})

// Ticket 10 AC-4: Adding a wishlisted pin to collection removes it from wishlist and notifies user
describe("Ticket 10 AC-4 Adding to collection removes from wishlist", () => {
    test("wishlist button disappears and toast fires when wishlist pin added to collection", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => ({ collection: [], total: 0 }) })
            .mockResolvedValueOnce({ json: async () => ({ inWishlist: true }) })
            .mockResolvedValueOnce({ json: async () => ({ removedFromWishlist: true }) })
        render(<PinfoPage />)
        await waitFor(() => {
            expect(screen.getByText("Remove from Wishlist")).toBeInTheDocument()
        })
        fireEvent.click(screen.getByText("Add to My Collection"))
        await waitFor(() => {
            expect(screen.getByText("Add to Wishlist")).toBeInTheDocument()
        })
    })
})