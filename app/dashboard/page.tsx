'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ ventas: 0, gastos: 0, utilidad: 0, inventario: 0, porCobrar: 0, porPagar: 0, comisiones: 0 })
  const [alertas, setAlertas] = useState<string[]>([])
  const [rendimiento, setRendimiento] = useState({ masVendido: '—', masRentable: '—', ticketPromedio: 0 })
  const [inventarioStats, setInventarioStats] = useState({ stockMinimo: 0, agotados: 0, porCaducar: 0 })
  const [comprasStats, setComprasStats] = useState({ recibidas: 0, pendientes: 0, saldoProveedores: 0 })
  const [filtro, setFiltro] = useState('Hoy')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const negocioId = localStorage.getItem('negocio_id')
    if (!negocioId) { router.push('/seleccion-negocio'); return }
    cargarDatos(negocioId)
  }, [filtro])

  async function cargarDatos(negocioId: string) {
    setLoading(true)
    const supabase = createClient()
    const hoy = new Date()
    let desde = new Date()

    if (filtro === 'Hoy') desde.setHours(0,0,0,0)
    else if (filtro === 'Ayer') { desde.setDate(hoy.getDate()-1); desde.setHours(0,0,0,0) }
    else if (filtro === '7 días') desde.setDate(hoy.getDate()-7)
    else if (filtro === '15 días') desde.setDate(hoy.getDate()-15)
    else if (filtro === '30 días') desde.setDate(hoy.getDate()-30)

    // Ventas
    const { data: ventas } = await supabase.from('ventas')
      .select('total, iva').eq('negocio_id', negocioId).eq('estado', 'Completada')
      .gte('fecha', desde.toISOString())
    const totalVentas = ventas?.reduce((a, v) => a + Number(v.total), 0) || 0

    // Gastos
    const { data: gastos } = await supabase.from('gastos')
      .select('monto').eq('negocio_id', negocioId).gte('fecha', desde.toISOString().split('T')[0])
    const totalGastos = gastos?.reduce((a, g) => a + Number(g.monto), 0) || 0

    // Comisiones
    const { data: pagos } = await supabase.from('ventas_pagos')
      .select('comision, venta_id, ventas!inner(negocio_id, fecha)')
      .eq('ventas.negocio_id', negocioId)
    const totalComisiones = pagos?.reduce((a, p) => a + Number(p.comision), 0) || 0

    // Inventario valor
    const { data: prods } = await supabase.from('productos')
      .select('stock_actual, precio_compra, stock_minimo').eq('negocio_id', negocioId).eq('activo', true)
    const valorInventario = prods?.reduce((a, p) => a + (Number(p.stock_actual) * Number(p.precio_compra)), 0) || 0
    const stockMinimo = prods?.filter(p => Number(p.stock_actual) <= Number(p.stock_minimo) && Number(p.stock_actual) > 0).length || 0
    const agotados = prods?.filter(p => Number(p.stock_actual) <= 0).length || 0

    // Por caducar
    const en3dias = new Date(); en3dias.setDate(hoy.getDate()+3)
    const { data: porCaducar } = await supabase.from('productos')
      .select('id').eq('negocio_id', negocioId).eq('maneja_caducidad', true)
      .lte('fecha_caducidad', en3dias.toISOString().split('T')[0])
      .gt('fecha_caducidad', hoy.toISOString().split('T')[0])

    // CxC
    const { data: cxc } = await supabase.from('cuentas_por_cobrar')
      .select('saldo').eq('negocio_id', negocioId).neq('estado', 'Cobrada')
    const totalCxC = cxc?.reduce((a, c) => a + Number(c.saldo), 0) || 0

    // CxP
    const { data: cxp } = await supabase.from('cuentas_por_pagar')
      .select('saldo').eq('negocio_id', negocioId).neq('estado', 'Pagada')
    const totalCxP = cxp?.reduce((a, c) => a + Number(c.saldo), 0) || 0

    // Compras
    const { data: comprasPend } = await supabase.from('ordenes_compra')
      .select('id').eq('negocio_id', negocioId).eq('estado', 'Abierta')
    const { data: comprasRec } = await supabase.from('ordenes_compra')
      .select('id').eq('negocio_id', negocioId).eq('estado', 'Cerrada')
      .gte('created_at', desde.toISOString())

    // Alertas
    const nuevasAlertas: string[] = []
    if (stockMinimo > 0) nuevasAlertas.push(`${stockMinimo} producto(s) en stock mínimo — considera hacer pedidos`)
    if (agotados > 0) nuevasAlertas.push(`${agotados} producto(s) agotado(s)`)
    if ((porCaducar?.length || 0) > 0) nuevasAlertas.push(`${porCaducar?.length} producto(s) vencen en los próximos 3 días`)
    if (totalCxC > 0) nuevasAlertas.push(`Tienes $${totalCxC.toFixed(2)} pendientes de cobrar a clientes`)
    if (totalCxP > 0) nuevasAlertas.push(`Tienes $${totalCxP.toFixed(2)} pendientes de pagar a proveedores`)
    if ((comprasPend?.length || 0) > 0) nuevasAlertas.push(`${comprasPend?.length} orden(es) de compra pendientes de recibir`)
    if (nuevasAlertas.length === 0) nuevasAlertas.push('Todo en orden — tu negocio está operando bien ✅')

    setStats({
      ventas: totalVentas, gastos: totalGastos,
      utilidad: totalVentas - totalGastos - totalComisiones,
      inventario: valorInventario, porCobrar: totalCxC,
      porPagar: totalCxP, comisiones: totalComisiones
    })
    setInventarioStats({ stockMinimo, agotados, porCaducar: porCaducar?.length || 0 })
    setComprasStats({ recibidas: comprasRec?.length || 0, pendientes: comprasPend?.length || 0, saldoProveedores: totalCxP })
    setAlertas(nuevasAlertas)
    setLoading(false)
  }

  const fmt = (n: number) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`

  const statCards = [
    { label: 'Ventas', value: fmt(stats.ventas), icon: '📈', color: '#22C55E' },
    { label: 'Gastos', value: fmt(stats.gastos), icon: '📉', color: '#ef4444' },
    { label: 'Utilidad', value: fmt(stats.utilidad), icon: '💵', color: stats.utilidad >= 0 ? '#3b82f6' : '#ef4444' },
    { label: 'Valor Inventario', value: fmt(stats.inventario), icon: '📦', color: '#06b6d4' },
    { label: 'Por Cobrar', value: fmt(stats.porCobrar), icon: '🔔', color: '#8b5cf6' },
    { label: 'Por Pagar', value: fmt(stats.porPagar), icon: '🧾', color: '#f97316' },
    { label: 'Comisiones', value: fmt(stats.comisiones), icon: '💳', color: '#ec4899' },
  ]

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Vista general de tu negocio</p>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {['Hoy', 'Ayer', '7 días', '15 días', '30 días'].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '7px 16px', borderRadius: 20, border: '1px solid var(--border)',
              background: filtro === f ? 'var(--green)' : 'transparent',
              color: filtro === f ? '#000' : 'var(--text-muted)',
              fontWeight: filtro === f ? 700 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans',
            }}>{f}</button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
          {statCards.map(s => (
            <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: 22 }}>{loading ? '...' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Alertas */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>⚠️ Alertas inteligentes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alertas.map((a, i) => (
                <div key={i} style={{
                  padding: '12px 14px', borderRadius: 8,
                  background: a.includes('✅') ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)',
                  borderLeft: `3px solid ${a.includes('✅') ? '#22C55E' : '#eab308'}`,
                  fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
                }}>{a}</div>
              ))}
            </div>
          </div>

          {/* Inventario */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>📦 Inventario</h3>
            {[
              { label: 'En stock mínimo', value: inventarioStats.stockMinimo, color: '#eab308' },
              { label: 'Agotados', value: inventarioStats.agotados, color: '#ef4444' },
              { label: 'Por caducar (3 días)', value: inventarioStats.porCaducar, color: '#f97316' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.value > 0 ? r.color : 'var(--green)' }}>{loading ? '...' : r.value}</span>
              </div>
            ))}

            <h3 style={{ margin: '20px 0 16px', fontSize: 16, fontWeight: 700 }}>🛒 Compras</h3>
            {[
              { label: 'Órdenes recibidas', value: comprasStats.recibidas },
              { label: 'Pendientes de recibir', value: comprasStats.pendientes },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>{loading ? '...' : r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
