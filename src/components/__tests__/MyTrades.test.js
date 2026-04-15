import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyTradesPage from '../../../src/app/(auth)/trades/page'
import TradeNotification from '../TradeNotification'

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => "/trades"
}))

jest.mock("next-auth/react", () => ({
    useSession: () => ({ data: { user: { username: 'testuser' } } }),
    signOut: jest.fn()
}))

jest.mock("react-hot-toast", () => ({
    __esModule: true,
    default: jest.fn(),
    Toaster: () => null
}))

global.fetch = jest.fn()

const mockEmptyTrades = {
    myListings: [],
    myOffers: [],
    pendingTrades: [],
    completedTrades: []
}

const mockFullTrades = {
    myListings: [
        {
            id: 'listing-1',
            pin: { id: 'pin-1', name: 'Kermit the Frog', series: 'Muppets', credits: 3 },
            wantsDescription: 'Any villain pins',
            trades: [
                {
                    id: 'trade-1',
                    status: 'pending',
                    offerer: { username: 'otheruser' },
                    items: [
                        { id: 'item-1', direction: 'incoming', pin: { name: 'Jafar', credits: 1 } }
                    ]
                }
            ]
        }
    ],
    myOffers: [
        {
            id: 'trade-2',
            status: 'pending',
            listing: { pin: { name: 'Dr Facilier', credits: 6 }, user: { username: 'otheruser' } },
            items: [
                { id: 'item-2', direction: 'incoming', pin: { name: 'Kermit the Frog', credits: 3 } }
            ]
        }
    ],
    pendingTrades: [
        {
            id: 'trade-3',
            status: 'accepted',
            offererConfirmed: false,
            receiverConfirmed: false,
            offerer: { username: 'testuser' },
            receiver: { username: 'otheruser' },
            listing: { pin: { name: 'Kermit the Frog', credits: 3 } },
            items: []
        }
    ],
    completedTrades: [
        {
            id: 'trade-4',
            status: 'completed',
            offerer: { username: 'testuser' },
            receiver: { username: 'otheruser' },
            listing: { pin: { name: 'Jafar', credits: 1 } },
            items: []
        }
    ]
}

const mockDeclinedOffer = {
    myListings: [],
    myOffers: [
        {
            id: 'trade-5',
            status: 'declined',
            listing: { pin: { name: 'Dr Facilier', credits: 6 }, user: { username: 'otheruser' } },
            items: [
                { id: 'item-3', direction: 'incoming', pin: { name: 'Kermit the Frog', credits: 3 } }
            ]
        }
    ],
    pendingTrades: [],
    completedTrades: []
}

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 12 AC-1: My Listings section renders with remove button
describe("Ticket 12 AC-1 My Listings renders correctly", () => {
    test("displays listing with pin name and remove button", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockFullTrades
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("my-listing-card")).toBeInTheDocument()
            expect(screen.getByTestId("delete-listing-button")).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-2: Offers received renders with accept and decline buttons
describe("Ticket 12 AC-2 Offers Received renders correctly", () => {
    test("displays offer with accept and decline buttons", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockFullTrades
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("offer-received-card")).toBeInTheDocument()
            expect(screen.getByTestId("accept-offer-button")).toBeInTheDocument()
            expect(screen.getByTestId("decline-offer-button")).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-3: MANUAL TEST

// Ticket 12 AC-4: Pending trades renders with mark as complete button
describe("Ticket 12 AC-4 Pending trades renders correctly", () => {
    test("displays pending trade with mark as complete button", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockFullTrades
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("pending-trade-card")).toBeInTheDocument()
            expect(screen.getByTestId("mark-complete-button")).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-5: MANUAL TEST

// Ticket 12 AC-6: My Offers renders with withdraw button
describe("Ticket 12 AC-6 My Offers renders with withdraw button", () => {
    test("displays offer with withdraw button", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockFullTrades
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("my-offer-card")).toBeInTheDocument()
            expect(screen.getByTestId("withdraw-offer-button")).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-8: Completed trades renders correctly
describe("Ticket 12 AC-8 Completed trades renders correctly", () => {
    test("displays completed trade with completed status", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockFullTrades
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("completed-trade-card")).toBeInTheDocument()
            expect(screen.getByText("Completed")).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-9: Empty state renders with browse trading post button
describe("Ticket 12 AC-9 Empty state renders correctly", () => {
    test("displays empty state with browse trading post button", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockEmptyTrades
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByText("No trade activity yet!")).toBeInTheDocument()
            expect(screen.getByRole("button", { name: /browse trading post/i })).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-10 & AC-11 MANUAL TESTING

// Ticket 12 AC-12: Declined offer shows with hide button
describe("Ticket 12 AC-12 Declined offer shows with hide button", () => {
    test("displays declined offer with hide button", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockDeclinedOffer
        })
        render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("my-offer-card")).toBeInTheDocument()
            expect(screen.getByText("Offer declined")).toBeInTheDocument()
            expect(screen.getByText("Hide")).toBeInTheDocument()
        })
    })
})

// Ticket 12 AC-13: Snapshot testing of My Trades page
describe("Ticket 12 AC-13 My Trades snapshot", () => {
    test("My Trades page matches snapshot", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockFullTrades
        })
        const { container } = render(<MyTradesPage />)
        await waitFor(() => {
            expect(screen.getByTestId("my-listing-card")).toBeInTheDocument()
        })
        expect(container).toMatchSnapshot()
    })
})