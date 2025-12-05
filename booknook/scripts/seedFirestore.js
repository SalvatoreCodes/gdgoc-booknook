/**
 * Seed the Firestore `books` collection from the local MOCK_BOOKS.
 *
 * Usage:
 *  - Create a service account JSON in your machine and set GOOGLE_APPLICATION_CREDENTIALS to its path
 *  - Run: `npm run seed:books`
 */
const admin = require('firebase-admin')
const path = require('path')

try{
  admin.initializeApp({})
}catch(e){
  // already initialized
}

const db = admin.firestore()

async function main(){
  // load the embedded catalog (support ES default export)
  const modPath = path.resolve(__dirname, '../src/data/mockBooks.js')
  const mockModule = await import('file://' + modPath)
  const MOCK_BOOKS = mockModule.MOCK_BOOKS || mockModule.default || mockModule
  console.log('Seeding', MOCK_BOOKS.length, 'books...')
  for(const b of MOCK_BOOKS){
    const id = b.id || b.title.replace(/[^a-z0-9]/ig,'_').toLowerCase()
    const ref = db.collection('books').doc(id)
    await ref.set({ title: b.title, author: b.author, price: b.price || 0, isbn: b.isbn || '', description: b.description || '' })
    console.log('Wrote', id)
  }
  console.log('Done')
}

main().catch(err=>{ console.error(err); process.exit(1) })
