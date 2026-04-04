import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '../LoginForm'
import '@testing-library/jest-dom'

// function to register if routing was successfully called
const mockPush = jest.fn()
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush })
}))

// added post db integration (ticket 4)
const mockSignIn = jest.fn()
jest.mock("next-auth/react", () => ({
    signIn: (...args) => mockSignIn(...args)
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
// describe("AC-4 LoginForm redirect", () => {
//     test("redirects to /home when correct credentials are submitted", () => {
//         fireEvent.change(screen.getByLabelText("Username"), { target: { value: "admin" } })
//         fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } })
//         fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
//         expect(mockPush).toHaveBeenCalledWith("/home")
//     })
//   })

// describe("AC-6 LoginForm inline credentials error", () => {
//     test("shows inline error when invalid credentials are submitted", () => {
//         fireEvent.change(screen.getByTestId("username"), { target: { value: "wronguser" } })
//         fireEvent.change(screen.getByTestId("password"), { target: { value: "wrongpass" } })
//         fireEvent.click(screen.getByTestId("sign-in-button"))
//         expect(screen.getByTestId("credentials-error")).toBeInTheDocument()
//     })
// })
 

// UPDATED IN TICKET 4, for TICKET AC-2
describe("AC-4 LoginForm calls signIn with correct credentials", () => {
    test("calls signIn and redirects to /home on success", async () => {
        mockSignIn.mockResolvedValueOnce({ error: null })
        fireEvent.change(screen.getByLabelText("Username"), { target: { value: "admin" } })
        fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } })
        fireEvent.click(screen.getByRole("button", { name: /sign in/i }))
        await new Promise(resolve => setTimeout(resolve, 0))
        expect(mockSignIn).toHaveBeenCalled()
        expect(mockPush).toHaveBeenCalledWith("/home")
    })
})

// UPDATED IN TICKET 4 for TICKET AC-3
  describe("AC-6 LoginForm inline credentials error", () => {
    test("shows inline error when invalid credentials are submitted", async () => {
        mockSignIn.mockResolvedValueOnce({ error: "CredentialsSignin" })
        fireEvent.change(screen.getByTestId("username"), { target: { value: "wronguser" } })
        fireEvent.change(screen.getByTestId("password"), { target: { value: "wrongpass" } })
        fireEvent.click(screen.getByTestId("sign-in-button"))
        await waitFor(() => {
            expect(screen.getByTestId("credentials-error")).toBeInTheDocument()
        })
    })
})