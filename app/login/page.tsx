'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase-client'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos')
      setLoading(false)
    } else {
      router.push('/seleccion-negocio')
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 30%, #0d2a1a 0%, var(--bg) 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/CENTRA.png" alt="Centra" width={80} height={80} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Bienvenido
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Inicia sesión en tu cuenta Centra</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32 }}>
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#ef4444'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label className="label">Correo electrónico</label>
            <input
              className="input"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>

          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 10, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link href="/registro" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
