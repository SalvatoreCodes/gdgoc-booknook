import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Browse from './components/Browse'
import MyBooks from './components/MyBooks'
import PaymentModal from './components/PaymentModal'
import LateFeeModal from './components/LateFeeModal'
import LoginScreen from './components/LoginScreen'
import BookDetailModal from './components/BookDetailModal'
import useLocalStorage from './hooks/useLocalStorage'
import { MOCK_BOOKS } from './data/data'
import { MOCK_ACCOUNTS } from './data/accounts'

function loadAccounts(){
  try{
    const raw = localStorage.getItem('booknook_accounts')
    if(raw) return JSON.parse(raw)
  }catch(e){ }
  try{ localStorage.setItem('booknook_accounts', JSON.stringify(MOCK_ACCOUNTS)) }catch(e){}
  return MOCK_ACCOUNTS
}

function saveAccounts(accounts){
  try{ localStorage.setItem('booknook_accounts', JSON.stringify(accounts)) }catch(e){}
}

export default function App(){
  const [user, setUser] = useLocalStorage('booknook_user', null)
  const [active, setActive] = useLocalStorage('booknook_active', 'browse')
  const [myBooks, setMyBooks] = useState([])
  const [payFor, setPayFor] = useState(null)
  const [lateReturnFor, setLateReturnFor] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [borrowToast, setBorrowToast] = useState(false)

  useEffect(()=>{
    if(!user){ document.title = 'BookNook'; setMyBooks([]); return }
    const acct = loadAccounts().find(a => a.username === user)
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
    const acct = loadAccounts().find(a => a.username === username && a.password === password)
    if(acct){ setUser(acct.username); return true }
    return false
  }

  function createAccount({username, password, displayName}){
    if(!username || !password) return { success: false, message: 'Missing username or password' }
    const accounts = loadAccounts()
    const exists = accounts.find(a => a.username.toLowerCase() === username.toLowerCase())
    if(exists) return { success: false, message: 'Username already exists' }
    const acct = { username, password, displayName: displayName || username, initialBooks: [] }
    accounts.push(acct)
    saveAccounts(accounts)
    try{ localStorage.setItem(`booknook_items_${username}`, JSON.stringify([])) }catch(e){}
    setUser(username)
    return { success: true }
  }

  function handleLogout(){ setUser(null); setActive('browse') }

  function borrowBook(book){
    const instance = {
      instanceId: `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      id: book.id, title: book.title, author: book.author, isbn: book.isbn,
      type: 'borrowed', received: false, borrowDate: new Date().toISOString(), dueDate: addDays(new Date(), 14).toISOString()
    }
    setMyBooks(prev => [instance, ...prev])
    setActive('mybooks')
    setBorrowToast(true)
    setTimeout(()=>setBorrowToast(false), 2800)
  }

  function buyBook(book){ setPayFor(book) }

  function confirmBuy(){
    const instance = {
      instanceId: `i_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
      id: payFor.id, title: payFor.title, author: payFor.author, isbn: payFor.isbn,
      type: 'owned', received: false, purchasedAt: new Date().toISOString()
    }
    setMyBooks(prev => [instance, ...prev])
    setPayFor(null)
    setActive('mybooks')
  }

  function deleteOwned(instanceId){
    setMyBooks(prev => prev.filter(it => it.instanceId !== instanceId))
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

  if(!user) return <LoginScreen onLogin={handleLogin} onCreateAccount={createAccount} />

  const acct = loadAccounts().find(a=>a.username===user)
  const displayName = acct?.displayName ?? (user ? user.charAt(0).toUpperCase()+user.slice(1) : '')

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={displayName} active={active} setActive={setActive} onLogout={handleLogout} />
      <main className="flex-1 max-w-6xl mx-auto w-full mt-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {active === 'browse' && <Browse books={MOCK_BOOKS} onBorrow={borrowBook} onBuy={buyBook} onReadMore={setSelectedBook} />}
          {active === 'mybooks' && <MyBooks items={myBooks} onToggleReceived={toggleReceived} onReturn={handleReturn} onDelete={deleteOwned} />}
        </div>
      </main>

      {payFor && <PaymentModal book={payFor} onCancel={() => setPayFor(null)} onConfirm={confirmBuy} />}
      {lateReturnFor && <LateFeeModal item={lateReturnFor.item} fee={lateReturnFor.fee} onCancel={()=>setLateReturnFor(null)} onConfirm={confirmLateReturn} />}
      {selectedBook && <BookDetailModal book={selectedBook} onClose={() => setSelectedBook(null)} onBorrow={borrowBook} onBuy={buyBook} />}

      {borrowToast && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-lg px-4 py-3 z-50">
          Book borrowed — check My Books for details on the book
        </div>
      )}

      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-gray-400 py-6">@SalvatoreCodes</footer>
    </div>
  )
}
