import Sidebar from '@/components/Sidebar'

export default function Caja() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>💰 Caja</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Control de apertura y cierre de caja</p>
        </div>

        {/* Estado actual */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
          {[
            { label: 'Estado de Caja', value: 'Cerrada', color: '#ef4444' },
            { label: 'Fondo Inicial', value: '$0.00', color: 'var(--text)' },
            { label: 'Total Vendido Hoy', value: '$0.00', color: 'var(--green)' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Apertura */}
        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Apertura de Caja</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Fondo inicial ($)</label>
              <input className="input" placeholder="0.00" type="number" />
            </div>
            <div>
              <label className="label">Quién abre</label>
              <select className="select"><option>Dueño</option></select>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <button className="btn-primary">Abrir Caja</button>
          </div>
        </div>

        {/* Corte */}
        <div className="card">
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Corte de Caja</h3>
          <table className="tabla">
            <thead>
              <tr>
                <th>Medio de pago</th>
                <th>Ventas</th>
                <th>Comisión</th>
                <th>Neto</th>
              </tr>
            </thead>
            <tbody>
              {['Efectivo', 'Tarjeta Crédito', 'Tarjeta Débito', 'Transferencias'].map(m => (
                <tr key={m}>
                  <td>{m}</td>
                  <td>$0.00</td>
                  <td>$0.00</td>
                  <td style={{ fontWeight: 600, color: 'var(--green)' }}>$0.00</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700 }}>
                <td style={{ fontFamily: 'Syne' }}>TOTALES</td>
                <td style={{ color: 'var(--green)' }}>$0.00</td>
                <td style={{ color: '#ef4444' }}>$0.00</td>
                <td style={{ color: 'var(--green)' }}>$0.00</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
            <div>
              <label className="label">Efectivo contado físicamente ($)</label>
              <input className="input" placeholder="0.00" type="number" />
            </div>
            <div>
              <label className="label">Diferencia</label>
              <input className="input" value="$0.00" readOnly style={{ color: 'var(--green)' }} />
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button className="btn-primary">Cerrar Caja</button>
          </div>
        </div>
      </main>
    </div>
  )
}
