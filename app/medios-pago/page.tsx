import Sidebar from '@/components/Sidebar'

export default function MediosPago() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>💳 Medios de Pago</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Configura cómo recibes dinero en tu negocio</p>
          </div>
          <button className="btn-primary">+ Nuevo Medio</button>
        </div>

        <div style={{
          background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)'
        }}>
          💡 Solo activa los medios que usas. Solo esos aparecerán disponibles al registrar una venta.
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Banco</th>
                <th>Últimos 4 dígitos</th>
                <th>Comisión %</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>💳</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin medios de pago configurados</div>
                  <div style={{ fontSize: 13 }}>Configura al menos Efectivo para comenzar a vender</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nuevo Medio de Pago</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Tipo *</label>
              <select className="select">
                <option>Efectivo</option>
                <option>Tarjeta Crédito</option>
                <option>Tarjeta Débito</option>
                <option>Transferencia</option>
              </select>
            </div>
            <div>
              <label className="label">Nombre *</label>
              <input className="input" placeholder="Ej: Caja principal, Terminal Banamex, Cuenta BBVA" />
            </div>
            <div>
              <label className="label">Banco</label>
              <input className="input" placeholder="Nombre del banco" />
            </div>
            <div>
              <label className="label">Últimos 4 dígitos</label>
              <input className="input" placeholder="1234" maxLength={4} />
            </div>
            <div>
              <label className="label">CLABE (para transferencias)</label>
              <input className="input" placeholder="18 dígitos" />
            </div>
            <div>
              <label className="label">Comisión % (para terminales)</label>
              <input className="input" placeholder="0.00" type="number" step="0.01" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Guardar Medio de Pago</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
