'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

export default function Inventario() {
  const [productos, setProductos] = useState<any[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState('Todos')
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const { data } = await createClient().from('productos').select('*').eq('negocio_id', nid).eq('activo', true).order('nombre')
    setProductos(data || [])
  }

  const fmt = (n: number) => `$${Number(n).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
  const valorTotal = productos.reduce((a, p) => a + (Number(p.stock_actual) * Number(p.precio_compra)), 0)
  const enMinimo = productos.filter(p => Number(p.stock_actual) <= Number(p.stock_minimo) && Number(p.stock_actual) > 0).length
  const agotados = productos.filter(p => Number(p.stock_actual) <= 0).length

  const filtrados = productos
    .filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .filter(p => {
      if (filtro === 'Mínimo') return Number(p.stock_actual) <= Number(p.stock_minimo) && Number(p.stock_actual) > 0
      if (filtro === 'Agotados') return Number(p.stock_actual) <= 0
      return true
    })

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📋 Inventario</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Existencias actuales del negocio</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Valor inventario', value: fmt(valorTotal), color: '#22C55E' },
            { label: 'Total productos', value: productos.length, color: '#3b82f6' },
            { label: 'Stock mínimo', value: enMinimo, color: '#eab308' },
            { label: 'Agotados', value: agotados, color: '#ef4444' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="stat-value" style={{ color: s.color, fontSize: 20 }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input className="input" placeholder="Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} style={{ maxWidth: 300 }} />
          {['Todos', 'Mínimo', 'Agotados'].map(f => (
            <button key={f} onClick={() => setFiltro(f)} style={{
              padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
              background: filtro === f ? 'var(--green)' : 'transparent',
              color: filtro === f ? '#000' : 'var(--text-muted)',
              fontWeight: filtro === f ? 700 : 400, fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans'
            }}>{f}</button>
          ))}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tabla">
            <thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Mínimo</th><th>Máximo</th><th>Valor</th><th>Estado</th></tr></thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                  <div style={{ fontWeight: 600 }}>Sin productos en inventario</div>
                </td></tr>
              ) : filtrados.map(p => {
                const stock = Number(p.stock_actual)
                const min = Number(p.stock_minimo)
                const estado = stock <= 0 ? 'Agotado' : stock <= min ? 'Mínimo' : 'OK'
                const colorEstado = stock <= 0 ? 'badge-red' : stock <= min ? 'badge-yellow' : 'badge-green'
                return (
                  <tr key={p.id}>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.codigo || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                    <td>{p.categoria || '—'}</td>
                    <td style={{ fontWeight: 700, color: stock <= 0 ? '#ef4444' : stock <= min ? '#eab308' : '#22C55E', fontSize: 16 }}>{stock}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.stock_minimo}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{p.stock_maximo}</td>
                    <td>{fmt(stock * Number(p.precio_compra))}</td>
                    <td><span className={`badge ${colorEstado}`}>{estado}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
