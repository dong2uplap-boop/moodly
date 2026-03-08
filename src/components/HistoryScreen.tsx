import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react'
import { getAllEntries } from '../services/db'
import type { MoodEntry, Screen } from '../types'

interface HistoryScreenProps {
  onNavigate: (screen: Screen) => void
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const [entries, setEntries] = useState<MoodEntry[]>([])

  useEffect(() => {
    getAllEntries().then(setEntries)
  }, [])

  return (
    <motion.div
      key="history"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 rounded-full glass hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-serif font-bold tracking-tight">Echoes</h2>
      </div>

      {entries.length === 0 ? (
        <div className="py-32 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
            <AlertCircle size={32} className="text-white/20" />
          </div>
          <p className="text-white/30 font-light tracking-wide">침묵만이 우주를 채우고 있습니다.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map(entry => (
            <div key={entry.id} className="p-6 rounded-[28px] glass-card space-y-4 hover:bg-white/10 transition-all">
              <div className="flex justify-between items-start gap-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                  <Calendar size={12} />
                  {new Date(entry.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {entry.needsType && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    entry.needsType === 'fulfilled'
                      ? 'bg-pink-500/20 text-pink-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {entry.needsType === 'fulfilled' ? '채워진' : '채우고 싶은'}
                  </span>
                )}
              </div>
              <p className="text-white/80 leading-relaxed text-base font-light italic line-clamp-2">"{entry.content}"</p>
              {entry.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.emotions.map((e, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                      e.type === 'positive'
                        ? 'bg-pink-500/20 text-pink-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {e.name}
                    </span>
                  ))}
                </div>
              )}
              {entry.needs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {entry.needs.map((need, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] text-white/50">
                      {need}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
