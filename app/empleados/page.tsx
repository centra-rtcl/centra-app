import Sidebar from '@/components/Sidebar'

export default function Empleados() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>👤 Empleados</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Control de equipo y permisos</p>
          </div>
          <button className="btn-primary">+ Nuevo Empleado</button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Puesto</th>
                <th>Correo</th>
                <th>Ventas</th>
                <th>Compras</th>
                <th>Caja</th>
                <th>Reportes</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin empleados registrados</div>
                  <div style={{ fontSize: 13 }}>Como dueño tienes acceso total al sistema</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nuevo Empleado</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Nombre completo *', placeholder: 'Nombre del empleado' },
              { label: 'Correo electrónico *', placeholder: 'correo@negocio.com' },
              { label: 'Teléfono', placeholder: '55 1234 5678' },
              { label: 'Puesto', placeholder: 'Ej: Cajero, Almacenista, Gerente' },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">Fecha de ingreso</label>
              <input className="input" type="date" />
            </div>
            <div>
              <label className="label">Tipo de pago</label>
              <select className="select">
                <option>Sueldo fijo</option><option>Comisión</option><option>Mixto</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 24, marginBottom: 12, fontWeight: 600, fontSize: 15 }}>Permisos del sistema</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              '¿Puede registrar ventas?',
              '¿Puede registrar compras?',
              '¿Puede recibir mercancía?',
              '¿Puede registrar ajustes?',
              '¿Puede registrar salidas?',
              '¿Puede abrir/cerrar caja?',
              '¿Puede ver reportes?',
            ].map(p => (
              <label key={p} style={{
                display: 'flex', alignItems: 'center', gap: 8, fontSize: 13,
                color: 'var(--text-muted)', cursor: 'pointer', padding: '10px 12px',
                background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)'
              }}>
                <input type="checkbox" style={{ accentColor: 'var(--green)' }} />
                {p.replace('¿Puede ', '').replace('?', '')}
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Guardar Empleado</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
