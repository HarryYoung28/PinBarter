import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../Home'

// mock next-auth to return a fake session with username
jest.mock("next-auth/react", () => ({
    useSession: () => ({
        data: {
            user: {
                username: 'testuser'
            }
        }
    })
}))

// mock fetch to return fake stats
global.fetch = jest.fn()

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 15 AC-3, snapshot testing
describe("Ticket 15 AC-3 Snapshot testing", () => {
    test("Home page matches snapshot", async () => {
        // mock the home API response with fake stats
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                collectionCount: 5,
                wishlistCount: 1,
                completedTradesCount: 0,
                pendingOffersCount: 1,
                activeListingsCount: 1
            })
        })

        const { container } = render(<Home />)

        // wait for stats to load before taking snapshot
        await waitFor(() => {
            expect(screen.getByText("Pins in Collection")).toBeInTheDocument()
            expect(screen.getByText("Pending Offers")).toBeInTheDocument()
            expect(screen.getByText("Active Listings")).toBeInTheDocument()
        })

        expect(container).toMatchSnapshot()
    })
})