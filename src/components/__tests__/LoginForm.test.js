import { render, screen, fireEvent } from '@testing-library/react'
import LoginForm from '../LoginForm'


// All the LoginForm Rendering tests (UI)
describe("LoginForm rendering", () => {
    test("Renders the username field", () => {
        render(<LoginForm />)
        // The getByLabelText finds the label associated with the text, and 
        expect(screen.getByLabelText('Username')).toBeInTheDocument()
    })

    test("Renders the password field", () => {
        render(<LoginForm />)
        expect(screen.getByLabelText("Password")).toBeInTheDocument()
    })
})

// Login Form Validation tests (UI/Logic)
describe("LoginForm  validation", () => {
    test("shows error messages when submitting empty fields", () => {
        render(<LoginForm />)
        // The fireEvent manually triggers elements, using i after /sign in/ makes it case insensitive
        fireEvent.click(screen.getByRole("button", { name: /sign in/i }))

        expect(screen.getByText("Username is required")).toBeInTheDocument()
        expect(screen.getByText("Password is required")).toBeInTheDocument()
    })
})