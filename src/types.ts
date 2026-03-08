export interface Emotion {
  name: string
  type: 'positive' | 'negative'
}

export interface MoodEntry {
  id: string
  content: string
  emotions: Emotion[]
  needs: string[]
  needsType: 'fulfilled' | 'unfulfilled' | null
  created_at: string
}

export interface Alarm {
  id: string
  time: string
  days: number[]
  enabled: boolean
  label: string
}

export type Screen =
  | 'home'
  | 'write'
  | 'loading'
  | 'emotion-select'
  | 'needs-select'
  | 'complete'
  | 'history'
  | 'alarm-settings'
