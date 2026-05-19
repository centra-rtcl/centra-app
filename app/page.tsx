'use client'
import { useState, useEffect } from 'react'

export default function Home() {
  const [dark, setDark] = useState(true)
  const [form, setForm] = useState({ nombre: '', email: '', whatsapp: '' })
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const target = new Date('2026-07-01T00:00:00')
    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) return
      setTimeLeft({
        dias: Math.floor(diff / 86400000),
        horas: Math.floor((diff % 86400000) / 3600000),
        minutos: Math.floor((diff % 3600000) / 60000),
        segundos: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
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

  const pad = (n: number) => String(n).padStart(2, '0')

  // Color tokens
  const c = {
    bg:        dark ? '#07101E' : '#EEF2F8',
    bg2:       dark ? '#0D1B2E' : '#E2E9F3',
    surface:   dark ? '#112040' : '#FFFFFF',
    border:    dark ? 'rgba(34,197,94,0.15)' : 'rgba(27,43,75,0.12)',
    borderSub: dark ? 'rgba(226,234,244,0.07)' : 'rgba(27,43,75,0.08)',
    text:      dark ? '#E8F0FA' : '#1B2B4B',
    muted:     dark ? 'rgba(226,234,244,0.45)' : 'rgba(27,43,75,0.5)',
    green:     dark ? '#22C55E' : '#16A34A',
    greenBg:   dark ? 'rgba(34,197,94,0.1)' : 'rgba(22,163,74,0.08)',
    greenBd:   dark ? 'rgba(34,197,94,0.25)' : 'rgba(22,163,74,0.2)',
    inputBg:   dark ? 'rgba(7,16,30,0.7)' : 'rgba(238,242,248,0.9)',
    inputBd:   dark ? 'rgba(226,234,244,0.1)' : 'rgba(27,43,75,0.15)',
    btnTxt:    dark ? '#000' : '#fff',
    glow:      dark ? 'rgba(34,197,94,0.07)' : 'rgba(22,163,74,0.05)',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: ${c.bg};
          color: ${c.text};
          font-family: 'Outfit', sans-serif;
          transition: background 0.35s, color 0.35s;
          overflow-x: hidden;
        }
        /* ── NAV ─────────────────────────────── */
        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 clamp(20px, 5vw, 80px);
          height: 68px;
          background: ${dark ? 'rgba(7,16,30,0.85)' : 'rgba(238,242,248,0.9)'};
          backdrop-filter: blur(16px);
          border-bottom: 1px solid ${c.borderSub};
        }
        .nav-logo { display:flex; align-items:center; gap:12px; text-decoration:none; }
        .nav-logo img { width:44px; height:44px; border-radius:10px; }
        .nav-logo-name {
          font-size:20px; font-weight:900; letter-spacing:-0.03em;
          color:${c.text};
        }
        .nav-logo-name span { color:${c.green}; }
        .nav-right { display:flex; align-items:center; gap:12px; }
        .toggle {
          background: ${c.surface}; border: 1px solid ${c.borderSub};
          border-radius:100px; padding:7px 14px; font-size:13px;
          font-family:'Outfit',sans-serif; color:${c.muted}; cursor:pointer;
          transition:all 0.2s;
        }
        .toggle:hover { color:${c.text}; }
        .cta-nav {
          background:${c.green}; color:${c.btnTxt};
          border:none; border-radius:8px; padding:9px 18px;
          font-size:14px; font-weight:700; font-family:'Outfit',sans-serif;
          cursor:pointer; transition:all 0.2s;
        }
        .cta-nav:hover { opacity:0.85; }

        /* ── LAYOUT ──────────────────────────── */
        section { width:100%; padding: 0 clamp(20px, 5vw, 80px); }
        .inner { max-width:1100px; margin:0 auto; }

        /* ── HERO ────────────────────────────── */
        #hero {
          padding-top: 68px;
          min-height: 100vh;
          display:flex; align-items:center;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, ${c.glow} 0%, transparent 70%);
        }
        .hero-inner {
          display:grid; grid-template-columns:1fr 1fr; gap:60px;
          align-items:center; padding:80px 0;
        }
        .hero-badge {
          display:inline-flex; align-items:center; gap:8px;
          background:${c.greenBg}; border:1px solid ${c.greenBd};
          border-radius:100px; padding:7px 16px;
          font-size:12px; font-weight:700; color:${c.green};
          letter-spacing:0.1em; text-transform:uppercase; margin-bottom:20px;
        }
        .badge-dot {
          width:6px; height:6px; background:${c.green};
          border-radius:50%; animation:pulse 2s infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
        h1 {
          font-size:clamp(38px,4.5vw,62px); font-weight:900;
          line-height:1.0; letter-spacing:-0.04em; color:${c.text};
          margin-bottom:20px;
        }
        h1 em { color:${c.green}; font-style:normal; }
        .hero-sub {
          font-size:clamp(15px,1.5vw,18px); font-weight:300;
          color:${c.muted}; line-height:1.7; margin-bottom:32px;
          max-width:480px;
        }
        .btn-row { display:flex; gap:12px; flex-wrap:wrap; }
        .btn-primary {
          background:${c.green}; color:${c.btnTxt}; border:none;
          border-radius:10px; padding:14px 24px;
          font-size:15px; font-weight:700; font-family:'Outfit',sans-serif;
          cursor:pointer; transition:all 0.2s; letter-spacing:-0.01em;
        }
        .btn-primary:hover { opacity:0.85; transform:translateY(-1px); }
        .btn-secondary {
          background:transparent; color:${c.text};
          border:1px solid ${c.borderSub};
          border-radius:10px; padding:14px 24px;
          font-size:15px; font-weight:500; font-family:'Outfit',sans-serif;
          cursor:pointer; transition:all 0.2s;
        }
        .btn-secondary:hover { border-color:${c.green}; color:${c.green}; }

        /* Hero visual */
        .hero-visual {
          display:flex; flex-direction:column; gap:12px; position:relative;
        }
        .hero-card {
          background:${c.surface}; border:1px solid ${c.borderSub};
          border-radius:16px; padding:18px 20px;
        }
        .hero-card-label {
          font-size:11px; font-weight:700; text-transform:uppercase;
          letter-spacing:0.1em; color:${c.muted}; margin-bottom:8px;
        }
        .hero-card-value {
          font-size:28px; font-weight:900; letter-spacing:-0.03em; color:${c.text};
        }
        .hero-card-value span { color:${c.green}; }
        .hero-card-sub { font-size:13px; color:${c.muted}; margin-top:4px; }
        .hero-stats { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        .stat-mini {
          background:${c.bg2}; border:1px solid ${c.borderSub};
          border-radius:12px; padding:14px 16px;
        }
        .stat-mini-val { font-size:22px; font-weight:900; color:${c.text}; letter-spacing:-0.02em; }
        .stat-mini-val span { color:${c.green}; }
        .stat-mini-lbl { font-size:12px; color:${c.muted}; margin-top:2px; }

        /* ── VIDEOS ──────────────────────────── */
        #videos { padding-top:80px; padding-bottom:80px; }
        .videos-title { text-align:center; margin-bottom:10px; }
        .section-label {
          font-size:12px; font-weight:700; text-transform:uppercase;
          letter-spacing:0.15em; color:${c.green}; margin-bottom:12px;
        }
        h2 {
          font-size:clamp(28px,3vw,42px); font-weight:900;
          letter-spacing:-0.03em; color:${c.text}; margin-bottom:12px;
        }
        .section-sub {
          font-size:16px; font-weight:300; color:${c.muted};
          line-height:1.7; max-width:520px; margin:0 auto 48px;
        }
        .video-grid {
          display:grid; grid-template-columns:repeat(3,1fr); gap:14px;
        }
        .video-slot {
          aspect-ratio:9/16; border-radius:18px; overflow:hidden;
          background:${c.surface}; border:1px solid ${c.borderSub};
          position:relative;
        }
        .video-slot video { width:100%; height:100%; object-fit:cover; display:block; }
        .video-overlay {
          position:absolute; inset:0; display:flex; align-items:flex-end; padding:16px;
          background:linear-gradient(to top, ${dark?'rgba(7,16,30,0.7)':'rgba(27,43,75,0.4)'} 0%, transparent 60%);
        }
        .video-tag {
          background:${c.greenBg}; border:1px solid ${c.greenBd};
          border-radius:100px; padding:5px 12px; font-size:12px;
          font-weight:700; color:${c.green};
        }

        /* ── EMPATÍA ─────────────────────────── */
        #empatia { padding-top:80px; padding-bottom:80px; background:${c.bg2}; }
        .empatia-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
        .empatia-quote {
          font-size:clamp(24px,3vw,38px); font-weight:900;
          letter-spacing:-0.03em; line-height:1.1; color:${c.text};
          margin-bottom:20px;
        }
        .empatia-quote em { color:${c.green}; font-style:normal; }
        .empatia-body { font-size:16px; font-weight:300; color:${c.muted}; line-height:1.8; }
        .negocios-list {
          display:flex; flex-wrap:wrap; gap:8px;
        }
        .negocio-chip {
          background:${c.surface}; border:1px solid ${c.borderSub};
          border-radius:100px; padding:8px 16px; font-size:13px;
          font-weight:500; color:${c.text};
        }

        /* ── SERVICIOS ───────────────────────── */
        #servicios { padding-top:80px; padding-bottom:80px; }
        .servicios-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .servicio-card {
          background:${c.surface}; border:1px solid ${c.borderSub};
          border-radius:18px; padding:28px 24px;
          transition:border-color 0.2s;
        }
        .servicio-card:hover { border-color:${c.green}; }
        .servicio-icon { font-size:32px; margin-bottom:16px; }
        .servicio-title {
          font-size:17px; font-weight:700; color:${c.text};
          margin-bottom:8px; letter-spacing:-0.02em;
        }
        .servicio-desc { font-size:14px; font-weight:300; color:${c.muted}; line-height:1.6; }

        /* ── COUNTDOWN ───────────────────────── */
        #cuenta { padding-top:80px; padding-bottom:80px; background:${c.bg2}; text-align:center; }
        .countdown { display:flex; align-items:flex-start; gap:10px; justify-content:center; margin:40px 0; }
        .cnt-item { display:flex; flex-direction:column; align-items:center; gap:6px; }
        .cnt-num {
          font-size:clamp(36px,5vw,56px); font-weight:900; color:${c.text};
          letter-spacing:-0.04em; line-height:1;
          background:${c.surface}; border:1px solid ${c.borderSub};
          border-radius:14px; padding:16px 12px; min-width:80px; text-align:center;
        }
        .cnt-lbl {
          font-size:11px; font-weight:700; letter-spacing:0.1em;
          text-transform:uppercase; color:${c.muted};
        }
        .cnt-sep {
          font-size:42px; font-weight:900; color:${c.green};
          opacity:0.4; padding-top:16px;
        }

        /* ── FORM ────────────────────────────── */
        #lista { padding-top:80px; padding-bottom:80px; }
        .form-wrap { max-width:560px; margin:0 auto; }
        .form-card {
          background:${c.surface}; border:1px solid ${c.border};
          border-radius:24px; padding:36px;
        }
        .form-input {
          background:${c.inputBg}; border:1px solid ${c.inputBd};
          border-radius:10px; padding:13px 16px;
          color:${c.text}; font-family:'Outfit',sans-serif;
          font-size:15px; width:100%; outline:none;
          transition:border-color 0.2s; margin-bottom:10px; display:block;
        }
        .form-input:focus { border-color:${dark?'rgba(34,197,94,0.4)':'rgba(22,163,74,0.4)'}; }
        .form-input::placeholder { color:${c.muted}; }
        .form-btn {
          width:100%; background:${c.green}; color:${c.btnTxt};
          border:none; border-radius:10px; padding:15px;
          font-size:16px; font-weight:900; font-family:'Outfit',sans-serif;
          cursor:pointer; transition:all 0.2s; letter-spacing:-0.01em; margin-top:4px;
        }
        .form-btn:hover { opacity:0.85; transform:translateY(-1px); }
        .form-btn:disabled { opacity:0.5; cursor:default; transform:none; }
        .form-err {
          background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
          border-radius:8px; padding:10px 14px; font-size:13px; color:#ef4444; margin-bottom:10px;
        }
        .success-box { text-align:center; padding:20px 0; }
        .success-logo { width:72px; height:72px; border-radius:16px; margin:0 auto 16px; display:block; }
        .success-title { font-size:22px; font-weight:900; color:${c.green}; margin-bottom:8px; letter-spacing:-0.02em; }
        .success-sub { font-size:14px; font-weight:300; color:${c.muted}; line-height:1.6; }

        /* ── FOOTER ──────────────────────────── */
        footer {
          border-top:1px solid ${c.borderSub};
          padding:28px clamp(20px,5vw,80px);
          display:flex; align-items:center; justify-content:space-between;
          flex-wrap:wrap; gap:12px;
        }
        .footer-logo { display:flex; align-items:center; gap:10px; }
        .footer-logo img { width:30px; height:30px; border-radius:7px; }
        .footer-logo span { font-size:15px; font-weight:900; color:${c.text}; letter-spacing:-0.02em; }
        .footer-txt { font-size:13px; font-weight:300; color:${c.muted}; }
        .footer-txt a { color:${c.green}; text-decoration:none; }

        /* ── RESPONSIVE ──────────────────────── */
        @media (max-width:768px) {
          .hero-inner { grid-template-columns:1fr; gap:40px; padding:60px 0; }
          .hero-visual { display:none; }
          .empatia-grid { grid-template-columns:1fr; gap:32px; }
          .servicios-grid { grid-template-columns:1fr 1fr; }
          .video-grid { grid-template-columns:repeat(3,1fr); gap:8px; }
          .btn-row { flex-direction:column; }
          .btn-primary, .btn-secondary { width:100%; text-align:center; }
          footer { flex-direction:column; align-items:flex-start; }
          .cnt-num { font-size:28px; min-width:60px; padding:12px 8px; }
        }
        @media (max-width:480px) {
          .servicios-grid { grid-template-columns:1fr; }
          .video-grid { gap:6px; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#">
          <img src="/CENTRA.png" alt="Centra" />
          <span className="nav-logo-name">CENTRA</span>
        </a>
        <div className="nav-right">
          <button className="toggle" onClick={() => setDark(!dark)}>
            {dark ? '☀ Claro' : '☾ Oscuro'}
          </button>
          <button className="cta-nav" onClick={() => document.getElementById('lista')?.scrollIntoView({behavior:'smooth'})}>
            Quiero saber más
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero">
        <div className="inner hero-inner">
          <div>
            <div className="hero-badge">
              <div className="badge-dot" />
              Próximamente · Verano 2026
            </div>
            <h1>
              ¿Sientes que tu negocio <em>te controla</em> a ti?
            </h1>
            <p className="hero-sub">
              Centra te ayuda a tener más control de tus ventas, inventario y caja — sin complicaciones, sin gastar como una gran empresa.
            </p>
            <div className="btn-row">
              <button className="btn-primary" onClick={() => document.getElementById('lista')?.scrollIntoView({behavior:'smooth'})}>
                Quiero ordenar mi negocio →
              </button>
              <button className="btn-secondary" onClick={() => document.getElementById('servicios')?.scrollIntoView({behavior:'smooth'})}>
                Ver cómo funciona
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-label">Ventas de hoy</div>
              <div className="hero-card-value"><span>$12,840</span></div>
              <div className="hero-card-sub">↑ 18% vs ayer · 47 tickets</div>
            </div>
            <div className="hero-stats">
              <div className="stat-mini">
                <div className="stat-mini-val"><span>98</span></div>
                <div className="stat-mini-lbl">Productos en stock</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-val"><span>$0</span></div>
                <div className="stat-mini-lbl">Diferencia en caja</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-val"><span>32%</span></div>
                <div className="stat-mini-lbl">Margen promedio</div>
              </div>
              <div className="stat-mini">
                <div className="stat-mini-val"><span>3</span></div>
                <div className="stat-mini-lbl">Alertas activas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos">
        <div className="inner">
          <div className="videos-title">
            <div className="section-label">Centra en acción</div>
            <h2>Míralo tú mismo</h2>
            <p className="section-sub">Simple como debe ser. Sin cursos, sin manuales.</p>
          </div>
          <div className="video-grid">
            {[
              { file: 'video1.mp4', tag: 'El problema' },
              { file: 'video2.mp4', tag: 'La solución' },
              { file: 'video3.mp4', tag: 'Tu negocio' },
            ].map((v, i) => (
              <div key={i} className="video-slot">
                <video autoPlay muted loop playsInline preload="auto">
                  <source src={`/${v.file}`} type="video/mp4" />
                </video>
                <div className="video-overlay">
                  <span className="video-tag">{v.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EMPATÍA */}
      <section id="empatia">
        <div className="inner">
          <div className="empatia-grid">
            <div>
              <div className="section-label">Te entendemos</div>
              <div className="empatia-quote">
                Sabemos lo difícil que es<br />llevar un <em>negocio</em>
              </div>
            </div>
            <div>
              <p className="empatia-body" style={{marginBottom:28}}>
                Muchos pequeños negocios trabajan con libretas, notas o Excel y terminan perdiendo tiempo, dinero y control. Centra nace para ayudarte a tener orden, sin gastar como una gran empresa.
              </p>
              <div className="negocios-list">
                {['🛒 Abarrotes','☕ Cafeterías','🍗 Rosticerías','📎 Papelerías','🔧 Ferreterías','✂️ Estéticas','🔩 Talleres','🧁 Panaderías','👕 Ropa','🌮 Taquerías'].map(n => (
                  <span key={n} className="negocio-chip">{n}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios">
        <div className="inner">
          <div style={{textAlign:'center'}}>
            <div className="section-label">¿Qué hace Centra?</div>
            <h2>Menos caos, más control</h2>
            <p className="section-sub">Todo lo que necesitas para ordenar tu negocio, en un solo lugar.</p>
          </div>
          <div className="servicios-grid">
            {[
              { icon:'🏷️', title:'Control de ventas', desc:'Conoce cuánto vendes realmente. Cada ticket, cada forma de pago, cada día.' },
              { icon:'📦', title:'Inventario inteligente', desc:'Evita pérdidas y faltantes. Centra te avisa antes de que se te acabe.' },
              { icon:'💰', title:'Caja y gastos', desc:'Entiende en qué se va tu dinero. Corte exacto al final del día.' },
              { icon:'🛒', title:'Compras y proveedores', desc:'Registra pedidos y recepciones. Nunca pierdas de vista lo que debes.' },
              { icon:'📊', title:'Dashboard diario', desc:'Abre Centra cada mañana y sabe en segundos cómo está tu negocio.' },
              { icon:'📱', title:'Desde tu celular', desc:'Funciona en cualquier celular. Sin instalar nada. Siempre contigo.' },
            ].map(s => (
              <div key={s.title} className="servicio-card">
                <div className="servicio-icon">{s.icon}</div>
                <div className="servicio-title">{s.title}</div>
                <div className="servicio-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUNTDOWN */}
      <section id="cuenta">
        <div className="inner">
          <div className="section-label">El lanzamiento se acerca</div>
          <h2>Llega el 1 de julio</h2>
          <p className="section-sub">Ordena tu negocio desde este verano.</p>
          <div className="countdown">
            {[
              {num: pad(timeLeft.dias), lbl:'Días'},
              {sep:':'},
              {num: pad(timeLeft.horas), lbl:'Horas'},
              {sep:':'},
              {num: pad(timeLeft.minutos), lbl:'Minutos'},
              {sep:':'},
              {num: pad(timeLeft.segundos), lbl:'Segundos'},
            ].map((item:any, i) => item.sep
              ? <div key={i} className="cnt-sep">{item.sep}</div>
              : <div key={i} className="cnt-item">
                  <div className="cnt-num">{item.num}</div>
                  <div className="cnt-lbl">{item.lbl}</div>
                </div>
            )}
          </div>
        </div>
      </section>

      {/* FORM */}
      <section id="lista">
        <div className="inner">
          <div className="form-wrap">
            <div style={{textAlign:'center', marginBottom:28}}>
              <div className="section-label">Lista de espera</div>
              <h2>Sé de los primeros</h2>
              <p className="section-sub" style={{margin:'12px auto 0'}}>
                Te avisamos el día que lancemos. Sin spam, prometido.
              </p>
            </div>
            <div className="form-card">
              {enviado ? (
                <div className="success-box">
                  <img src="/CENTRA.png" alt="Centra" className="success-logo" />
                  <div className="success-title">¡Ya estás en la lista!</div>
                  <div className="success-sub">
                    Gracias {form.nombre}.<br />
                    Te contactaremos cuando Centra esté listo.<br />
                    Serás de los primeros en probarlo.
                  </div>
                </div>
              ) : (
                <>
                  {error && <div className="form-err">{error}</div>}
                  <input className="form-input" placeholder="Tu nombre" value={form.nombre} onChange={e => setForm(f=>({...f,nombre:e.target.value}))} />
                  <input className="form-input" type="email" placeholder="Tu correo electrónico" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} />
                  <input className="form-input" placeholder="Tu WhatsApp (con lada, ej: 5512345678)" value={form.whatsapp} onChange={e => setForm(f=>({...f,whatsapp:e.target.value}))} />
                  <button className="form-btn" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Guardando...' : 'Quiero ordenar mi negocio →'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          <img src="/CENTRA.png" alt="Centra" />
          <span>CENTRA</span>
        </div>
        <div className="footer-txt">
          © 2026 Centra · <a href="mailto:crt.centra@gmail.com">centra@centratunegocio.com</a>
        </div>
        <div className="footer-txt">centratunegocio.com</div>
      </footer>
    </>
  )
}
