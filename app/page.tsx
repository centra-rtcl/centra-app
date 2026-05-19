'use client'
import { useState, useEffect } from 'react'

export default function ProximamentePage() {
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const target = new Date('2026-07-01T00:00:00')
    const tick = () => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) return
      setTimeLeft({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  async function handleSubmit() {
    setError('')
    if (!form.nombre || (!form.email && !form.whatsapp)) {
      setError('Ingresa tu nombre y al menos un medio de contacto')
      return
    }
    setLoading(true)
    try {
      const { createClient } = await import('@/app/lib/supabase-client')
      const supabase = createClient()
      await supabase.from('lista_espera').insert({
        nombre: form.nombre,
        email: form.email || null,
        whatsapp: form.whatsapp || null,
      })
      setEnviado(true)
    } catch {
      setError('Ocurrió un error, intenta de nuevo')
    }
    setLoading(false)
  }

  const d = darkMode
  const bg = d ? '#080F1A' : '#F0F4FF'
  const surface = d ? 'rgba(15,30,53,0.8)' : 'rgba(255,255,255,0.9)'
  const border = d ? 'rgba(34,197,94,0.15)' : 'rgba(27,43,75,0.12)'
  const text = d ? '#E2EAF4' : '#1B2B4B'
  const muted = d ? 'rgba(226,234,244,0.4)' : 'rgba(27,43,75,0.45)'
  const green = d ? '#22C55E' : '#16A34A'
  const inputBg = d ? 'rgba(8,15,26,0.8)' : 'rgba(240,244,255,0.8)'
  const inputBorder = d ? 'rgba(226,234,244,0.1)' : 'rgba(27,43,75,0.15)'
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${bg}; transition: background 0.4s; }
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          font-family: 'Outfit', sans-serif;
          position: relative;
          overflow-x: hidden;
        }
        .glow {
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 700px;
          background: radial-gradient(ellipse, ${d ? 'rgba(34,197,94,0.07)' : 'rgba(22,163,74,0.06)'} 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .content {
          position: relative;
          z-index: 1;
          max-width: 660px;
          width: 100%;
          text-align: center;
        }
        .topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 660px;
          margin-bottom: 48px;
          position: relative;
          z-index: 1;
        }
        .logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-img {
          width: 36px;
          height: 36px;
          border-radius: 8px;
        }
        .logo-name {
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: ${text};
        }
        .toggle-btn {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          color: ${muted};
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn:hover { color: ${text}; }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: ${d ? 'rgba(34,197,94,0.1)' : 'rgba(22,163,74,0.08)'};
          border: 1px solid ${d ? 'rgba(34,197,94,0.2)' : 'rgba(22,163,74,0.2)'};
          border-radius: 100px;
          padding: 7px 18px;
          font-size: 12px;
          font-weight: 700;
          color: ${green};
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          background: ${green};
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.3; transform:scale(0.7); }
        }
        h1 {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(44px, 8vw, 78px);
          font-weight: 900;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: ${text};
          margin-bottom: 10px;
        }
        h1 span {
          color: ${green};
          font-weight: 300;
          display: block;
          letter-spacing: -0.02em;
        }
        .subtitle {
          font-size: 16px;
          font-weight: 300;
          color: ${muted};
          line-height: 1.7;
          max-width: 460px;
          margin: 16px auto 48px;
        }
        .videos {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 52px;
        }
        .video-slot {
          aspect-ratio: 9/16;
          background: ${d ? 'rgba(27,43,75,0.5)' : 'rgba(27,43,75,0.06)'};
          border: 1px solid ${border};
          border-radius: 14px;
          overflow: hidden;
          position: relative;
        }
        .video-slot video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .countdown {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          justify-content: center;
          margin-bottom: 52px;
        }
        .cnt-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .cnt-num {
          font-family: 'Outfit', sans-serif;
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 900;
          color: ${text};
          line-height: 1;
          min-width: 68px;
          text-align: center;
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 12px;
          padding: 14px 8px;
          letter-spacing: -0.03em;
        }
        .cnt-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${muted};
        }
        .cnt-sep {
          font-family: 'Outfit', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: ${green};
          line-height: 1;
          padding-top: 14px;
          opacity: 0.4;
        }
        .form-section { margin-bottom: 52px; }
        .form-title {
          font-family: 'Outfit', sans-serif;
          font-size: 22px;
          font-weight: 900;
          color: ${text};
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }
        .form-sub {
          font-size: 14px;
          font-weight: 300;
          color: ${muted};
          margin-bottom: 20px;
        }
        .form-card {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 20px;
          padding: 28px;
          backdrop-filter: blur(12px);
        }
        .form-input {
          background: ${inputBg};
          border: 1px solid ${inputBorder};
          border-radius: 10px;
          padding: 13px 16px;
          color: ${text};
          font-family: 'Outfit', sans-serif;
          font-size: 15px;
          font-weight: 400;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
          margin-bottom: 10px;
          display: block;
        }
        .form-input:focus { border-color: ${d ? 'rgba(34,197,94,0.4)' : 'rgba(22,163,74,0.4)'}; }
        .form-input::placeholder { color: ${muted}; }
        .form-btn {
          width: 100%;
          background: ${green};
          color: ${d ? '#000' : '#fff'};
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 900;
          padding: 15px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: all 0.2s;
          margin-top: 4px;
        }
        .form-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .form-btn:disabled { opacity: 0.5; cursor: default; transform: none; }
        .form-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #ef4444;
          margin-bottom: 10px;
        }
        .success-box {
          padding: 32px 20px;
          text-align: center;
        }
        .success-logo {
          width: 64px;
          height: 64px;
          border-radius: 14px;
          margin: 0 auto 16px;
        }
        .success-title {
          font-family: 'Outfit', sans-serif;
          font-size: 20px;
          font-weight: 900;
          color: ${green};
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .success-sub {
          font-size: 14px;
          font-weight: 300;
          color: ${muted};
          line-height: 1.6;
        }
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 48px;
        }
        .feature {
          background: ${surface};
          border: 1px solid ${border};
          border-radius: 14px;
          padding: 18px 14px;
          text-align: center;
        }
        .feature-icon {
          font-size: 22px;
          margin-bottom: 8px;
        }
        .feature-title {
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: ${text};
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .feature-desc {
          font-size: 12px;
          font-weight: 300;
          color: ${muted};
          line-height: 1.5;
        }
        .footer {
          font-size: 12px;
          font-weight: 300;
          color: ${muted};
        }
        .footer a {
          color: ${d ? 'rgba(34,197,94,0.7)' : 'rgba(22,163,74,0.8)'};
          text-decoration: none;
        }
        @media (max-width: 500px) {
          .features { grid-template-columns: repeat(2, 1fr); }
          .cnt-num { font-size: 26px; min-width: 52px; padding: 10px 6px; }
          h1 { font-size: 40px; }
        }
      `}</style>

      <div className="glow" />

      <div className="topbar">
        <div className="logo-row">
          <img src="/CENTRA.png" alt="Centra" className="logo-img" />
          <span className="logo-name">CENTRA</span>
        </div>
        <button className="toggle-btn" onClick={() => setDarkMode(!d)}>
          {d ? '☀ Modo claro' : '☾ Modo oscuro'}
        </button>
      </div>

      <div className="content">
        <div className="badge">
          <div className="badge-dot" />
          Próximamente — Verano 2026
        </div>

        <h1>
          Centra
          <span>tu negocio</span>
        </h1>

        <p className="subtitle">
          El sistema de control diseñado para micro y pequeñas empresas.
          Ventas, inventario, caja y más — todo desde tu celular.
        </p>

        <div className="videos">
          {['video1.mp4', 'video2.mp4', 'video3.mp4'].map((v, i) => (
            <div key={i} className="video-slot">
              <video autoPlay muted loop playsInline>
                <source src={`/${v}`} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        <div className="countdown">
          {[
            { num: pad(timeLeft.dias), label: 'Días' },
            { sep: ':' },
            { num: pad(timeLeft.horas), label: 'Horas' },
            { sep: ':' },
            { num: pad(timeLeft.minutos), label: 'Minutos' },
            { sep: ':' },
            { num: pad(timeLeft.segundos), label: 'Segundos' },
          ].map((item: any, i) =>
            item.sep ? (
              <div key={i} className="cnt-sep">{item.sep}</div>
            ) : (
              <div key={i} className="cnt-item">
                <div className="cnt-num">{item.num}</div>
                <div className="cnt-label">{item.label}</div>
              </div>
            )
          )}
        </div>

        <div className="form-section">
          <div className="form-title">Sé de los primeros</div>
          <div className="form-sub">Te avisamos el día que lancemos — sin spam</div>
          <div className="form-card">
            {enviado ? (
              <div className="success-box">
                <img src="/CENTRA.png" alt="Centra" className="success-logo" />
                <div className="success-title">Ya estás en la lista</div>
                <div className="success-sub">
                  Te contactaremos cuando Centra esté listo.<br />
                  Gracias {form.nombre}, serás de los primeros en probarlo.
                </div>
              </div>
            ) : (
              <>
                {error && <div className="form-error">{error}</div>}
                <input className="form-input" placeholder="Tu nombre" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
                <input className="form-input" type="email" placeholder="Tu correo electrónico" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                <input className="form-input" placeholder="Tu WhatsApp (con lada, ej: 5512345678)" value={form.whatsapp} onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))} />
                <button className="form-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Guardando...' : 'Quiero ser de los primeros →'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="features">
          {[
            { icon: '🏷️', title: 'Ventas rápidas', desc: 'Cobra en segundos, escanea o busca' },
            { icon: '📦', title: 'Inventario automático', desc: 'Se actualiza con cada venta y compra' },
            { icon: '📊', title: 'Dashboard inteligente', desc: 'Tu negocio de un vistazo cada mañana' },
            { icon: '💰', title: 'Control de caja', desc: 'Corte exacto por forma de pago' },
            { icon: '🛒', title: 'Compras y proveedores', desc: 'Pedidos, recepciones y cuentas por pagar' },
            { icon: '📱', title: 'Desde tu celular', desc: 'Web app y próximamente en Play Store' },
          ].map(f => (
            <div key={f.title} className="feature">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="footer">
          © 2026 Centra · <a href="mailto:crt.centra@gmail.com">centra@centratunegocio.com</a>
        </div>
      </div>
    </>
  )
}
