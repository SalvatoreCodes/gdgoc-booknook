import React, { useState } from 'react'
import { fmtPrice } from '../utils'

export default function LateFeeModal({item, fee, onCancel, onConfirm}){
  const [processing, setProcessing] = useState(false)
  function doPay(){
    setProcessing(true)
    setTimeout(()=>{ setProcessing(false); onConfirm() }, 1200 + Math.random()*1000)
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">Late Return Fee</div>
            <div className="text-sm text-gray-500">Return <span className="font-medium">{item.title}</span> — fee {fmtPrice(fee)}</div>
          </div>
          <button onClick={onCancel} className="text-gray-400">✕</button>
        </div>
        <div className="mt-4 text-sm text-gray-600">This book is past the 3-day free return window. Pay the fee to complete the return.</div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200">Cancel</button>
          <button onClick={doPay} disabled={processing} className="px-4 py-2 rounded-lg bg-gblue text-white">{processing ? 'Processing...' : `Pay ${fmtPrice(fee)}`}</button>
        </div>
      </div>
    </div>
  )
}
