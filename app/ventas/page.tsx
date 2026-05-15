'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

export default function Ventas() {
  const [productos, setProductos] = useState<any[]>([])
  const [clientes, setClientes] = useState<any[]>([])
  const [medios, setMedios] = useState<any[]>([])
  const [carrito, setCarrito] = useState<any[]>([])
  const [clienteId, setClienteId] = useState('')
  const [medioPagoId, setMedioPagoId] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [sugerencias, setSugerencias] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)
  const [ventas, setVentas] = useState<any[]>([])
  const [efectivo, setEfectivo] = useState(0)
  const [ticket, setTicket] = useState<any>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) { cargarCatalogos(id); cargarVentas(id) }
  }, [])

  async function cargarCatalogos(nid: string) {
    const supabase = createClient()
    const [{ data: prods }, { data: clts }, { data: meds }] = await Promise.all([
      supabase.from('productos').select('*').eq('negocio_id', nid).eq('activo', true).gt('stock_actual', 0),
      supabase.from('clientes').select('*').eq('negocio_id', nid).eq('activo', true),
      supabase.from('medios_pago').select('*').eq('negocio_id', nid).eq('activo', true),
    ])
    setProductos(prods || [])
    setClientes(clts || [])
    setMedios(meds || [])
    const pg = clts?.find((c: any) => c.es_publico_general)
    if (pg) setClienteId(pg.id)
    if (meds && meds.length > 0) setMedioPagoId(meds[0].id)
  }

  async function cargarVentas(nid: string) {
    const { data } = await createClient().from('ventas').select('*, clientes(nombre)').eq('negocio_id', nid).order('created_at', { ascending: false }).limit(20)
    setVentas(data || [])
  }

  function buscarProducto(q: string) {
    setBusqueda(q)
    if (q.length < 1) { setSugerencias([]); return }
    const r = productos.filter(p => p.nombre.toLowerCase().includes(q.toLowerCase()) || (p.codigo||'').includes(q)).slice(0, 5)
    setSugerencias(r)
  }

  function agregarProducto(p: any) {
    const existe = carrito.find(c => c.id === p.id)
    if (existe) {
      setCarrito(carrito.map(c => c.id === p.id ? { ...c, cantidad: c.cantidad + 1 } : c))
    } else {
      setCarrito([...carrito, { ...p, cantidad: 1 }])
    }
    setBusqueda(''); setSugerencias([])
  }

  function cambiarCantidad(id: string, cantidad: number) {
    if (cantidad <= 0) { setCarrito(carrito.filter(c => c.id !== id)); return }
    setCarrito(carrito.map(c => c.id === id ? { ...c, cantidad } : c))
  }

  const subtotal = carrito.reduce((a, c) => a + (c.precio_venta * c.cantidad), 0)
  const iva = carrito.reduce((a, c) => a + (c.precio_venta * c.cantidad * (c.iva_porcentaje / 100)), 0)
  const total = subtotal + iva
  const cambio = efectivo > total ? efectivo - total : 0
  const medio = medios.find(m => m.id === medioPagoId)
  const comision = medio?.comision_porcentaje > 0 ? (total * medio.comision_porcentaje / 100) : 0
  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  async function cobrar() {
    if (carrito.length === 0 || !medioPagoId || !negocioId) return
    setLoading(true)
    const supabase = createClient()

    const { data: venta } = await supabase.from('ventas').insert({
      negocio_id: negocioId, cliente_id: clienteId || null,
      subtotal, iva, total, estado: 'Completada',
    }).select().single()

    if (!venta) { setLoading(false); return }

    await supabase.from('ventas_detalle').insert(
      carrito.map(c => ({ venta_id: venta.id, producto_id: c.id, cantidad: c.cantidad, precio_unitario: c.precio_venta, iva_porcentaje: c.iva_porcentaje, subtotal: c.precio_venta * c.cantidad }))
    )

    await supabase.from('ventas_pagos').insert({
      venta_id: venta.id, medio_pago_id: medioPagoId,
      monto: total, comision, neto: total - comision
    })

    for (const item of carrito) {
      await supabase.from('productos').update({ stock_actual: item.stock_actual - item.cantidad }).eq('id', item.id)
    }

    setTicket({ folio: venta.folio, total, subtotal, iva, carrito: [...carrito], medio: medio?.nombre, cambio, comision })
    setCarrito([]); setEfectivo(0)
    await cargarCatalogos(negocioId)
    await cargarVentas(negocioId)
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🏷️ Ventas</h1>
        </div>

        {ticket && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 32, maxWidth: 380, width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: 'Syne', fontSize: 22, margin: '0 0 4px' }}>¡Venta registrada!</h2>
              <p style={{ color: 'var(--green)', fontWeight: 700, marginBottom: 20 }}>{ticket.folio}</p>
              <div style={{ textAlign: 'left', marginBottom: 20 }}>
                {ticket.carrito.map((c: any) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                    <span>{c.nombre} × {c.cantidad}</span>
                    <span>{fmt(c.precio_venta * c.cantidad)}</span>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>Subtotal</span><span>{fmt(ticket.subtotal)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}><span>IVA</span><span>{fmt(ticket.iva)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, color: 'var(--green)' }}><span>TOTAL</span><span>{fmt(ticket.total)}</span></div>
                  {ticket.cambio > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 8, color: '#eab308' }}><span>Cambio</span><span>{fmt(ticket.cambio)}</span></div>}
                </div>
              </div>
              <button className="btn-primary" onClick={() => setTicket(null)} style={{ width: '100%', padding: '12px' }}>
                Nueva venta
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
          <div>
            {/* Buscador */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <input className="input" placeholder="🔍 Buscar producto por nombre o código..." value={busqueda} onChange={e => buscarProducto(e.target.value)} />
              {sugerencias.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, zIndex: 10, marginTop: 4 }}>
                  {sugerencias.map(p => (
                    <div key={p.id} onClick={() => agregarProducto(p)} style={{ padding: '10px 16px', cursor: 'pointer', fontSize: 14, borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{p.nombre}</span>
                      <span style={{ color: 'var(--green)', fontWeight: 600 }}>{fmt(p.precio_venta)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Carrito */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="tabla">
                <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
                <tbody>
                  {carrito.length === 0 ? (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>🛒</div>
                      <div>Busca productos para agregar</div>
                    </td></tr>
                  ) : carrito.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.nombre}</td>
                      <td>{fmt(c.precio_venta)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <button onClick={() => cambiarCantidad(c.id, c.cantidad - 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 16 }}>−</button>
                          <span style={{ fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{c.cantidad}</span>
                          <button onClick={() => cambiarCantidad(c.id, c.cantidad + 1)} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: 'var(--text)', cursor: 'pointer', fontSize: 16 }}>+</button>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(c.precio_venta * c.cantidad)}</td>
                      <td><button onClick={() => cambiarCantidad(c.id, 0)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel cobro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <label className="label">Cliente</label>
              <select className="select" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="card">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-muted)' }}><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-muted)' }}><span>IVA</span><span>{fmt(iva)}</span></div>
                {comision > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#f97316' }}><span>Comisión terminal</span><span>-{fmt(comision)}</span></div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, fontWeight: 800, color: 'var(--green)', borderTop: '1px solid var(--border)', paddingTop: 12 }}><span>TOTAL</span><span>{fmt(total)}</span></div>
              </div>

              <label className="label">Forma de pago</label>
              <select className="select" value={medioPagoId} onChange={e => setMedioPagoId(e.target.value)} style={{ marginBottom: 12 }}>
                {medios.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>

              {medio?.tipo === 'Efectivo' && (
                <div style={{ marginBottom: 12 }}>
                  <label className="label">Efectivo recibido</label>
                  <input className="input" type="number" value={efectivo || ''} onChange={e => setEfectivo(parseFloat(e.target.value)||0)} placeholder={fmt(total)} />
                  {cambio > 0 && <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(234,179,8,0.1)', borderRadius: 6, fontSize: 13, color: '#eab308', fontWeight: 600 }}>Cambio: {fmt(cambio)}</div>}
                </div>
              )}
            </div>

            <button className="btn-primary" onClick={cobrar} disabled={loading || carrito.length === 0} style={{ padding: '16px', fontSize: 16, borderRadius: 10, opacity: carrito.length === 0 ? 0.5 : 1 }}>
              {loading ? 'Procesando...' : `Cobrar ${fmt(total)}`}
            </button>
          </div>
        </div>

        {/* Historial */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Ventas recientes</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="tabla">
              <thead><tr><th>Folio</th><th>Fecha</th><th>Cliente</th><th>Total</th><th>Estado</th></tr></thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>No hay ventas aún</td></tr>
                ) : ventas.map(v => (
                  <tr key={v.id}>
                    <td style={{ fontWeight: 600, color: 'var(--green)' }}>{v.folio}</td>
                    <td style={{ fontSize: 13 }}>{new Date(v.fecha).toLocaleString('es-MX')}</td>
                    <td>{v.clientes?.nombre || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{fmt(v.total)}</td>
                    <td><span className="badge badge-green">{v.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
