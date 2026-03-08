import Dexie, { type Table } from 'dexie'
import type { MoodEntry, Alarm } from '../types'

class MoodlyDatabase extends Dexie {
  moodEntries!: Table<MoodEntry>
  alarms!: Table<Alarm>

  constructor() {
    super('MoodlyDB')
    this.version(1).stores({
      moodEntries: 'id, created_at',
      alarms: 'id, time'
    })
  }
}

const db = new MoodlyDatabase()

export async function getAllEntries(): Promise<MoodEntry[]> {
  return db.moodEntries.orderBy('created_at').reverse().toArray()
}

export async function addEntry(entry: MoodEntry): Promise<void> {
  await db.moodEntries.add(entry)
}

export async function deleteEntry(id: string): Promise<void> {
  await db.moodEntries.delete(id)
}

export async function getAllAlarms(): Promise<Alarm[]> {
  return db.alarms.toArray()
}

export async function addAlarm(alarm: Alarm): Promise<void> {
  await db.alarms.add(alarm)
}

export async function updateAlarm(alarm: Alarm): Promise<void> {
  await db.alarms.put(alarm)
}

export async function deleteAlarm(id: string): Promise<void> {
  await db.alarms.delete(id)
}
