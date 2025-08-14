export type RangeKey = 'today' | '7d' | '30d'

export function computeRange(key: RangeKey) {
  const now = new Date()
  const to = now.toISOString()
  const start = new Date()
  if (key === 'today') {
    start.setHours(0, 0, 0, 0)
  } else if (key === '7d') {
    start.setDate(start.getDate() - 7)
  } else {
    start.setDate(start.getDate() - 30)
  }
  const from = start.toISOString()
  return { from, to }
}

export function pickInterval(key: RangeKey): '5m' | '1h' | '1d' {
  if (key === 'today') return '1h'
  if (key === '7d') return '1d'
  return '1d'
}


