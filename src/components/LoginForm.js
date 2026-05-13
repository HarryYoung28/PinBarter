'use client'

// imports
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export default function LoginForm() {

    // state
    // form field values and error messages
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [credentialsError, setCredentialsError] = useState("")

    // hooks
    const router = useRouter()

    // functions
    // handles form validation and sign in submission
    async function handleSubmit() {
        let valid = true

        // validate username field
        if (!username) {
            setUsernameError("Username is required")
            setCredentialsError("")
            valid = false
        } else {
            setUsernameError("")
        }

        // validate password field
        if (!password) {
            setPasswordError("Password is required")
            setCredentialsError("")
            valid = false
        } else {
            setPasswordError("")
        }

        // only attempt sign in if both fields are valid
        if (valid) {
            const result = await signIn("credentials", {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                setCredentialsError("Incorrect username or password.")
            } else {
                setCredentialsError("")
                router.push("/home")
            }
        }
    }

    // return
    return (
        <div className="min-h-screen flex items-center justify-center bg-disney-light-blue">
            <div className="
                bg-white
                dark:bg-neutral-800
                p-8
                rounded-lg
                border
                border-gray-200
                w-full
                max-w-sm">

                <h1 className="text-2xl font-bold mb-1">
                    <span className="text-gray-900 dark:text-gray-100">Pin</span>
                    <span className="text-disney-dark-blue dark:text-disney-light-blue">Barter</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Sign in to your account</p>

                {/* htmlFor and id on label and input are important for RTL and Jest testing */}
                <div className="mb-4">
                    <label
                        htmlFor="Username"
                        className="block text-sm dark:text-gray-300 text-gray-600 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        id="Username"
                        data-testid="username"
                        placeholder="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 
                            ${usernameError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } text-gray-500 dark:text-gray-300`}
                    />
                    {/* only renders the error message if usernameError has a value */}
                    {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="Password"
                        className="block dark:text-gray-300 text-sm text-gray-600 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="Password"
                        data-testid="password"
                        placeholder="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 
                            ${passwordError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } text-gray-500 dark:text-gray-300`}
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                {/* credentials error shows when username and password do not match */}
                {credentialsError && (
                    <p
                        data-testid="credentials-error"
                        className="text-red-500 text-xs mb-2">
                        {credentialsError}
                    </p>
                )}

                <button
                    data-testid="sign-in-button"
                    type="button"
                    onClick={handleSubmit}
                    className="
                        w-full
                        cursor-pointer
                        py-2
                        rounded-md
                        text-sm
                        font-medium
                        bg-disney-light-blue
                        text-disney-dark-blue
                        hover:bg-disney-dark-blue
                        hover:text-white
                        dark:hover:bg-white
                        dark:hover:text-disney-dark-blue">
                    Sign in
                </button>

                <p className="text-sm text-center dark:text-gray-300 text-gray-500 mt-4">
                    Don't have an account?{' '}
                    <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Create one
                    </a>
                </p>
            </div>
        </div>
    )
}