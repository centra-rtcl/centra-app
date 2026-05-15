'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const empty = { nombre: '', rfc: '', correo: '', telefono: '', persona_contacto: '', direccion: '', maneja_credito: false, dias_credito: 30, limite_credito: 0, maneja_consigna: false, condiciones_consigna: '', notas: '', activo: true }

export default function Proveedores() {
  const [proveedores, setProveedores] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const { data } = await createClient().from('proveedores').select('*').eq('negocio_id', nid).order('nombre')
    setProveedores(data || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  async function guardar() {
    if (!form.nombre || !negocioId) return
    setLoading(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('proveedores').update({ ...form }).eq('id', editId)
    } else {
      await supabase.from('proveedores').insert({ ...form, negocio_id: negocioId })
    }
    await cargar(negocioId)
    setForm(empty); setEditId(null); setShowForm(false); setLoading(false)
  }

  async function toggleActivo(id: string, activo: boolean) {
    await createClient().from('proveedores').update({ activo: !activo }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  function editar(p: any) {
    setForm({ nombre: p.nombre, rfc: p.rfc||'', correo: p.correo||'', telefono: p.telefono||'', persona_contacto: p.persona_contacto||'', direccion: p.direccion||'', maneja_credito: p.maneja_credito, dias_credito: p.dias_credito||30, limite_credito: p.limite_credito||0, maneja_consigna: p.maneja_consigna, condiciones_consigna: p.condiciones_consigna||'', notas: p.notas||'', activo: p.activo })
    setEditId(p.id); setShowForm(true)
  }

  const filtrados = proveedores.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.rfc||'').toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🏭 Proveedores</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>{proveedores.length} proveedores registrados</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }}>+ Nuevo Proveedor</button>
        </div>

        <input className="input" placeholder="Buscar por nombre o RFC..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ maxWidth: 400, marginBottom: 20 }} />

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Nombre</th><th>RFC</th><th>Teléfono</th><th>Crédito</th><th>Consigna</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🏭</div>
                  <div style={{ fontWeight: 600 }}>Sin proveedores registrados</div>
                </td></tr>
              ) : filtrados.map(p => (
                <tr key={p.id}>
                  <td><div style={{ fontWeight: 600 }}>{p.nombre}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.persona_contacto}</div></td>
                  <td>{p.rfc || '—'}</td>
                  <td>{p.telefono || '—'}</td>
                  <td>{p.maneja_credito ? <span className="badge badge-green">{p.dias_credito} días</span> : '—'}</td>
                  <td>{p.maneja_consigna ? <span className="badge badge-yellow">Sí</span> : '—'}</td>
                  <td><span className={`badge ${p.activo ? 'badge-green' : 'badge-red'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => editar(p)} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: 13 }}>Editar</button>
                      <button onClick={() => toggleActivo(p.id, p.activo)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>{p.activo ? 'Desactivar' : 'Activar'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="card">
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>{editId ? 'Editar' : 'Nuevo'} Proveedor</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['nombre', 'Nombre / Razón Social *', 'Nombre del proveedor'],
                ['rfc', 'RFC', 'RFC del proveedor'],
                ['correo', 'Correo', 'correo@proveedor.com'],
                ['telefono', 'Teléfono', '55 1234 5678'],
                ['persona_contacto', 'Persona de contacto', 'Nombre del representante'],
                ['direccion', 'Dirección', 'Domicilio del proveedor'],
              ].map(([field, label, placeholder]) => (
                <div key={field}>
                  <label className="label">{label}</label>
                  <input className="input" placeholder={placeholder} value={form[field]} onChange={e => set(field, e.target.value)} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label className="label">¿Maneja crédito?</label>
                <select className="select" value={form.maneja_credito ? 'si' : 'no'} onChange={e => set('maneja_credito', e.target.value === 'si')}>
                  <option value="no">No</option><option value="si">Sí</option>
                </select>
              </div>
              {form.maneja_credito && <>
                <div>
                  <label className="label">Días de crédito</label>
                  <select className="select" value={form.dias_credito} onChange={e => set('dias_credito', parseInt(e.target.value))}>
                    {[15,30,60,90].map(d => <option key={d} value={d}>{d} días</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Límite de crédito ($)</label>
                  <input className="input" type="number" value={form.limite_credito} onChange={e => set('limite_credito', parseFloat(e.target.value)||0)} />
                </div>
              </>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label className="label">¿Maneja consigna?</label>
                <select className="select" value={form.maneja_consigna ? 'si' : 'no'} onChange={e => set('maneja_consigna', e.target.value === 'si')}>
                  <option value="no">No</option><option value="si">Sí</option>
                </select>
              </div>
              {form.maneja_consigna && <div>
                <label className="label">Condiciones de consigna</label>
                <input className="input" placeholder="Descripción de condiciones" value={form.condiciones_consigna} onChange={e => set('condiciones_consigna', e.target.value)} />
              </div>}
            </div>

            <div style={{ marginTop: 16 }}>
              <label className="label">Notas</label>
              <input className="input" placeholder="Observaciones adicionales" value={form.notas} onChange={e => set('notas', e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Proveedor'}</button>
              <button className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null) }}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
