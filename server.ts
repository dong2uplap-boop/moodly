import express from 'express'
import { createServer as createViteServer } from 'vite'
import Anthropic from '@anthropic-ai/sdk'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// NVC 감정 목록 (서버에서 Claude 프롬프트에 활용)
const NVC_POSITIVE = [
  '기쁨', '즐거움', '행복', '유쾌함', '흥겨움', '환희', '황홀함',
  '감사', '감동', '감격', '뭉클함', '벅참',
  '평온', '편안함', '안도', '안정감', '여유로움', '고요함',
  '희망', '설렘', '기대감', '활기참', '생동감',
  '자신감', '뿌듯함', '충만함', '자랑스러움', '당당함',
  '따뜻함', '다정함', '포근함', '사랑스러움', '친밀감',
  '경이로움', '영감받음', '상쾌함', '자유로움', '가벼움'
]

const NVC_NEGATIVE = [
  '슬픔', '서러움', '허전함', '그리움', '쓸쓸함', '외로움',
  '불안', '두려움', '초조함', '긴장됨', '걱정됨', '무서움',
  '화남', '짜증남', '억울함', '억압감', '분함', '원망스러움',
  '답답함', '막막함', '혼란스러움', '난감함',
  '무기력함', '지침', '탈진됨', '무감각함', '공허함',
  '실망', '후회', '자책감', '수치스러움', '창피함',
  '불편함', '어색함', '부담스러움', '압도됨', '지루함'
]

async function startServer() {
  const app = express()
  const PORT = process.env.PORT || 3000

  app.use(express.json())

  app.post('/api/analyze', async (req, res) => {
    const { content } = req.body
    if (!content) {
      res.status(400).json({ error: 'content is required' })
      return
    }

    // Mock mode: API 키 없이 테스트 (NVC 감정 목록에서 랜덤 선택)
    if (!process.env.ANTHROPIC_API_KEY) {
      const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
      const pos = shuffle(NVC_POSITIVE).slice(0, 5).map(name => ({ name, type: 'positive' as const }))
      const neg = shuffle(NVC_NEGATIVE).slice(0, 5).map(name => ({ name, type: 'negative' as const }))
      const emotions = shuffle([...pos, ...neg])
      res.json({ emotions })
      return
    }

    try {
      const message = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `당신은 NVC(비폭력대화) 전문가입니다. 아래 일기 텍스트를 읽고, 글쓴이가 느꼈을 법한 NVC 순수 감정 단어 10개를 선택해주세요.

반드시 아래 감정 목록에서만 선택하세요.
긍정 감정 목록: ${NVC_POSITIVE.join(', ')}
부정 감정 목록: ${NVC_NEGATIVE.join(', ')}

규칙:
- 생각/판단/해석이 아닌 순수 감정만 선택
- 텍스트 맥락에 맞는 감정으로 선택
- 긍정과 부정을 적절히 섞어 10개 반환
- 반드시 다음 JSON 형식으로만 응답:
{"emotions": [{"name": "감정명", "type": "positive|negative"}, ...]}

일기: "${content}"`
          }
        ]
      })

      const text = message.content[0].type === 'text' ? message.content[0].text : ''
      const match = text.match(/\{[\s\S]*\}/)
      if (!match) {
        res.status(500).json({ error: 'Failed to parse response' })
        return
      }
      const data = JSON.parse(match[0])
      res.json(data)
    } catch (err) {
      console.error('Claude API error:', err)
      res.status(500).json({ error: 'Analysis failed' })
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(path.join(__dirname, 'dist')))
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    })
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

startServer()
