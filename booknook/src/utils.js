export const fmtPrice = p => `$${p.toFixed(2)}`

export function addDays(date, days){
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function shortDate(d){ return new Date(d).toLocaleDateString() }
