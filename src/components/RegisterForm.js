'use client'

// imports
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterForm() {

    // state
    // form field values and error messages
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [generalError, setGeneralError] = useState("")

    // hooks
    const router = useRouter()

    // functions
    // handles form validation and registration submission
    async function handleRegister() {
        let valid = true

        // validate username field
        if (!username) {
            setUsernameError("Username is required")
            valid = false
        } else {
            setUsernameError("")
        }

        // validate email field
        if (!email) {
            setEmailError("Email is required")
            valid = false
        } else {
            setEmailError("")
        }

        // validate password field
        if (!password) {
            setPasswordError("Password is required")
            valid = false
        } else {
            setPasswordError("")
        }

        // only attempt registration if all fields are valid
        if (valid) {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                // show server error such as username already taken
                setGeneralError(data.error)
            } else {
                router.push("/login")
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
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">Create your account</p>

                {/* htmlFor and id on label and input are important for RTL and Jest testing */}
                <div className="mb-4">
                    <label
                        htmlFor="Username"
                        className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        id="Username"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full border dark:text-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 
                            ${usernameError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } text-gray-500`}
                    />
                    {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="Email"
                        className="block text-sm dark:text-gray-300 text-gray-600 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="Email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full border dark:text-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 
                            ${emailError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } text-gray-500`}
                    />
                    {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="Password"
                        className="block text-sm dark:text-gray-300 text-gray-600 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="Password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full border dark:text-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 
                            ${passwordError
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-blue-500"
                            } text-gray-500`}
                    />
                    {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                </div>

                {/* general error shows server side errors such as username already taken */}
                {generalError && <p className="text-red-500 text-xs mb-2">{generalError}</p>}

                <button
                    type="button"
                    onClick={handleRegister}
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
                    Create Account
                </button>

                <p className="text-sm text-center text-gray-500 dark:text-gray-300 mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}