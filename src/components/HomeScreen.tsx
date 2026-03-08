import React from 'react'
import { motion } from 'motion/react'
import { Plus, History, Bell, ChevronRight } from 'lucide-react'
import type { MoodEntry, Alarm, Screen } from '../types'

interface HomeScreenProps {
  entries: MoodEntry[]
  alarms: Alarm[]
  onNavigate: (screen: Screen) => void
}

export function HomeScreen({ entries, alarms, onNavigate }: HomeScreenProps) {
  const todayEntries = entries.filter(e => {
    const today = new Date().toDateString()
    return new Date(e.created_at).toDateString() === today
  })

  const recentEntry = entries[0]
  const enabledAlarms = alarms.filter(a => a.enabled)

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-serif font-bold tracking-tighter text-glow">Moodly</h1>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-[0.2em] font-medium">Atmospheric Journal</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('history')}
            className="p-3 rounded-full glass hover:bg-white/20 transition-all"
          >
            <History size={20} />
          </button>
          <button
            onClick={() => onNavigate('alarm-settings')}
            className={`p-3 rounded-full glass transition-all ${enabledAlarms.length > 0 ? 'text-pink-400 border-pink-400/50' : 'text-white'}`}
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Today Stats */}
      <div className="glass rounded-2xl p-5">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mb-3">오늘의 기록</p>
        <p className="text-3xl font-bold">{todayEntries.length}<span className="text-sm font-normal text-white/50 ml-1">개</span></p>
        {todayEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {todayEntries.slice(0, 1).flatMap(e => e.emotions).slice(0, 5).map((em, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  em.type === 'positive' ? 'bg-pink-500/20 text-pink-300' : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {em.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onNavigate('write')}
        className="w-full py-6 rounded-3xl btn-dreamy text-lg flex items-center justify-center gap-3 transition-all"
      >
        <Plus size={24} />
        있잖아 오늘 말야..
      </motion.button>

      {/* Recent Entry */}
      {recentEntry && (
        <div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3 px-1">최근 기록</p>
          <div
            onClick={() => onNavigate('history')}
            className="p-5 rounded-3xl glass-card flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 line-clamp-2 font-light italic">"{recentEntry.content}"</p>
              <div className="flex gap-2 mt-2">
                {recentEntry.emotions.slice(0, 3).map((e, i) => (
                  <span key={i} className={`text-[9px] font-bold uppercase tracking-widest ${e.type === 'positive' ? 'text-pink-400' : 'text-blue-400'}`}>
                    #{e.name}
                  </span>
                ))}
              </div>
            </div>
            <ChevronRight size={16} className="text-white/20 group-hover:text-white transition-colors flex-shrink-0 ml-3" />
          </div>
        </div>
      )}

      {/* Alarm Preview */}
      {enabledAlarms.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3 px-1">활성 알람</p>
          <div className="space-y-2">
            {enabledAlarms.slice(0, 2).map(alarm => (
              <div key={alarm.id} className="p-4 rounded-2xl glass flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">{alarm.time}</p>
                  <p className="text-[10px] text-white/40">{alarm.label || '감정 체크'}</p>
                </div>
                <div className="flex gap-1">
                  {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                    <span key={i} className={`text-[9px] font-bold ${alarm.days.includes(i) ? 'text-pink-400' : 'text-white/20'}`}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
