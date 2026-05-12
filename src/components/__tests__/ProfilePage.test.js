import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Profile from '../Profile'

// mock next-auth to return a fake session with username and email
jest.mock("next-auth/react", () => ({
    useSession: () => ({
        data: {
            user: {
                username: 'testuser',
                email: 'testuser@pinbarter.org'
            }
        }
    }),
    signOut: jest.fn()
}))

// mock fetch globally for API calls
global.fetch = jest.fn()

beforeEach(() => {
    jest.clearAllMocks()
})

// Ticket 14 AC-1 - account info displays correctly
describe("Ticket 14 AC-1 Account info displays", () => {
    test("displays username and email from session", () => {
        render(<Profile />)

        // assert username is visible on the page
        expect(screen.getByText("testuser")).toBeInTheDocument()

        // assert email is visible on the page
        expect(screen.getByText("testuser@pinbarter.org")).toBeInTheDocument()
    })
})

// Ticket 14 AC-2 - successful password change
describe("Ticket 14 AC-2 Successful password change", () => {
    test("shows success message when password is updated successfully", async () => {
        // mock fetch to return success on PATCH request
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true })
        })

        render(<Profile />)

        // fill in all three password fields
        fireEvent.change(screen.getByTestId("current-password"), {
            target: { value: "OldPassword123" }
        })
        fireEvent.change(screen.getByTestId("new-password"), {
            target: { value: "NewPassword123" }
        })
        fireEvent.change(screen.getByTestId("confirm-password"), {
            target: { value: "NewPassword123" }
        })

        // click the update password button
        fireEvent.click(screen.getByTestId("change-password-button"))

        // assert success message appears
        await waitFor(() => {
            expect(screen.getByText("Password updated successfully!")).toBeInTheDocument()
        })
    })
})

// Ticket 14 AC-3 - incorrect current password shows error
describe("Ticket 14 AC-3 Incorrect current password", () => {
    test("shows error message when current password is wrong", async () => {
        // mock fetch to return 400 with error message simulating wrong password
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Current password is incorrect." })
        })

        render(<Profile />)

        // fill in all three password fields with wrong current password
        fireEvent.change(screen.getByTestId("current-password"), {
            target: { value: "WrongPassword123" }
        })
        fireEvent.change(screen.getByTestId("new-password"), {
            target: { value: "NewPassword123" }
        })
        fireEvent.change(screen.getByTestId("confirm-password"), {
            target: { value: "NewPassword123" }
        })

        // click the update password button
        fireEvent.click(screen.getByTestId("change-password-button"))

        // assert error message from server appears
        await waitFor(() => {
            expect(screen.getByText("Current password is incorrect.")).toBeInTheDocument()
        })
    })
})

// Ticket 14 AC-4 - mismatched passwords caught client side before API call
describe("Ticket 14 AC-4 Mismatched passwords", () => {
    test("shows error message when new passwords do not match without calling fetch", async () => {
        render(<Profile />)

        // fill in fields with mismatching new and confirm passwords
        fireEvent.change(screen.getByTestId("current-password"), {
            target: { value: "OldPassword123" }
        })
        fireEvent.change(screen.getByTestId("new-password"), {
            target: { value: "NewPassword123" }
        })
        fireEvent.change(screen.getByTestId("confirm-password"), {
            target: { value: "DifferentPassword123" }
        })

        // click the update password button
        fireEvent.click(screen.getByTestId("change-password-button"))

        // assert client side error appears without hitting the API
        await waitFor(() => {
            expect(screen.getByText("New passwords do not match.")).toBeInTheDocument()
        })

        // fetch should never have been called as validation failed before it
        expect(global.fetch).not.toHaveBeenCalled()
    })
})

// Ticket 14 AC-5 - delete confirmation appears after clicking delete account
describe("Ticket 14 AC-5 Delete confirmation appears", () => {
    test("shows confirmation prompt when delete account is clicked", () => {
        render(<Profile />)

        // click the delete account button
        fireEvent.click(screen.getByTestId("delete-account-button"))

        // assert confirmation prompt and both confirm and cancel buttons appear
        expect(screen.getByText("Are you sure? This cannot be undone.")).toBeInTheDocument()
        expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument()
        expect(screen.getByTestId("cancel-delete-button")).toBeInTheDocument()
    })
})

// Ticket 14 AC-6 - cancel hides the delete confirmation prompt
describe("Ticket 14 AC-6 Cancel hides delete confirmation", () => {
    test("hides confirmation prompt when cancel is clicked", () => {
        render(<Profile />)

        // click delete account to show the confirmation prompt
        fireEvent.click(screen.getByTestId("delete-account-button"))

        // confirm the prompt is showing
        expect(screen.getByTestId("confirm-delete-button")).toBeInTheDocument()

        // click cancel to dismiss the confirmation
        fireEvent.click(screen.getByTestId("cancel-delete-button"))

        // assert the confirmation prompt is no longer visible
        expect(screen.queryByTestId("confirm-delete-button")).not.toBeInTheDocument()
        expect(screen.queryByTestId("cancel-delete-button")).not.toBeInTheDocument()
    })
})

// Ticket 14 AC-8 - snapshot testing
describe("Ticket 14 AC-8 Snapshot testing", () => {
    test("Profile page matches snapshot", () => {
        const { container } = render(<Profile />)

        // assert the page matches the snapshot
        expect(container).toMatchSnapshot()
    })
})