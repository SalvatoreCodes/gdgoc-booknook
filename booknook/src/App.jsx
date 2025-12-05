import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Browse from './components/Browse'
import MyBooks from './components/MyBooks'
import PaymentModal from './components/PaymentModal'
import LateFeeModal from './components/LateFeeModal'
import LoginScreen from './components/LoginScreen'
import useLocalStorage from './hooks/useLocalStorage'
import { addDays } from './utils'

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

const MOCK_ACCOUNTS = [
  {
    username: 'alice',
    password: 'password123',
    displayName: 'Alice',
    initialBooks: [
      {
        instanceId: 'i_demo_1', id: 'b2', title: 'Designing Calm', author: 'J. Lee', seed: 45,
        type: 'borrowed', received: false, borrowDate: new Date().toISOString(), dueDate: addDays(new Date(), 7).toISOString()
      },
      {
        instanceId: 'i_demo_2', id: 'b5', title: 'The First Chapter', author: 'S. N.', seed: 101,
        type: 'owned', received: true, purchasedAt: new Date().toISOString()
      }
    ]
  },
  {
    username: 'bob',
    password: 'letmein',
    displayName: 'Bob',
    initialBooks: [
      {
        instanceId: 'i_demo_3', id: 'b3', title: 'Small Things', author: 'M. Patel', seed: 67,
        type: 'owned', received: false, purchasedAt: new Date().toISOString()
      }
    ]
  }
]

export default function App(){
  const [user, setUser] = useLocalStorage('booknook_user', null)
  const [active, setActive] = useLocalStorage('booknook_active', 'browse')
  const [myBooks, setMyBooks] = useState([])
  const [payFor, setPayFor] = useState(null)
  const [lateReturnFor, setLateReturnFor] = useState(null)

  useEffect(()=>{
    if(!user){ document.title = 'BookNook'; setMyBooks([]); return }
    const acct = MOCK_ACCOUNTS.find(a => a.username === user)
    const display = acct?.displayName ?? user
    document.title = `${display} • BookNook`

    const key = `booknook_items_${user}`
    try{
      const raw = localStorage.getItem(key)
      if(raw) setMyBooks(JSON.parse(raw))
      else setMyBooks(acct?.initialBooks ?? [])
    }catch(e){ setMyBooks(acct?.initialBooks ?? []) }
  }, [user])

  useEffect(()=>{
    if(!user) return
    try{ localStorage.setItem(`booknook_items_${user}`, JSON.stringify(myBooks)) }catch(e){}
  }, [user, myBooks])

  function handleLogin(username, password){
    if(!username) return false
    if(username.toLowerCase() === 'guest'){ setUser('guest'); return true }
    const acct = MOCK_ACCOUNTS.find(a => a.username === username && a.password === password)
    if(acct){ setUser(acct.username); return true }
    return false
  }

  function handleLogout(){ setUser(null); setActive('browse') }

  function borrowBook(book){
    const instance = {
      instanceId: `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      id: book.id, title: book.title, author: book.author, seed: book.seed,
      type: 'borrowed', received: false, borrowDate: new Date().toISOString(), dueDate: addDays(new Date(), 14).toISOString()
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

  function handleReturn(item){
    const borrowDate = item.borrowDate ? new Date(item.borrowDate) : null
    if(!borrowDate){ setMyBooks(prev => prev.filter(it => it.instanceId !== item.instanceId)); return }
    const now = new Date()
    const msPerDay = 1000*60*60*24
    const days = (now - borrowDate) / msPerDay
    if(days > 3){ const overdueDays = Math.ceil(days - 3); const fee = overdueDays * 2; setLateReturnFor({item, fee}) }
    else { setMyBooks(prev => prev.filter(it => it.instanceId !== item.instanceId)) }
  }

  function confirmLateReturn(){ if(!lateReturnFor) return; setMyBooks(prev => prev.filter(it => it.instanceId !== lateReturnFor.item.instanceId)); setLateReturnFor(null) }

  if(!user) return <LoginScreen onLogin={handleLogin} />

  const acct = MOCK_ACCOUNTS.find(a=>a.username===user)
  const displayName = acct?.displayName ?? (user ? user.charAt(0).toUpperCase()+user.slice(1) : '')

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={displayName} active={active} setActive={setActive} onLogout={handleLogout} />
      <main className="flex-1 max-w-6xl mx-auto w-full mt-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {active === 'browse' && <Browse books={MOCK_BOOKS} onBorrow={borrowBook} onBuy={buyBook} />}
          {active === 'mybooks' && <MyBooks items={myBooks} onToggleReceived={toggleReceived} onReturn={handleReturn} />}
        </div>
      </main>

      {payFor && <PaymentModal book={payFor} onCancel={() => setPayFor(null)} onConfirm={confirmBuy} />}
      {lateReturnFor && <LateFeeModal item={lateReturnFor.item} fee={lateReturnFor.fee} onCancel={()=>setLateReturnFor(null)} onConfirm={confirmLateReturn} />}

      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-400 py-6">Crafted with whitespace & rounded corners • Demo UI</footer>
    </div>
  )
}
