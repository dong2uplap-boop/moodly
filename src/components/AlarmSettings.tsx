import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Plus, Trash2, Bell } from 'lucide-react'
import { getAllAlarms, addAlarm, updateAlarm, deleteAlarm } from '../services/db'
import type { Alarm, Screen } from '../types'

interface AlarmSettingsProps {
  onNavigate: (screen: Screen) => void
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export function AlarmSettings({ onNavigate }: AlarmSettingsProps) {
  const [alarms, setAlarms] = useState<Alarm[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newTime, setNewTime] = useState('09:00')
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5])
  const [newLabel, setNewLabel] = useState('')

  useEffect(() => {
    getAllAlarms().then(setAlarms)
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const syncAlarms = (updatedAlarms: Alarm[]) => {
    navigator.serviceWorker?.controller?.postMessage({
      type: 'UPDATE_ALARMS',
      alarms: updatedAlarms
    })
  }

  const handleAdd = async () => {
    const alarm: Alarm = {
      id: crypto.randomUUID(),
      time: newTime,
      days: newDays,
      enabled: true,
      label: newLabel || '감정 체크'
    }
    await addAlarm(alarm)
    const updated = await getAllAlarms()
    setAlarms(updated)
    syncAlarms(updated)
    setShowForm(false)
    setNewLabel('')
    setNewDays([1, 2, 3, 4, 5])
    setNewTime('09:00')
  }

  const handleToggle = async (alarm: Alarm) => {
    const updated = { ...alarm, enabled: !alarm.enabled }
    await updateAlarm(updated)
    const list = await getAllAlarms()
    setAlarms(list)
    syncAlarms(list)
  }

  const handleDelete = async (id: string) => {
    await deleteAlarm(id)
    const list = await getAllAlarms()
    setAlarms(list)
    syncAlarms(list)
  }

  const toggleDay = (day: number) => {
    setNewDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  return (
    <motion.div
      key="alarm-settings"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-full glass hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-serif font-bold">알람 설정</h2>
      </div>

      <button
        onClick={() => setShowForm(!showForm)}
        className="w-full py-4 rounded-2xl glass border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-bold"
      >
        <Plus size={16} />
        새 알람 추가
      </button>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass rounded-2xl p-5 space-y-4"
        >
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">시간</p>
            <input
              type="time"
              value={newTime}
              onChange={e => setNewTime(e.target.value)}
              className="bg-white/10 rounded-xl px-4 py-3 text-lg font-bold focus:outline-none focus:ring-1 focus:ring-white/30 w-full"
            />
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">요일</p>
            <div className="flex gap-2">
              {DAYS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => toggleDay(i)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    newDays.includes(i)
                      ? 'bg-pink-500/40 text-pink-200 border border-pink-500/40'
                      : 'bg-white/5 text-white/30 border border-white/10'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">레이블</p>
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="감정 체크"
              className="bg-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 w-full placeholder:text-white/20"
            />
          </div>
          <button
            onClick={handleAdd}
            className="w-full py-4 rounded-xl btn-dreamy transition-all hover:scale-[1.02]"
          >
            저장
          </button>
        </motion.div>
      )}

      <div className="space-y-3">
        {alarms.length === 0 && !showForm && (
          <div className="py-16 text-center">
            <Bell size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">설정된 알람이 없습니다</p>
          </div>
        )}
        {alarms.map(alarm => (
          <div key={alarm.id} className="p-4 rounded-2xl glass flex items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <p className={`text-xl font-bold ${alarm.enabled ? 'text-white' : 'text-white/30'}`}>
                  {alarm.time}
                </p>
                <p className={`text-xs ${alarm.enabled ? 'text-white/60' : 'text-white/20'}`}>
                  {alarm.label}
                </p>
              </div>
              <div className="flex gap-1.5 mt-1">
                {DAYS.map((d, i) => (
                  <span key={i} className={`text-[9px] font-bold ${
                    alarm.days.includes(i)
                      ? alarm.enabled ? 'text-pink-400' : 'text-white/20'
                      : 'text-white/10'
                  }`}>{d}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggle(alarm)}
                className={`w-12 h-6 rounded-full transition-all relative ${alarm.enabled ? 'bg-pink-500' : 'bg-white/10'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${alarm.enabled ? 'left-6' : 'left-0.5'}`} />
              </button>
              <button
                onClick={() => handleDelete(alarm.id)}
                className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
