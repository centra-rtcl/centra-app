import Sidebar from '@/components/Sidebar'

export default function Productos() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>📦 Productos</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>Catálogo de productos del negocio</p>
          </div>
          <button className="btn-primary">+ Nuevo Producto</button>
        </div>

        <div style={{ marginBottom: 20, display: 'flex', gap: 12 }}>
          <input className="input" placeholder="Buscar por nombre o código..." style={{ maxWidth: 340 }} />
          <select className="select" style={{ maxWidth: 180 }}>
            <option>Todas las categorías</option>
          </select>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>IVA</th>
                <th>Stock</th>
                <th>Stock Mín</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
                  <div style={{ fontWeight: 600, marginBottom: 8 }}>Sin productos registrados</div>
                  <div style={{ fontSize: 13 }}>Primero registra proveedores, luego agrega productos</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ padding: 24, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>Nuevo Producto</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Código (deja vacío para auto-asignar)', placeholder: 'Escanea o escribe el código de barras' },
              { label: 'Nombre del producto *', placeholder: 'Nombre del producto' },
              { label: 'Descripción', placeholder: 'Descripción detallada' },
              { label: 'Categoría', placeholder: 'Ej: Bebidas, Lácteos, Limpieza...' },
            ].map(f => (
              <div key={f.label}>
                <label className="label">{f.label}</label>
                <input className="input" placeholder={f.placeholder} />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">Unidad de medida — Compra</label>
              <select className="select">
                <option>Caja</option><option>Pallet</option><option>Kilo</option><option>Litro</option><option>Pieza</option>
              </select>
            </div>
            <div>
              <label className="label">Unidad de medida — Venta</label>
              <select className="select">
                <option>Pieza</option><option>Litro</option><option>Kilo</option><option>ml</option><option>gr</option>
              </select>
            </div>
            <div>
              <label className="label">IVA</label>
              <select className="select">
                <option>16%</option><option>8%</option><option>0%</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">Precio de compra ($) *</label>
              <input className="input" placeholder="0.00" type="number" />
            </div>
            <div>
              <label className="label">Precio de venta ($) *</label>
              <input className="input" placeholder="0.00" type="number" />
            </div>
            <div>
              <label className="label">Proveedor principal</label>
              <select className="select">
                <option>Seleccionar proveedor</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label className="label">Stock mínimo</label>
              <input className="input" placeholder="0" type="number" />
            </div>
            <div>
              <label className="label">Stock máximo</label>
              <input className="input" placeholder="0" type="number" />
            </div>
            <div>
              <label className="label">¿Maneja caducidad?</label>
              <select className="select">
                <option>No</option><option>Sí</option>
              </select>
            </div>
            <div>
              <label className="label">Fecha de caducidad</label>
              <input className="input" type="date" />
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label className="label">Foto del producto</label>
            <div style={{
              border: '2px dashed var(--border)', borderRadius: 8, padding: 24,
              textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer'
            }}>
              📷 Toca aquí para tomar foto o seleccionar de galería
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btn-primary">Guardar Producto</button>
            <button className="btn-secondary">Cancelar</button>
          </div>
        </div>
      </main>
    </div>
  )
}
