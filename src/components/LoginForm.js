'use client'

// import the hook
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {

  // hooks
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isErrorWindowOpen, setIsErrorWindowOpen] = useState(false);

  // router for pushing
  const router = useRouter()

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
      if (username !== "admin" || password !== "admin123") {
        setIsErrorWindowOpen(true)
      } else {
        setIsErrorWindowOpen(false)
        router.push("/home")
      }
    }
  }

  function closeErrorWindow() {
    setIsErrorWindowOpen(false);
  }

  // return single tag to export component
  return (
    <div className="min-h-screen flex items-center justify-center bg-disney-light-blue">
      <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-sm">
        
        <h1 className="text-2xl font-bold mb-1">
            <span className="text-gray-900">Pin</span>
            <span className="text-disney-dark-blue">Barter</span>
        </h1>
        <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

        {/* htmlFor and id in label and input important for testing with RTL and jest */}
        <div className="mb-4">
          <label htmlFor="Username" className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            id="Username"
            data-testid="UsernameTest"
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
        className="w-full bg-slate-600 text-white py-2 rounded-md text-sm font-medium 
        hover:bg-slate-800">
          Sign in
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
            Don't have an account?{' '} 
          <a href="/register" className="text-blue-600 hover:underline">Create one</a>
        </p>

      </div>

      {/* Modal for update/ecdit warden form */}
      {isErrorWindowOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="
          relative
          z-10
          bg-white
          p-6
          rounded-lg
          shadow-lg
          w-full
          max-w-lg
          text-center
        ">
          <h2 className="text-xl font-bold mb-4 text-gray-600">
            Error: Invalid Credentials
          </h2>
          <p className="mb-4 text-sm opacity-80 text-gray-600">
            Incorrect username or password submitted.
          </p>
          <button
          type="button"
          onClick={closeErrorWindow}
          className="bg-slate-600 hover:bg-slate-800 p-1 rounded shadow text-white">
            Close
          </button>
          </div>
        </div>
      )}
    </div>
  )
}
