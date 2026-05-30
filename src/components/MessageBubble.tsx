import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ChatMessage } from '../types'
import styles from './MessageBubble.module.css'

interface Props {
  message: ChatMessage
  index: number
}

const TypingIndicator: React.FC = () => (
  <div className={styles.typingDots}>
    <span /><span /><span />
  </div>
)

const VerseBlock: React.FC<{ verse: ChatMessage['verses'] extends (infer V)[] | undefined ? V : never }> = ({ verse }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 700)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`${styles.verseCard} ${visible ? styles.verseVisible : ''}`}>
      <div className={styles.verseHeader}>
        <span className={styles.verseRef}>{verse.ref}</span>
        <span className={styles.verseConcept}>{verse.concept}</span>
      </div>
      {verse.sanskrit && (
        <p className={styles.verseSanskrit}>{verse.sanskrit}</p>
      )}
      <p className={styles.verseText}>"{verse.text}"</p>
    </div>
  )
}

export const MessageBubble: React.FC<Props> = ({ message, index }) => {
  const isUser = message.role === 'user'
  const isTyping = message.role === 'typing'

  return (
    <div
      className={`${styles.wrapper} ${isUser ? styles.wrapperUser : styles.wrapperAssistant}`}
      style={{ animationDelay: `${Math.min(index * 0.04, 0.3)}s` }}
    >
      {!isUser && (
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>🕉</div>
          <span className={styles.avatarLabel}>Gita Wisdom</span>
        </div>
      )}

      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAssistant}`}>
        {isTyping ? (
          <TypingIndicator />
        ) : isUser ? (
          <p className={styles.userText}>{message.text}</p>
        ) : (
          <div className={styles.assistantText}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className={styles.mdParagraph}>{children}</p>,
                strong: ({ children }) => <strong className={styles.mdBold}>{children}</strong>,
                em: ({ children }) => <em className={styles.mdItalic}>{children}</em>,
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {!isUser && !isTyping && message.verses && message.verses.length > 0 && (
        <div className={styles.verses}>
          {message.verses.map((v, i) => (
            <VerseBlock key={i} verse={v} />
          ))}
        </div>
      )}

      {!isUser && !isTyping && (
        <div className={styles.footer}>
          <span className={styles.disclaimer}>
            AI-generated spiritual guidance inspired by Bhagavad Gita teachings
          </span>
          {message.processingTimeMs && (
            <span className={styles.timing}>
              {(message.processingTimeMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      )}
    </div>
  )
}
