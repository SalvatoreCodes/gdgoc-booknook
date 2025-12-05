import React from 'react'
import { X, ShoppingCart, Clock } from 'lucide-react'
import { fmtPrice } from '../utils'

export default function BookDetailModal({book, onClose, onBorrow, onBuy}){
  if(!book) return null

  const coverUrl = book.isbn 
    ? `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`
    : `https://covers.openlibrary.org/b/id/${book.id}-M.jpg`

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-6 h-6 text-gray-600"/>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <img 
                src={coverUrl} 
                alt={book.title}
                className="w-full rounded-xl shadow-md"
                onError={(e) => {e.target.src = `https://via.placeholder.com/300x420/cccccc/999999?text=${encodeURIComponent(book.title.substring(0, 20))}`}}
              />
            </div>

            <div className="md:col-span-2">
              <div className="mb-4">
                <p className="text-lg text-gray-600 mb-2"><strong>Author:</strong> {book.author}</p>
                <p className="text-2xl font-bold text-gray-900 mb-4">{fmtPrice(book.price)}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{book.description}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => { onBorrow(book); onClose(); }} 
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium flex items-center justify-center gap-2 hover:bg-gray-200"
                >
                  <Clock className="w-5 h-5"/> Borrow
                </button>
                <button 
                  onClick={() => { onBuy(book); onClose(); }} 
                  className="flex-1 px-4 py-3 rounded-lg bg-gblue text-white font-medium flex items-center justify-center gap-2 hover:bg-blue-600"
                >
                  <ShoppingCart className="w-5 h-5"/> Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
