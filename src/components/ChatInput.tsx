import React, { useCallback, useEffect, useRef } from 'react'
import styles from './ChatInput.module.css'

interface Props {
  onSend: (text: string) => void
  disabled: boolean
}

export const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef('')

  // Auto-resize textarea
  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [])

  useEffect(() => {
    resize()
  }, [resize])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    valueRef.current = e.target.value
    resize()
  }

  const submit = () => {
    const text = valueRef.current.trim()
    if (!text || disabled) return
    onSend(text)
    if (textareaRef.current) {
      textareaRef.current.value = ''
      valueRef.current = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputRow}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder="Share what is on your heart…  (Enter to send, Shift+Enter for new line)"
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
        />
        <button
          className={styles.sendBtn}
          onClick={submit}
          disabled={disabled}
          aria-label="Send message"
        >
          {disabled ? (
            <span className={styles.spinner} />
          ) : (
            <span className={styles.sendIcon}>✦</span>
          )}
        </button>
      </div>
      <p className={styles.legalNote}>
        AI-generated spiritual guidance inspired by Bhagavad Gita teachings ·
        Not a substitute for professional mental health support
      </p>
    </div>
  )
}
