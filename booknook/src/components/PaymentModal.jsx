import React, { useState } from 'react'
import { fmtPrice } from '../utils'

export default function PaymentModal({book, onCancel, onConfirm}){
  const [card, setCard] = useState({name:'', number:'', exp:'', cvc:''})
  const [processing, setProcessing] = useState(false)
  function doPay(){
    setProcessing(true)
    setTimeout(()=>{ setProcessing(false); onConfirm() }, 1400 + Math.random()*1000)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">Debit Payment</div>
            <div className="text-sm text-gray-500">Pay {fmtPrice(book.price)} for <span className="font-medium">{book.title}</span></div>
          </div>
          <button onClick={onCancel} className="text-gray-400">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <input placeholder="Name on card" value={card.name} onChange={e=>setCard({...card,name:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200"/>
          <input placeholder="Card number" value={card.number} onChange={e=>setCard({...card,number:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-gray-200"/>
          <div className="flex gap-2">
            <input placeholder="MM/YY" value={card.exp} onChange={e=>setCard({...card,exp:e.target.value})} className="flex-1 px-3 py-2 rounded-lg border border-gray-200"/>
            <input placeholder="CVC" value={card.cvc} onChange={e=>setCard({...card,cvc:e.target.value})} className="w-24 px-3 py-2 rounded-lg border border-gray-200"/>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200">Cancel</button>
          <button onClick={doPay} disabled={processing} className="px-4 py-2 rounded-lg bg-gblue text-white flex items-center gap-2">{processing ? 'Processing...' : 'Pay & Buy'}</button>
        </div>
      </div>
    </div>
  )
}
