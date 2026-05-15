'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const tipos = ['Uso interno', 'Pago en especie', 'Donación', 'Traspaso', 'Degustación']
const empty = { tipo_salida: 'Uso interno', producto_id: '', cantidad: 1, empleado_id: '', razon: '' }

export default function Salidas() {
  const [salidas, setSalidas] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [empleados, setEmpleados] = useState<any[]>([])
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
    const [{ data: sals }, { data: prods }, { data: emps }] = await Promise.all([
      supabase.from('salidas_inventario').select('*, productos(nombre), empleados(nombre)').eq('negocio_id', nid).order('created_at', { ascending: false }),
      supabase.from('productos').select('id,nombre,precio_compra,stock_actual').eq('negocio_id', nid).eq('activo', true),
      supabase.from('empleados').select('id,nombre').eq('negocio_id', nid).eq('activo', true),
    ])
    setSalidas(sals || [])
    setProductos(prods || [])
    setEmpleados(emps || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  const productoSeleccionado = productos.find(p => p.id === form.producto_id)
  const costoRegistrado = productoSeleccionado ? form.cantidad * Number(productoSeleccionado.precio_compra) : 0
  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  async function guardar() {
    if (!form.producto_id || !form.razon || !negocioId) return
    setLoading(true)
    await createClient().from('salidas_inventario').insert({
      ...form, negocio_id: negocioId,
      empleado_id: form.empleado_id || null,
      costo_registrado: costoRegistrado,
      estado: 'Pendiente'
    })
    await cargar(negocioId)
    setForm(empty); setShowForm(false); setLoading(false)
  }

  async function aprobar(id: string, productoId: string, cantidad: number) {
    const supabase = createClient()
    await supabase.from('salidas_inventario').update({ estado: 'Aprobada' }).eq('id', id)
    const { data: prod } = await supabase.from('productos').select('stock_actual').eq('id', productoId).single()
    if (prod) await supabase.from('productos').update({ stock_actual: Math.max(0, Number(prod.stock_actual) - cantidad) }).eq('id', productoId)
    if (negocioId) cargar(negocioId)
  }

  async function rechazar(id: string) {
    await createClient().from('salidas_inventario').update({ estado: 'Rechazada' }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  const pendientes = salidas.filter(s => s.estado === 'Pendiente')
  const historial = salidas.filter(s => s.estado !== 'Pendiente')

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📤 Salidas de Inventario</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Salidas que no son ventas</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setShowForm(true) }}>+ Nueva Salida</button>
        </div>

        {pendientes.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#eab308' }}>⏳ Pendientes de autorización ({pendientes.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pendientes.map(s => (
                <div key={s.id} style={{ background: 'var(--surface)', border: '1px solid rgba(234,179,8,0.3)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.folio} — <span style={{ color: '#eab308' }}>{s.tipo_salida}</span></div>
                    <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{s.productos?.nombre} · {s.cantidad} unidades · Costo: {fmt(s.costo_registrado)}</div>
                    {s.empleados && <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Empleado: {s.empleados.nombre}</div>}
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{s.razon}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => aprobar(s.id, s.producto_id, s.cantidad)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>✅ Aprobar</button>
                    <button onClick={() => rechazar(s.id)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>✕ Rechazar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nueva Salida</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label className="label">Tipo de salida *</label>
                <select className="select" value={form.tipo_salida} onChange={e => set('tipo_salida', e.target.value)}>
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
              {(form.tipo_salida === 'Pago en especie') && (
                <div>
                  <label className="label">Empleado</label>
                  <select className="select" value={form.empleado_id} onChange={e => set('empleado_id', e.target.value)}>
                    <option value="">Seleccionar...</option>
                    {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
                  </select>
                </div>
              )}
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label">Razón / Descripción *</label>
                <input className="input" placeholder="Explica el motivo" value={form.razon} onChange={e => set('razon', e.target.value)} />
              </div>
            </div>
            {costoRegistrado > 0 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, fontSize: 13, color: '#ef4444' }}>
                Costo registrado: <strong>{fmt(costoRegistrado)}</strong>
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
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>Sin salidas en historial</td></tr>
              ) : historial.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, color: 'var(--green)', fontSize: 13 }}>{s.folio}</td>
                  <td><span className="badge badge-blue">{s.tipo_salida}</span></td>
                  <td>{s.productos?.nombre}</td>
                  <td>{s.cantidad}</td>
                  <td style={{ color: '#ef4444' }}>{fmt(s.costo_registrado)}</td>
                  <td><span className={`badge ${s.estado === 'Aprobada' ? 'badge-green' : 'badge-red'}`}>{s.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
