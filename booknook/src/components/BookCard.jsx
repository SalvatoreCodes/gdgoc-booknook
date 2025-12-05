import React from 'react'
import { Clock, ShoppingCart } from 'lucide-react'
import { fmtPrice } from '../utils'

export default function BookCard({book, onBorrow, onBuy}){
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
