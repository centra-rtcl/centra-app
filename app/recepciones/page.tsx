import Sidebar from '@/components/Sidebar'
export default function Recepciones() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📬 Recepciones</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Confirma lo que llegó de tus órdenes de compra</p>
          </div>
        </div>
        <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          ⚠️ El inventario solo se actualiza cuando confirmas una recepción. No antes.
        </div>
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Folio OC</th><th>Proveedor</th><th>Fecha recepción</th><th>Comprobante</th><th>Forma pago</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin recepciones</div>
                <div style={{ fontSize: 13 }}>Crea una orden de compra primero</div>
              </td></tr>
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Registrar Recepción</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div><label className="label">Orden de compra *</label><select className="select"><option>Seleccionar orden abierta</option></select></div>
            <div><label className="label">Fecha de recepción</label><input className="input" type="datetime-local" /></div>
            <div><label className="label">Tipo de comprobante</label><select className="select"><option>Factura</option><option>Remisión</option><option>Sin comprobante</option></select></div>
            <div><label className="label">Folio del comprobante</label><input className="input" placeholder="Número de factura o remisión" /></div>
            <div><label className="label">Forma de pago</label><select className="select"><option>Contado</option><option>Crédito</option><option>Consigna</option></select></div>
            <div><label className="label">Monto pagado ($)</label><input className="input" placeholder="0.00" type="number" /></div>
          </div>
          <div style={{ marginTop: 24, fontWeight: 600, marginBottom: 12 }}>Productos recibidos</div>
          <table className="tabla">
            <thead><tr><th>Producto</th><th>Pedido</th><th>Recibido</th><th>Condición</th><th>¿Cerrar línea?</th></tr></thead>
            <tbody><tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>Selecciona una orden para ver los productos</td></tr></tbody>
          </table>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Confirmar Recepción</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
