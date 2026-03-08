import type { Emotion } from '../types'

export async function analyzeMood(content: string): Promise<Emotion[]> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  })
  if (!res.ok) throw new Error('Analysis failed')
  const data = await res.json()
  return data.emotions as Emotion[]
}
