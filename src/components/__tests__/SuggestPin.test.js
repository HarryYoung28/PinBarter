import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import SuggestPinModal from '../SuggestPinModal'

// mock fetch globally for API calls
global.fetch = jest.fn()

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 17 AC-2 modal renders with correct fields
describe("Ticket 17 AC-2 Suggest pin modal renders correctly", () => {
    test("modal displays all expected fields", () => {
        render(<SuggestPinModal onClose={jest.fn()} onSuccess={jest.fn()} />)

        // confirm all fields are visible
        expect(screen.getByTestId("pin-name")).toBeInTheDocument()
        expect(screen.getByTestId("pin-series")).toBeInTheDocument()
        expect(screen.getByTestId("pin-description")).toBeInTheDocument()
        expect(screen.getByTestId("pin-rarity")).toBeInTheDocument()

        // edition size should not be visible until limited edition is selected
        expect(screen.queryByTestId("pin-edition-size")).not.toBeInTheDocument()
    })

    test("edition size field appears when Limited Edition is selected", () => {
        render(<SuggestPinModal onClose={jest.fn()} onSuccess={jest.fn()} />)

        // change rarity to limited edition
        fireEvent.change(screen.getByTestId("pin-rarity"), {
            target: { value: "Limited Edition" }
        })

        // edition size field should now be visible
        expect(screen.getByTestId("pin-edition-size")).toBeInTheDocument()
    })
})

// Ticket 17 AC-3 client side validation catches missing name
describe("Ticket 17 AC-3 Submit without name shows error", () => {
    test("shows error message when pin name is empty", async () => {
        render(<SuggestPinModal onClose={jest.fn()} onSuccess={jest.fn()} />)

        // click submit without filling in the name
        fireEvent.click(screen.getByTestId("submit-suggest"))

        // error message should appear without calling fetch
        await waitFor(() => {
            expect(screen.getByText("Pin name is required.")).toBeInTheDocument()
        })

        // fetch should never have been called as validation failed before it
        expect(global.fetch).not.toHaveBeenCalled()
    })
})

// Ticket 17 AC-9 snapshot testing
describe("Ticket 17 AC-9 Snapshot testing", () => {
    test("SuggestPinModal matches snapshot", () => {
        const { container } = render(<SuggestPinModal onClose={jest.fn()} onSuccess={jest.fn()} />)
        expect(container).toMatchSnapshot()
    })
})