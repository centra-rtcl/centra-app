'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/app/lib/supabase-client'

interface Negocio {
  id: string
  nombre: string
  giro: string
  logo_url: string | null
}

export default function SeleccionNegocio() {
  const router = useRouter()
  const [negocios, setNegocios] = useState<Negocio[]>([])
  const [usuario, setUsuario] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargar() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', user.id)
        .single()

      setUsuario(usuarioData)

      if (usuarioData) {
        const { data: negociosData } = await supabase
          .from('negocios')
          .select('*')
          .eq('usuario_id', usuarioData.id)
          .eq('activo', true)
        setNegocios(negociosData || [])
      }
      setLoading(false)
    }
    cargar()
  }, [])

  async function seleccionar(negocioId: string) {
    localStorage.setItem('negocio_id', negocioId)
    router.push('/dashboard')
  }

  async function cerrarSesion() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Cargando...</div>
    </main>
  )

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg)', padding: 32 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image src="/CENTRA.png" alt="Centra" width={40} height={40} />
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 18, color: 'var(--text)' }}>CENTRA</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{usuario?.nombre_completo}</div>
            </div>
          </div>
          <button className="btn-secondary" onClick={cerrarSesion} style={{ fontSize: 13 }}>
            Cerrar sesión
          </button>
        </div>

        {/* Título */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: 32, fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            ¿A qué negocio entras?
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Selecciona o crea un negocio para continuar</p>
        </div>

        {/* Grid de negocios */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>

          {negocios.map(n => (
            <button
              key={n.id}
              onClick={() => seleccionar(n.id)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 16, padding: 24, cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 12,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--green)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <div style={{
                width: 64, height: 64, borderRadius: 12,
                background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28
              }}>
                🏪
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 4 }}>{n.nombre}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{n.giro}</div>
              </div>
            </button>
          ))}

          {/* Botón agregar negocio */}
          <button
            onClick={() => router.push('/nuevo-negocio')}
            style={{
              background: 'transparent', border: '2px dashed var(--border)',
              borderRadius: 16, padding: 24, cursor: 'pointer', textAlign: 'center',
              transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12, color: 'var(--text-muted)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <div style={{ fontSize: 32 }}>+</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Agregar negocio</div>
          </button>
        </div>

        {/* Plan info */}
        <div style={{
          marginTop: 48, padding: '16px 20px',
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 10, fontSize: 13, color: 'var(--text-muted)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <span>Plan actual: <strong style={{ color: 'var(--green)' }}>Free — 90 días</strong></span>
          <span>{negocios.length} / 1 negocio</span>
        </div>
      </div>
    </main>
  )
}
