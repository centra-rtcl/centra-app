'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

export default function Compras() {
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [proveedores, setProveedores] = useState<any[]>([])
  const [productos, setProductos] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ proveedor_id: '', fecha_pedido: new Date().toISOString().split('T')[0], fecha_estimada_entrega: '', condicion_pago: 'Contado', notas: '' })
  const [detalle, setDetalle] = useState<any[]>([])
  const [prodBusqueda, setProdBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const supabase = createClient()
    const [{ data: ords }, { data: provs }, { data: prods }] = await Promise.all([
      supabase.from('ordenes_compra').select('*, proveedores(nombre)').eq('negocio_id', nid).order('created_at', { ascending: false }),
      supabase.from('proveedores').select('id,nombre').eq('negocio_id', nid).eq('activo', true),
      supabase.from('productos').select('id,nombre,unidad_compra,precio_compra').eq('negocio_id', nid).eq('activo', true),
    ])
    setOrdenes(ords || [])
    setProveedores(provs || [])
    setProductos(prods || [])
    if (provs && provs.length > 0) setForm(f => ({ ...f, proveedor_id: provs[0].id }))
  }

  function buscarProducto(q: string) {
    setProdBusqueda(q)
    if (!q) { setSugerencias([]); return }
    setSugerencias(productos.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase())).slice(0, 5))
  }

  function agregarProducto(p: any) {
    const existe = detalle.find(d => d.producto_id === p.id)
    if (!existe) setDetalle([...detalle, { producto_id: p.id, nombre: p.nombre, unidad_medida: p.unidad_compra, precio_unitario: p.precio_compra, cantidad_pedida: 1 }])
    setProdBusqueda(''); setSugerencias([])
  }

  function updateDetalle(idx: number, field: string, value: any) {
    setDetalle(detalle.map((d, i) => i === idx ? { ...d, [field]: value } : d))
  }

  const total = detalle.reduce((a, d) => a + (d.cantidad_pedida * d.precio_unitario), 0)
  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  async function guardar() {
    if (!form.proveedor_id || detalle.length === 0 || !negocioId) return
    setLoading(true)
    const supabase = createClient()
    const { data: orden } = await supabase.from('ordenes_compra').insert({ ...form, negocio_id: negocioId, total, estado: 'Abierta' }).select().single()
    if (orden) {
      await supabase.from('ordenes_compra_detalle').insert(
        detalle.map(d => ({ orden_id: orden.id, producto_id: d.producto_id, cantidad_pedida: d.cantidad_pedida, cantidad_recibida: 0, unidad_medida: d.unidad_medida, precio_unitario: d.precio_unitario, subtotal: d.cantidad_pedida * d.precio_unitario }))
      )
    }
    await cargar(negocioId)
    setShowForm(false); setDetalle([])
    setLoading(false)
  }

  const badgeColor: any = { 'Abierta': 'badge-yellow', 'Recibida parcial': 'badge-blue', 'Cerrada': 'badge-green', 'Cancelada': 'badge-red' }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🛒 Compras</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Órdenes de compra a proveedores</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(true); setDetalle([]) }}>+ Nueva Orden</button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Folio</th><th>Proveedor</th><th>Fecha pedido</th><th>Entrega est.</th><th>Condición</th><th>Total</th><th>Estado</th></tr></thead>
            <tbody>
              {ordenes.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🛒</div>
                  <div style={{ fontWeight: 600 }}>Sin órdenes de compra</div>
                </td></tr>
              ) : ordenes.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600, color: 'var(--green)' }}>{o.folio}</td>
                  <td>{o.proveedores?.nombre}</td>
                  <td style={{ fontSize: 13 }}>{o.fecha_pedido}</td>
                  <td style={{ fontSize: 13 }}>{o.fecha_estimada_entrega || '—'}</td>
                  <td><span className="badge badge-blue">{o.condicion_pago}</span></td>
                  <td style={{ fontWeight: 600 }}>{fmt(o.total)}</td>
                  <td><span className={`badge ${badgeColor[o.estado]}`}>{o.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="card">
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nueva Orden de Compra</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label className="label">Proveedor *</label>
                <select className="select" value={form.proveedor_id} onChange={e => setForm(f => ({ ...f, proveedor_id: e.target.value }))}>
                  {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Fecha de pedido</label>
                <input className="input" type="date" value={form.fecha_pedido} onChange={e => setForm(f => ({ ...f, fecha_pedido: e.target.value }))} />
              </div>
              <div>
                <label className="label">Entrega estimada</label>
                <input className="input" type="date" value={form.fecha_estimada_entrega} onChange={e => setForm(f => ({ ...f, fecha_estimada_entrega: e.target.value }))} />
              </div>
              <div>
                <label className="label">Condición de pago</label>
                <select className="select" value={form.condicion_pago} onChange={e => setForm(f => ({ ...f, condicion_pago: e.target.value }))}>
                  <option>Contado</option><option>Crédito</option><option>Consigna</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="label">Notas</label>
                <input className="input" placeholder="Instrucciones especiales" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
              </div>
            </div>

            <div style={{ marginBottom: 12, fontWeight: 600 }}>Productos a pedir</div>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input className="input" placeholder="Buscar producto..." value={prodBusqueda} onChange={e => buscarProducto(e.target.value)} style={{ maxWidth: 400 }} />
              {sugerencias.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, width: 400, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, zIndex: 10, marginTop: 4 }}>
                  {sugerencias.map(p => (
                    <div key={p.id} onClick={() => agregarProducto(p)} style={{ padding: '10px 16px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid var(--border)' }}>
                      {p.nombre} — {fmt(p.precio_compra)}/{p.unidad_compra}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {detalle.length > 0 && (
              <table className="tabla" style={{ marginBottom: 16 }}>
                <thead><tr><th>Producto</th><th>Unidad</th><th>Cantidad</th><th>Precio unit.</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {detalle.map((d, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{d.nombre}</td>
                      <td>{d.unidad_medida}</td>
                      <td><input type="number" value={d.cantidad_pedida} onChange={e => updateDetalle(i, 'cantidad_pedida', parseFloat(e.target.value)||1)} style={{ width: 80, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)' }} /></td>
                      <td><input type="number" step="0.01" value={d.precio_unitario} onChange={e => updateDetalle(i, 'precio_unitario', parseFloat(e.target.value)||0)} style={{ width: 100, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)' }} /></td>
                      <td style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(d.cantidad_pedida * d.precio_unitario)}</td>
                      <td><button onClick={() => setDetalle(detalle.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>✕</button></td>
                    </tr>
                  ))}
                  <tr><td colSpan={4} style={{ textAlign: 'right', fontWeight: 700 }}>TOTAL</td><td style={{ fontWeight: 700, color: 'var(--green)' }}>{fmt(total)}</td><td></td></tr>
                </tbody>
              </table>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading || detalle.length === 0}>{loading ? 'Guardando...' : 'Crear Orden de Compra'}</button>
              <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
