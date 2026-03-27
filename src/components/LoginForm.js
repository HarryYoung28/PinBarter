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
  const [credentialsError, setCredentialsError] = useState("");

  // router for pushing
  const router = useRouter();

  // functions
  function handleSubmit() {
    let valid = true

    if (!username) {
      setUsernameError("Username is required")
      setCredentialsError("")
      valid = false
    } else {
      setUsernameError("")
    }

    if (!password) {
      setPasswordError("Password is required")
      setCredentialsError("")
      valid = false
    } else {
      setPasswordError("")
    }
  
    if (valid) {
      if (username !== "admin" || password !== "admin123") {
        setCredentialsError("Incorrect username or password")
      } else {
        setCredentialsError("")
        router.push("/home")
      }
    }
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
            data-testid="username"
            placeholder="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 
              ${usernameError 
                ? "border-red-500 focus:ring-red-500" 
                : "border-gray-300 focus:ring-blue-500"
              } text-gray-500`}
          />
          {/* this means only if the lefthand is true, format the right  */}
          {usernameError && <p className="text-red-500 text-xs mt-1">{usernameError}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="Password" className="block text-sm text-gray-600 mb-1">Password</label>
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
              } text-gray-500`}
          />
          {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
        </div>
        {credentialsError && <p data-testid="credentials-error" className="text-red-500 text-xs mb-2">{credentialsError}</p>}
        <button 
        data-testid="sign-in-button"
        type="button"
        onClick={handleSubmit}
        
        className="w-full cursor-pointer bg-slate-600 text-white py-2 rounded-md text-sm font-medium 
        hover:bg-slate-800">
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
