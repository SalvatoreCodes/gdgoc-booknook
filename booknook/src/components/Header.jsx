import React from 'react'
import { LogOut } from 'lucide-react'

export default function Header({user, active, setActive, onLogout}){
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 select-none">
            <span className="text-2xl font-extrabold" style={{letterSpacing: '-0.02em'}}>
              <span style={{color:'#4285F4'}}>B</span>
              <span style={{color:'#EA4335'}}>o</span>
              <span style={{color:'#FBBC05'}}>o</span>
              <span style={{color:'#34A853'}}>k</span>
              <span style={{marginLeft:6}}>Nook</span>
            </span>
          </div>

          <nav className="ml-6 flex items-center gap-2">
            <button onClick={() => setActive('browse')} className={`px-3 py-2 rounded-md ${active==='browse' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Browse
            </button>
            <button onClick={() => setActive('mybooks')} className={`px-3 py-2 rounded-md ${active==='mybooks' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              My Books
            </button>
            <button onClick={() => setActive('dashboard')} className={`px-3 py-2 rounded-md ${active==='dashboard' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              Dashboard
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Hello, <span className="font-medium text-gray-800">{user}</span></div>
            <div className="text-xs text-gray-400">Welcome back to your nook</div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm">
            <LogOut className="w-4 h-4 text-gray-600"/> <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
