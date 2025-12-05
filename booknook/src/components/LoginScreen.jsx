import React, { useState } from 'react'
import Signup from './Signup'
import { auth } from '../firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

export default function LoginScreen({onLogin, onCreateAccount}){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showSignup, setShowSignup] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState(null)
  const [resetError, setResetError] = useState(null)
  const [resetLoading, setResetLoading] = useState(false)

  async function submit(){
    setError(null)
    const ok = await onLogin(email.trim(), password)
    if(!ok) setError('Invalid credentials. Try demo accounts or create an account.')
  }

  if(showSignup) return <Signup onCreateAccount={onCreateAccount} onCancel={()=>setShowSignup(false)} />

  if(showReset) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reset password</h2>
        {resetMessage && <div className="mb-3 text-sm text-green-600">{resetMessage}</div>}
        {resetError && <div className="mb-3 text-sm text-red-600">{resetError}</div>}
        <label className="block text-sm text-gray-600 mb-2">Email</label>
        <input value={resetEmail} onChange={e=>setResetEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200" placeholder="you@example.com" />
        <div className="mt-4 flex gap-3">
          <button disabled={resetLoading} onClick={async ()=>{
            setResetLoading(true); setResetError(null); setResetMessage(null)
            try{ await sendPasswordResetEmail(auth, (resetEmail||email).trim()); setResetMessage('Password reset email sent.'); setResetLoading(false) }catch(e){ setResetError(e.message || 'Unable to send'); setResetLoading(false) }
          }} className="flex-1 py-3 rounded-lg bg-gblue text-white">Send reset</button>
          <button onClick={()=>{ setShowReset(false); setResetError(null); setResetMessage(null) }} className="py-3 px-4 rounded-lg border">Back</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gblue to-ggreen flex items-center justify-center text-white text-xl">📚</div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome to <span className="inline-block"> <span style={{color:'#4285F4'}}>Book</span><span style={{color:'#EA4335'}}>N</span><span style={{color:'#FBBC05'}}>o</span><span style={{color:'#34A853'}}>ok</span></span></h1>
            <p className="text-gray-500 mt-1">Sign in to access your nook</p>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

        <label className="block text-sm text-gray-600 mb-2">Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="you@example.com" />

        <label className="block text-sm text-gray-600 mt-4 mb-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="••••••" />

        <div className="mt-6 flex gap-3">
          <button onClick={submit} className="flex-1 py-3 rounded-lg bg-gblue text-white font-medium">Sign in</button>
        </div>

        <p className="text-xs text-gray-400 mt-4">Demo accounts available in-memory. <button onClick={()=>setShowSignup(true)} className="ml-2 underline text-gblue">Create account</button></p>
      </div>
    </div>
  )
}
