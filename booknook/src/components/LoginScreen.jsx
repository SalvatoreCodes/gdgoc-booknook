import React, { useState } from 'react'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import Signup from './Signup'

export default function LoginScreen({onLogin, onCreateAccount}){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  async function submit(e) {
    e?.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      onLogin && onLogin(userCredential.user)
    } catch (err) {
      console.error('Login error:', err)
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No user found with this email')
          break
        case 'auth/wrong-password':
          setError('Incorrect password')
          break
        case 'auth/invalid-email':
          setError('Invalid email address')
          break
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later or reset your password')
          break
        default:
          setError(`Login failed: ${err.message || 'Unknown error occurred'}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if(showSignup) return <Signup onCreateAccount={onCreateAccount} onCancel={()=>setShowSignup(false)} />

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={submit} className="max-w-md w-full p-8 bg-white rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gblue to-ggreen flex items-center justify-center text-white text-xl">📚</div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome to <span className="inline-block"> <span style={{color:'#4285F4'}}>Book</span><span style={{color:'#EA4335'}}>N</span><span style={{color:'#FBBC05'}}>o</span><span style={{color:'#34A853'}}>ok</span></span></h1>
            <p className="text-gray-500 mt-1">Sign in to access your nook</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition"
              placeholder="email@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-600 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition"
              placeholder="••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-medium text-white transition ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gblue hover:bg-blue-600'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setShowSignup(true)}
            className="text-gblue hover:underline"
          >
            Create account
          </button>
        </p>
      </form>
    </div>
  )
}