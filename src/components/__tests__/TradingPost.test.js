import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TradingPostPage from '@/app/(auth)/trading-post/page'
import TradeListing from '../TradeListing'
import MakeOfferForm from '../MakeOfferForm'

const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => "/trading-post"
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

const mockPin = {
    id: 'pin-1',
    name: 'Kermit the Frog',
    series: 'Muppets Christmas Carol',
    imageUrl: null,
    credits: 3
}

const mockPin1Credit = {
    id: 'pin-2',
    name: 'Max as Powerline',
    series: 'A Goofy Movie',
    imageUrl: null,
    credits: 1
}

const mockListing = {
    id: 'listing-1',
    pinId: 'pin-1',
    wantsDescription: 'Any Goofy pins',
    creditFlexibility: 1,
    status: 'open',
    pin: mockPin,
    user: { username: 'otheruser' }
}

const mockOwnListing = {
    id: 'listing-2',
    pinId: 'pin-2',
    wantsDescription: 'Any villain pins',
    creditFlexibility: 0,
    status: 'open',
    pin: mockPin,
    user: { username: 'testuser' }
}

const mockListings = { listings: [mockListing], total: 1 }
const mockOwnListings = { listings: [mockOwnListing], total: 1 }

const mockCollection = {
    collection: [
        { pin: mockPin },
        { pin: mockPin1Credit }
    ]
}

const mockMineListings = { listings: [] }
const mockOfferedPins = { pinIds: [] }

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 11 AC-1: Post to Trading Post modal renders with correct fields
describe("Ticket 11 AC-1 Trade listing modal renders correctly", () => {
    test("modal shows pin name, description field and submit button", () => {
        render(<TradeListing pin={mockPin} onClose={jest.fn()} onSuccess={jest.fn()} />)
        expect(screen.getByRole("heading", { name: "Post to Trading Post" })).toBeInTheDocument()
        expect(screen.getByText(/Kermit the Frog/)).toBeInTheDocument()
        expect(screen.getByTestId("wants-description")).toBeInTheDocument()
        expect(screen.getByTestId("accept-below-checkbox")).toBeInTheDocument()
        expect(screen.getByTestId("submit-trade-listing")).toBeInTheDocument()
    })
})

// Ticket 11 AC-2: Credit flexibility hidden for 1 credit pins
describe("Ticket 11 AC-2 Credit flexibility hidden for 1 credit pins", () => {
    test("accept below checkbox is hidden when pin is worth 1 credit", () => {
        render(<TradeListing pin={mockPin1Credit} onClose={jest.fn()} onSuccess={jest.fn()} />)
        expect(screen.queryByTestId("accept-below-checkbox")).not.toBeInTheDocument()
    })
})

// Ticket 11 AC-3 and AC-4 were completed purely via manual testing

// Ticket 11 AC-5: Trading Post renders search bar and sort dropdown
describe("Ticket 11 AC-5 Trading Post search and sort renders", () => {
    test("renders search bar and sort dropdown", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({ listings: [], total: 0 })
        })
        render(<TradingPostPage />)
        await waitFor(() => {
            expect(screen.getByTestId("pin-search")).toBeInTheDocument()
            expect(screen.getByTestId("sort-select")).toBeInTheDocument()
        })
    })
})

// Ticket 11 AC-6: Make an Offer button hidden on own listings
describe("Ticket 11 AC-6 Make an Offer hidden on own listings", () => {
    test("hides Make an Offer button on own listings", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => mockOwnListings
        })
        render(<TradingPostPage />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
        expect(screen.queryByTestId("make-offer-button")).not.toBeInTheDocument()
    })
})

// Ticket 11 AC-7: Credit total updates and validates minimum
describe("Ticket 11 AC-7 Credit total updates correctly", () => {
    test("credit total shows red when below minimum and green when meets minimum", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockCollection })
            .mockResolvedValueOnce({ json: async () => mockMineListings })
            .mockResolvedValueOnce({ json: async () => mockOfferedPins })
        render(<MakeOfferForm listing={mockListing} onClose={jest.fn()} onSuccess={jest.fn()} />)
        await waitFor(() => {
            expect(screen.getByTestId("pin-select-0")).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId("pin-select-0"), { target: { value: 'pin-2' } })
        await waitFor(() => {
            const redSpan = screen.getByTestId("offer-total")
            expect(redSpan).toHaveClass("text-red-500")
        })
        fireEvent.change(screen.getByTestId("pin-select-0"), { target: { value: 'pin-1' } })
        await waitFor(() => {
            const greenSpan = screen.getByTestId("offer-total")
            expect(greenSpan).toHaveClass("text-green-500")
        })
    })
})

// Ticket 11 AC-8 is manual test only, tested live data in the db to confirm behaviour

// Ticket 11 AC-9: Over value warning appears when offering more than pin credit value
describe("Ticket 11 AC-9 Over value warning", () => {
    test("shows warning when offer exceeds pin credit value", async () => {
        const lowCreditListing = {
            ...mockListing,
            creditFlexibility: 0,
            pin: mockPin1Credit
        }
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockCollection })
            .mockResolvedValueOnce({ json: async () => mockMineListings })
            .mockResolvedValueOnce({ json: async () => mockOfferedPins })
        render(<MakeOfferForm listing={lowCreditListing} onClose={jest.fn()} onSuccess={jest.fn()} />)
        await waitFor(() => {
            expect(screen.getByTestId("pin-select-0")).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId("pin-select-0"), { target: { value: 'pin-1' } })
        fireEvent.click(screen.getByTestId("submit-offer-button"))
        await waitFor(() => {
            expect(screen.getByText(/You are offering more than the pin's credit value/)).toBeInTheDocument()
        })
    })
})

// Ticket 11 AC-10: Snapshot testing of the Trading Post page
describe("Ticket 11 AC-10 Trading Post snapshot", () => {
    test("Trading Post page matches snapshot", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({ listings: [mockListing], total: 1 })
        })
        const { container } = render(<TradingPostPage />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
        expect(container).toMatchSnapshot()
    })
})

// Ticket 11.1 AC-11: Successful offer submission calls onSuccess
describe("Ticket 11 AC-11 Successful offer submission", () => {
    test("submitting a valid offer calls onSuccess", async () => {
        const mockOnSuccess = jest.fn()
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockCollection })
            .mockResolvedValueOnce({ json: async () => mockMineListings })
            .mockResolvedValueOnce({ json: async () => mockOfferedPins })
            .mockResolvedValueOnce({ json: async () => ({ id: 'trade-1' }), ok: true })
        render(<MakeOfferForm listing={mockListing} onClose={jest.fn()} onSuccess={mockOnSuccess} />)
        await waitFor(() => {
            expect(screen.getByTestId("pin-select-0")).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId("pin-select-0"), { target: { value: 'pin-1' } })
        await waitFor(() => {
            expect(screen.getByTestId("submit-offer-button")).not.toBeDisabled()
        })
        fireEvent.click(screen.getByTestId("submit-offer-button"))
        await waitFor(() => {
            expect(mockOnSuccess).toHaveBeenCalled()
        })
    })
})

// Ticket 11 AC-12: Failed offer submission shows error message
describe("Ticket 11 AC-12 Failed offer submission shows error", () => {
    test("shows error message when API returns an error", async () => {
        global.fetch
            .mockResolvedValueOnce({ json: async () => mockCollection })
            .mockResolvedValueOnce({ json: async () => mockMineListings })
            .mockResolvedValueOnce({ json: async () => mockOfferedPins })
            .mockResolvedValueOnce({ json: async () => ({ error: "Something went wrong, please try again!" }), ok: false })
        render(<MakeOfferForm listing={mockListing} onClose={jest.fn()} onSuccess={jest.fn()} />)
        await waitFor(() => {
            expect(screen.getByTestId("pin-select-0")).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId("pin-select-0"), { target: { value: 'pin-1' } })
        await waitFor(() => {
            expect(screen.getByTestId("submit-offer-button")).not.toBeDisabled()
        })
        fireEvent.click(screen.getByTestId("submit-offer-button"))
        await waitFor(() => {
            expect(screen.getByText("Something went wrong, please try again!")).toBeInTheDocument()
        })
    })
})

// Ticket 11 AC-13: Empty description shows error message
describe("Ticket 11 AC-13 Empty description shows error", () => {
    test("shows error when description is empty on submit", () => {
        render(<TradeListing pin={mockPin} onClose={jest.fn()} onSuccess={jest.fn()} />)
        fireEvent.click(screen.getByTestId("submit-trade-listing"))
        expect(screen.getByText("Please describe what you are looking for!")).toBeInTheDocument()
    })
})

// Ticket 11 AC-14: Search and sort interactions trigger state updates
describe("Ticket 11 AC-14 Search and sort interactions", () => {
    test("typing in search bar and changing sort updates the page", async () => {
        global.fetch.mockResolvedValue({
            json: async () => ({ listings: [], total: 0 })
        })
        render(<TradingPostPage />)
        await waitFor(() => {
            expect(screen.getByTestId("pin-search")).toBeInTheDocument()
        })
        fireEvent.change(screen.getByTestId("pin-search"), { target: { value: "Kermit" } })
        fireEvent.change(screen.getByTestId("sort-select"), { target: { value: "oldest" } })
        await waitFor(() => {
            expect(screen.getByTestId("pin-search")).toHaveValue("Kermit")
            expect(screen.getByTestId("sort-select")).toHaveValue("oldest")
        })
    })
})