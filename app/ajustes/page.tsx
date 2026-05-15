'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const tipos = ['Daño', 'Merma', 'Caducidad', 'Robo', 'Uso interno', 'Diferencia en conteo']
const empty = { tipo_ajuste: 'Daño', producto_id: '', cantidad: 1, razon: '', estado: 'Pendiente' }

export default function Ajustes() {
  const [ajustes, setAjustes] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const supabase = createClient()
    const [{ data: ajs }, { data: prods }] = await Promise.all([
      supabase.from('ajustes_inventario').select('*, productos(nombre, precio_compra)').eq('negocio_id', nid).order('created_at', { ascending: false }),
      supabase.from('productos').select('id,nombre,precio_compra,stock_actual').eq('negocio_id', nid).eq('activo', true),
    ])
    setAjustes(ajs || [])
    setProductos(prods || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  const productoSeleccionado = productos.find(p => p.id === form.producto_id)
  const costoAjuste = productoSeleccionado ? form.cantidad * Number(productoSeleccionado.precio_compra) : 0
  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  async function guardar() {
    if (!form.producto_id || !form.razon || !negocioId) return
    setLoading(true)
    await createClient().from('ajustes_inventario').insert({
      ...form, negocio_id: negocioId, costo_ajuste: costoAjuste, estado: 'Pendiente'
    })
    await cargar(negocioId)
    setForm(empty); setShowForm(false); setLoading(false)
  }

  async function aprobar(id: string, productoId: string, cantidad: number) {
    const supabase = createClient()
    await supabase.from('ajustes_inventario').update({ estado: 'Aprobado' }).eq('id', id)
    const { data: prod } = await supabase.from('productos').select('stock_actual').eq('id', productoId).single()
    if (prod) await supabase.from('productos').update({ stock_actual: Math.max(0, Number(prod.stock_actual) - cantidad) }).eq('id', productoId)
    if (negocioId) cargar(negocioId)
  }

  async function rechazar(id: string) {
    await createClient().from('ajustes_inventario').update({ estado: 'Rechazado' }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  const pendientes = ajustes.filter(a => a.estado === 'Pendiente')
  const historial = ajustes.filter(a => a.estado !== 'Pendiente')

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>⚖️ Ajustes de Inventario</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Daños, mermas, robos y diferencias</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setShowForm(true) }}>+ Nuevo Ajuste</button>
        </div>

        {pendientes.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#eab308' }}>⏳ Pendientes de autorización ({pendientes.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendientes.map(a => (
                <div key={a.id} style={{ background: 'var(--surface)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{a.folio} — <span style={{ color: '#eab308' }}>{a.tipo_ajuste}</span></div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{a.productos?.nombre} · {a.cantidad} unidades · Costo: {fmt(a.costo_ajuste)}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{a.razon}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => aprobar(a.id, a.producto_id, a.cantidad)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>✅ Aprobar</button>
                    <button onClick={() => rechazar(a.id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>✕ Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Registrar Ajuste</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Tipo de ajuste *</label>
                <select className="select" value={form.tipo_ajuste} onChange={e => set('tipo_ajuste', e.target.value)}>
                  {tipos.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Producto *</label>
                <select className="select" value={form.producto_id} onChange={e => set('producto_id', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} (stock: {p.stock_actual})</option>)}
                </select>
              </div>
              <div>
                <label className="label">Cantidad *</label>
                <input className="input" type="number" min={1} value={form.cantidad} onChange={e => set('cantidad', parseFloat(e.target.value)||1)} />
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="label">Razón / Descripción * (obligatorio)</label>
              <input className="input" placeholder="Describe qué ocurrió" value={form.razon} onChange={e => set('razon', e.target.value)} />
            </div>
            {costoAjuste > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
                Pérdida estimada: <strong>{fmt(costoAjuste)}</strong>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading || !form.producto_id || !form.razon}>{loading ? 'Guardando...' : 'Enviar para autorización'}</button>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}

        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Historial</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tabla">
            <thead><tr><th>Folio</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Costo</th><th>Estado</th></tr></thead>
            <tbody>
              {historial.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>Sin ajustes en historial</td></tr>
              ) : historial.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600, color: 'var(--green)', fontSize: 13 }}>{a.folio}</td>
                  <td><span className="badge badge-yellow">{a.tipo_ajuste}</span></td>
                  <td>{a.productos?.nombre}</td>
                  <td>{a.cantidad}</td>
                  <td style={{ color: '#ef4444' }}>{fmt(a.costo_ajuste)}</td>
                  <td><span className={`badge ${a.estado === 'Aprobado' ? 'badge-green' : 'badge-red'}`}>{a.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
