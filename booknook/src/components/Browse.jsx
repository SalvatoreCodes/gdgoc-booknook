import React from 'react'
import BookCard from './BookCard'

export default function Browse({books, onBorrow, onBuy}){
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Browse books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(b => <BookCard key={b.id} book={b} onBorrow={onBorrow} onBuy={onBuy} />)}
      </div>
    </div>
  )
}
