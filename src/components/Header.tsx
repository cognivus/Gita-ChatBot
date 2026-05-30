import React from 'react'
import { EmotionType } from '../types'
import { EMOTION_META } from '../constants/verses'
import styles from './Header.module.css'

interface HeaderProps {
  currentEmotion: EmotionType | null
  totalTurns: number
  onShowArch: () => void
  showArch: boolean
}

export const Header: React.FC<HeaderProps> = ({
  currentEmotion,
  totalTurns,
  onShowArch,
  showArch,
}) => {
  const emotionMeta = currentEmotion ? EMOTION_META[currentEmotion] : null

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.omSymbol}>🕉</div>
        <div className={styles.brandText}>
          <h1 className={styles.title}>Gita GraphRAG</h1>
          <p className={styles.subtitle}>Agentic AI · Spiritual Guidance</p>
        </div>
      </div>

      <div className={styles.controls}>
        {emotionMeta && totalTurns > 0 && (
          <div
            className={styles.emotionBadge}
            style={{
              background: `${emotionMeta.color}18`,
              border: `1px solid ${emotionMeta.color}44`,
              color: emotionMeta.color,
            }}
          >
            <span className={styles.emotionDot} style={{ background: emotionMeta.color }} />
            {emotionMeta.icon} {emotionMeta.label}
          </div>
        )}

        <button
          className={`${styles.archBtn} ${showArch ? styles.archBtnActive : ''}`}
          onClick={onShowArch}
          aria-label="Toggle architecture view"
        >
          Architecture
        </button>

        <button
          className={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem('gita_token');
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </header>
  )
}
