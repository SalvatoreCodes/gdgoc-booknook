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

const MOCK_BOOKS = [
  { id: 'b1', title: 'Pride and Prejudice', author: 'Jane Austen', price: 12.99, isbn: '0141018267', description: 'A romantic novel of manners that follows Elizabeth Bennet as she navigates issues of wealth, morality, and marriage in Georgian society. With wit and social commentary, Austen explores the prejudices of the time and the importance of personal growth.' },
  { id: 'b2', title: 'Jane Eyre', author: 'Charlotte Brontë', price: 13.99, isbn: '0141441143', description: 'An orphaned governess falls in love with her mysterious employer, only to discover dark secrets hidden within the mansion. A Gothic romance that champions female independence and moral integrity.' },
  { id: 'b3', title: 'Wuthering Heights', author: 'Emily Brontë', price: 12.99, isbn: '0141439556', description: 'A dark, turbulent tale of love and revenge on the Yorkshire moors. The volatile relationship between Heathcliff and Cathy spans generations, exploring themes of passion, social class, and redemption.' },
  { id: 'b4', title: 'Great Expectations', author: 'Charles Dickens', price: 14.99, isbn: '0141439564', description: 'A coming-of-age story of a young orphan, Pip, who suddenly acquires a fortune and moves to London. Dickens examines class, ambition, and the nature of gratitude through vivid characters and social critique.' },
  { id: 'b5', title: 'Little Women', author: 'Louisa May Alcott', price: 11.99, isbn: '0141321443', description: 'Four sisters—Meg, Jo, Beth, and Amy—navigate adolescence and young womanhood during the Civil War. A timeless tale of family bonds, dreams, and the journey to adulthood.' },
  { id: 'b6', title: 'Frankenstein', author: 'Mary Shelley', price: 10.99, isbn: '0141439475', description: 'Victor Frankenstein\'s obsession with creating life leads to catastrophe when his monster awakens. A Gothic masterpiece exploring ambition, responsibility, and the nature of humanity.' },
  { id: 'b7', title: 'The Count of Monte Cristo', author: 'Alexandre Dumas', price: 15.99, isbn: '0140449264', description: 'An unjustly imprisoned sailor escapes, discovers a fortune, and spends years executing an elaborate plan of revenge against those who betrayed him. A thrilling tale of justice and redemption.' },
  { id: 'b8', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', price: 9.99, isbn: '0141442468', description: 'A vain young man wishes that a portrait ages instead of him, and his wish comes true. Wilde\'s only novel explores vanity, morality, and the corruption of the soul through wit and philosophy.' },
  { id: 'b9', title: 'Anna Karenina', author: 'Leo Tolstoy', price: 16.99, isbn: '0199232768', description: 'A sweeping epic chronicling the tragic affair between Anna Karenina and Count Vronsky against the backdrop of Russian society. Tolstoy explores love, marriage, family, and the meaning of life.' },
  { id: 'b10', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', price: 15.99, isbn: '0486454614', description: 'A poor student commits murder and struggles with guilt and redemption in 19th-century Saint Petersburg. Dostoevsky\'s psychological masterpiece delves into morality, suffering, and spiritual resurrection.' },
  { id: 'b11', title: 'War and Peace', author: 'Leo Tolstoy', price: 18.99, isbn: '0199232369', description: 'An epic novel set during the Napoleonic Wars, following the intertwined lives of Russian aristocrats. Tolstoy weaves history, philosophy, and personal narratives into a monumental exploration of human existence.' },
  { id: 'b12', title: 'Middlemarch', author: 'George Eliot', price: 14.99, isbn: '0141441089', description: 'A provincial English town is the setting for interconnected stories of passion, marriage, and self-discovery among its inhabitants. Eliot crafts a rich tapestry of human desires and moral complexities.' },
  { id: 'b13', title: 'Moby-Dick', author: 'Herman Melville', price: 13.99, isbn: '0141439645', description: 'Captain Ahab leads his obsessed crew aboard the Pequod in pursuit of the legendary white whale. An epic adventure that questions fate, obsession, and humanity\'s relationship with nature.' },
  { id: 'b14', title: 'The Adventures of Huckleberry Finn', author: 'Mark Twain', price: 12.99, isbn: '048626264X', description: 'A young boy and an escaped slave journey down the Mississippi River in search of freedom. Twain\'s satirical masterpiece critiques racism and celebrates the bond of friendship.' },
  { id: 'b15', title: '1984', author: 'George Orwell', price: 13.99, isbn: '0451524934', description: 'In a totalitarian dystopia, Winston Smith rebels against Big Brother\'s absolute control. Orwell\'s chilling novel warns against surveillance, propaganda, and the manipulation of truth.' },
  { id: 'b16', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 11.99, isbn: '0743273567', description: 'A mysterious millionaire throws lavish parties on Long Island to win back his lost love. Fitzgerald captures the decadence and disillusionment of the Jazz Age in this American classic.' },
  { id: 'b17', title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 12.99, isbn: '0061120081', description: 'A young girl named Scout comes of age in the Deep South as her father defends a Black man falsely accused of assault. Lee\'s powerful novel explores prejudice, justice, and moral courage.' },
  { id: 'b18', title: 'The Catcher in the Rye', author: 'J.D. Salinger', price: 12.99, isbn: '0316769174', description: 'Teenage Holden Caulfield wanders New York City after being expelled from school, struggling with alienation and depression. Salinger\'s controversial classic captures adolescent angst and searching.' },
  { id: 'b19', title: 'Brave New World', author: 'Aldous Huxley', price: 13.99, isbn: '0060085235', description: 'In a future where people are conditioned for happiness and pleasure, individuality is sacrificed. Huxley\'s dystopia warns against the dangers of comfort, conformity, and technological control.' },
  { id: 'b20', title: 'Animal Farm', author: 'George Orwell', price: 9.99, isbn: '045152634X', description: 'Farm animals overthrow their human master to establish their own society, only to have power corrupted. Orwell\'s allegorical novella is a sharp critique of totalitarianism and revolution.' },
  { id: 'b21', title: 'Lord of the Flies', author: 'William Golding', price: 11.99, isbn: '0399501487', description: 'Schoolboys stranded on an uninhabited island attempt to govern themselves, descending into chaos and savagery. Golding explores the darkness within human nature and civilization\'s fragility.' },
  { id: 'b22', title: 'The Grapes of Wrath', author: 'John Steinbeck', price: 14.99, isbn: '0143039431', description: 'The Joad family loses their farm during the Great Depression and journeys west seeking a better life. Steinbeck\'s powerful novel portrays poverty, exploitation, and the resilience of the human spirit.' },
  { id: 'b23', title: 'The Stranger', author: 'Albert Camus', price: 11.99, isbn: '0679720200', description: 'A detached man commits a senseless murder and faces trial and execution. Camus\' philosophical novel explores absurdism, indifference, and the search for meaning in a meaningless universe.' },
  { id: 'b24', title: 'Invisible Man', author: 'Ralph Ellison', price: 14.99, isbn: '0679732764', description: 'An unnamed Black man navigates American racism and becomes invisible to society. Ellison\'s masterpiece examines identity, race, and the struggle for recognition in a prejudiced world.' },
  { id: 'b25', title: 'The Bell Jar', author: 'Sylvia Plath', price: 12.99, isbn: '0061148512', description: 'A talented young woman\'s descent into mental illness and suicide attempt during the 1950s. Plath\'s semi-autobiographical novel candidly portrays depression, identity, and feminine constraints.' },
  { id: 'b26', title: 'Catch-22', author: 'Joseph Heller', price: 15.99, isbn: '0684801221', description: 'A bombardier caught in the bureaucratic absurdities of World War II confronts the circular logic of military regulation. Heller\'s darkly comic novel is a scathing critique of war and authority.' },
  { id: 'b27', title: 'Lolita', author: 'Vladimir Nabokov', price: 13.99, isbn: '0679723153', description: 'A narrator obsessed with a young girl recounts his seduction and abuse of her. Nabokov\'s controversial novel is a linguistic masterpiece exploring obsession, manipulation, and unreliable narration.' },
  { id: 'b28', title: 'Mrs. Dalloway', author: 'Virginia Woolf', price: 11.99, isbn: '0156628708', description: 'A single day in the life of an upper-class London woman as she prepares for an evening party. Woolf\'s experimental stream-of-consciousness novel explores consciousness, time, and feminine experience.' },
  { id: 'b29', title: 'One Hundred Years of Solitude', author: 'Gabriel García Márquez', price: 15.99, isbn: '0060883286', description: 'Seven generations of the Buendía family repeat patterns of love and solitude in the magical town of Macondo. Márquez\'s masterpiece blends realism with magical elements in a multigenerational saga.' },
  { id: 'b30', title: 'Beloved', author: 'Toni Morrison', price: 14.99, isbn: '1400033415', description: 'A formerly enslaved woman and her daughter confront the ghost of a baby she killed to save from slavery. Morrison\'s haunting novel unflinchingly addresses the trauma and legacy of slavery.' },
  { id: 'b31', title: 'The Handmaid\'s Tale', author: 'Margaret Atwood', price: 13.99, isbn: '0385333315', description: 'In a dystopian theocracy, a woman is forced into servitude for reproduction and begins to rebel. Atwood\'s chilling feminist novel envisions a world where women\'s rights are stripped away.' },
  { id: 'b32', title: 'Things Fall Apart', author: 'Chinua Achebe', price: 11.99, isbn: '0385474547', description: 'A respected warrior in a Nigerian village watches his world collapse as European colonizers arrive. Achebe\'s groundbreaking novel centers African perspectives and critiques colonialism from within.' },
  { id: 'b33', title: 'The Kite Runner', author: 'Khaled Hosseini', price: 14.99, isbn: '1594480001', description: 'Two boys in Afghanistan are separated by a traumatic event and a betrayal. Hosseini explores friendship, guilt, redemption, and the possibility of atonement against the backdrop of Taliban rule.' },
  { id: 'b34', title: 'The God of Small Things', author: 'Arundhati Roy', price: 14.99, isbn: '0060977493', description: 'Fraternal twins are separated after a forbidden love affair rocks their Syrian Christian family in Kerala. Roy\'s lyrical debut examines love, caste, family, and the transformative power of storytelling.' },
  { id: 'b35', title: 'Midnight\'s Children', author: 'Salman Rushdie', price: 15.99, isbn: '0812976711', description: 'Children born at the moment of India\'s independence discover they possess magical powers. Rushdie\'s magical realist epic weaves personal and national histories through an enchanting narrative.' },
  { id: 'b36', title: 'The Color Purple', author: 'Alice Walker', price: 13.99, isbn: '0142003093', description: 'An abused Black woman finds her voice and freedom through letters to God and her sister. Walker\'s epistolary novel is a powerful testament to resilience, sisterhood, and spiritual liberation.' },
  { id: 'b37', title: 'Atonement', author: 'Ian McEwan', price: 14.99, isbn: '0385721722', description: 'A teenage girl\'s lie sets off a chain of events that destroys lives during World War II. McEwan\'s meticulously crafted novel explores the consequences of a moment and the redemptive power of art.' },
  { id: 'b38', title: 'Life of Pi', author: 'Yann Martel', price: 13.99, isbn: '0156027321', description: 'A young man survives 227 days at sea on a lifeboat with a Bengal tiger. Martel\'s philosophical adventure novel explores faith, storytelling, and the human capacity for survival and adaptation.' },
  { id: 'b39', title: 'White Teeth', author: 'Zadie Smith', price: 14.99, isbn: '0375701028', description: 'Two aging immigrant fathers and their mixed-race families navigate London in the final decades of the 20th century. Smith\'s debut is a vibrant, comic exploration of multiculturalism and belonging.' },
  { id: 'b40', title: 'The Road', author: 'Cormac McCarthy', price: 13.99, isbn: '0307387895', description: 'A father and son journey through a post-apocalyptic wasteland toward the coast. McCarthy\'s sparse, haunting prose explores survival, love, and hope in a world reduced to ashes.' },
  { id: 'b41', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', price: 16.99, isbn: '0544003413', description: 'Hobbits and their companions embark on an epic quest to destroy a magical ring and defeat dark forces. Tolkien\'s trilogy revolutionized fantasy literature with its rich world-building and mythic scope.' },
  { id: 'b42', title: 'The Hobbit', author: 'J.R.R. Tolkien', price: 12.99, isbn: '0544003407', description: 'A comfort-loving hobbit embarks on an unexpected adventure with dwarves and a wizard. Tolkien\'s beloved classic is a fairy tale quest filled with magical encounters and self-discovery.' },
  { id: 'b43', title: 'Dune', author: 'Frank Herbert', price: 14.99, isbn: '0441172717', description: 'On a desert planet, a young man becomes embroiled in political intrigue, religious prophecy, and ecological transformation. Herbert\'s monumental sci-fi epic explores power, ecology, and human potential.' },
  { id: 'b44', title: 'Fahrenheit 451', author: 'Ray Bradbury', price: 11.99, isbn: '1451673264', description: 'A fireman burns books in a society where reading is forbidden and independent thought is dangerous. Bradbury\'s prescient novel celebrates literature and warns against censorship and conformity.' },
  { id: 'b45', title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', price: 12.99, isbn: '0345391802', description: 'An ordinary man is swept into space adventures after Earth is demolished to make way for a hyperspace bypass. Adams\' absurdist comedy is a witty, sardonic exploration of life, the universe, and everything.' },
  { id: 'b46', title: 'The Diary of a Young Girl', author: 'Anne Frank', price: 12.99, isbn: '0553296981', description: 'A Jewish girl records her experiences hiding from Nazi persecution in Amsterdam during World War II. Frank\'s moving diary is a testament to hope and humanity amid historical tragedy.' },
  { id: 'b47', title: 'Night', author: 'Elie Wiesel', price: 11.99, isbn: '0374500010', description: 'A survivor recalls his experiences in Nazi concentration camps during the Holocaust. Wiesel\'s haunting memoir is a powerful witness to atrocity and a meditation on faith, suffering, and survival.' },
  { id: 'b48', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', price: 17.99, isbn: '0062316095', description: 'An ambitious survey of human history from the Cognitive Revolution to the present day. Harari traces how humans came to dominate the world through storytelling, agriculture, and technology.' },
  { id: 'b49', title: 'In Cold Blood', author: 'Truman Capote', price: 13.99, isbn: '0375418571', description: 'A true account of a brutal farmhouse murder in Kansas and the investigation that follows. Capote\'s pioneering true crime narrative is a masterwork of journalism and psychological portraiture.' },
  { id: 'b50', title: 'Man\'s Search for Meaning', author: 'Viktor Frankl', price: 12.99, isbn: '0807014290', description: 'A Holocaust survivor and psychiatrist reflects on his experiences and develops a philosophy of meaning and purpose. Frankl\'s profoundly moving book offers insights on resilience and finding purpose amid suffering.' }
]

const MOCK_ACCOUNTS = [
  {
    username: 'alice',
    password: 'password123',
    displayName: 'Alice',
    initialBooks: [
      {
        instanceId: 'i_demo_1', id: 'b1', title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518',
        type: 'borrowed', received: false, borrowDate: new Date().toISOString(), dueDate: addDays(new Date(), 7).toISOString()
      },
      {
        instanceId: 'i_demo_2', id: 'b16', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565',
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
        instanceId: 'i_demo_3', id: 'b15', title: '1984', author: 'George Orwell', isbn: '9780451524935',
        type: 'owned', received: false, purchasedAt: new Date().toISOString()
      }
    ]
  }
]

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
    if(username.toLowerCase() === 'guest'){ setUser('guest'); return true }
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
