import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ProfilePage from '@/components/ProfilePage'

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

// Ticket 14 AC-1, account info displays correctly
describe("Ticket 14 AC-1 Account info displays", () => {
    test("displays username and email from session", () => {
        render(<ProfilePage />)

        // assert username is visible on the page
        expect(screen.getByText("testuser")).toBeInTheDocument()

        // assert email is visible on the page
        expect(screen.getByText("testuser@pinbarter.org")).toBeInTheDocument()
    })
})