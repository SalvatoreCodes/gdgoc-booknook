import React, { useState } from 'react'
import BookCard from './BookCard'

export default function Browse({books, onBorrow, onBuy, onReadMore}){
  const [searchQuery, setSearchQuery] = useState('')

  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase()
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
    )
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Browse books</h2>
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books found matching "{searchQuery}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map(b => <BookCard key={b.id} book={b} onBorrow={onBorrow} onBuy={onBuy} onReadMore={onReadMore} />)}
        </div>
      )}
    </div>
  )
}
