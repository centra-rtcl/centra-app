'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

export default function Recepciones() {
  const [recepciones, setRecepciones] = useState<any[]>([])
  const [ordenesAbiertas, setOrdenesAbiertas] = useState<any[]>([])
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<any>(null)
  const [detalleOrden, setDetalleOrden] = useState<any[]>([])
  const [recibidos, setRecibidos] = useState<any[]>([])
  const [form, setForm] = useState({ tipo_comprobante: 'Sin comprobante', folio_comprobante: '', forma_pago: 'Contado', monto_pagado: 0, cerrar_orden: false, notas: '' })
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
    const [{ data: recs }, { data: ords }] = await Promise.all([
      supabase.from('recepciones').select('*, ordenes_compra(folio, proveedores(nombre))').eq('negocio_id', nid).order('created_at', { ascending: false }),
      supabase.from('ordenes_compra').select('*, proveedores(nombre)').eq('negocio_id', nid).in('estado', ['Abierta', 'Recibida parcial']),
    ])
    setRecepciones(recs || [])
    setOrdenesAbiertas(ords || [])
  }

  async function seleccionarOrden(ordenId: string) {
    const orden = ordenesAbiertas.find(o => o.id === ordenId)
    setOrdenSeleccionada(orden)
    const { data } = await createClient().from('ordenes_compra_detalle')
      .select('*, productos(nombre, unidad_venta)').eq('orden_id', ordenId)
    setDetalleOrden(data || [])
    setRecibidos((data || []).map(d => ({ ...d, cantidad_recibida_ahora: d.cantidad_pedida - d.cantidad_recibida, condicion: 'Correcto' })))
  }

  function updateRecibido(idx: number, field: string, value: any) {
    setRecibidos(recibidos.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  async function confirmar() {
    if (!ordenSeleccionada || !negocioId) return
    setLoading(true)
    const supabase = createClient()

    const { data: recepcion } = await supabase.from('recepciones').insert({
      negocio_id: negocioId, orden_id: ordenSeleccionada.id,
      fecha_recepcion: new Date().toISOString(),
      tipo_comprobante: form.tipo_comprobante, folio_comprobante: form.folio_comprobante,
      forma_pago: form.forma_pago, monto_pagado: form.monto_pagado,
      cerrar_orden: form.cerrar_orden, notas: form.notas,
    }).select().single()

    if (recepcion) {
      await supabase.from('recepciones_detalle').insert(
        recibidos.map(r => ({ recepcion_id: recepcion.id, producto_id: r.producto_id, cantidad_recibida: r.cantidad_recibida_ahora, condicion: r.condicion }))
      )

      for (const r of recibidos) {
        if (r.cantidad_recibida_ahora > 0) {
          const { data: prod } = await supabase.from('productos').select('stock_actual').eq('id', r.producto_id).single()
          if (prod) await supabase.from('productos').update({ stock_actual: Number(prod.stock_actual) + Number(r.cantidad_recibida_ahora) }).eq('id', r.producto_id)
          await supabase.from('ordenes_compra_detalle').update({ cantidad_recibida: r.cantidad_recibida + r.cantidad_recibida_ahora }).eq('id', r.id)
        }
      }

      const nuevoEstado = form.cerrar_orden ? 'Cerrada' : 'Recibida parcial'
      await supabase.from('ordenes_compra').update({ estado: nuevoEstado }).eq('id', ordenSeleccionada.id)

      if (form.forma_pago === 'Crédito') {
        await supabase.from('cuentas_por_pagar').insert({
          negocio_id: negocioId, proveedor_id: ordenSeleccionada.proveedor_id,
          recepcion_id: recepcion.id, monto_total: form.monto_pagado,
          monto_pagado: 0, saldo: form.monto_pagado, estado: 'Vigente',
        })
      }
    }

    await cargar(negocioId)
    setShowForm(false); setOrdenSeleccionada(null); setDetalleOrden([]); setRecibidos([])
    setLoading(false)
  }

  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📬 Recepciones</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Confirma mercancía recibida — aquí sube el inventario</p>
          </div>
          {ordenesAbiertas.length > 0 && <button className="btn-primary" onClick={() => setShowForm(true)}>+ Registrar Recepción</button>}
        </div>

        <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          ⚠️ El inventario solo se actualiza al confirmar una recepción.
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Registrar Recepción</h3>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Orden de compra *</label>
              <select className="select" style={{ maxWidth: 400 }} onChange={e => seleccionarOrden(e.target.value)}>
                <option value="">Seleccionar orden...</option>
                {ordenesAbiertas.map(o => <option key={o.id} value={o.id}>{o.folio} — {o.proveedores?.nombre}</option>)}
              </select>
            </div>

            {detalleOrden.length > 0 && (
              <>
                <div style={{ marginBottom: 16, fontWeight: 600 }}>¿Qué llegó?</div>
                <table className="tabla" style={{ marginBottom: 20 }}>
                  <thead><tr><th>Producto</th><th>Pedido</th><th>Ya recibido</th><th>Recibido ahora</th><th>Condición</th></tr></thead>
                  <tbody>
                    {recibidos.map((r, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{r.productos?.nombre}</td>
                        <td>{r.cantidad_pedida}</td>
                        <td style={{ color: 'var(--text-muted)' }}>{r.cantidad_recibida}</td>
                        <td><input type="number" value={r.cantidad_recibida_ahora} onChange={e => updateRecibido(i, 'cantidad_recibida_ahora', parseFloat(e.target.value)||0)} style={{ width: 80, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)' }} /></td>
                        <td>
                          <select value={r.condicion} onChange={e => updateRecibido(i, 'condicion', e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 8px', color: 'var(--text)', fontSize: 13 }}>
                            <option>Correcto</option><option>Dañado</option><option>Caducado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="label">Comprobante</label>
                    <select className="select" value={form.tipo_comprobante} onChange={e => setForm(f => ({ ...f, tipo_comprobante: e.target.value }))}>
                      <option>Sin comprobante</option><option>Factura</option><option>Remisión</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Folio comprobante</label>
                    <input className="input" placeholder="Número de factura" value={form.folio_comprobante} onChange={e => setForm(f => ({ ...f, folio_comprobante: e.target.value }))} />
                  </div>
                  <div>
                    <label className="label">Forma de pago</label>
                    <select className="select" value={form.forma_pago} onChange={e => setForm(f => ({ ...f, forma_pago: e.target.value }))}>
                      <option>Contado</option><option>Crédito</option><option>Consigna</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Monto pagado ($)</label>
                    <input className="input" type="number" value={form.monto_pagado} onChange={e => setForm(f => ({ ...f, monto_pagado: parseFloat(e.target.value)||0 }))} />
                  </div>
                  <div>
                    <label className="label">Notas</label>
                    <input className="input" placeholder="Observaciones" value={form.notas} onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 20 }}>
                    <input type="checkbox" id="cerrar" checked={form.cerrar_orden} onChange={e => setForm(f => ({ ...f, cerrar_orden: e.target.checked }))} style={{ accentColor: 'var(--green)' }} />
                    <label htmlFor="cerrar" style={{ fontSize: 14, color: 'var(--text-muted)', cursor: 'pointer' }}>Cerrar orden aunque esté incompleta</label>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button className="btn-primary" onClick={confirmar} disabled={loading}>{loading ? 'Confirmando...' : 'Confirmar Recepción'}</button>
                  <button className="btn-secondary" onClick={() => { setShowForm(false); setOrdenSeleccionada(null); setDetalleOrden([]) }}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tabla">
            <thead><tr><th>Orden</th><th>Proveedor</th><th>Fecha</th><th>Comprobante</th><th>Pago</th><th>Monto</th></tr></thead>
            <tbody>
              {recepciones.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
                  <div style={{ fontWeight: 600 }}>Sin recepciones registradas</div>
                </td></tr>
              ) : recepciones.map(r => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: 'var(--green)' }}>{r.ordenes_compra?.folio}</td>
                  <td>{r.ordenes_compra?.proveedores?.nombre}</td>
                  <td style={{ fontSize: 12 }}>{new Date(r.fecha_recepcion).toLocaleString('es-MX')}</td>
                  <td>{r.tipo_comprobante}</td>
                  <td><span className="badge badge-blue">{r.forma_pago}</span></td>
                  <td style={{ fontWeight: 600 }}>{fmt(r.monto_pagado)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
