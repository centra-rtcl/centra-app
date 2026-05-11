import Sidebar from '@/components/Sidebar'

export default function Ventas() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🏷️ Ventas</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Registro de ventas del negocio</p>
          </div>
          <button className="btn-primary">+ Nueva Venta</button>
        </div>

        {/* POS Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

          {/* Productos */}
          <div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
              <input className="input" placeholder="🔍 Buscar producto por nombre o código..." />
              <button className="btn-secondary" style={{ whiteSpace: 'nowrap' }}>📷 Escanear</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table className="tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🛒</div>
                      <div style={{ fontWeight: 600, marginBottom: 8 }}>Carrito vacío</div>
                      <div style={{ fontSize: 13 }}>Busca o escanea productos para agregar</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cobro */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Cliente</h3>
              <select className="select">
                <option>Público General</option>
              </select>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Resumen</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Subtotal', value: '$0.00' },
                  { label: 'IVA', value: '$0.00' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-muted)' }}>
                    <span>{r.label}</span>
                    <span>{r.value}</span>
                  </div>
                ))}
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 22, fontWeight: 800, fontFamily: 'Syne',
                  borderTop: '1px solid var(--border)', paddingTop: 12, marginTop: 4,
                  color: 'var(--green)'
                }}>
                  <span>TOTAL</span>
                  <span>$0.00</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700 }}>Forma de pago</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['💵 Efectivo', '💳 T. Crédito', '💳 T. Débito', '🏦 Transferencia'].map(p => (
                  <button key={p} style={{
                    padding: '10px 8px', borderRadius: 8, border: '1px solid var(--border)',
                    background: 'transparent', color: 'var(--text-muted)', fontSize: 13,
                    cursor: 'pointer', fontFamily: 'DM Sans', textAlign: 'center'
                  }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ padding: '16px', fontSize: 16, borderRadius: 10 }}>
              Cobrar $0.00
            </button>
          </div>
        </div>

        {/* Historial */}
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Ventas recientes</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="tabla">
              <thead>
                <tr>
                  <th>Folio</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Forma de pago</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>
                    No hay ventas registradas aún
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
