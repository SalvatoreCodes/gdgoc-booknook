import React, { useState } from 'react'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function Signup({ onCreateAccount, onCancel, onLogin }){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  async function submit(e){
    e && e.preventDefault()
    setError(null)
    const u = username.trim().toLowerCase()
    if(!u) return setError('Choose a username')
    if(!password) return setError('Choose a password')
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      onLogin && onLogin(userCredential.user)
      onCancel && onCancel()
    } catch(err){ setError('Error creating account') }
    setLoading(false)
  }

  if (showLogin) return <LoginScreen onLogin={onLogin} onCreateAccount={onCreateAccount} />

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={submit} className="max-w-md w-full p-8 bg-white rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gblue to-ggreen flex items-center justify-center text-white text-xl">🔐</div>
          <div>
            <h2 className="text-xl font-semibold">Create an account</h2>
            <p className="text-gray-500 mt-1 text-sm">Create a username to save your library</p>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <label className="block text-sm text-gray-600 mb-2">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="username" />

        <label className="block text-sm text-gray-600 mt-4 mb-2">Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="Your email" />

        <label className="block text-sm text-gray-600 mt-4 mb-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="Choose a password" />

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-gblue text-white font-medium">{loading ? 'Creating...' : 'Create account'}</button>
          <button type="button" onClick={onCancel} className="py-3 px-4 rounded-lg border border-gray-200">Cancel</button>
        </div>

        <p className="text-xs text-gray-400 mt-4">User accounts are saved locally in your browser.</p>
      </form>
    </div>
  )
}
