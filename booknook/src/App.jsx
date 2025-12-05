import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Browse from './components/Browse'
import MyBooks from './components/MyBooks'
import PaymentModal from './components/PaymentModal'
import LateFeeModal from './components/LateFeeModal'
import LoginScreen from './components/LoginScreen'
import BookDetailModal from './components/BookDetailModal'
import useLocalStorage from './hooks/useLocalStorage'
import { addDays } from './utils'
import MOCK_BOOKS from './data/mockBooks'
import { auth, db } from './firebase'
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, sendEmailVerification } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore'

// MOCK_BOOKS moved to `src/data/mockBooks.js` and imported above

// Accounts and persistence are handled via Firebase now.

export default function App(){
  const [user, setUser] = useState(null) // firebase user object
  const [active, setActive] = useLocalStorage('booknook_active', 'browse')
  const [myBooks, setMyBooks] = useState([])
  const [payFor, setPayFor] = useState(null)
  const [lateReturnFor, setLateReturnFor] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [borrowToast, setBorrowToast] = useState(false)
  const [catalog, setCatalog] = useState([])
  const [profile, setProfile] = useState(null)
  const [isAuthInitializing, setIsAuthInitializing] = useState(true)
  const [isCatalogLoading, setIsCatalogLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [initialBooksLoaded, setInitialBooksLoaded] = useState(false)

  useEffect(()=>{
    // subscribe to firebase auth state
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setIsAuthInitializing(false)
      if(!fbUser){
        setUser(null)
        setProfile(null)
        setMyBooks([])
        setInitialBooksLoaded(false)
        setNeedsVerification(false)
        document.title = 'BookNook'
        return
      }
      setUser(fbUser)
      setNeedsVerification(!fbUser.emailVerified)
      // load user profile from firestore
      try{
        const udoc = await getDoc(doc(db,'users', fbUser.uid))
        const display = udoc.exists() ? (udoc.data().displayName || fbUser.email) : (fbUser.email)
        setProfile({ uid: fbUser.uid, email: fbUser.email, displayName: display })
        document.title = `${display} • BookNook`
      }catch(e){ setProfile({ uid: fbUser.uid, email: fbUser.email, displayName: fbUser.email }); document.title = fbUser.email }

      // load user books from firestore
      try{
        const ub = await getDoc(doc(db,'user_books', fbUser.uid))
        if(ub.exists()) setMyBooks(ub.data().items || [])
        else setMyBooks([])
        setInitialBooksLoaded(true)
      }catch(e){ setMyBooks([]) }
    })
    // load catalog once
    loadCatalog()
    return ()=>unsub()
  }, [])

  async function loadCatalog(){
    setIsCatalogLoading(true)
    try{
      const snaps = await getDocs(collection(db,'books'))
      const items = snaps.docs.map(d=>({ id: d.id, ...d.data() }))
      if(items.length) { setCatalog(items); setIsCatalogLoading(false); return }
    }catch(e){ /* ignore and fallback */ }
    setCatalog(MOCK_BOOKS)
    setIsCatalogLoading(false)
  }

  useEffect(()=>{
    if(!user || !user.uid || !initialBooksLoaded) return
    // persist user books to Firestore
    const uid = user.uid
    let cancelled = false
    ;(async ()=>{
      setIsSaving(true)
      try{ await setDoc(doc(db,'user_books', uid), { items: myBooks }) }catch(e){ console.warn('saving user books failed', e) }
      if(!cancelled) setIsSaving(false)
    })()
    return ()=>{ cancelled = true }
  }, [user, myBooks])

  async function handleLogin(email, password){
    if(!email) return false
    try{
      const res = await signInWithEmailAndPassword(auth, email, password)
      return !!res.user
    }catch(e){ return false }
  }

  async function createAccount({username, email, password, displayName}){
    if(!email || !password) return { success: false, message: 'Missing email or password' }
    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)
      const uid = res.user.uid
      await setDoc(doc(db,'users', uid), { username: username || '', email, displayName: displayName || username || email })
      try{ await updateProfile(res.user, { displayName: displayName || username || email }) }catch(e){}
      try{ await sendEmailVerification(res.user) }catch(e){ console.warn('verification send failed', e) }
      await setDoc(doc(db,'user_books', uid), { items: [] })
      return { success: true }
    }catch(e){ return { success: false, message: e.message || 'Unable to create account' } }
  }

  async function resendVerification(){
    if(!auth.currentUser) return { success: false }
    try{ await sendEmailVerification(auth.currentUser); return { success: true } }catch(e){ return { success: false, message: e.message } }
  }

  // createAccount is implemented using Firebase (see async createAccount above)

  async function handleLogout(){ try{ await signOut(auth) }catch(e){}; setActive('browse') }

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

  if(isAuthInitializing) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center text-gray-600">Initializing authentication…</div>
    </div>
  )

  if(!user) return <LoginScreen onLogin={handleLogin} onCreateAccount={createAccount} />

  const displayName = profile?.displayName ?? user?.email ?? 'User'

  return (
    <div className="min-h-screen flex flex-col">
      {needsVerification && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-yellow-800">Please verify your email address to enable full account features.</div>
              <div className="text-xs text-yellow-600">A verification link was sent after signup.</div>
            </div>
            <div className="flex gap-2">
              <button onClick={async ()=>{ const r = await resendVerification(); if(r.success) alert('Verification email sent'); else alert('Unable to send verification') }} className="px-3 py-2 rounded bg-yellow-400 text-white">Resend</button>
              <button onClick={handleLogout} className="px-3 py-2 rounded border">Sign out</button>
            </div>
          </div>
        </div>
      )}
      <Header user={displayName} active={active} setActive={setActive} onLogout={handleLogout} />
      <main className="flex-1 max-w-6xl mx-auto w-full mt-6">
        {(isCatalogLoading || isSaving) && (
          <div className="max-w-6xl mx-auto px-6 mb-4">
            <div className="text-xs text-gray-500">
              {isCatalogLoading && <span>Loading catalog… </span>}
              {isSaving && <span>Saving your library…</span>}
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {active === 'browse' && <Browse books={catalog.length ? catalog : MOCK_BOOKS} onBorrow={borrowBook} onBuy={buyBook} onReadMore={setSelectedBook} />}
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
