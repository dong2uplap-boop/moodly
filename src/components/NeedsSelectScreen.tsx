import React, { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { NVC_NEEDS } from '../data/nvcData'
import type { Emotion, Screen } from '../types'

interface NeedsSelectScreenProps {
  selectedEmotions: Emotion[]
  selectedNeeds: string[]
  onToggleNeed: (need: string) => void
  onSave: (needsType: 'fulfilled' | 'unfulfilled') => void
  onNavigate: (screen: Screen) => void
}

export function NeedsSelectScreen({
  selectedEmotions,
  selectedNeeds,
  onToggleNeed,
  onSave,
  onNavigate
}: NeedsSelectScreenProps) {
  const hasPositive = selectedEmotions.some(e => e.type === 'positive')
  const hasNegative = selectedEmotions.some(e => e.type === 'negative')
  const isMixed = hasPositive && hasNegative

  // 탭: 혼합 감정일 때만 탭 선택 가능
  const [activeTab, setActiveTab] = useState<'fulfilled' | 'unfulfilled'>(
    hasNegative ? 'unfulfilled' : 'fulfilled'
  )

  const isFulfilled = activeTab === 'fulfilled'

  const positiveEmotions = selectedEmotions.filter(e => e.type === 'positive')
  const negativeEmotions = selectedEmotions.filter(e => e.type === 'negative')

  return (
    <motion.div
      key="needs-select"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-5"
    >
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('emotion-select')}
          className="p-2 rounded-full glass hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-serif font-bold">욕구 선택</h2>
      </div>

      {/* 선택된 감정 요약 */}
      <div className="glass rounded-2xl p-4 space-y-3">
        {positiveEmotions.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-pink-400/70 uppercase tracking-widest mb-1.5">✨ 포지티브</p>
            <div className="flex flex-wrap gap-1.5">
              {positiveEmotions.map(e => (
                <span key={e.name} className="px-2.5 py-1 rounded-full text-xs bg-pink-500/20 text-pink-300 border border-pink-500/20">
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {negativeEmotions.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest mb-1.5">💧 네거티브</p>
            <div className="flex flex-wrap gap-1.5">
              {negativeEmotions.map(e => (
                <span key={e.name} className="px-2.5 py-1 rounded-full text-xs bg-blue-500/20 text-blue-300 border border-blue-500/20">
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 설명 */}
      <p className="text-xs text-white/30 px-1 leading-relaxed">
        모든 감정은 시그널이에요. 포지티브 감정이 나의 채워진 욕구를 알려주고, 네거티브 감정이 내가 더 채우고 싶은 욕구를 알려줘요.
      </p>

      {/* 탭 (혼합 감정일 때만 표시) */}
      {isMixed ? (
        <div className="flex gap-2 p-1 glass rounded-2xl">
          <button
            onClick={() => setActiveTab('fulfilled')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'fulfilled'
                ? 'bg-pink-500/30 text-pink-200'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            ✨ 채워진 욕구
          </button>
          <button
            onClick={() => setActiveTab('unfulfilled')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'unfulfilled'
                ? 'bg-blue-500/30 text-blue-200'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            💧 채우고 싶은 욕구
          </button>
        </div>
      ) : (
        <div className={`rounded-2xl px-4 py-3 flex items-center justify-between ${
          isFulfilled ? 'bg-pink-500/10 border border-pink-500/20' : 'bg-blue-500/10 border border-blue-500/20'
        }`}>
          <p className={`text-sm font-bold ${isFulfilled ? 'text-pink-300' : 'text-blue-300'}`}>
            {isFulfilled ? '✨ 채워진 욕구' : '💧 채우고 싶은 욕구'}
          </p>
          <p className="text-[10px] font-mono text-white/40">{selectedNeeds.length}/3</p>
        </div>
      )}

      {/* 욕구 목록 */}
      <div className="space-y-5 pb-4">
        {NVC_NEEDS.map(cat => (
          <div key={cat.category}>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] mb-2 px-1">{cat.category}</p>
            <div className="flex flex-wrap gap-2">
              {cat.needs.map(need => (
                <button
                  key={need}
                  onClick={() => onToggleNeed(need)}
                  disabled={!selectedNeeds.includes(need) && selectedNeeds.length >= 3}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    selectedNeeds.includes(need)
                      ? isFulfilled
                        ? 'bg-pink-500/40 border-pink-400/60 text-white shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                        : 'bg-blue-500/40 border-blue-400/60 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30'
                  }`}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        onClick={() => onSave(activeTab)}
        disabled={selectedNeeds.length === 0}
        className="w-full py-5 rounded-3xl btn-dreamy hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20"
      >
        저장하기
      </motion.button>
    </motion.div>
  )
}
