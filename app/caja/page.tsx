'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

export default function Caja() {
  const [cajaActual, setCajaActual] = useState<any>(null)
  const [historial, setHistorial] = useState<any[]>([])
  const [medios, setMedios] = useState<any[]>([])
  const [fondoInicial, setFondoInicial] = useState(0)
  const [efectivoContado, setEfectivoContado] = useState(0)
  const [resumen, setResumen] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const supabase = createClient()
    const { data: cajaAbierta } = await supabase.from('cajas').select('*').eq('negocio_id', nid).eq('estado', 'Abierta').single()
    setCajaActual(cajaAbierta || null)
    if (cajaAbierta) await calcularResumen(nid, cajaAbierta)

    const { data: hist } = await supabase.from('cajas').select('*').eq('negocio_id', nid).eq('estado', 'Cerrada').order('created_at', { ascending: false }).limit(10)
    setHistorial(hist || [])

    const { data: meds } = await supabase.from('medios_pago').select('*').eq('negocio_id', nid).eq('activo', true)
    setMedios(meds || [])
  }

  async function calcularResumen(nid: string, caja: any) {
    const supabase = createClient()
    const desde = caja.fecha_apertura
    const res: any[] = []

    for (const medio of medios.length > 0 ? medios : (await supabase.from('medios_pago').select('*').eq('negocio_id', nid).eq('activo', true)).data || []) {
      const { data: pagos } = await supabase.from('ventas_pagos')
        .select('monto, comision, neto, ventas!inner(negocio_id, fecha, estado)')
        .eq('medio_pago_id', medio.id)
        .eq('ventas.negocio_id', nid)
        .eq('ventas.estado', 'Completada')
        .gte('ventas.fecha', desde)

      const ventas = pagos?.reduce((a, p) => a + Number(p.monto), 0) || 0
      const comisiones = pagos?.reduce((a, p) => a + Number(p.comision), 0) || 0
      res.push({ medio: medio.nombre, tipo: medio.tipo, ventas, comisiones, neto: ventas - comisiones })
    }
    setResumen(res)
  }

  async function abrirCaja() {
    if (!negocioId) return
    setLoading(true)
    await createClient().from('cajas').insert({ negocio_id: negocioId, fondo_inicial: fondoInicial, estado: 'Abierta' })
    await cargar(negocioId)
    setLoading(false)
  }

  async function cerrarCaja() {
    if (!cajaActual || !negocioId) return
    setLoading(true)
    const totalVendido = resumen.reduce((a, r) => a + r.ventas, 0)
    const totalComisiones = resumen.reduce((a, r) => a + r.comisiones, 0)
    const totalReal = resumen.reduce((a, r) => a + r.neto, 0)
    const efectivoEsperado = cajaActual.fondo_inicial + (resumen.find(r => r.tipo === 'Efectivo')?.ventas || 0)
    const diferencia = efectivoContado - efectivoEsperado

    await createClient().from('cajas').update({
      estado: 'Cerrada', fecha_cierre: new Date().toISOString(),
      efectivo_esperado: efectivoEsperado, efectivo_contado: efectivoContado,
      diferencia_efectivo: diferencia, total_vendido: totalVendido,
      total_real_recibido: totalReal, total_comisiones: totalComisiones,
    }).eq('id', cajaActual.id)

    setCajaActual(null); setResumen([]); setEfectivoContado(0)
    await cargar(negocioId)
    setLoading(false)
  }

  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  const totalVendido = resumen.reduce((a, r) => a + r.ventas, 0)
  const totalComisiones = resumen.reduce((a, r) => a + r.comisiones, 0)
  const efectivoEsperado = cajaActual ? cajaActual.fondo_inicial + (resumen.find(r => r.tipo === 'Efectivo')?.ventas || 0) : 0

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>💰 Caja</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Control de apertura y cierre</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
          <div className="stat-card" style={{ borderTop: `3px solid ${cajaActual ? '#22C55E' : '#ef4444'}` }}>
            <div className="stat-value" style={{ color: cajaActual ? '#22C55E' : '#ef4444', fontSize: 20 }}>{cajaActual ? 'Abierta' : 'Cerrada'}</div>
            <div className="stat-label">Estado de Caja</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #22C55E' }}>
            <div className="stat-value" style={{ color: '#22C55E', fontSize: 20 }}>{fmt(totalVendido)}</div>
            <div className="stat-label">Total Vendido</div>
          </div>
          <div className="stat-card" style={{ borderTop: '3px solid #f97316' }}>
            <div className="stat-value" style={{ color: '#f97316', fontSize: 20 }}>{fmt(totalComisiones)}</div>
            <div className="stat-label">Comisiones</div>
          </div>
        </div>

        {!cajaActual ? (
          <div className="card">
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Apertura de Caja</h3>
            <div style={{ maxWidth: 300 }}>
              <label className="label">Fondo inicial ($)</label>
              <input className="input" type="number" value={fondoInicial || ''} onChange={e => setFondoInicial(parseFloat(e.target.value)||0)} placeholder="0.00" style={{ marginBottom: 16 }} />
              <button className="btn-primary" onClick={abrirCaja} disabled={loading}>{loading ? 'Abriendo...' : 'Abrir Caja'}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Corte por medio de pago</h3>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Fondo inicial: {fmt(cajaActual.fondo_inicial)}</span>
              </div>
              <table className="tabla">
                <thead><tr><th>Medio</th><th>Ventas</th><th>Comisión</th><th>Neto</th></tr></thead>
                <tbody>
                  {resumen.length === 0 ? (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Sin movimientos en esta caja</td></tr>
                  ) : resumen.map(r => (
                    <tr key={r.medio}>
                      <td>{r.medio}</td>
                      <td>{fmt(r.ventas)}</td>
                      <td style={{ color: r.comisiones > 0 ? '#f97316' : 'var(--text-muted)' }}>{fmt(r.comisiones)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(r.neto)}</td>
                    </tr>
                  ))}
                  <tr style={{ fontWeight: 700 }}>
                    <td style={{ fontFamily: 'Syne' }}>TOTAL</td>
                    <td style={{ color: 'var(--green)' }}>{fmt(totalVendido)}</td>
                    <td style={{ color: '#f97316' }}>{fmt(totalComisiones)}</td>
                    <td style={{ color: 'var(--green)' }}>{fmt(totalVendido - totalComisiones)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Cierre de Caja</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label className="label">Efectivo esperado</label>
                  <input className="input" value={fmt(efectivoEsperado)} readOnly style={{ color: 'var(--text-muted)' }} />
                </div>
                <div>
                  <label className="label">Efectivo contado físicamente</label>
                  <input className="input" type="number" value={efectivoContado || ''} onChange={e => setEfectivoContado(parseFloat(e.target.value)||0)} placeholder="0.00" />
                </div>
                <div>
                  <label className="label">Diferencia</label>
                  <input className="input" value={fmt(efectivoContado - efectivoEsperado)} readOnly style={{ color: efectivoContado - efectivoEsperado < 0 ? '#ef4444' : '#22C55E' }} />
                </div>
              </div>
              <button className="btn-primary" onClick={cerrarCaja} disabled={loading}>{loading ? 'Cerrando...' : 'Cerrar Caja'}</button>
            </div>
          </>
        )}

        {historial.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Historial de cierres</h2>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="tabla">
                <thead><tr><th>Apertura</th><th>Cierre</th><th>Fondo</th><th>Total vendido</th><th>Comisiones</th><th>Diferencia</th></tr></thead>
                <tbody>
                  {historial.map(h => (
                    <tr key={h.id}>
                      <td style={{ fontSize: 12 }}>{new Date(h.fecha_apertura).toLocaleString('es-MX')}</td>
                      <td style={{ fontSize: 12 }}>{h.fecha_cierre ? new Date(h.fecha_cierre).toLocaleString('es-MX') : '—'}</td>
                      <td>{fmt(h.fondo_inicial)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--green)' }}>{fmt(h.total_vendido)}</td>
                      <td style={{ color: '#f97316' }}>{fmt(h.total_comisiones)}</td>
                      <td style={{ color: h.diferencia_efectivo < 0 ? '#ef4444' : '#22C55E', fontWeight: 600 }}>{fmt(h.diferencia_efectivo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
