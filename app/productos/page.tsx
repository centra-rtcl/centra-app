'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const empty = { codigo: '', nombre: '', descripcion: '', categoria: '', unidad_compra: 'Caja', unidad_venta: 'Pieza', precio_compra: 0, precio_venta: 0, iva_porcentaje: 16, proveedor_id: '', maneja_caducidad: false, fecha_caducidad: '', stock_minimo: 0, stock_maximo: 0, activo: true }

const unidades = ['Pieza', 'Caja', 'Kilo', 'Gramo', 'Litro', 'Mililitro', 'Pallet', 'Metro', 'Par']

export default function Productos() {
  const [productos, setProductos] = useState<any[]>([])
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
    if (id) { cargar(id); cargarProveedores(id) }
  }, [])

  async function cargar(nid: string) {
    const { data } = await createClient().from('productos').select('*, proveedores(nombre)').eq('negocio_id', nid).order('nombre')
    setProductos(data || [])
  }

  async function cargarProveedores(nid: string) {
    const { data } = await createClient().from('proveedores').select('id,nombre').eq('negocio_id', nid).eq('activo', true)
    setProveedores(data || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  async function guardar() {
    if (!form.nombre || !negocioId) return
    setLoading(true)
    const supabase = createClient()
    const payload = { ...form, proveedor_id: form.proveedor_id || null, fecha_caducidad: form.fecha_caducidad || null }
    if (editId) {
      await supabase.from('productos').update(payload).eq('id', editId)
    } else {
      await supabase.from('productos').insert({ ...payload, negocio_id: negocioId, stock_actual: 0 })
    }
    await cargar(negocioId)
    setForm(empty); setEditId(null); setShowForm(false); setLoading(false)
  }

  async function toggleActivo(id: string, activo: boolean) {
    await createClient().from('productos').update({ activo: !activo }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  function editar(p: any) {
    setForm({ codigo: p.codigo||'', nombre: p.nombre, descripcion: p.descripcion||'', categoria: p.categoria||'', unidad_compra: p.unidad_compra, unidad_venta: p.unidad_venta, precio_compra: p.precio_compra, precio_venta: p.precio_venta, iva_porcentaje: p.iva_porcentaje, proveedor_id: p.proveedor_id||'', maneja_caducidad: p.maneja_caducidad, fecha_caducidad: p.fecha_caducidad||'', stock_minimo: p.stock_minimo, stock_maximo: p.stock_maximo, activo: p.activo })
    setEditId(p.id); setShowForm(true)
  }

  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  const margen = (compra: number, venta: number) => compra > 0 ? (((venta - compra) / compra) * 100).toFixed(0) + '%' : '—'
  const filtrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()) || (p.codigo||'').toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📦 Productos</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>{productos.length} productos registrados</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true) }}>+ Nuevo Producto</button>
        </div>

        <input className="input" placeholder="Buscar por nombre o código..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ maxWidth: 400, marginBottom: 20 }} />

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Código</th><th>Nombre</th><th>Precio Compra</th><th>Precio Venta</th><th>Margen</th><th>Stock</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
                  <div style={{ fontWeight: 600 }}>Sin productos — agrega tu primer producto</div>
                </td></tr>
              ) : filtrados.map(p => (
                <tr key={p.id}>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.codigo || 'AUTO'}</td>
                  <td><div style={{ fontWeight: 600 }}>{p.nombre}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.categoria}</div></td>
                  <td>{fmt(p.precio_compra)}</td>
                  <td style={{ color: 'var(--green)', fontWeight: 600 }}>{fmt(p.precio_venta)}</td>
                  <td><span className="badge badge-green">{margen(p.precio_compra, p.precio_venta)}</span></td>
                  <td>
                    <span style={{ color: p.stock_actual <= 0 ? '#ef4444' : p.stock_actual <= p.stock_minimo ? '#eab308' : 'var(--green)', fontWeight: 700 }}>
                      {p.stock_actual}
                    </span>
                  </td>
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
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>{editId ? 'Editar' : 'Nuevo'} Producto</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label className="label">Código (vacío = auto)</label><input className="input" placeholder="Código de barras" value={form.codigo} onChange={e => set('codigo', e.target.value)} /></div>
              <div><label className="label">Nombre *</label><input className="input" placeholder="Nombre del producto" value={form.nombre} onChange={e => set('nombre', e.target.value)} /></div>
              <div><label className="label">Descripción</label><input className="input" placeholder="Descripción" value={form.descripcion} onChange={e => set('descripcion', e.target.value)} /></div>
              <div><label className="label">Categoría</label><input className="input" placeholder="Bebidas, Lácteos, etc." value={form.categoria} onChange={e => set('categoria', e.target.value)} /></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <label className="label">Unidad de compra</label>
                <select className="select" value={form.unidad_compra} onChange={e => set('unidad_compra', e.target.value)}>
                  {unidades.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Unidad de venta</label>
                <select className="select" value={form.unidad_venta} onChange={e => set('unidad_venta', e.target.value)}>
                  {unidades.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="label">IVA</label>
                <select className="select" value={form.iva_porcentaje} onChange={e => set('iva_porcentaje', parseFloat(e.target.value))}>
                  <option value={16}>16%</option><option value={8}>8%</option><option value={0}>0%</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
              <div><label className="label">Precio de compra *</label><input className="input" type="number" step="0.01" value={form.precio_compra} onChange={e => set('precio_compra', parseFloat(e.target.value)||0)} /></div>
              <div><label className="label">Precio de venta *</label><input className="input" type="number" step="0.01" value={form.precio_venta} onChange={e => set('precio_venta', parseFloat(e.target.value)||0)} /></div>
              <div>
                <label className="label">Proveedor principal</label>
                <select className="select" value={form.proveedor_id} onChange={e => set('proveedor_id', e.target.value)}>
                  <option value="">Sin proveedor</option>
                  {proveedores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
              <div><label className="label">Stock mínimo</label><input className="input" type="number" value={form.stock_minimo} onChange={e => set('stock_minimo', parseFloat(e.target.value)||0)} /></div>
              <div><label className="label">Stock máximo</label><input className="input" type="number" value={form.stock_maximo} onChange={e => set('stock_maximo', parseFloat(e.target.value)||0)} /></div>
              <div>
                <label className="label">¿Maneja caducidad?</label>
                <select className="select" value={form.maneja_caducidad ? 'si' : 'no'} onChange={e => set('maneja_caducidad', e.target.value === 'si')}>
                  <option value="no">No</option><option value="si">Sí</option>
                </select>
              </div>
              {form.maneja_caducidad && <div><label className="label">Fecha de caducidad</label><input className="input" type="date" value={form.fecha_caducidad} onChange={e => set('fecha_caducidad', e.target.value)} /></div>}
            </div>

            {form.precio_compra > 0 && form.precio_venta > 0 && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(34,197,94,0.08)', borderRadius: 8, fontSize: 13 }}>
                Margen: <strong style={{ color: 'var(--green)' }}>{margen(form.precio_compra, form.precio_venta)}</strong> —
                Ganancia por unidad: <strong style={{ color: 'var(--green)' }}>{fmt(form.precio_venta - form.precio_compra)}</strong>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Producto'}</button>
              <button className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null) }}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
