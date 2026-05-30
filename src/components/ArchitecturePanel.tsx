import React from 'react'
import styles from './ArchitecturePanel.module.css'

const AGENTS = [
  { name: 'Emotion Detection',   icon: '🧠', color: '#6b8cba' },
  { name: 'Intent Understanding',icon: '🎯', color: '#a07bc4' },
  { name: 'GraphRAG Retrieval',  icon: '📖', color: '#d4943a' },
  { name: 'Wisdom Synthesis',    icon: '✨', color: '#7bc47b' },
  { name: 'Krishna Persona',     icon: '🕉', color: '#e8c87d' },
  { name: 'Reflection Agent',    icon: '🪷', color: '#c47b7b' },
  { name: 'Safety Agent',        icon: '🛡', color: '#7ba0a0' },
  { name: 'Response Assembly',   icon: '⚡', color: '#c4a05a' },
]

const STACK = [
  {
    label: 'LLM',
    value: 'NVIDIA Nemotron 70B',
    desc: 'Via OpenRouter API with streaming SSE support',
    icon: '🤖',
  },
  {
    label: 'Graph DB',
    value: 'Neo4j',
    desc: '7 node types · Emotion→Concept→Verse traversal',
    icon: '🕸',
  },
  {
    label: 'Vector DB',
    value: 'Qdrant',
    desc: 'Semantic search · 700+ verse embeddings',
    icon: '🔍',
  },
  {
    label: 'Memory',
    value: 'Redis + PostgreSQL',
    desc: 'Short-term session + long-term conversation history',
    icon: '🗄',
  },
  {
    label: 'Orchestration',
    value: 'LangGraph',
    desc: 'Directed agent graph with conditional routing',
    icon: '🔀',
  },
  {
    label: 'Backend',
    value: 'FastAPI (async)',
    desc: 'JWT auth · Rate limiting · Prometheus metrics',
    icon: '⚡',
  },
]

export const ArchitecturePanel: React.FC = () => (
  <div className={styles.panel}>
    <p className={styles.sectionLabel}>LangGraph Multi-Agent Pipeline</p>
    <div className={styles.agents}>
      {AGENTS.map((a, i) => (
        <div
          key={i}
          className={styles.agentChip}
          style={{
            background: `${a.color}14`,
            border: `1px solid ${a.color}40`,
            color: a.color,
          }}
        >
          <span>{a.icon}</span>
          {a.name}
        </div>
      ))}
    </div>

    <p className={styles.sectionLabel} style={{ marginTop: 20 }}>Tech Stack</p>
    <div className={styles.stack}>
      {STACK.map((s, i) => (
        <div key={i} className={styles.stackCard}>
          <div className={styles.stackIcon}>{s.icon}</div>
          <div>
            <div className={styles.stackLabel}>{s.label}</div>
            <div className={styles.stackValue}>{s.value}</div>
            <div className={styles.stackDesc}>{s.desc}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)
