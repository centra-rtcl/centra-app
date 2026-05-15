'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const empty = { nombre: '', rfc: '', correo: '', telefono: '', direccion_entrega: '', requiere_factura: false, maneja_credito: false, dias_credito: 30, limite_credito: 0, notas: '', activo: true }

export default function Clientes() {
  const [clientes, setClientes] = useState<any[]>([])
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
    const { data } = await createClient().from('clientes').select('*').eq('negocio_id', nid).order('nombre')
    setClientes(data || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  async function guardar() {
    if (!form.nombre || !negocioId) return
    setLoading(true)
    const supabase = createClient()
    if (editId) {
      await supabase.from('clientes').update({ ...form }).eq('id', editId)
    } else {
      await supabase.from('clientes').insert({ ...form, negocio_id: negocioId, es_publico_general: false, saldo_credito: 0, cliente_desde: new Date().toISOString().split('T')[0] })
    }
    await cargar(negocioId)
    setForm(empty); setEditId(null); setShowForm(false); setLoading(false)
  }

  async function toggleActivo(id: string, activo: boolean) {
    await createClient().from('clientes').update({ activo: !activo }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  function editar(c: any) {
    if (c.es_publico_general) return
    setForm({ nombre: c.nombre, rfc: c.rfc||'', correo: c.correo||'', telefono: c.telefono||'', direccion_entrega: c.direccion_entrega||'', requiere_factura: c.requiere_factura, maneja_credito: c.maneja_credito, dias_credito: c.dias_credito||30, limite_credito: c.limite_credito||0, notas: c.notas||'', activo: c.activo })
    setEditId(c.id); setShowForm(true)
  }

  const filtrados = clientes.filter(c => c.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>👥 Clientes</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>{clientes.length} clientes registrados</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }}>+ Nuevo Cliente</button>
        </div>

        <input className="input" placeholder="Buscar cliente..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ maxWidth: 400, marginBottom: 20 }} />

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Nombre</th><th>RFC</th><th>Teléfono</th><th>Factura</th><th>Crédito</th><th>Saldo</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                  <div style={{ fontWeight: 600 }}>Sin clientes registrados</div>
                </td></tr>
              ) : filtrados.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.nombre}</div>
                    {c.es_publico_general && <span className="badge badge-blue" style={{ fontSize: 10 }}>Default</span>}
                  </td>
                  <td>{c.rfc || '—'}</td>
                  <td>{c.telefono || '—'}</td>
                  <td>{c.requiere_factura ? <span className="badge badge-yellow">Sí</span> : '—'}</td>
                  <td>{c.maneja_credito ? <span className="badge badge-green">{c.dias_credito}d</span> : '—'}</td>
                  <td style={{ color: c.saldo_credito > 0 ? '#ef4444' : 'var(--text-muted)' }}>{c.saldo_credito > 0 ? fmt(c.saldo_credito) : '—'}</td>
                  <td><span className={`badge ${c.activo ? 'badge-green' : 'badge-red'}`}>{c.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    {!c.es_publico_general && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => editar(c)} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: 13 }}>Editar</button>
                        <button onClick={() => toggleActivo(c.id, c.activo)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>{c.activo ? 'Desactivar' : 'Activar'}</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="card">
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>{editId ? 'Editar' : 'Nuevo'} Cliente</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[['nombre','Nombre / Razón Social *','Nombre del cliente'],['rfc','RFC','RFC (si factura)'],['correo','Correo','correo@cliente.com'],['telefono','Teléfono','55 1234 5678'],['direccion_entrega','Dirección de entrega','Si aplica domicilio']].map(([f,l,p]) => (
                <div key={f}><label className="label">{l}</label><input className="input" placeholder={p} value={form[f]} onChange={e => set(f, e.target.value)} /></div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label className="label">¿Requiere factura?</label>
                <select className="select" value={form.requiere_factura?'si':'no'} onChange={e => set('requiere_factura', e.target.value==='si')}>
                  <option value="no">No</option><option value="si">Sí</option>
                </select>
              </div>
              <div>
                <label className="label">¿Maneja crédito?</label>
                <select className="select" value={form.maneja_credito?'si':'no'} onChange={e => set('maneja_credito', e.target.value==='si')}>
                  <option value="no">No</option><option value="si">Sí</option>
                </select>
              </div>
              {form.maneja_credito && <>
                <div><label className="label">Días de crédito</label><select className="select" value={form.dias_credito} onChange={e => set('dias_credito', parseInt(e.target.value))}>{[15,30,60,90].map(d=><option key={d} value={d}>{d} días</option>)}</select></div>
                <div><label className="label">Límite ($)</label><input className="input" type="number" value={form.limite_credito} onChange={e => set('limite_credito', parseFloat(e.target.value)||0)} /></div>
              </>}
            </div>

            <div style={{ marginTop: 16 }}><label className="label">Notas</label><input className="input" placeholder="Observaciones" value={form.notas} onChange={e => set('notas', e.target.value)} /></div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cliente'}</button>
              <button className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null) }}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
