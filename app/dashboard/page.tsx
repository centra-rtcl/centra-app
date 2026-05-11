import Sidebar from '@/components/Sidebar'

const stats = [
  { label: 'Ventas Hoy', value: '$0.00', icon: '📈', color: '#22C55E' },
  { label: 'Gastos Hoy', value: '$0.00', icon: '📉', color: '#ef4444' },
  { label: 'Utilidad', value: '$0.00', icon: '💵', color: '#3b82f6' },
  { label: 'En Caja', value: '$0.00', icon: '💰', color: '#eab308' },
  { label: 'Por Cobrar', value: '$0.00', icon: '🔔', color: '#8b5cf6' },
  { label: 'Por Pagar', value: '$0.00', icon: '🧾', color: '#f97316' },
  { label: 'Valor Inventario', value: '$0.00', icon: '📦', color: '#06b6d4' },
  { label: 'Comisiones', value: '$0.00', icon: '💳', color: '#ec4899' },
]

const alertas = [
  { tipo: 'warning', msg: 'Aún no tienes productos registrados. Comienza por el catálogo.' },
  { tipo: 'info', msg: 'Registra tus medios de pago antes de tu primera venta.' },
  { tipo: 'success', msg: 'Centra está conectado y listo para operar.' },
]

export default function Dashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Vista general de tu negocio</p>
        </div>

        {/* Filtro tiempo */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
          {['Hoy', 'Ayer', '7 días', '15 días', '30 días'].map((f, i) => (
            <button key={f} style={{
              padding: '7px 16px',
              borderRadius: 20,
              border: '1px solid var(--border)',
              background: i === 0 ? 'var(--green)' : 'transparent',
              color: i === 0 ? '#000' : 'var(--text-muted)',
              fontWeight: i === 0 ? 700 : 400,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'DM Sans',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 32,
        }}>
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>

          {/* Alertas */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>⚠️ Alertas inteligentes</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {alertas.map((a, i) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: a.tipo === 'warning' ? 'rgba(234,179,8,0.08)' : a.tipo === 'info' ? 'rgba(59,130,246,0.08)' : 'rgba(34,197,94,0.08)',
                  borderLeft: `3px solid ${a.tipo === 'warning' ? '#eab308' : a.tipo === 'info' ? '#3b82f6' : '#22C55E'}`,
                  fontSize: 13,
                  color: 'var(--text)',
                  lineHeight: 1.5,
                }}>
                  {a.msg}
                </div>
              ))}
            </div>
          </div>

          {/* Rendimiento */}
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>📈 Rendimiento</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Producto más vendido', value: '—' },
                { label: 'Producto más rentable', value: '—' },
                { label: 'Hora pico de ventas', value: '—' },
                { label: 'Forma de pago más usada', value: '—' },
                { label: 'Ticket promedio', value: '$0.00' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ fontWeight: 600, color: 'var(--green)' }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventario y Compras */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>📦 Inventario</h3>
            {[
              { label: 'Productos en stock mínimo', value: '0', color: '#eab308' },
              { label: 'Productos agotados', value: '0', color: '#ef4444' },
              { label: 'Productos por caducar', value: '0', color: '#f97316' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700 }}>🛒 Compras</h3>
            {[
              { label: 'Compras recibidas', value: '0' },
              { label: 'Pendientes de recibir', value: '0' },
              { label: 'Proveedores con saldo', value: '$0.00' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14 }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--green)' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
