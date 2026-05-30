import React from 'react'
import { AGENT_STEPS } from '../constants/verses'
import styles from './AgentPipeline.module.css'

export const AgentPipeline: React.FC = () => (
  <div className={styles.bar}>
    {AGENT_STEPS.map((step, i) => (
      <div
        key={step.key}
        className={styles.step}
        style={{ animationDelay: `${i * 0.28}s` }}
      >
        <div className={styles.dot} />
        <span className={styles.label}>{step.icon} {step.name}</span>
      </div>
    ))}
  </div>
)
