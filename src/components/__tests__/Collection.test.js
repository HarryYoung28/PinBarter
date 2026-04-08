import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PinfoPage from '../../../src/app/(auth)/pins/[id]/page'
import Collection from '../../../src/app/(auth)/collection/page'

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
describe("Ticket 8 AC-1 Add to collection button", () => {
    test("shows Add to My Collection and switches to Remove after clicking", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockPin })
            .mockResolvedValueOnce({ json: async () => ({ collection: [], total: 0 }) })
            .mockResolvedValueOnce({ json: async () => ({}) })
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