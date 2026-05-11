import Sidebar from '@/components/Sidebar'

export default function Compras() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🛒 Compras</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Órdenes de compra a proveedores</p>
          </div>
          <button className="btn-primary">+ Nueva Orden</button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Proveedor</th>
                <th>Fecha pedido</th>
                <th>Entrega estimada</th>
                <th>Condición</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🛒</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin órdenes de compra</div>
                  <div style={{ fontSize: 13 }}>Las órdenes no afectan inventario hasta ser recibidas</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nueva Orden de Compra</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Proveedor *</label>
              <select className="select"><option>Seleccionar proveedor</option></select>
            </div>
            <div>
              <label className="label">Fecha de pedido</label>
              <input className="input" type="date" />
            </div>
            <div>
              <label className="label">Fecha estimada de entrega</label>
              <input className="input" type="date" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">Condición de pago</label>
              <select className="select">
                <option>Contado</option><option>Crédito</option><option>Consigna</option>
              </select>
            </div>
            <div>
              <label className="label">Notas</label>
              <input className="input" placeholder="Instrucciones especiales" />
            </div>
          </div>

          <div style={{ marginTop: 24, marginBottom: 12, fontWeight: 600 }}>Productos a pedir</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input className="input" placeholder="Buscar producto..." />
            <button className="btn-secondary">Agregar</button>
          </div>
          <table className="tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Unidad</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                  Agrega productos a la orden
                </td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Guardar Orden de Compra</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
