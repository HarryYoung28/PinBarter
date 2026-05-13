import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginForm from '../LoginForm'
import RegisterForm from '../RegisterForm'
import PinsPage from '@/components/PinsPage'
import PinCard from '../PinCard'
import SideBar from '../SideBar'

// mock next navigation
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => "/pins",
    useParams: () => ({}),
    useSearchParams: () => ({ get: () => null })
}))

// mock next auth
jest.mock("next-auth/react", () => ({
    useSession: () => ({ data: { user: { username: 'testuser' } } }),
    signOut: jest.fn()
}))

// mock fetch for PinsPage - returns empty pins by default
global.fetch = jest.fn((url) => {
    if (url && url.includes('/api/trades')) {
        return Promise.resolve({
            json: () => Promise.resolve({ myListings: [], myOffers: [], pendingTrades: [], completedTrades: [] })
        })
    }
    return Promise.resolve({
        json: () => Promise.resolve({ pins: [], total: 0 })
    })
})

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 9 AC-1: Login page light mode theme classes
describe("Ticket 9 AC-1 Login page light mode theme", () => {
    test("login page outer background uses disney-light-blue", () => {
        const { container } = render(<LoginForm />)
        const outer = container.firstChild
        expect(outer).toHaveClass("bg-disney-light-blue")
    })
    test("login card background is white in light mode", () => {
        const { container } = render(<LoginForm />)
        const card = container.firstChild.firstChild
        expect(card).toHaveClass("bg-white")
    })
    test("login page PinBarter logo has disney-dark-blue accent in light mode", () => {
        render(<LoginForm />)
        const barter = screen.getByText("Barter")
        expect(barter).toHaveClass("text-disney-dark-blue")
    })
})

// Ticket 9 AC-2: Login page dark mode theme classes
describe("Ticket 9 AC-2 Login page dark mode theme", () => {
    test("login card has dark:bg-neutral-800 for dark mode", () => {
        const { container } = render(<LoginForm />)
        const card = container.firstChild.firstChild
        expect(card).toHaveClass("dark:bg-neutral-800")
    })
    test("login outer background stays disney-light-blue in dark mode", () => {
        const { container } = render(<LoginForm />)
        const outer = container.firstChild
        expect(outer).toHaveClass("bg-disney-light-blue")
        expect(outer).not.toHaveClass("dark:bg-neutral-800")
    })
})

// Ticket 9 AC-3: Register page light mode theme classes
describe("Ticket 9 AC-3 Register page light mode theme", () => {
    test("register page outer background uses disney-light-blue", () => {
        const { container } = render(<RegisterForm />)
        const outer = container.firstChild
        expect(outer).toHaveClass("bg-disney-light-blue")
    })
    test("register card background is white in light mode", () => {
        const { container } = render(<RegisterForm />)
        const card = container.firstChild.firstChild
        expect(card).toHaveClass("bg-white")
    })
    test("register page PinBarter logo has disney-dark-blue accent", () => {
        render(<RegisterForm />)
        const barter = screen.getByText("Barter")
        expect(barter).toHaveClass("text-disney-dark-blue")
    })
})

// Ticket 9 AC-4: Register page dark mode theme classes
describe("Ticket 9 AC-4 Register page dark mode theme", () => {
    test("register card has dark:bg-neutral-800 for dark mode", () => {
        const { container } = render(<RegisterForm />)
        const card = container.firstChild.firstChild
        expect(card).toHaveClass("dark:bg-neutral-800")
    })
    test("register outer background stays disney-light-blue in dark mode", () => {
        const { container } = render(<RegisterForm />)
        const outer = container.firstChild
        expect(outer).toHaveClass("bg-disney-light-blue")
        expect(outer).not.toHaveClass("dark:bg-neutral-800")
    })
})

// Ticket 9 AC-5: All Pins page light mode theme classes
// wrapped in waitFor to prevent act() warnings from async state updates in PinsPage
describe("Ticket 9 AC-5 All Pins page light mode theme", () => {
    test("All Pins heading has light mode text class", async () => {
        render(<PinsPage />)
        await waitFor(() => {
            expect(screen.getByText("All Pins")).toHaveClass("text-gray-900")
        })
    })
    test("All Pins subtitle has light mode text class", async () => {
        render(<PinsPage />)
        await waitFor(() => {
            expect(screen.getByText("Browse and discover our catalogue of pins!")).toHaveClass("text-gray-500")
        })
    })
})

// Ticket 9 AC-6: All Pins page dark mode theme classes
// wrapped in waitFor to prevent act() warnings from async state updates in PinsPage
describe("Ticket 9 AC-6 All Pins page dark mode theme", () => {
    test("All Pins heading has dark:text-gray-100 for dark mode", async () => {
        render(<PinsPage />)
        await waitFor(() => {
            expect(screen.getByText("All Pins")).toHaveClass("dark:text-gray-100")
        })
    })
    test("All Pins subtitle has dark:text-gray-300 for dark mode", async () => {
        render(<PinsPage />)
        await waitFor(() => {
            expect(screen.getByText("Browse and discover our catalogue of pins!")).toHaveClass("dark:text-gray-300")
        })
    })
    test("PinCard has dark:bg-neutral-800 for dark mode background", () => {
        const mockPin = {
            id: 'pin-1',
            name: 'Kermit the Frog',
            series: 'Muppets Christmas Carol',
            imageUrl: null,
            credits: 3
        }
        render(<PinCard pin={mockPin} />)
        expect(screen.getByTestId("pin-card")).toHaveClass("dark:bg-neutral-800")
    })
    test("PinCard name text has dark:text-gray-100 for dark mode", () => {
        const mockPin = {
            id: 'pin-1',
            name: 'Kermit the Frog',
            series: 'Muppets Christmas Carol',
            imageUrl: null,
            credits: 3
        }
        render(<PinCard pin={mockPin} />)
        expect(screen.getByText("Kermit the Frog")).toHaveClass("dark:text-gray-100")
    })
    test("PinCard credits text has dark:text-disney-light-blue for dark mode", () => {
        const mockPin = {
            id: 'pin-1',
            name: 'Kermit the Frog',
            series: 'Muppets Christmas Carol',
            imageUrl: null,
            credits: 3
        }
        render(<PinCard pin={mockPin} />)
        expect(screen.getByText("3 credits")).toHaveClass("dark:text-disney-light-blue")
    })
})

// Ticket 9 AC-7: Sidebar dark mode active link classes
describe("Ticket 9 AC-7 Sidebar active link dark mode theme", () => {
    test("active link has dark:text-disney-light-blue class", () => {
        render(<SideBar />)
        expect(screen.getByTestId("pins")).toHaveClass("dark:text-disney-light-blue")
    })
    test("active link has dark:bg-neutral-800 class", () => {
        render(<SideBar />)
        expect(screen.getByTestId("pins")).toHaveClass("dark:bg-neutral-800")
    })
    test("inactive link has dark hover class dark:hover:text-disney-light-blue", () => {
        render(<SideBar />)
        expect(screen.getByTestId("home")).toHaveClass("dark:hover:text-disney-light-blue")
    })
})

// Ticket 9 AC-8 Snapshot Tests (multiple pages)
describe("Ticket 9 Snapshot Tests", () => {
    test("LoginForm matches snapshot", () => {
        const { container } = render(<LoginForm />)
        expect(container).toMatchSnapshot()
    })

    test("RegisterForm matches snapshot", () => {
        const { container } = render(<RegisterForm />)
        expect(container).toMatchSnapshot()
    })

    test("PinCard matches snapshot", () => {
        const mockPin = {
            id: 'pin-1',
            name: 'Kermit the Frog',
            series: 'Muppets Christmas Carol',
            imageUrl: null,
            credits: 3
        }
        const { container } = render(<PinCard pin={mockPin} />)
        expect(container).toMatchSnapshot()
    })

    test("SideBar matches snapshot with dark mode classes", () => {
        const { container } = render(<SideBar />)
        expect(container).toMatchSnapshot()
    })

    test("PinsPage matches snapshot with pins rendered", async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({
                pins: [
                    {
                        id: 'pin-1',
                        name: 'Kermit the Frog',
                        series: 'Muppets Christmas Carol',
                        imageUrl: null,
                        credits: 3
                    }
                ],
                total: 1
            })
        })
        const { container } = render(<PinsPage />)
        await waitFor(() => {
            expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
        })
        await waitFor(() => {
            expect(container).toMatchSnapshot()
        })
    })
})