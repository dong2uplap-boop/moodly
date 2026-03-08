import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'motion/react'
import { analyzeMood } from './services/claudeService'
import { addEntry, getAllEntries, getAllAlarms } from './services/db'
import { HomeScreen } from './components/HomeScreen'
import { WriteScreen } from './components/WriteScreen'
import { EmotionSelectScreen } from './components/EmotionSelectScreen'
import { NeedsSelectScreen } from './components/NeedsSelectScreen'
import { HistoryScreen } from './components/HistoryScreen'
import { AlarmSettings } from './components/AlarmSettings'
import type { Screen, Emotion, MoodEntry, Alarm } from './types'
import { motion } from 'motion/react'
import { Check } from 'lucide-react'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [currentContent, setCurrentContent] = useState('')
  const [suggestedEmotions, setSuggestedEmotions] = useState<Emotion[]>([])
  const [selectedEmotions, setSelectedEmotions] = useState<Emotion[]>([])
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [alarms, setAlarms] = useState<Alarm[]>([])

  useEffect(() => {
    getAllEntries().then(setEntries)
    getAllAlarms().then(setAlarms)
  }, [])

  const handleAnalyze = async () => {
    if (!currentContent.trim()) return
    setScreen('loading')
    try {
      const emotions = await analyzeMood(currentContent)
      setSuggestedEmotions(emotions)
      setSelectedEmotions([])
      setScreen('emotion-select')
    } catch (err) {
      console.error('Analysis failed', err)
      setScreen('write')
    }
  }

  const toggleEmotion = (emotion: Emotion) => {
    if (selectedEmotions.some(e => e.name === emotion.name)) {
      setSelectedEmotions(prev => prev.filter(e => e.name !== emotion.name))
    } else if (selectedEmotions.length < 3) {
      setSelectedEmotions(prev => [...prev, emotion])
    }
  }

  const toggleNeed = (need: string) => {
    if (selectedNeeds.includes(need)) {
      setSelectedNeeds(prev => prev.filter(n => n !== need))
    } else if (selectedNeeds.length < 3) {
      setSelectedNeeds(prev => [...prev, need])
    }
  }

  const handleSave = async (needsType: 'fulfilled' | 'unfulfilled') => {
    const entry: MoodEntry = {
      id: crypto.randomUUID(),
      content: currentContent,
      emotions: selectedEmotions,
      needs: selectedNeeds,
      needsType: selectedNeeds.length > 0 ? needsType : null,
      created_at: new Date().toISOString()
    }
    await addEntry(entry)
    const updated = await getAllEntries()
    setEntries(updated)
    setCurrentContent('')
    setSuggestedEmotions([])
    setSelectedEmotions([])
    setSelectedNeeds([])
    setScreen('complete')
  }

  const navigate = (s: Screen) => setScreen(s)

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col relative text-white">
      {/* Background */}
      <div className="atmosphere">
        {/* 로즈 구름 */}
        <div className="cloud cloud-drift-1 w-[500px] h-[500px] -top-32 -left-24"
          style={{ background: 'radial-gradient(circle, #d4607880, #e8b4c840)' }} />
        <div className="cloud cloud-drift-3 w-[320px] h-[320px] top-1/3 -left-16"
          style={{ background: 'radial-gradient(circle, #e8b4c860, transparent)' }} />
        {/* 세레니티 구름 */}
        <div className="cloud cloud-drift-2 w-[480px] h-[480px] -top-20 -right-28"
          style={{ background: 'radial-gradient(circle, #4a80b870, #a8c4e045)' }} />
        <div className="cloud cloud-drift-4 w-[360px] h-[360px] top-2/3 -right-20"
          style={{ background: 'radial-gradient(circle, #a8c4e055, transparent)' }} />
        {/* 라벤더 중간 구름 */}
        <div className="cloud cloud-drift-5 w-[280px] h-[280px] top-1/2 left-1/3"
          style={{ background: 'radial-gradient(circle, #c8b8e840, transparent)' }} />
        {/* 미스트 오버레이 */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(232,180,200,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Content */}
      <main className="flex-1 px-6 pt-12 pb-24 overflow-y-auto z-10">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <HomeScreen
              key="home"
              entries={entries}
              alarms={alarms}
              onNavigate={navigate}
            />
          )}
          {screen === 'write' && (
            <WriteScreen
              key="write"
              content={currentContent}
              onContentChange={setCurrentContent}
              onNavigate={navigate}
            />
          )}
          {screen === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-6"
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold">감정을 분석하는 중...</p>
                <p className="text-sm text-white/40">NVC 기반으로 마음을 읽고 있어요</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white/40"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          )}
          {screen === 'emotion-select' && (
            <EmotionSelectScreen
              key="emotion-select"
              suggestedEmotions={suggestedEmotions}
              selectedEmotions={selectedEmotions}
              onToggleEmotion={toggleEmotion}
              onNext={() => navigate('needs-select')}
              onNavigate={navigate}
            />
          )}
          {screen === 'needs-select' && (
            <NeedsSelectScreen
              key="needs-select"
              selectedEmotions={selectedEmotions}
              selectedNeeds={selectedNeeds}
              onToggleNeed={toggleNeed}
              onSave={handleSave}
              onNavigate={navigate}
            />
          )}
          {screen === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)]"
              >
                <Check size={48} className="text-black" />
              </motion.div>
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold">기록 완료</h2>
                <p className="text-white/50">오늘의 감정이 우주에 새겨졌어요</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {selectedEmotions.map((e, i) => (
                  <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    e.type === 'positive' ? 'bg-pink-500/30 text-pink-300' : 'bg-blue-500/30 text-blue-300'
                  }`}>
                    {e.name}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => navigate('home')}
                  className="flex-1 py-4 rounded-2xl glass font-semibold hover:bg-white/20 transition-all"
                >
                  홈으로
                </button>
                <button
                  onClick={() => navigate('history')}
                  className="flex-1 py-4 rounded-2xl btn-dreamy hover:scale-[1.02] transition-all"
                >
                  기록 보기
                </button>
              </div>
            </motion.div>
          )}
          {screen === 'history' && (
            <HistoryScreen key="history" onNavigate={navigate} />
          )}
          {screen === 'alarm-settings' && (
            <AlarmSettings key="alarm-settings" onNavigate={navigate} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
