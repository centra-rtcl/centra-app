import Sidebar from '@/components/Sidebar'

export default function Clientes() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>👥 Clientes</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Catálogo de clientes del negocio</p>
          </div>
          <button className="btn-primary">+ Nuevo Cliente</button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <input className="input" placeholder="Buscar cliente por nombre, RFC o teléfono..." style={{ maxWidth: 400 }} />
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>RFC</th>
                <th>Teléfono</th>
                <th>Factura</th>
                <th>Crédito</th>
                <th>Saldo</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>—</td>
                <td style={{ fontWeight: 600 }}>Público General</td>
                <td>—</td>
                <td>—</td>
                <td><span className="badge badge-blue">No</span></td>
                <td><span className="badge badge-blue">No</span></td>
                <td>$0.00</td>
                <td><span className="badge badge-green">Activo</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nuevo Cliente</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Nombre / Razón Social *', placeholder: 'Nombre del cliente' },
              { label: 'RFC', placeholder: 'RFC (requerido si factura)' },
              { label: 'Correo electrónico', placeholder: 'correo@cliente.com' },
              { label: 'Teléfono', placeholder: '55 1234 5678' },
              { label: 'Dirección de entrega', placeholder: 'Dirección si aplica domicilio' },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">¿Requiere factura?</label>
              <select className="select"><option>No</option><option>Sí</option></select>
            </div>
            <div>
              <label className="label">¿Maneja crédito?</label>
              <select className="select"><option>No</option><option>Sí</option></select>
            </div>
            <div>
              <label className="label">Días de crédito</label>
              <select className="select">
                <option>15 días</option><option>30 días</option><option>60 días</option><option>90 días</option>
              </select>
            </div>
            <div>
              <label className="label">Límite de crédito ($)</label>
              <input className="input" placeholder="0.00" type="number" />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="label">Notas</label>
            <input className="input" placeholder="Observaciones adicionales" />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Guardar Cliente</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
