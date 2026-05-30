// ── API Types ──────────────────────────────────────────────────────────────

export type EmotionType =
  | 'sadness' | 'fear' | 'anxiety' | 'anger'
  | 'confusion' | 'motivation' | 'peace'
  | 'grief' | 'loneliness' | 'overwhelm'
  | 'guilt' | 'hope' | 'unknown'

export type IntentType =
  | 'emotional_support' | 'career_guidance' | 'relationship_advice'
  | 'spiritual_question' | 'philosophical_inquiry' | 'life_purpose'
  | 'anger_management' | 'discipline' | 'general'

export interface ChatRequest {
  message: string
  session_id?: string
  stream?: boolean
  language?: string
}

export interface ChatResponse {
  session_id: string
  response: string
  verses_cited: string[]
  emotion_detected: EmotionType | null
  disclaimer: string
  processing_time_ms: number
  metadata: {
    request_id: string
    retrieval_count: number
    intent: IntentType
    processing_steps: string[]
  }
}

export interface ReflectionRequest {
  session_id: string
  topic?: string
}

export interface ReflectionResponse {
  session_id: string
  reflection: string
  emotional_journey: EmotionType[]
  key_teachings: string[]
  disclaimer: string
}

export interface MemoryResponse {
  session_id: string
  total_turns: number
  emotional_arc: EmotionType[]
  summary: string | null
  created_at: string
}

export interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  environment: string
  services: Record<string, string>
  timestamp: string
}

// ── UI Types ───────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'typing'

export interface VerseCard {
  ref: string        // e.g. "BG 2.47"
  fullRef: string    // e.g. "Chapter 2, Verse 47"
  text: string
  sanskrit?: string
  concept: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  text: string
  timestamp: Date
  emotion?: EmotionType
  verses?: VerseCard[]
  processingSteps?: string[]
  processingTimeMs?: number
}

export interface AgentStep {
  name: string
  icon: string
  status: 'pending' | 'running' | 'done'
}

export interface AppState {
  sessionId: string | null
  messages: ChatMessage[]
  isLoading: boolean
  currentEmotion: EmotionType | null
  totalTurns: number
  emotionalArc: EmotionType[]
}

// ── Auth Types ─────────────────────────────────────────────────────────────

export interface UserRegister {
  username: string
  email: string
  password: string
}

export interface UserLogin {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}
