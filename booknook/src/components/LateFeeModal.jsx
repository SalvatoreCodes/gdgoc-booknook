import React, { useState, useMemo } from 'react'
import { fmtPrice } from '../utils'

function luhnCheck(num){
  const digits = num.split('').reverse().map(d=>parseInt(d,10))
  let sum = 0
  for(let i=0;i<digits.length;i++){
    let d = digits[i]
    if(i % 2 === 1){ d = d*2; if(d>9) d -= 9 }
    sum += d
  }
  return sum % 10 === 0
}

function validExpiry(mmYY){
  if(!/^(0[1-9]|1[0-2])\/(\d{2})$/.test(mmYY)) return false
  const [mm, yy] = mmYY.split('/')
  const month = parseInt(mm,10)
  const year = 2000 + parseInt(yy,10)
  const now = new Date()
  const exp = new Date(year, month, 1)
  return exp > now
}

export default function LateFeeModal({item, fee, onCancel, onConfirm}){
  const [card, setCard] = useState({name:'', number:'', exp:'', cvc:''})
  const [processing, setProcessing] = useState(false)

  const sanitizedNumber = useMemo(()=> (card.number||'').replace(/\D/g,''), [card.number])
  const isNumberValid = sanitizedNumber.length >= 13 && sanitizedNumber.length <= 19 && luhnCheck(sanitizedNumber)
  const isNameValid = !!(card.name && card.name.trim().length > 1)
  const isExpValid = validExpiry(card.exp)
  const isCvcValid = /^[0-9]{3,4}$/.test(card.cvc)
  const formValid = isNumberValid && isNameValid && isExpValid && isCvcValid

  function doPay(){
    if(!formValid) return
    setProcessing(true)
    setTimeout(()=>{ setProcessing(false); onConfirm() }, 1400 + Math.random()*1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-lg font-semibold">Late Return Fee Payment</div>
            <div className="text-sm text-gray-500">Return <span className="font-medium">{item.title}</span> — fee {fmtPrice(fee)}</div>
          </div>
          <button onClick={onCancel} className="text-gray-400">✕</button>
        </div>
        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs text-gray-600">Name on card</label>
            <input maxLength={50} placeholder="Name on card" value={card.name} onChange={e=>setCard({...card,name:e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200"/>
            {!isNameValid && card.name !== '' && <div className="text-xs text-red-500 mt-1">Please enter the cardholder's full name</div>}
          </div>

          <div>
            <label className="text-xs text-gray-600">Card number</label>
            <input
              inputMode="numeric"
              maxLength={23}
              placeholder="1234 5678 9012 3456"
              value={card.number}
              onChange={e=>{
                const digits = (e.target.value||'').replace(/\D/g,'').slice(0,19)
                const parts = digits.match(/.{1,4}/g)
                const formatted = parts ? parts.join(' ') : digits
                setCard(prev=>({...prev, number: formatted}))
              }}
              className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200"
            />
            {!isNumberValid && card.number !== '' && <div className="text-xs text-red-500 mt-1">Enter a valid card number</div>}
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-600">Expiry (MM/YY)</label>
              <input
                inputMode="numeric"
                maxLength={5}
                placeholder="MM/YY"
                value={card.exp}
                onChange={e=>{
                  let v = (e.target.value||'').replace(/\D/g,'').slice(0,4)
                  if(v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2)
                  setCard(prev=>({...prev, exp: v}))
                }}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200"
              />
              {!isExpValid && card.exp !== '' && <div className="text-xs text-red-500 mt-1">Enter a valid future date</div>}
            </div>
            <div className="w-24">
              <label className="text-xs text-gray-600">CVC</label>
              <input
                inputMode="numeric"
                maxLength={4}
                placeholder="CVC"
                value={card.cvc}
                onChange={e=>setCard(prev=>({...prev, cvc: (e.target.value||'').replace(/\D/g,'').slice(0,4)}))}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-gray-200"
              />
              {!isCvcValid && card.cvc !== '' && <div className="text-xs text-red-500 mt-1">3-4 digits</div>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200">Cancel</button>
          <button onClick={doPay} disabled={processing || !formValid} className="px-4 py-2 rounded-lg bg-gblue text-white disabled:opacity-50">{processing ? 'Processing...' : `Pay ${fmtPrice(fee)}`}</button>
        </div>
      </div>
    </div>
  )
}
