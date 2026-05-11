import Sidebar from '@/components/Sidebar'

export default function Proveedores() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🏭 Proveedores</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Catálogo de proveedores del negocio</p>
          </div>
          <button className="btn-primary">+ Nuevo Proveedor</button>
        </div>

        {/* Buscador */}
        <div style={{ marginBottom: 20 }}>
          <input className="input" placeholder="Buscar proveedor por nombre, RFC o contacto..." style={{ maxWidth: 400 }} />
        </div>

        {/* Tabla */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>RFC</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Crédito</th>
                <th>Consigna</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🏭</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin proveedores registrados</div>
                  <div style={{ fontSize: 13 }}>Agrega tu primer proveedor para comenzar</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Form modal placeholder */}
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nuevo Proveedor</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Nombre / Razón Social *', placeholder: 'Nombre del proveedor' },
              { label: 'RFC', placeholder: 'RFC del proveedor' },
              { label: 'Correo electrónico', placeholder: 'correo@proveedor.com' },
              { label: 'Teléfono', placeholder: '55 1234 5678' },
              { label: 'Persona de contacto', placeholder: 'Nombre del representante' },
              { label: 'Dirección', placeholder: 'Domicilio del proveedor' },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">¿Maneja crédito?</label>
              <select className="select">
                <option>No</option>
                <option>Sí</option>
              </select>
            </div>
            <div>
              <label className="label">Días de crédito</label>
              <select className="select">
                <option>15 días</option>
                <option>30 días</option>
                <option>60 días</option>
                <option>90 días</option>
              </select>
            </div>
            <div>
              <label className="label">Límite de crédito ($)</label>
              <input className="input" placeholder="0.00" type="number" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">¿Maneja consigna?</label>
              <select className="select">
                <option>No</option>
                <option>Sí</option>
              </select>
            </div>
            <div>
              <label className="label">Condiciones de consigna</label>
              <input className="input" placeholder="Descripción de condiciones" />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="label">Notas</label>
            <input className="input" placeholder="Observaciones adicionales" />
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Guardar Proveedor</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
