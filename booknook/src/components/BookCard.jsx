import React from 'react'
import { Clock, ShoppingCart, BookOpen } from 'lucide-react'
import { fmtPrice } from '../utils'

export default function BookCard({book, onBorrow, onBuy, onReadMore}){
  const coverUrl = book.isbn 
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : `https://covers.openlibrary.org/b/id/${book.id}-M.jpg`
  
  const shortDesc = book.description.substring(0, 100) + '...'
  
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="w-full h-60 bg-gradient-to-br from-gray-200 to-gray-300 cover-placeholder">
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover"
            onError={(e) => {e.target.src = `https://via.placeholder.com/300x420/cccccc/999999?text=${encodeURIComponent(book.title.substring(0, 20))}`}}
          />
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{book.title}</h3>
          <p className="text-xs text-gray-500 mt-1">{book.author}</p>
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{shortDesc}</p>
        </div>
        <div className="mt-3 flex items-center justify-between mb-2">
          <div className="text-lg font-medium text-gray-800">{fmtPrice(book.price)}</div>
        </div>
        <button onClick={()=>onReadMore(book)} className="w-full px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-100 mb-2">
          <BookOpen className="w-3.5 h-3.5"/> Read More
        </button>
        <div className="flex gap-2">
          <button onClick={()=>onBorrow(book)} className="flex-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-600"/> Borrow
          </button>
          <button onClick={()=>onBuy(book)} className="flex-1 px-3 py-1.5 rounded-lg bg-gblue text-white text-xs flex items-center justify-center gap-1">
            <ShoppingCart className="w-3.5 h-3.5"/> Buy
          </button>
        </div>
      </div>
    </div>
  )
}
