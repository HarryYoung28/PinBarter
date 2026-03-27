import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '../LoginForm'
import '@testing-library/jest-dom'

// function to register if routing was successfully called
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush })
}))

// Render before each test element
beforeEach(() => {
    render(<LoginForm />)
})

// All the LoginForm Rendering tests (UI) AC1
describe("AC-1 LoginForm rendering", () => {
    test("Renders the username field", () => {
        // The getByLabelText finds the label associated with the text, and 
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    test("Renders the password field", () => {
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
    })
})

// Login Form Validation tests (UI/Logic)
describe("AC-2 LoginForm  validation", () => {
    it("shows error messages when submitting empty fields", () => {
        // The fireEvent manually triggers elements, using i after /sign in/ makes it case insensitive
        fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

        expect(screen.getByText("Username is required")).toBeInTheDocument()
        expect(screen.getByText("Password is required")).toBeInTheDocument()
    })
})

// Login Form Snapshot tests
describe("AC-5 LoginForm snapshot testing", () => {
    it("matches snapshot", () => {
        const { container } = render(<LoginForm />)
        expect(container).toMatchSnapshot()
    })
})

// -- DEFUNCT TEST AS OF TICKET 1.1 (removal of modal for simpler option) --
// // Login form credentials validation testing (modal)
// describe("AC-3 LoginForm credentials validation", () => {
//     test("shows error modal when invalid credentials are submitted", () => {
//       fireEvent.change(screen.getByLabelText("Username"), { target: { value: "wronguser" } })
//       fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrongpass" } })
//       fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
//       expect(screen.getByText("Error: Invalid Credentials")).toBeInTheDocument()
//     })
//   })

// Login form redirect tests (successful login without db connection up and running)
describe("AC-4 LoginForm redirect", () => {
    test("redirects to /home when correct credentials are submitted", () => {
        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "admin" } })
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } })
        fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
        expect(mockPush).toHaveBeenCalledWith("/home")
    })
  })

describe("AC-6 LoginForm inline credentials error", () => {
    test("shows inline error when invalid credentials are submitted", () => {
        fireEvent.change(screen.getByTestId("username"), { target: { value: "wronguser" } })
        fireEvent.change(screen.getByTestId("password"), { target: { value: "wrongpass" } })
        fireEvent.click(screen.getByTestId("sign-in-button"))
        expect(screen.getByTestId("credentials-error")).toBeInTheDocument()
    })
})
 