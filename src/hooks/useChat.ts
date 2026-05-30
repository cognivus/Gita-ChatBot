import { useCallback, useReducer, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { api } from '../services/api'
import { EMOTION_VERSES } from '../constants/verses'
import type { AppState, ChatMessage, EmotionType } from '../types'

// ── State & Reducer ──────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_LAST_MESSAGE'; payload: Partial<ChatMessage> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: string }
  | { type: 'SET_EMOTION'; payload: EmotionType }
  | { type: 'ADD_EMOTION_TO_ARC'; payload: EmotionType }
  | { type: 'REMOVE_TYPING' }

const initialState: AppState = {
  sessionId: null,
  messages: [],
  isLoading: false,
  currentEmotion: null,
  totalTurns: 0,
  emotionalArc: [],
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        totalTurns: state.totalTurns + 1,
      }
    case 'UPDATE_LAST_MESSAGE': {
      const msgs = [...state.messages]
      const last = msgs[msgs.length - 1]
      if (last) msgs[msgs.length - 1] = { ...last, ...action.payload }
      return { ...state, messages: msgs }
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_SESSION':
      return { ...state, sessionId: action.payload }
    case 'SET_EMOTION':
      return { ...state, currentEmotion: action.payload }
    case 'ADD_EMOTION_TO_ARC':
      return { ...state, emotionalArc: [...state.emotionalArc, action.payload] }
    case 'REMOVE_TYPING':
      return {
        ...state,
        messages: state.messages.filter((m) => m.role !== 'typing'),
      }
    default:
      return state
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useChat() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const streamCancelRef = useRef<(() => void) | null>(null)

  const sendMessage = useCallback(
    async (text: string, useStream = false) => {
      const trimmed = text.trim()
      if (!trimmed || state.isLoading) return

      // Add user message
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: uuidv4(),
          role: 'user',
          text: trimmed,
          timestamp: new Date(),
        },
      })

      // Add typing indicator
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: 'typing',
          role: 'typing',
          text: '',
          timestamp: new Date(),
        },
      })

      dispatch({ type: 'SET_LOADING', payload: true })

      if (useStream) {
        // ── Streaming path ─────────────────────────────────────────────────
        let accumulated = ''
        const assistantId = uuidv4()

        // Replace typing with empty assistant message
        dispatch({ type: 'REMOVE_TYPING' })
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: assistantId,
            role: 'assistant',
            text: '',
            timestamp: new Date(),
          },
        })

        const cancel = api.chatStream(
          { message: trimmed, session_id: state.sessionId ?? undefined, stream: true },
          (chunk) => {
            accumulated += chunk
            dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: { text: accumulated } })
          },
          (meta) => {
            if (meta.session_id) dispatch({ type: 'SET_SESSION', payload: meta.session_id })
            const emotion = meta.emotion_detected as EmotionType | undefined
            if (emotion) {
              dispatch({ type: 'SET_EMOTION', payload: emotion })
              dispatch({ type: 'ADD_EMOTION_TO_ARC', payload: emotion })
            }
            const verse = emotion ? EMOTION_VERSES[emotion] : undefined
            dispatch({
              type: 'UPDATE_LAST_MESSAGE',
              payload: {
                verses: verse ? [verse] : [],
                emotion: emotion,
              },
            })
            dispatch({ type: 'SET_LOADING', payload: false })
          },
          (err) => {
            console.error('Stream error', err)
            dispatch({ type: 'UPDATE_LAST_MESSAGE', payload: { text: 'A moment of stillness — please try again.' } })
            dispatch({ type: 'SET_LOADING', payload: false })
          }
        )
        streamCancelRef.current = cancel

      } else {
        // ── Standard path ──────────────────────────────────────────────────
        try {
          const data = await api.chat({
            message: trimmed,
            session_id: state.sessionId ?? undefined,
          })

          dispatch({ type: 'REMOVE_TYPING' })

          if (data.session_id) dispatch({ type: 'SET_SESSION', payload: data.session_id })

          const emotion = data.emotion_detected ?? undefined
          if (emotion) {
            dispatch({ type: 'SET_EMOTION', payload: emotion })
            dispatch({ type: 'ADD_EMOTION_TO_ARC', payload: emotion })
          }

          const verse = emotion ? EMOTION_VERSES[emotion] : undefined

          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: uuidv4(),
              role: 'assistant',
              text: data.response,
              timestamp: new Date(),
              emotion: emotion,
              verses: verse ? [verse] : [],
              processingSteps: data.metadata?.processing_steps,
              processingTimeMs: data.processing_time_ms,
            },
          })
        } catch (err) {
          dispatch({ type: 'REMOVE_TYPING' })
          dispatch({
            type: 'ADD_MESSAGE',
            payload: {
              id: uuidv4(),
              role: 'assistant',
              text: 'My dear friend, a moment of stillness — please share your thoughts again.\n\n— AI-generated spiritual guidance inspired by Bhagavad Gita teachings.',
              timestamp: new Date(),
            },
          })
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    },
    [state.isLoading, state.sessionId]
  )

  const cancelStream = useCallback(() => {
    streamCancelRef.current?.()
    streamCancelRef.current = null
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  return { state, sendMessage, cancelStream }
}
