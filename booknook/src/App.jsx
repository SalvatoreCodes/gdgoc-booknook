import React, { useEffect, useState } from 'react'
import { LogOut, Clock, ShoppingCart, Check, Package } from 'lucide-react'

const MOCK_BOOKS = [
  { id: 'b1', title: 'The Quiet Mind', author: 'A. Rivers', price: 9.99, seed: 23 },
  { id: 'b2', title: 'Designing Calm', author: 'J. Lee', price: 14.99, seed: 45 },
  { id: 'b3', title: 'Small Things', author: 'M. Patel', price: 7.5, seed: 67 },
  { id: 'b4', title: 'Green Pages', author: 'L. Gomez', price: 12.0, seed: 89 },
  { id: 'b5', title: 'The First Chapter', author: 'S. N.', price: 11.25, seed: 101 },
  { id: 'b6', title: 'Paper Trails', author: 'C. Armitage', price: 8.5, seed: 131 },
  { id: 'b7', title: 'Daylight Reads', author: 'R. Ochoa', price: 16.0, seed: 151 },
  { id: 'b8', title: 'Pocket Library', author: 'K. Dunn', price: 6.99, seed: 177 }
]

const fmtPrice = p => `$${p.toFixed(2)}`

function addDays(date, days){
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function shortDate(d){ return new Date(d).toLocaleDateString() }

function useLocalStorage(key, initial){
  const [state, setState] = useState(()=>{
    try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial }catch(e){ return initial }
  })
  useEffect(()=> localStorage.setItem(key, JSON.stringify(state)), [key, state])
  return [state, setState]
}

function Header({user, active, setActive, onLogout}){
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

function BookCard({book, onBorrow, onBuy}){
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="w-full h-44 bg-gradient-to-br from-gray-200 to-gray-300 cover-placeholder">
        <div className="w-full h-full flex items-center justify-center">
          <img src={`https://picsum.photos/seed/${book.seed}/300/420`} alt={book.title} className="w-full h-full object-cover"/>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-md font-semibold text-gray-800">{book.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{book.author}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-800">{fmtPrice(book.price)}</div>
          <div className="flex gap-2">
            <button onClick={()=>onBorrow(book)} className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600"/> Borrow
            </button>
            <button onClick={()=>onBuy(book)} className="px-3 py-1 rounded-lg bg-gblue text-white text-sm flex items-center gap-2">
              <ShoppingCart className="w-4 h-4"/> Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Browse({onBorrow, onBuy}){
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Browse books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_BOOKS.map(b => <BookCard key={b.id} book={b} onBorrow={onBorrow} onBuy={onBuy} />)}
      </div>
    </div>
  )
}

function MyBooks({items, onToggleReceived}){
  if(items.length === 0) return (
    <div className="p-6 text-gray-500">You don't have any books yet. Borrow or buy from Browse.</div>
  )
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">My Books</h2>
      <div className="space-y-3">
        {items.map(it => (
          <div key={it.instanceId} className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <img src={`https://picsum.photos/seed/${it.seed}/80/110`} alt={it.title} className="w-16 h-20 object-cover rounded-md" />
              <div>
                <div className="font-medium text-gray-800">{it.title}</div>
                <div className="text-sm text-gray-500">{it.author} • {it.type === 'borrowed' ? 'Borrowed' : 'Owned'}</div>
                {it.type === 'borrowed' && <div className="text-xs text-gray-400 mt-1">Due {shortDate(it.dueDate)}</div>}
                {it.type === 'owned' && <div className="text-xs text-gray-400 mt-1">Owned</div>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <label className={`inline-flex items-center gap-2 cursor-pointer ${it.received ? 'text-ggreen' : 'text-gray-500'}`}>
                <input type="checkbox" checked={!!it.received} onChange={() => onToggleReceived(it.instanceId)} className="hidden" />
                <span className={`w-9 h-9 flex items-center justify-center rounded-md border ${it.received ? 'bg-ggreen text-white border-transparent' : 'bg-white border-gray-200'}`}>
                  {it.received ? <Check className="w-4 h-4"/> : <Package className="w-4 h-4"/>}
                </span>
                <span className="text-sm">Received</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PaymentModal({book, onCancel, onConfirm}){
  const [card, setCard] = useState({name:'', number:'', exp:'', cvc:''})
  const [processing, setProcessing] = useState(false)
  function doPay(){
    setProcessing(true)
    setTimeout(()=>{ setProcessing(false); onConfirm() }, 1400 + Math.random()*1000)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">Debit Payment</div>
            <div className="text-sm text-gray-500">Pay {fmtPrice(book.price)} for <span className="font-medium">{book.title}</span></div>
          </div>
          <button onClick={onCancel} className="text-gray-400">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <input placeholder="Name on card" value={card.name} onChange={e=>setCard({...card,name:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200"/>
          <input placeholder="Card number" value={card.number} onChange={e=>setCard({...card,number:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200"/>
          <div className="flex gap-2">
            <input placeholder="MM/YY" value={card.exp} onChange={e=>setCard({...card,exp:e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-gray-200"/>
            <input placeholder="CVC" value={card.cvc} onChange={e=>setCard({...card,cvc:e.target.value})} className="w-24 px-3 py-2 rounded-lg border border-gray-200"/>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200">Cancel</button>
          <button onClick={doPay} disabled={processing} className="px-4 py-2 rounded-lg bg-gblue text-white flex items-center gap-2">{processing ? 'Processing...' : 'Pay & Buy'}</button>
        </div>
      </div>
    </div>
  )
}

export default function App(){
  const [user, setUser] = useLocalStorage('booknook_user', null)
  const [active, setActive] = useLocalStorage('booknook_active', 'browse')
  const [myBooks, setMyBooks] = useLocalStorage('booknook_items', [])
  const [payFor, setPayFor] = useState(null)

  useEffect(()=>{ document.title = user ? `${user} • BookNook` : 'BookNook' }, [user])

  function handleLogin(name){ setUser(name) }
  function handleLogout(){ setUser(null); setActive('browse') }

  function borrowBook(book){
    const instance = {
      instanceId: `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      id: book.id, title: book.title, author: book.author, seed: book.seed,
      type: 'borrowed', received: false, dueDate: addDays(new Date(), 14).toISOString()
    }
    setMyBooks(prev => [instance, ...prev])
    setActive('mybooks')
  }

  function buyBook(book){ setPayFor(book) }

  function confirmBuy(){
    const instance = {
      instanceId: `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      id: payFor.id, title: payFor.title, author: payFor.author, seed: payFor.seed,
      type: 'owned', received: false, purchasedAt: new Date().toISOString()
    }
    setMyBooks(prev => [instance, ...prev])
    setPayFor(null)
    setActive('mybooks')
  }

  function toggleReceived(instanceId){ setMyBooks(prev => prev.map(it => it.instanceId===instanceId ? {...it, received: !it.received} : it)) }

  if(!user) return <LoginScreen onLogin={handleLogin} />

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} active={active} setActive={setActive} onLogout={handleLogout} />
      <main className="flex-1 max-w-6xl mx-auto w-full mt-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {active === 'browse' && <Browse onBorrow={borrowBook} onBuy={buyBook} />}
          {active === 'mybooks' && <MyBooks items={myBooks} onToggleReceived={toggleReceived} />}
        </div>
      </main>

      {payFor && <PaymentModal book={payFor} onCancel={() => setPayFor(null)} onConfirm={confirmBuy} />}

      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-400 py-6">Crafted with whitespace & rounded corners • Demo UI</footer>
    </div>
  )
}

function LoginScreen({onLogin}){
  const [name, setName] = useState('')
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gblue to-ggreen flex items-center justify-center text-white text-xl">📚</div>
          <div>
            <h1 className="text-2xl font-semibold">Welcome to <span className="inline-block"> <span style={{color:'#4285F4'}}>Book</span><span style={{color:'#EA4335'}}>N</span><span style={{color:'#FBBC05'}}>o</span><span style={{color:'#34A853'}}>ok</span></span></h1>
            <p className="text-gray-500 mt-1">Enter your name to unlock the nook</p>
          </div>
        </div>

        <label className="block text-sm text-gray-600 mb-2">Your name</label>
        <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gblue transition" placeholder="e.g., Sasha" />

        <div className="mt-6 flex gap-3">
          <button onClick={() => name.trim() && onLogin(name.trim())} disabled={!name.trim()} className="flex-1 py-3 rounded-lg bg-gblue text-white font-medium disabled:opacity-60">Unlock the Nook</button>
          <button onClick={() => { setName('Guest'); }} className="py-3 px-4 rounded-lg border border-gray-200">Try demo</button>
        </div>

        <p className="text-xs text-gray-400 mt-4">This is a demo — no real accounts or payments.</p>
      </div>
    </div>
  )
}
