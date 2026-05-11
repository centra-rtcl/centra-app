'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/app/lib/supabase-client'

const giros = [
  'Abarrotes', 'Ferretería', 'Papelería', 'Farmacia', 'Ropa y calzado',
  'Taquería / Comida', 'Carnicería', 'Panadería', 'Tortillería', 'Lavandería',
  'Estética / Salón', 'Taller mecánico', 'Electrónica', 'Joyería', 'Otro'
]

export default function Registro() {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', email: '', telefono: '', password: '', confirmar: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleRegistro() {
    setError('')
    if (!form.nombre || !form.email || !form.password) {
      setError('Nombre, correo y contraseña son obligatorios')
      return
    }
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { nombre_completo: form.nombre } }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('usuarios').insert({
        auth_id: data.user.id,
        email: form.email,
        nombre_completo: form.nombre,
        telefono: form.telefono,
        estado_plan: 'Free',
      })
    }

    setEnviado(true)
    setLoading(false)
  }

  // Pantalla de confirmación enviada
  if (enviado) {
    return (
      <main style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 60% 30%, #0d2a1a 0%, var(--bg) 60%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
      }}>
        <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
          <Image src="/CENTRA.png" alt="Centra" width={80} height={80} style={{ margin: '0 auto 24px' }} />

          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 40
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontFamily: 'Syne', fontSize: 24, fontWeight: 800, margin: '0 0 12px', color: 'var(--text)' }}>
              Revisa tu correo
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
              Enviamos un enlace de confirmación a:
            </p>
            <p style={{ color: 'var(--green)', fontWeight: 700, fontSize: 15, marginBottom: 24 }}>
              {form.email}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 32 }}>
              Abre el correo y haz click en el enlace para activar tu cuenta. Luego regresa aquí para iniciar sesión.
            </p>

            <button
              className="btn-primary"
              onClick={() => router.push('/login')}
              style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 10 }}
            >
              Ir al login →
            </button>

            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
              ¿No llegó el correo? Revisa tu carpeta de spam
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 30%, #0d2a1a 0%, var(--bg) 60%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/CENTRA.png" alt="Centra" width={80} height={80} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Crea tu cuenta
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>90 días gratis · Sin tarjeta requerida</p>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Nombre completo *</label>
              <input className="input" placeholder="Tu nombre" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
            </div>
            <div>
              <label className="label">Correo electrónico *</label>
              <input className="input" type="email" placeholder="tu@correo.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input className="input" placeholder="55 1234 5678" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
            </div>
            <div>
              <label className="label">Contraseña *</label>
              <input className="input" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
            <div>
              <label className="label">Confirmar contraseña *</label>
              <input className="input" type="password" placeholder="Repite tu contraseña" value={form.confirmar} onChange={e => set('confirmar', e.target.value)} />
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleRegistro}
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: 15, borderRadius: 10, marginTop: 24, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta gratis →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" style={{ color: 'var(--green)', fontWeight: 600, textDecoration: 'none' }}>
              Inicia sesión
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          Al registrarte aceptas los términos de servicio de Centra
        </p>
      </div>
    </main>
  )
}
