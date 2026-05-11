import Sidebar from '@/components/Sidebar'
export default function Inventario() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📋 Inventario</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Conteos físicos y verificación de existencias</p>
          </div>
          <button className="btn-primary">+ Nuevo Conteo</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>
          {[{label:'Total productos',value:'0',color:'var(--green)'},{label:'Stock mínimo',value:'0',color:'#eab308'},{label:'Agotados',value:'0',color:'#ef4444'}].map(s=>(
            <div key={s.label} className="stat-card"><div className="stat-value" style={{color:s.color}}>{s.value}</div><div className="stat-label">{s.label}</div></div>
          ))}
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tabla">
            <thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Stock actual</th><th>Stock mín</th><th>Stock máx</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin productos en inventario</div>
                <div style={{ fontSize: 13 }}>El inventario se actualiza automáticamente con compras y ventas</div>
              </td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
