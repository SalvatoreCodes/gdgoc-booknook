import { useState, useEffect } from 'react'

export default function useLocalStorage(key, initial){
  const [state, setState] = useState(()=>{
    try{ const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial }catch(e){ return initial }
  })
  useEffect(()=> localStorage.setItem(key, JSON.stringify(state)), [key, state])
  return [state, setState]
}
