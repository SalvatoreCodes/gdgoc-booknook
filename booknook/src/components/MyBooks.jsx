import React from 'react'
import { Check, Package } from 'lucide-react'
import BorrowTimer from './BorrowTimer'

export default function MyBooks({items, onToggleReceived, onReturn, onDelete}){
  if(items.length === 0) return (
    <div className="p-6 text-gray-500">You don't have any books yet. Borrow or buy from Browse.</div>
  )
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">My Books</h2>
      <div className="space-y-3">
        {items.map(it => (
          <div key={it.instanceId} className="flex items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <img 
                src={it.isbn ? `https://covers.openlibrary.org/b/isbn/${it.isbn}-S.jpg` : `https://via.placeholder.com/80x110/cccccc/999999?text=${encodeURIComponent(it.title.substring(0,12))}`}
                alt={it.title} 
                className="w-16 h-20 object-cover rounded-md" 
                onError={(e)=>{e.target.src = `https://via.placeholder.com/80x110/cccccc/999999?text=${encodeURIComponent(it.title.substring(0,12))}`}} 
              />
              <div>
                <div className="font-medium text-gray-800">{it.title}</div>
                <div className="text-sm text-gray-500">{it.author} • {it.type === 'borrowed' ? 'Borrowed' : 'Owned'}</div>
                {it.type === 'borrowed' && <div className="text-xs text-gray-400 mt-1">Due {new Date(it.dueDate).toLocaleDateString()}</div>}
                {it.type === 'owned' && <div className="text-xs text-gray-400 mt-1">Owned</div>}
              </div>
            </div>
              <div className="flex items-center gap-4">
              <div className="flex flex-col items-end gap-2">
                {it.type === 'borrowed' ? <BorrowTimer borrowDate={it.borrowDate} dueDate={it.dueDate} /> : <div className="text-sm text-gray-500">{it.type === 'owned' ? 'Owned' : ''}</div>}
                {it.type === 'borrowed' && (
                  <button onClick={() => onReturn(it)} className="text-sm px-3 py-1 rounded-md bg-gray-100">Return</button>
                )}
                {it.type === 'owned' && (
                  <button onClick={() => onDelete?.(it.instanceId)} className="text-sm px-3 py-1 rounded-md bg-red-50 text-red-700 border border-red-100">Delete</button>
                )}
              </div>

              <label className={`inline-flex items-center gap-2 cursor-pointer ${it.received ? 'text-ggreen' : 'text-gray-500'}`}>
                <input type="checkbox" checked={!!it.received} onChange={() => onToggleReceived(it.instanceId)} className="hidden" />
                <span className={`w-9 h-9 flex items-center justify-center rounded-md border ${it.received ? 'bg-ggreen text-white border-transparent' : 'bg-white border-gray-200'}`}>
                  {it.received ? <Check className="w-4 h-4"/> : <Package className="w-4 h-4"/>}
                </span>
                <span className="text-sm">Received</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
