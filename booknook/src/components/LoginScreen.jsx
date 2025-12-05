import React, { useState } from 'react'
import Signup from './Signup'

export default function LoginScreen({onLogin, onCreateAccount}){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [showSignup, setShowSignup] = useState(false)

  function submit(){
    setError(null)
    const ok = onLogin(username.trim(), password)
    if(!ok) setError('Invalid credentials. Try username/password from the demo accounts (alice/password123, bob/letmein) or use Guest.')
  }

  if(showSignup) return <Signup onCreateAccount={onCreateAccount} onCancel={()=>setShowSignup(false)} />

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

        <label className="block text-sm text-gray-600 mb-2">Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="alice" />

        <label className="block text-sm text-gray-600 mt-4 mb-2">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="••••••" />

        <div className="mt-6 flex gap-3">
          <button onClick={submit} className="flex-1 py-3 rounded-lg bg-gblue text-white font-medium">Sign in</button>
          <button onClick={() => { setUsername('guest'); setPassword(''); const ok = onLogin('guest', ''); if(!ok) setError('Unable to sign in as Guest') }} className="py-3 px-4 rounded-lg border border-gray-200">Try Guest</button>
        </div>

        <p className="text-xs text-gray-400 mt-4">Demo accounts: <span className="font-medium">alice / password123</span>, <span className="font-medium">bob / letmein</span>. <button onClick={()=>setShowSignup(true)} className="ml-2 underline text-gblue">Create account</button></p>
      </div>
    </div>
  )
}
