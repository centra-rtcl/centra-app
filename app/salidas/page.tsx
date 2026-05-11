import Sidebar from '@/components/Sidebar'
export default function Salidas() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📤 Salidas de Inventario</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Salidas que no son ventas — uso interno, especie, donaciones</p>
          </div>
          <button className="btn-primary">+ Nueva Salida</button>
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Folio</th><th>Tipo</th><th>Producto</th><th>Cantidad</th><th>Costo</th><th>Empleado</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📤</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin salidas registradas</div>
              </td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nueva Salida</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div><label className="label">Tipo de salida *</label><select className="select"><option>Uso interno</option><option>Pago en especie</option><option>Donación</option><option>Traspaso</option><option>Degustación</option></select></div>
            <div><label className="label">Producto *</label><select className="select"><option>Seleccionar producto</option></select></div>
            <div><label className="label">Cantidad *</label><input className="input" placeholder="0" type="number" /></div>
            <div><label className="label">Empleado relacionado</label><select className="select"><option>N/A</option></select></div>
            <div style={{ gridColumn: 'span 2' }}><label className="label">Razón / Descripción *</label><input className="input" placeholder="Explica el motivo de la salida" /></div>
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
