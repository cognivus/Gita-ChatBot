import React, { useEffect, useRef } from 'react'

/* ── Particle canvas for floating lotus petals / light motes ── */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    interface Particle {
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; hue: number; life: number; maxLife: number
      type: 'mote' | 'petal'
    }

    const particles: Particle[] = []
    const MAX = 55

    const spawn = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.25 + Math.random() * 0.5),
      size: 1.5 + Math.random() * 3.5,
      opacity: 0,
      hue: Math.random() < 0.6 ? 38 : Math.random() < 0.5 ? 340 : 200,
      life: 0,
      maxLife: 180 + Math.random() * 200,
      type: Math.random() < 0.35 ? 'petal' : 'mote',
    })

    for (let i = 0; i < MAX; i++) {
      const p = spawn()
      p.y = Math.random() * canvas.height
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    let raf: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.life++
        p.x += p.vx
        p.y += p.vy
        const progress = p.life / p.maxLife
        p.opacity = progress < 0.15
          ? progress / 0.15
          : progress > 0.8
            ? (1 - progress) / 0.2
            : 0.75

        if (p.type === 'petal') {
          // Soft teardrop petal
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate(Math.sin(p.life * 0.02) * 0.4)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2)
          grad.addColorStop(0, `hsla(${p.hue}, 85%, 80%, ${p.opacity})`)
          grad.addColorStop(1, `hsla(${p.hue}, 75%, 65%, 0)`)
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size, p.size * 1.8, 0, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
          ctx.restore()
        } else {
          // Glowing mote
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3)
          grad.addColorStop(0, `hsla(${p.hue}, 90%, 85%, ${p.opacity})`)
          grad.addColorStop(0.4, `hsla(${p.hue}, 80%, 70%, ${p.opacity * 0.5})`)
          grad.addColorStop(1, `hsla(${p.hue}, 70%, 60%, 0)`)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()
        }

        if (p.life >= p.maxLife || p.y < -20) {
          particles[i] = spawn()
        }
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0,
        pointerEvents: 'none', zIndex: 0,
        opacity: 0.65,
      }}
    />
  )
}

/* ── Inline SVG Krishna silhouette ── */
const KrishnaScene: React.FC = () => (
  <div aria-hidden style={{
    position: 'fixed',
    bottom: 0,
    right: '3%',
    width: 'min(340px, 34vw)',
    height: 'min(580px, 72vh)',
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.18,
    animation: 'divinePulse 6s ease-in-out infinite',
  }}>
    <svg viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="krishnaGlow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#f0c060" stopOpacity="0.9"/>
          <stop offset="60%" stopColor="#e89b2e" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </radialGradient>
        <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d07a" stopOpacity="0.8"/>
          <stop offset="70%" stopColor="#e89b2e" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#e89b2e" stopOpacity="0"/>
        </radialGradient>
        <filter id="krishnaBlur">
          <feGaussianBlur stdDeviation="2.5"/>
        </filter>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* Divine halo / aura behind */}
      <ellipse cx="150" cy="110" rx="85" ry="85" fill="url(#haloGrad)" style={{ animation: 'divinePulse 4s ease-in-out infinite' }}/>
      <circle cx="150" cy="110" r="70" fill="none" stroke="#f5d07a" strokeWidth="1" strokeDasharray="4 8" opacity="0.5"
        style={{ transformOrigin: '150px 110px', animation: 'chakraRotate 20s linear infinite' }}/>
      <circle cx="150" cy="110" r="55" fill="none" stroke="#e89b2e" strokeWidth="0.5" strokeDasharray="2 6" opacity="0.4"
        style={{ transformOrigin: '150px 110px', animation: 'chakraRotateReverse 14s linear infinite' }}/>

      {/* Body glow base */}
      <ellipse cx="150" cy="300" rx="70" ry="200" fill="url(#krishnaGlow)" filter="url(#krishnaBlur)"/>

      {/* Crown / Mukut */}
      <path d="M120 55 L125 20 L135 40 L150 10 L165 40 L175 20 L180 55 Z"
        fill="#f5d07a" opacity="0.9"/>
      <circle cx="150" cy="18" r="5" fill="#f5d07a" opacity="1"/>
      <circle cx="135" cy="38" r="3" fill="#e89b2e" opacity="0.8"/>
      <circle cx="165" cy="38" r="3" fill="#e89b2e" opacity="0.8"/>
      {/* Peacock feather in crown */}
      <path d="M148 10 Q145 -5 148 -15 Q150 -20 152 -15 Q155 -5 152 10 Z"
        fill="#4a9aba" opacity="0.8"/>
      <ellipse cx="150" cy="-16" rx="5" ry="7" fill="#2eb8a0" opacity="0.7"/>
      <circle cx="150" cy="-17" r="3" fill="#f5d07a" opacity="0.9"/>

      {/* Head */}
      <ellipse cx="150" cy="90" rx="32" ry="38" fill="#1a1230" stroke="#e89b2e" strokeWidth="1.5" opacity="0.95"/>
      {/* Face glow */}
      <ellipse cx="150" cy="85" rx="22" ry="28" fill="#f0c060" opacity="0.12"/>
      {/* Tilak on forehead */}
      <path d="M148 68 L150 60 L152 68 Z" fill="#f5d07a" opacity="0.9"/>
      <rect x="148.5" y="62" width="3" height="6" rx="1.5" fill="#e89b2e" opacity="0.9"/>

      {/* Neck */}
      <rect x="141" y="122" width="18" height="16" rx="6" fill="#1a1230" stroke="#e89b2e" strokeWidth="0.8" opacity="0.9"/>

      {/* Shoulders & torso */}
      <path d="M100 145 Q80 160 82 220 L118 230 L150 240 L182 230 L218 220 Q220 160 200 145 Q175 135 150 138 Q125 135 100 145 Z"
        fill="#0c0920" stroke="#e89b2e" strokeWidth="1.2" opacity="0.95"/>
      {/* Dhoti / sacred cloth lines */}
      <path d="M110 200 Q150 190 190 200" stroke="#f5d07a" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M108 215 Q150 205 192 215" stroke="#f5d07a" strokeWidth="0.6" fill="none" opacity="0.4"/>
      {/* Jewelry necklace */}
      <path d="M122 148 Q150 165 178 148" stroke="#f5d07a" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <circle cx="150" cy="162" r="3" fill="#f5d07a" opacity="0.8"/>
      <circle cx="135" cy="154" r="2" fill="#e89b2e" opacity="0.7"/>
      <circle cx="165" cy="154" r="2" fill="#e89b2e" opacity="0.7"/>

      {/* Left arm — raised with flute */}
      <path d="M100 145 Q72 160 60 185 Q52 210 58 230"
        stroke="#1a1230" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M100 145 Q72 160 60 185 Q52 210 58 230"
        stroke="#e89b2e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* Flute */}
      <path d="M55 225 L90 180 L95 184 L60 229 Z"
        fill="#8b5a1a" stroke="#f5d07a" strokeWidth="0.8" opacity="0.85"/>
      {/* Flute holes */}
      <circle cx="72" cy="200" r="1.5" fill="#f5d07a" opacity="0.7"/>
      <circle cx="78" cy="194" r="1.5" fill="#f5d07a" opacity="0.7"/>
      <circle cx="84" cy="188" r="1.5" fill="#f5d07a" opacity="0.7"/>

      {/* Right arm — elegant hand gesture */}
      <path d="M200 145 Q228 165 238 195 Q242 215 235 230"
        stroke="#1a1230" strokeWidth="18" strokeLinecap="round" fill="none"/>
      <path d="M200 145 Q228 165 238 195 Q242 215 235 230"
        stroke="#e89b2e" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
      {/* Right hand blessing gesture */}
      <ellipse cx="235" cy="232" rx="10" ry="12" fill="#1a1230" stroke="#e89b2e" strokeWidth="1" opacity="0.9"/>

      {/* Lower body / dhoti */}
      <path d="M118 230 Q100 280 105 360 Q120 400 150 420 Q180 400 195 360 Q200 280 182 230 Z"
        fill="#0a0818" stroke="#e89b2e" strokeWidth="1" opacity="0.95"/>
      {/* Dhoti decorative edge */}
      <path d="M105 360 Q120 370 150 375 Q180 370 195 360"
        stroke="#f5d07a" strokeWidth="1.2" fill="none" opacity="0.55"/>
      {/* Legs */}
      <path d="M130 380 Q122 430 125 480"
        stroke="#0c0920" strokeWidth="20" strokeLinecap="round" fill="none"/>
      <path d="M130 380 Q122 430 125 480"
        stroke="#e89b2e" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M170 380 Q178 430 175 480"
        stroke="#0c0920" strokeWidth="20" strokeLinecap="round" fill="none"/>
      <path d="M170 380 Q178 430 175 480"
        stroke="#e89b2e" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.4"/>

      {/* Lotus base */}
      <ellipse cx="150" cy="495" rx="50" ry="14" fill="#e8778a" opacity="0.3"/>
      <path d="M110 492 Q115 475 120 490 Q130 465 140 488 Q150 460 160 488 Q170 465 180 490 Q185 475 190 492 Z"
        fill="#e8778a" opacity="0.4"/>

      {/* Ground glow */}
      <ellipse cx="150" cy="500" rx="90" ry="18" fill="#e89b2e" opacity="0.08" filter="url(#krishnaBlur)"/>
    </svg>
  </div>
)

/* ── Decorative Peacock Feather (left side) ── */
const PeacockFeather: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div aria-hidden style={{
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 0,
    animation: 'lotusFloat 8s ease-in-out infinite',
    ...style,
  }}>
    <svg viewBox="0 0 80 220" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="eyeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d07a"/>
          <stop offset="35%" stopColor="#2eb8a0"/>
          <stop offset="65%" stopColor="#4a9aba"/>
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Stem */}
      <path d="M40 220 Q38 150 40 80" stroke="#4a9aba" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Barbs fanning out */}
      {[-40,-30,-22,-16,-10,-5,0,5,10,16,22,30,40].map((offset, i) => (
        <path key={i}
          d={`M40 ${210 - i * 10} Q${40 + offset * 0.6} ${185 - i * 9} ${40 + offset} ${160 - i * 8}`}
          stroke={i % 2 === 0 ? '#4a9aba' : '#2eb8a0'}
          strokeWidth="0.8" fill="none" opacity="0.4"/>
      ))}
      {/* Eye */}
      <ellipse cx="40" cy="75" rx="22" ry="28" fill="url(#eyeGrad)" opacity="0.8"/>
      <ellipse cx="40" cy="75" rx="13" ry="18" fill="#2eb8a0" opacity="0.6"/>
      <ellipse cx="40" cy="75" rx="6" ry="9" fill="#f5d07a" opacity="0.9"/>
      <circle cx="40" cy="75" r="3" fill="#1a0a30" opacity="0.9"/>
    </svg>
  </div>
)

/* ── Chakra Mandala ── */
const ChakraMandala: React.FC = () => (
  <div aria-hidden style={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'min(600px, 70vw)',
    height: 'min(600px, 70vw)',
    pointerEvents: 'none',
    zIndex: 0,
    opacity: 0.04,
  }}>
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="mandalaCenterGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5d07a" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#e89b2e" stopOpacity="0"/>
        </radialGradient>
      </defs>
      {/* Rings */}
      {[240, 210, 180, 150, 120, 90, 60].map((r, i) => (
        <circle key={i} cx="250" cy="250" r={r}
          fill="none" stroke="#e89b2e"
          strokeWidth={i === 0 ? 0.8 : 0.5}
          strokeDasharray={`${6 - i} ${8 + i}`}
          opacity={0.6 - i * 0.06}
          style={{ transformOrigin: '250px 250px', animation: `${i % 2 === 0 ? 'chakraRotate' : 'chakraRotateReverse'} ${20 + i * 8}s linear infinite` }}
        />
      ))}
      {/* 16-petal lotus */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i * 360) / 16
        const rad = (angle * Math.PI) / 180
        const x = 250 + Math.cos(rad) * 100
        const y = 250 + Math.sin(rad) * 100
        const cx = 250 + Math.cos(rad) * 60
        const cy = 250 + Math.sin(rad) * 60
        return (
          <path key={i}
            d={`M250 250 Q${cx} ${cy} ${x} ${y} Q${cx + Math.cos(rad + 0.3) * 20} ${cy + Math.sin(rad + 0.3) * 20} 250 250`}
            fill="#e89b2e" opacity="0.5"
            style={{ transformOrigin: '250px 250px', animation: `chakraRotate 30s linear infinite` }}
          />
        )
      })}
      {/* Center */}
      <circle cx="250" cy="250" r="30" fill="url(#mandalaCenterGrad)"/>
      <text x="250" y="258" textAnchor="middle" fontSize="28" fill="#f5d07a" opacity="0.9">ॐ</text>
    </svg>
  </div>
)

/* ── Stars ── */
const StarField: React.FC = () => {
  const stars = Array.from({ length: 70 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 0.5 + Math.random() * 1.5,
    delay: Math.random() * 8,
    dur: 2 + Math.random() * 4,
  }))

  return (
    <div aria-hidden style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none', zIndex: 0,
      overflow: 'hidden',
    }}>
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${s.x}%`,
          top: `${s.y}%`,
          width: s.size,
          height: s.size,
          borderRadius: '50%',
          background: '#f5d07a',
          animation: `starTwinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
        }} />
      ))}
    </div>
  )
}

/* ── Main export ── */
export const BackgroundOrbs: React.FC = () => (
  <>
    <StarField />
    <ChakraMandala />

    {/* Primary ambient orbs */}
    <div aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Deep saffron orb — top left */}
      <div style={{
        position: 'absolute',
        top: '-15%', left: '-10%',
        width: 700, height: 700,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,155,46,0.07) 0%, rgba(240,120,40,0.03) 50%, transparent 70%)',
        animation: 'orbDrift 14s ease-in-out infinite',
      }} />
      {/* Peacock indigo — bottom right */}
      <div style={{
        position: 'absolute',
        bottom: '-15%', right: '-10%',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(74,154,186,0.08) 0%, rgba(46,184,160,0.04) 50%, transparent 70%)',
        animation: 'orbDrift 18s ease-in-out infinite reverse',
      }} />
      {/* Violet — center bloom */}
      <div style={{
        position: 'absolute',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800, height: 450,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 70%)',
      }} />
      {/* Lotus pink glow bottom center */}
      <div style={{
        position: 'absolute',
        bottom: '-5%', left: '50%',
        transform: 'translateX(-50%)',
        width: 500, height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(232,119,138,0.06) 0%, transparent 70%)',
        animation: 'orbDrift 22s ease-in-out infinite',
      }} />
    </div>

    {/* Krishna silhouette */}
    <KrishnaScene />

    {/* Peacock feathers */}
    <PeacockFeather style={{ left: '1%', bottom: '10%', width: 'min(65px, 7vw)', height: 'min(180px, 22vh)', opacity: 0.3 }} />
    <PeacockFeather style={{ left: '4%', bottom: '5%', width: 'min(45px, 5vw)', height: 'min(130px, 16vh)', opacity: 0.2, animationDelay: '3s' }} />

    {/* Particle canvas */}
    <ParticleCanvas />
  </>
)
