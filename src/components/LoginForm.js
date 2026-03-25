'use client'

// import the hook
import { useState } from "react"

export default function LoginForm() {

  // hooks
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // functions
  function handleSubmit() {
    let valid = true

    if (!username) {
      setUsernameError("Username is required")
      valid = false
    } else {
      setUsernameError("")
    }
    if (!password) {
      setPasswordError("Password is required")
      valid = false
    } else {
      setPasswordError("")
    }

    if (valid) {
      console.log("Submitted successfully", username, password)
    }
  }


  // return single tag to export component
  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-300">
      <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-sm">
        
        <h1 className="text-2xl font-bold mb-1">
            <span className="text-gray-900">Pin</span>
            <span className="text-orange-600">Barter</span>
        </h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {/* htmlFor and id in label and input important for testing with RTL and jest */}
        <div className="mb-4">
          <label htmlFor="Username" className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            id="Username"
            placeholder="your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm        
            focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
          />
          {/* this means only if the lefthand is true, format the right  */}
          {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="Password" className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            type="password" 
            id="Password"
            placeholder="your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none 
            focus:ring-2 focus:ring-blue-500 text-gray-500"
          />
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>

        <button 
        onClick={handleSubmit}
        className="w-full bg-orange-600 text-white py-2 rounded-md text-sm font-medium 
        hover:bg-orange-700">
          Sign in
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{' '} 
          <a href="/register" className="text-blue-600 hover:underline">Create one</a>
        </p>

      </div>
    </div>
  )
}