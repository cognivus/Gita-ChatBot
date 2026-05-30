import React, { useState } from 'react'
import { api } from '../services/api'
import styles from './AuthModal.module.css'

interface AuthModalProps {
  onSuccess: (token: string) => void
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isLogin) {
        const res = await api.login({
          username: formData.username,
          password: formData.password,
        })
        localStorage.setItem('gita_token', res.access_token)
        onSuccess(res.access_token)
      } else {
        const res = await api.register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        })
        localStorage.setItem('gita_token', res.access_token)
        onSuccess(res.access_token)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.omSymbol}>🕉</div>
        <h2 className={styles.title}>{isLogin ? 'Welcome Back' : 'Begin Your Journey'}</h2>
        <p className={styles.subtitle}>
          {isLogin 
            ? 'Reconnect with the wisdom of the Bhagavad Gita' 
            : 'Join our community for personalized spiritual guidance'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Arjuna"
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seeker@wisdom.com"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Entering...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.toggle}>
          {isLogin ? "Don't have an account? " : 'Already a member? '}
          <button onClick={() => setIsLogin(!isLogin)} className={styles.linkBtn}>
            {isLogin ? 'Create one' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  )
}
