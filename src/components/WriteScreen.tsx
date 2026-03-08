import React from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import type { Screen } from '../types'

interface WriteScreenProps {
  content: string
  onContentChange: (content: string) => void
  onAnalyze: () => void
  onNavigate: (screen: Screen) => void
}

export function WriteScreen({ content, onContentChange, onAnalyze, onNavigate }: WriteScreenProps) {
  return (
    <motion.div
      key="write"
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
        <h2 className="text-2xl font-serif font-bold">이런일이 있었어</h2>
      </div>

      <div className="relative group">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="이런일이 있었어"
          className="w-full h-72 p-8 rounded-[32px] glass-card focus:outline-none focus:ring-1 focus:ring-white/20 resize-none text-xl leading-relaxed placeholder:text-white/20 transition-all"
          autoFocus
        />
      </div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: content.trim() ? 1 : 0, y: content.trim() ? 0 : 10 }}
        onClick={onAnalyze}
        disabled={!content.trim()}
        className="w-full py-5 rounded-3xl btn-dreamy hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 flex items-center justify-center gap-2"
      >
        <Sparkles size={20} />
        내 마음은
      </motion.button>
    </motion.div>
  )
}
