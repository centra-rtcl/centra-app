import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 30%, #0d2a1a 0%, var(--bg) 60%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <Image
          src="/CENTRA.png"
          alt="Centra"
          width={140}
          height={140}
          style={{ margin: '0 auto 24px' }}
        />
        <h1 style={{
          fontFamily: 'Syne',
          fontSize: 56,
          fontWeight: 800,
          color: 'var(--text)',
          margin: '0 0 8px',
          letterSpacing: '-0.02em'
        }}>
          CENTRA
        </h1>
        <p style={{ color: 'var(--green)', fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
          Control total de tu negocio
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, marginBottom: 40, lineHeight: 1.6 }}>
          Mini ERP diseñado para micro y pequeñas empresas.<br />
          Simple, rápido y con inteligencia real.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{
            background: 'var(--green)',
            color: '#000',
            padding: '14px 32px',
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 16,
            textDecoration: 'none',
            fontFamily: 'Syne',
            transition: 'all 0.2s',
          }}>
            Entrar al sistema →
          </Link>
        </div>

        <div style={{
          marginTop: 48,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {[
            { icon: '📊', label: 'Dashboard inteligente' },
            { icon: '💰', label: 'Control de caja' },
            { icon: '📦', label: 'Inventario automático' },
          ].map(f => (
            <div key={f.label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '16px 12px',
              fontSize: 13,
              color: 'var(--text-muted)',
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              {f.label}
            </div>
          ))}
        </div>

        <p style={{ marginTop: 32, fontSize: 13, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--green)', fontWeight: 700 }}>$175 MXN/mes</span> · Todo incluido · Sin contratos
        </p>
      </div>
    </main>
  )
}
