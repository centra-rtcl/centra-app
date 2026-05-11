import Sidebar from '@/components/Sidebar'
export default function Ajustes() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>⚖️ Ajustes de Inventario</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Daños, mermas, robos y diferencias en conteo</p>
          </div>
          <button className="btn-primary">+ Nuevo Ajuste</button>
        </div>
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          🔒 Todo ajuste requiere autorización del dueño. El inventario solo se modifica si se aprueba.
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Folio</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Costo</th><th>Reportado por</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚖️</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin ajustes registrados</div>
              </td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Registrar Ajuste</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div><label className="label">Tipo de ajuste *</label><select className="select"><option>Daño</option><option>Merma</option><option>Caducidad</option><option>Robo</option><option>Uso interno</option><option>Diferencia en conteo</option></select></div>
            <div><label className="label">Producto *</label><select className="select"><option>Seleccionar producto</option></select></div>
            <div><label className="label">Cantidad afectada *</label><input className="input" placeholder="0" type="number" /></div>
          </div>
          <div style={{ marginTop: 16 }}><label className="label">Razón / Descripción * (obligatorio)</label><input className="input" placeholder="Describe qué ocurrió" /></div>
          <div style={{ marginTop: 16 }}><label className="label">Foto de evidencia (obligatoria en Daño y Robo)</label>
            <div style={{ border: '2px dashed var(--border)', borderRadius: 8, padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}>
              📷 Toca para adjuntar foto de evidencia
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Enviar para Autorización</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
