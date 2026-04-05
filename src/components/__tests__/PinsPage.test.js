import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PinCard from '../PinCard'
import PinGrid from '../PinGrid'
import SearchBar from '../SearchBar'

// mock next/navigation
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush })
}))

// sample pin data for tests
const mockPin = {
    id: 'test-id-1',
    name: 'Kermit the Frog',
    series: 'Muppets Christmas Carol',
    imageUrl: null,
    credits: 3,
    rarity: 'Limited Edition',
    editionSize: 3500,
    description: 'Kermit as Bob Cratchit in a festive wreath'
}

const mockPins = [
    mockPin,
    {
        id: 'test-id-2',
        name: 'Miss Piggy',
        series: 'Muppets Christmas Carol',
        imageUrl: null,
        credits: 3,
        rarity: 'Limited Edition',
        editionSize: 3500,
        description: 'Miss Piggy as Emily Cratchit in a festive wreath'
    }
]

// AC-1 and AC-2: PinCard renders correctly
describe("AC-1 and AC-2, PinCard renders pin name, series and credits", () => {
    test("renders pin name", () => {
        render(<PinCard pin={mockPin} />)
        expect(screen.getByText("Kermit the Frog")).toBeInTheDocument()
    })
    test("renders pin series", () => {
        render(<PinCard pin={mockPin} />)
        expect(screen.getByText("Muppets Christmas Carol")).toBeInTheDocument()
    })
    test("renders pin credits", () => {
        render(<PinCard pin={mockPin} />)
        expect(screen.getByText("3 credits")).toBeInTheDocument()
    })
    test("renders placeholder image when no imageUrl", () => {
        render(<PinCard pin={mockPin} />)
        const img = screen.getByAltText("Kermit the Frog")
        expect(img).toBeInTheDocument()
        expect(img.src).toContain("placehold.co")
    })
})

// AC-2: PinGrid renders multiple pin cards
describe("AC-2, PinGrid renders all pin cards", () => {
    test("renders correct number of pin cards", () => {
        render(<PinGrid pins={mockPins} />)
        const cards = screen.getAllByTestId("pin-card")
        expect(cards).toHaveLength(2)
    })
})

// AC-3: SearchBar renders and accepts input
describe("AC-3: SearchBar renders and accepts input", () => {
    test("renders search input", () => {
        render(<SearchBar value="" onChange={() => {}} />)
        expect(screen.getByTestId("pin-search")).toBeInTheDocument()
    })
    test("displays the current search value", () => {
        render(<SearchBar value="Kermit" onChange={() => {}} />)
        expect(screen.getByTestId("pin-search")).toHaveValue("Kermit")
    })
    test("calls onChange when user types", () => {
        const mockOnChange = jest.fn()
        render(<SearchBar value="" onChange={mockOnChange} />)
        fireEvent.change(screen.getByTestId("pin-search"), { target: { value: "Woody" } })
        expect(mockOnChange).toHaveBeenCalled()
    })
})

// AC-4: PinCard navigates to pin page on click
describe("AC-4, PinCard navigates to pin detail page on click", () => {
    test("calls router.push with correct pin id when clicked", () => {
        render(<PinCard pin={mockPin} />)
        fireEvent.click(screen.getByTestId("pin-card"))
        expect(mockPush).toHaveBeenCalledWith("/pins/test-id-1")
    })
})

// AC-5: Snapshot testing
describe("AC-5, PinCard snapshot", () => {
    test("matches snapshot", () => {
        const { container } = render(<PinCard pin={mockPin} />)
        expect(container).toMatchSnapshot()
    })
})