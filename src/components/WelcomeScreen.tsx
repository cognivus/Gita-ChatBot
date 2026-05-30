import React from 'react'
import { STARTER_PROMPTS } from '../constants/verses'
import styles from './WelcomeScreen.module.css'

interface Props {
  onPrompt: (text: string) => void
}

export const WelcomeScreen: React.FC<Props> = ({ onPrompt }) => (
  <div className={styles.wrapper}>
    {/* Animated OM with rings */}
    <div className={styles.omContainer}>
      <div className={styles.omRing} />
      <div className={styles.omRing2} />
      <div className={styles.omGlow}>ॐ</div>
    </div>

    <p className={styles.sanskrit}>श्रीमद्भगवद्गीता</p>

    <h2 className={styles.heading}>Seek Wisdom from the Gita</h2>

    <div className={styles.divider} />

    <p className={styles.subheading}>
      Share what weighs on your heart. Drawing from 700+ verses of the Bhagavad Gita,
      this system offers compassionate, grounded wisdom for modern life —
      as Krishna spoke to Arjuna on the sacred field of Kurukshetra.
    </p>

    {/* Verse of the day */}
    <div className={styles.verseOfDay}>
      <div className={styles.verseOfDayLabel}>✦ Daily Verse</div>
      <p className={styles.verseOfDayText}>
        "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions."
      </p>
      <div className={styles.verseOfDayRef}>Bhagavad Gita · 2.47</div>
    </div>

    <div className={styles.prompts}>
      {STARTER_PROMPTS.map((p, i) => (
        <button
          key={i}
          className={styles.promptBtn}
          onClick={() => onPrompt(p.text)}
        >
          <span className={styles.promptQuote}>"</span>
          {p.text}
          <span className={styles.promptQuote}>"</span>
        </button>
      ))}
    </div>

    <p className={styles.disclaimer}>
      AI-generated spiritual guidance inspired by Bhagavad Gita teachings.
      Not a substitute for professional mental health care.
    </p>
  </div>
)
