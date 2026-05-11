'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/app/lib/supabase-client'

const giros = [
  'Abarrotes', 'Ferretería', 'Papelería', 'Farmacia', 'Ropa y calzado',
  'Taquería / Comida', 'Carnicería', 'Panadería', 'Tortillería', 'Lavandería',
  'Estética / Salón', 'Taller mecánico', 'Electrónica', 'Joyería', 'Otro'
]

export default function NuevoNegocio() {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', giro: '', telefono: '', correo: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleCrear() {
    setError('')
    if (!form.nombre || !form.giro) {
      setError('Nombre y giro son obligatorios')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data: usuarioData } = await supabase
      .from('usuarios').select('id').eq('auth_id', user.id).single()

    if (!usuarioData) { setError('Error al obtener usuario'); setLoading(false); return }

    const { error: negocioError } = await supabase.from('negocios').insert({
      usuario_id: usuarioData.id,
      nombre: form.nombre,
      giro: form.giro,
      telefono: form.telefono,
      correo: form.correo,
      activo: true,
    })

    if (negocioError) {
      setError('Error al crear el negocio')
      setLoading(false)
      return
    }

    router.push('/seleccion-negocio')
  }

  return (
    <main style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/CENTRA.png" alt="Centra" width={64} height={64} style={{ margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'Syne', fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>
            Crea tu negocio
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Configura tu primer negocio en Centra</p>
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
              <label className="label">Nombre del negocio *</label>
              <input className="input" placeholder="Ej: Abarrotes La Fe" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
            </div>
            <div>
              <label className="label">Giro del negocio *</label>
              <select className="select" value={form.giro} onChange={e => set('giro', e.target.value)}>
                <option value="">Selecciona el giro</option>
                {giros.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Teléfono del negocio</label>
              <input className="input" placeholder="55 1234 5678" value={form.telefono} onChange={e => set('telefono', e.target.value)} />
            </div>
            <div>
              <label className="label">Correo del negocio</label>
              <input className="input" type="email" placeholder="contacto@minegocio.com" value={form.correo} onChange={e => set('correo', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              className="btn-primary"
              onClick={handleCrear}
              disabled={loading}
              style={{ flex: 1, padding: '14px', fontSize: 15, borderRadius: 10, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Creando...' : 'Crear negocio →'}
            </button>
            <button className="btn-secondary" onClick={() => router.push('/seleccion-negocio')} style={{ padding: '14px 20px', borderRadius: 10 }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
