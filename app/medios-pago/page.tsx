'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const tipos = ['Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencia']

const empty = { tipo: 'Efectivo', nombre: '', banco: '', ultimos_4_digitos: '', clabe: '', comision_porcentaje: 0, activo: true }

export default function MediosPago() {
  const [medios, setMedios] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const { data } = await createClient().from('medios_pago').select('*').eq('negocio_id', nid).order('created_at')
    setMedios(data || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  async function guardar() {
    if (!form.nombre || !negocioId) return
    setLoading(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('medios_pago').update({ ...form }).eq('id', editId)
    } else {
      await supabase.from('medios_pago').insert({ ...form, negocio_id: negocioId })
    }
    await cargar(negocioId)
    setForm(empty); setEditId(null); setShowForm(false); setLoading(false)
  }

  async function toggleActivo(id: string, activo: boolean) {
    await createClient().from('medios_pago').update({ activo: !activo }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  function editar(m: any) {
    setForm({ tipo: m.tipo, nombre: m.nombre, banco: m.banco || '', ultimos_4_digitos: m.ultimos_4_digitos || '', clabe: m.clabe || '', comision_porcentaje: m.comision_porcentaje, activo: m.activo })
    setEditId(m.id); setShowForm(true)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>💳 Medios de Pago</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Configura cómo recibes dinero</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }}>+ Nuevo Medio</button>
        </div>

        <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          💡 Solo activa los medios que usas. Solo esos aparecerán en el módulo de Ventas.
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Tipo</th><th>Nombre</th><th>Banco</th><th>Comisión</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {medios.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
                  <div style={{ fontWeight: 600 }}>Sin medios de pago — agrega al menos Efectivo</div>
                </td></tr>
              ) : medios.map(m => (
                <tr key={m.id}>
                  <td><span className="badge badge-blue">{m.tipo}</span></td>
                  <td style={{ fontWeight: 600 }}>{m.nombre}</td>
                  <td>{m.banco || '—'}</td>
                  <td>{m.comision_porcentaje > 0 ? `${m.comision_porcentaje}%` : '—'}</td>
                  <td>
                    <span className={`badge ${m.activo ? 'badge-green' : 'badge-red'}`}>
                      {m.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => editar(m)} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: 13 }}>Editar</button>
                      <button onClick={() => toggleActivo(m.id, m.activo)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>
                        {m.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="card">
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>{editId ? 'Editar' : 'Nuevo'} Medio de Pago</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Tipo *</label>
                <select className="select" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                  {tipos.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Nombre *</label>
                <input className="input" placeholder="Ej: Caja principal, Terminal Banamex" value={form.nombre} onChange={e => set('nombre', e.target.value)} />
              </div>
              <div>
                <label className="label">Banco</label>
                <input className="input" placeholder="Nombre del banco" value={form.banco} onChange={e => set('banco', e.target.value)} />
              </div>
              <div>
                <label className="label">Últimos 4 dígitos</label>
                <input className="input" placeholder="1234" maxLength={4} value={form.ultimos_4_digitos} onChange={e => set('ultimos_4_digitos', e.target.value)} />
              </div>
              <div>
                <label className="label">CLABE (transferencias)</label>
                <input className="input" placeholder="18 dígitos" value={form.clabe} onChange={e => set('clabe', e.target.value)} />
              </div>
              <div>
                <label className="label">Comisión %</label>
                <input className="input" type="number" step="0.01" placeholder="0.00" value={form.comision_porcentaje} onChange={e => set('comision_porcentaje', parseFloat(e.target.value) || 0)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
              <button className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null); setForm(empty) }}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
