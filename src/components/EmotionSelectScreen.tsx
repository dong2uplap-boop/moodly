import React, { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft } from 'lucide-react'
import { NVC_POSITIVE_EMOTIONS, NVC_NEGATIVE_EMOTIONS } from '../data/nvcData'
import type { Emotion, Screen } from '../types'

interface EmotionSelectScreenProps {
  suggestedEmotions: Emotion[]
  selectedEmotions: Emotion[]
  onToggleEmotion: (emotion: Emotion) => void
  onNext: () => void
  onNavigate: (screen: Screen) => void
}

export function EmotionSelectScreen({
  suggestedEmotions,
  selectedEmotions,
  onToggleEmotion,
  onNext,
  onNavigate
}: EmotionSelectScreenProps) {
  const [tab, setTab] = useState<'positive' | 'negative'>('positive')

  const isSelected = (name: string) => selectedEmotions.some(e => e.name === name)
  const isSuggested = (name: string) => suggestedEmotions.some(e => e.name === name)

  const currentList = tab === 'positive' ? NVC_POSITIVE_EMOTIONS : NVC_NEGATIVE_EMOTIONS
  const currentType = tab

  const handleToggle = (name: string) => {
    onToggleEmotion({ name, type: currentType })
  }

  return (
    <motion.div
      key="emotion-select"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-5"
    >
      {/* 헤더 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('write')}
          className="p-2 rounded-full glass hover:bg-white/20 transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-serif font-bold">마음 선택</h2>
          <p className="text-xs text-white/40 mt-0.5">어떤 마음이였어?</p>
        </div>
        <span className="text-sm font-mono text-white/40">{selectedEmotions.length}/3</span>
      </div>


      {/* 탭 */}
      <div className="flex gap-2 p-1 glass rounded-2xl">
        <button
          onClick={() => setTab('positive')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === 'positive'
              ? 'bg-pink-500/30 text-pink-200'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          ✨ 포지티브
        </button>
        <button
          onClick={() => setTab('negative')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === 'negative'
              ? 'bg-blue-500/30 text-blue-200'
              : 'text-white/40 hover:text-white/70'
          }`}
        >
          💧 네거티브
        </button>
      </div>

      {/* 전체 감정 목록 */}
      <div className="flex flex-wrap gap-2 pb-2">
        {currentList.map(name => (
          <button
            key={name}
            onClick={() => handleToggle(name)}
            disabled={!isSelected(name) && selectedEmotions.length >= 3}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              isSelected(name)
                ? currentType === 'positive'
                  ? 'bg-pink-500/40 border-pink-400/60 text-white shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                  : 'bg-blue-500/40 border-blue-400/60 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 disabled:opacity-30'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <motion.button
        onClick={onNext}
        disabled={selectedEmotions.length === 0}
        className="w-full py-5 rounded-3xl btn-dreamy hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20"
      >
        다음 — 욕구 선택
      </motion.button>
    </motion.div>
  )
}
