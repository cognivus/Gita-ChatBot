import { useEffect, useRef, useState } from 'react'
import { BackgroundOrbs }    from './components/BackgroundOrbs'
import { Header }            from './components/Header'
import { ArchitecturePanel } from './components/ArchitecturePanel'
import { WelcomeScreen }     from './components/WelcomeScreen'
import { MessageBubble }     from './components/MessageBubble'
import { AgentPipeline }     from './components/AgentPipeline'
import { ChatInput }         from './components/ChatInput'
import { AuthModal }         from './components/AuthModal'
import { useChat }           from './hooks/useChat'
import styles from './App.module.css'

export default function App() {
  const { state, sendMessage } = useChat()
  const [showArch, setShowArch] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('gita_token'))
  const bottomRef = useRef<HTMLDivElement>(null)

  if (!isAuthenticated) {
    return <AuthModal onSuccess={() => setIsAuthenticated(true)} />
  }

  const hasMessages = state.messages.length > 0

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.messages])

  return (
    <div className={styles.root}>
      <BackgroundOrbs />

      <div className={styles.layout}>
        {/* ── Header ── */}
        <Header
          currentEmotion={state.currentEmotion}
          totalTurns={state.totalTurns}
          onShowArch={() => setShowArch((v) => !v)}
          showArch={showArch}
        />

        {/* ── Architecture panel (collapsible) ── */}
        {showArch && <ArchitecturePanel />}

        {/* ── Agent pipeline status bar ── */}
        {state.isLoading && <AgentPipeline />}

        {/* ── Chat body ── */}
        <main className={styles.chatBody}>
          {!hasMessages ? (
            <WelcomeScreen onPrompt={sendMessage} />
          ) : (
            <div className={styles.messages}>
              {state.messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </main>

        {/* ── Input ── */}
        <ChatInput onSend={sendMessage} disabled={state.isLoading} />
      </div>
    </div>
  )
}
