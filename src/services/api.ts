import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  ChatRequest,
  ChatResponse,
  HealthResponse,
  MemoryResponse,
  ReflectionRequest,
  ReflectionResponse,
  UserRegister,
  UserLogin,
  TokenResponse,
} from '../types'

// ── Axios instance ──────────────────────────────────────────────────────────

const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1',
    timeout: 60_000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Attach JWT if stored
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('gita_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Global error handler
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      const msg =
        err.response?.data?.detail ?? err.message ?? 'An error occurred'
      console.error('[API Error]', msg)
      return Promise.reject(new Error(msg))
    }
  )

  return client
}

export const apiClient = createApiClient()

// ── API functions ───────────────────────────────────────────────────────────

export const api = {
  /** Send a chat message and receive Krishna-style guidance */
  chat: async (payload: ChatRequest): Promise<ChatResponse> => {
    const res: AxiosResponse<ChatResponse> = await apiClient.post('/chat', payload)
    return res.data
  },

  /** Stream a chat response via SSE */
  chatStream: (
    payload: ChatRequest,
    onChunk: (text: string) => void,
    onDone: (meta: { session_id: string; verses_cited: string[]; emotion_detected: string }) => void,
    onError: (err: Error) => void
  ): (() => void) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
    const token = localStorage.getItem('gita_token')

    const controller = new AbortController()

    fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ ...payload, stream: true }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const reader = res.body!.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const lines = decoder.decode(value).split('\n')
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6)
            if (data === '[DONE]') return
            if (data.startsWith('[METADATA]')) {
              try {
                const meta = JSON.parse(data.slice(10))
                onDone(meta)
              } catch { /* ignore */ }
            } else if (data.startsWith('[ERROR]')) {
              onError(new Error(data.slice(7)))
            } else {
              onChunk(data)
            }
          }
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') onError(err)
      })

    return () => controller.abort()
  },

  /** Get a reflective summary of the conversation */
  getReflection: async (payload: ReflectionRequest): Promise<ReflectionResponse> => {
    const res: AxiosResponse<ReflectionResponse> = await apiClient.post('/reflection', payload)
    return res.data
  },

  /** Retrieve session memory */
  getMemory: async (sessionId: string): Promise<MemoryResponse> => {
    const res: AxiosResponse<MemoryResponse> = await apiClient.get(`/memory/${sessionId}`)
    return res.data
  },

  /** Health check */
  health: async (): Promise<HealthResponse> => {
    const res: AxiosResponse<HealthResponse> = await apiClient.get(
      (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000').replace('/api/v1', '') + '/health'
    )
    return res.data
  },

  // ── Auth ──────────────────────────────────────────────────────────────────

  /** Register a new user */
  register: async (payload: UserRegister): Promise<TokenResponse> => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1').replace('/v1', '')
    const res: AxiosResponse<TokenResponse> = await axios.post(`${baseUrl}/auth/register`, payload)
    return res.data
  },

  /** Login existing user */
  login: async (payload: UserLogin): Promise<TokenResponse> => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1').replace('/v1', '')
    const res: AxiosResponse<TokenResponse> = await axios.post(`${baseUrl}/auth/login`, payload)
    return res.data
  },

  /** Logout locally */
  logout: () => {
    localStorage.removeItem('gita_token')
    window.location.reload()
  },
}
