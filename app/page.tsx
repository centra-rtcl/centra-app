'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function ProximamentePage() {
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const target = new Date('2025-07-01T00:00:00')
    const interval = setInterval(() => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) { clearInterval(interval); return }
      setTimeLeft({
        dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
        horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)
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
        created_at: new Date().toISOString(),
      })
      setEnviado(true)
    } catch {
      setError('Ocurrió un error, intenta de nuevo')
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
          background: #080F1A;
          color: #E2EAF4;
          font-family: 'DM Sans', sans-serif;
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
        }

        /* Background glow */
        .page::before {
          content: '';
          position: fixed;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .page::after {
          content: '';
          position: fixed;
          bottom: -20%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(ellipse, rgba(27,43,75,0.4) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          max-width: 680px;
          width: 100%;
          text-align: center;
        }

        /* Logo */
        .logo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          margin-bottom: 48px;
          animation: fadeDown 0.8s ease both;
        }

        .logo-img {
          width: 90px;
          height: 90px;
          border-radius: 20px;
          filter: drop-shadow(0 0 30px rgba(34,197,94,0.3));
        }

        .logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: rgba(226,234,244,0.5);
          text-transform: uppercase;
        }

        /* Summer badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.25);
          border-radius: 100px;
          padding: 8px 20px;
          font-size: 13px;
          color: #22C55E;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 28px;
          animation: fadeDown 0.8s ease 0.1s both;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: #22C55E;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* Headline */
        h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(40px, 7vw, 72px);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: -0.03em;
          color: #E2EAF4;
          margin-bottom: 20px;
          animation: fadeDown 0.8s ease 0.2s both;
        }

        h1 span {
          color: #22C55E;
        }

        .subtitle {
          font-size: 17px;
          color: rgba(226,234,244,0.55);
          line-height: 1.7;
          max-width: 480px;
          margin: 0 auto 48px;
          animation: fadeDown 0.8s ease 0.3s both;
        }

        /* Videos */
        .videos {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 52px;
          animation: fadeDown 0.8s ease 0.4s both;
        }

        .video-slot {
          aspect-ratio: 9/16;
          background: rgba(27,43,75,0.5);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
        }

        .video-slot video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .video-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: rgba(226,234,244,0.2);
          font-size: 12px;
        }

        .video-placeholder-icon {
          font-size: 28px;
          opacity: 0.3;
        }

        /* Countdown */
        .countdown {
          display: flex;
          gap: 16px;
          justify-content: center;
          margin-bottom: 52px;
          animation: fadeDown 0.8s ease 0.5s both;
        }

        .countdown-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .countdown-num {
          font-family: 'Syne', sans-serif;
          font-size: 42px;
          font-weight: 900;
          color: #E2EAF4;
          line-height: 1;
          min-width: 70px;
          text-align: center;
          background: rgba(27,43,75,0.6);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 12px;
          padding: 12px 8px;
        }

        .countdown-label {
          font-size: 10px;
          letter-spacing: 0.15em;
          color: rgba(226,234,244,0.35);
          text-transform: uppercase;
        }

        .countdown-sep {
          font-family: 'Syne', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: #22C55E;
          line-height: 1;
          padding-top: 12px;
          opacity: 0.5;
        }

        /* Form */
        .form-wrap {
          animation: fadeDown 0.8s ease 0.6s both;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #E2EAF4;
          margin-bottom: 8px;
        }

        .form-sub {
          font-size: 14px;
          color: rgba(226,234,244,0.4);
          margin-bottom: 24px;
        }

        .form-card {
          background: rgba(15,30,53,0.8);
          border: 1px solid rgba(34,197,94,0.15);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(10px);
        }

        .form-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 16px;
        }

        .form-input {
          background: rgba(8,15,26,0.8);
          border: 1px solid rgba(226,234,244,0.1);
          border-radius: 12px;
          padding: 14px 18px;
          color: #E2EAF4;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          width: 100%;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: rgba(34,197,94,0.4);
        }

        .form-input::placeholder {
          color: rgba(226,234,244,0.25);
        }

        .form-btn {
          width: 100%;
          background: #22C55E;
          color: #000;
          font-family: 'Syne', sans-serif;
          font-size: 16px;
          font-weight: 800;
          padding: 16px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all 0.2s;
        }

        .form-btn:hover { background: #16A34A; transform: translateY(-1px); }
        .form-btn:disabled { opacity: 0.6; cursor: default; transform: none; }

        .form-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 12px 16px;
          font-size: 13px;
          color: #ef4444;
          margin-bottom: 12px;
        }

        /* Success */
        .success {
          padding: 40px 32px;
          text-align: center;
        }

        .success-icon { font-size: 52px; margin-bottom: 16px; }

        .success-title {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 8px;
          color: #22C55E;
        }

        .success-sub {
          font-size: 14px;
          color: rgba(226,234,244,0.5);
          line-height: 1.6;
        }

        /* Features */
        .features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 52px;
          animation: fadeDown 0.8s ease 0.7s both;
        }

        .feature {
          background: rgba(15,30,53,0.5);
          border: 1px solid rgba(226,234,244,0.06);
          border-radius: 14px;
          padding: 20px 16px;
          text-align: center;
        }

        .feature-icon { font-size: 26px; margin-bottom: 10px; }

        .feature-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #E2EAF4;
          margin-bottom: 4px;
        }

        .feature-desc {
          font-size: 12px;
          color: rgba(226,234,244,0.35);
          line-height: 1.5;
        }

        /* Footer */
        .footer {
          margin-top: 52px;
          font-size: 13px;
          color: rgba(226,234,244,0.2);
          animation: fadeDown 0.8s ease 0.8s both;
        }

        .footer a {
          color: rgba(34,197,94,0.6);
          text-decoration: none;
        }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 600px) {
          .videos { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .countdown { gap: 8px; }
          .countdown-num { font-size: 28px; min-width: 52px; }
          .features { grid-template-columns: 1fr; }
          .form-card { padding: 24px 20px; }
        }
      `}</style>

      <div className="page">
        <div className="content">

          {/* Logo */}
          <div className="logo-wrap">
            <img src="/CENTRA.png" alt="Centra" className="logo-img" />
            <span className="logo-name">centratunegocio.com</span>
          </div>

          {/* Badge */}
          <div className="badge">
            <div className="badge-dot" />
            Próximamente — Verano 2025
          </div>

          {/* Headline */}
          <h1>Control total<br />de <span>tu negocio</span></h1>

          <p className="subtitle">
            El Mini ERP diseñado para micro y pequeñas empresas. Simple, inteligente y asequible.
            Ventas, inventario, caja y más — desde tu celular.
          </p>

          {/* Videos */}
          <div className="videos">
            {['video1.mp4', 'video2.mp4', 'video3.mp4'].map((v, i) => (
              <div key={i} className="video-slot">
                <video autoPlay muted loop playsInline>
                  <source src={`/${v}`} type="video/mp4" />
                </video>
                <div className="video-placeholder">
                  <span className="video-placeholder-icon">▶</span>
                </div>
              </div>
            ))}
          </div>

          {/* Countdown */}
          <div className="countdown">
            <div className="countdown-item">
              <div className="countdown-num">{String(timeLeft.dias).padStart(2,'0')}</div>
              <div className="countdown-label">Días</div>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-item">
              <div className="countdown-num">{String(timeLeft.horas).padStart(2,'0')}</div>
              <div className="countdown-label">Horas</div>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-item">
              <div className="countdown-num">{String(timeLeft.minutos).padStart(2,'0')}</div>
              <div className="countdown-label">Minutos</div>
            </div>
            <div className="countdown-sep">:</div>
            <div className="countdown-item">
              <div className="countdown-num">{String(timeLeft.segundos).padStart(2,'0')}</div>
              <div className="countdown-label">Segundos</div>
            </div>
          </div>

          {/* Form */}
          <div className="form-wrap">
            <div className="form-title">Sé de los primeros</div>
            <div className="form-sub">Regístrate y te avisamos el día que lancemos</div>

            <div className="form-card">
              {enviado ? (
                <div className="success">
                  <div className="success-icon">🎉</div>
                  <div className="success-title">¡Ya estás en la lista!</div>
                  <div className="success-sub">
                    Te contactaremos el 1 de julio cuando Centra esté listo.<br />
                    Gracias {form.nombre} — serás de los primeros.
                  </div>
                </div>
              ) : (
                <>
                  {error && <div className="form-error">{error}</div>}
                  <div className="form-grid">
                    <input
                      className="form-input"
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                    />
                    <input
                      className="form-input"
                      type="email"
                      placeholder="Tu correo electrónico"
                      value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    />
                    <input
                      className="form-input"
                      placeholder="Tu WhatsApp (con lada, ej: 5512345678)"
                      value={form.whatsapp}
                      onChange={e => setForm(f => ({ ...f, whatsapp: e.target.value }))}
                    />
                  </div>
                  <button className="form-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Guardando...' : 'Quiero ser de los primeros →'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="features">
            {[
              { icon: '🏷️', title: 'Ventas rápidas', desc: 'Cobra en segundos con escaneo o búsqueda' },
              { icon: '📦', title: 'Inventario automático', desc: 'Se actualiza solo con cada venta y compra' },
              { icon: '📊', title: 'Dashboard inteligente', desc: 'Ve cómo va tu negocio cada mañana' },
              { icon: '💰', title: 'Control de caja', desc: 'Corte exacto con todas las formas de pago' },
              { icon: '🛒', title: 'Compras y proveedores', desc: 'Rastrea pedidos y cuentas por pagar' },
              { icon: '📱', title: 'Desde tu celular', desc: 'Web app y próximamente en Play Store' },
            ].map(f => (
              <div key={f.title} className="feature">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="footer">
            <p>© 2025 Centra · <a href="mailto:hola@centratunegocio.com">hola@centratunegocio.com</a></p>
          </div>

        </div>
      </div>
    </>
  )
}
