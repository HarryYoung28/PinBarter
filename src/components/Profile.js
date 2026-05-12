'use client'
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Profile() {

    // get the current logged in user's session data
    const { data: session } = useSession()

    // state for the change password form fields
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    // feedback messages for the password form
    const [passwordMessage, setPasswordMessage] = useState(null)
    const [passwordError, setPasswordError] = useState(null)

    // controls whether the delete confirmation prompt is showing
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    // loading states to prevent double submissions
    const [passwordLoading, setPasswordLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // handles the change password form submission
    async function handleChangePassword() {
        // reset any previous messages
        setPasswordMessage(null)
        setPasswordError(null)

        // basic client-side validation before hitting the API
        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please fill in all fields.")
            return
        }

        // check new passwords match before sending to server
        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.")
            return
        }

        setPasswordLoading(true)

        const response = await fetch('/api/user', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ currentPassword, newPassword })
        })

        const data = await response.json()
        setPasswordLoading(false)

        if (!response.ok) {
            // server returned an error e.g. wrong current password
            setPasswordError(data.error || "Something went wrong.")
        } else {
            // success - clear the form fields
            setPasswordMessage("Password updated successfully!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        }
    }

    // handles account deletion - calls API then signs the user out
    async function handleDeleteAccount() {
        setDeleteLoading(true)

        const response = await fetch('/api/user', {
            method: 'DELETE'
        })

        if (response.ok) {
            // account deleted - sign out and redirect to login
            signOut({ callbackUrl: '/login' })
        } else {
            setDeleteLoading(false)
            setShowDeleteConfirm(false)
            alert("Something went wrong deleting your account. Please try again.")
        }
    }

    return (
        <div className="p-6 max-w-xl">
            <h1 className="
                text-2xl 
                font-bold 
                text-gray-900 
                dark:text-gray-100 
                mb-2">
                My Profile
            </h1>
            <p className="
                text-sm 
                text-gray-500 
                dark:text-gray-300 
                mb-8">
                Manage your account settings.
            </p>

            {/* ACCOUNT INFO SECTION - read only, pulled from session */}
            <div className="
                bg-white 
                dark:bg-neutral-800 
                border 
                border-gray-500 
                dark:border-gray-200 
                rounded-lg 
                p-6 
                mb-6">
                <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-700 
                    dark:text-gray-300 
                    mb-4">
                    Account Info
                </h2>
                <div className="flex flex-col gap-3">
                    <div>
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Username
                        </p>
                        <p className="
                            text-sm 
                            font-medium 
                            text-gray-900 
                            dark:text-gray-100">
                            {session?.user?.username}
                        </p>
                    </div>
                    <div>
                        <p className="
                            text-xs 
                            text-gray-500 
                            dark:text-gray-400 
                            uppercase 
                            tracking-wide 
                            mb-1">
                            Email
                        </p>
                        <p className="
                            text-sm 
                            font-medium 
                            text-gray-900 
                            dark:text-gray-100">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* CHANGE PASSWORD SECTION */}
            <div className="
                bg-white 
                dark:bg-neutral-800 
                border 
                border-gray-500 
                dark:border-gray-200 
                rounded-lg 
                p-6 
                mb-6">
                <h2 className="
                    text-lg 
                    font-semibold 
                    text-gray-700 
                    dark:text-gray-300 
                    mb-4">
                    Change Password
                </h2>
                <div className="flex flex-col gap-3">
                    <input
                        data-testid="current-password"
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="
                            w-full 
                            px-3 
                            py-2 
                            text-sm 
                            border 
                            border-gray-300 
                            dark:border-gray-600 
                            rounded-md 
                            bg-white 
                            dark:bg-neutral-700 
                            text-gray-900 
                            dark:text-gray-100"
                    />
                    <input
                        data-testid="new-password"
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="
                            w-full 
                            px-3 
                            py-2 
                            text-sm 
                            border 
                            border-gray-300 
                            dark:border-gray-600 
                            rounded-md 
                            bg-white 
                            dark:bg-neutral-700 
                            text-gray-900 
                            dark:text-gray-100"
                    />
                    <input
                        data-testid="confirm-password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="
                            w-full 
                            px-3 
                            py-2 
                            text-sm 
                            border 
                            border-gray-300 
                            dark:border-gray-600 
                            rounded-md 
                            bg-white 
                            dark:bg-neutral-700 
                            text-gray-900 
                            dark:text-gray-100"
                    />

                    {/* success or error feedback message */}
                    {passwordMessage && (
                        <p className="text-sm text-green-600 dark:text-green-400">{passwordMessage}</p>
                    )}
                    {passwordError && (
                        <p className="text-sm text-red-500">{passwordError}</p>
                    )}

                    <button
                        data-testid="change-password-button"
                        type="button"
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className="
                            mt-2 
                            px-4 
                            py-2 
                            text-sm 
                            font-medium 
                            bg-disney-light-blue 
                            text-disney-dark-blue 
                            rounded 
                            hover:bg-disney-dark-blue 
                            hover:text-white 
                            dark:hover:bg-white 
                            dark:hover:text-disney-dark-blue
                            disabled:opacity-50 
                            disabled:cursor-not-allowed">
                        {passwordLoading ? "Updating..." : "Update Password"}
                    </button>
                </div>
            </div>

            {/* DANGER ZONE - delete account, two step confirmation to prevent accidents */}
            <div className="
                bg-white 
                dark:bg-neutral-800 
                border 
                border-red-400 
                rounded-lg 
                p-6">
                <h2 className="
                    text-lg 
                    font-semibold 
                    text-red-500 
                    mb-2">
                    Danger Zone
                </h2>
                <p className="
                    text-sm 
                    text-gray-500 
                    dark:text-gray-400 
                    mb-4">
                    Deleting your account is permanent and cannot be undone.
                </p>

                {/* first click shows confirmation, second click deletes */}
                {!showDeleteConfirm ? (
                    <button
                        data-testid="delete-account-button"
                        type="button"
                        onClick={() => setShowDeleteConfirm(true)}
                        className="
                            px-4 
                            py-2 
                            text-sm 
                            font-medium 
                            bg-red-500 
                            hover:bg-red-600 
                            text-white 
                            rounded">
                        Delete Account
                    </button>
                ) : (
                    <div className="flex flex-col gap-3">
                        <p className="
                            text-sm 
                            font-medium 
                            text-red-500">
                            Are you sure? This cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                data-testid="confirm-delete-button"
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                className="
                                    px-4 
                                    py-2 
                                    text-sm 
                                    font-medium 
                                    bg-red-500 
                                    hover:bg-red-600 
                                    text-white 
                                    rounded 
                                    disabled:opacity-50">
                                {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                            </button>
                            <button
                                data-testid="cancel-delete-button"
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="
                                    px-4 
                                    py-2 
                                    text-sm 
                                    font-medium 
                                    bg-disney-light-blue 
                                    text-disney-dark-blue 
                                    hover:bg-disney-dark-blue 
                                    hover:text-white 
                                    dark:hover:bg-white 
                                    dark:hover:text-disney-dark-blue 
                                    rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}