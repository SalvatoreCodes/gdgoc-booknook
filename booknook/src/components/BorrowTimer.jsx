import React, { useEffect, useState } from 'react'
import { addDays } from '../utils'

export default function BorrowTimer({borrowDate, dueDate}){
  const [, setTick] = useState(0)
  useEffect(()=>{
    const id = setInterval(()=> setTick(t => t+1), 1000)
    return ()=> clearInterval(id)
  },[])

  const now = new Date()
  const due = new Date(dueDate || addDays(borrowDate, 14))
  const diff = due - now
  if(diff <= 0) {
    const overdueDays = Math.floor((now - (new Date(borrowDate))) / (1000*60*60*24))
    return <div className="text-sm text-red-600">Overdue {overdueDays}d</div>
  }
  const days = Math.floor(diff / (1000*60*60*24))
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60))
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60))
  return <div className="text-sm text-gray-500">Due in {days}d {hours}h {mins}m</div>
}
