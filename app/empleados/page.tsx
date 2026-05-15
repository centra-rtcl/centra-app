'use client'
import { useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@/app/lib/supabase-client'

const empty = { nombre: '', correo: '', telefono: '', puesto: '', fecha_ingreso: '', fecha_ingreso_negocio: '', tipo_pago: 'Sueldo fijo', salario_base: 0, dia_pago: 'Quincenal', num_cuenta_bancaria: '', banco: '', clabe_interbancaria: '', nss: '', contacto_emergencia_nombre: '', contacto_emergencia_telefono: '', contacto_emergencia_parentesco: '', puede_ventas: false, puede_compras: false, puede_recepciones: false, puede_ajustes: false, puede_salidas: false, puede_caja: false, puede_reportes: false, activo: true }

const permisos = [
  { key: 'puede_ventas', label: 'Ventas' },
  { key: 'puede_compras', label: 'Compras' },
  { key: 'puede_recepciones', label: 'Recepciones' },
  { key: 'puede_ajustes', label: 'Ajustes' },
  { key: 'puede_salidas', label: 'Salidas' },
  { key: 'puede_caja', label: 'Caja' },
  { key: 'puede_reportes', label: 'Reportes' },
]

export default function Empleados() {
  const [empleados, setEmpleados] = useState<any[]>([])
  const [form, setForm] = useState<any>(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [tab, setTab] = useState('info')
  const [loading, setLoading] = useState(false)
  const [negocioId, setNegocioId] = useState<string | null>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) cargar(id)
  }, [])

  async function cargar(nid: string) {
    const { data } = await createClient().from('empleados').select('*').eq('negocio_id', nid).order('nombre')
    setEmpleados(data || [])
  }

  function set(field: string, value: any) { setForm((p: any) => ({ ...p, [field]: value })) }

  async function guardar() {
    if (!form.nombre || !negocioId) return
    setLoading(true)
    const supabase = createClient()
    const payload = { ...form, fecha_ingreso: form.fecha_ingreso || null, fecha_ingreso_negocio: form.fecha_ingreso_negocio || null }
    if (editId) {
      await supabase.from('empleados').update(payload).eq('id', editId)
    } else {
      await supabase.from('empleados').insert({ ...payload, negocio_id: negocioId })
    }
    await cargar(negocioId)
    setForm(empty); setEditId(null); setShowForm(false); setLoading(false); setTab('info')
  }

  async function toggleActivo(id: string, activo: boolean) {
    await createClient().from('empleados').update({ activo: !activo }).eq('id', id)
    if (negocioId) cargar(negocioId)
  }

  function editar(e: any) {
    setForm({ ...empty, ...e, fecha_ingreso: e.fecha_ingreso||'', fecha_ingreso_negocio: e.fecha_ingreso_negocio||'' })
    setEditId(e.id); setShowForm(true); setTab('info')
  }

  const permisosActivos = (e: any) => permisos.filter(p => e[p.key]).map(p => p.label).join(', ') || 'Sin permisos'

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>👤 Empleados</h1>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 14 }}>{empleados.length} empleados registrados</p>
          </div>
          <button className="btn-primary" onClick={() => { setForm(empty); setEditId(null); setShowForm(true); setTab('info') }}>+ Nuevo Empleado</button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
          <table className="tabla">
            <thead><tr><th>Nombre</th><th>Puesto</th><th>Tipo pago</th><th>Permisos</th><th>Estado</th><th></th></tr></thead>
            <tbody>
              {empleados.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>👤</div>
                  <div style={{ fontWeight: 600 }}>Sin empleados — como dueño tienes acceso total</div>
                </td></tr>
              ) : empleados.map(e => (
                <tr key={e.id}>
                  <td><div style={{ fontWeight: 600 }}>{e.nombre}</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.correo}</div></td>
                  <td>{e.puesto || '—'}</td>
                  <td>{e.tipo_pago}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 200 }}>{permisosActivos(e)}</td>
                  <td><span className={`badge ${e.activo ? 'badge-green' : 'badge-red'}`}>{e.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => editar(e)} style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontSize: 13 }}>Editar</button>
                      <button onClick={() => toggleActivo(e.id, e.activo)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13 }}>{e.activo ? 'Desactivar' : 'Activar'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showForm && (
          <div className="card">
            <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700 }}>{editId ? 'Editar' : 'Nuevo'} Empleado</h3>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
              {[['info','📋 Información'],['pago','💰 Pago'],['emergencia','🆘 Emergencia'],['permisos','🔐 Permisos']].map(([t,l]) => (
                <button key={t} onClick={() => setTab(t)} style={{
                  padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontFamily: 'DM Sans', fontWeight: tab===t ? 700 : 400,
                  color: tab===t ? 'var(--green)' : 'var(--text-muted)',
                  borderBottom: tab===t ? '2px solid var(--green)' : '2px solid transparent',
                  marginBottom: -1
                }}>{l}</button>
              ))}
            </div>

            {tab === 'info' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['nombre','Nombre completo *','Tu nombre'],['correo','Correo','empleado@correo.com'],['telefono','Teléfono','55 1234 5678'],['puesto','Puesto','Cajero, Almacenista...']].map(([f,l,p]) => (
                  <div key={f}><label className="label">{l}</label><input className="input" placeholder={p} value={form[f]} onChange={e => set(f, e.target.value)} /></div>
                ))}
                <div><label className="label">Fecha de ingreso</label><input className="input" type="date" value={form.fecha_ingreso} onChange={e => set('fecha_ingreso', e.target.value)} /></div>
                <div><label className="label">Fecha ingreso al negocio</label><input className="input" type="date" value={form.fecha_ingreso_negocio} onChange={e => set('fecha_ingreso_negocio', e.target.value)} /></div>
              </div>
            )}

            {tab === 'pago' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label className="label">Tipo de pago</label><select className="select" value={form.tipo_pago} onChange={e => set('tipo_pago', e.target.value)}><option>Sueldo fijo</option><option>Comisión</option><option>Mixto</option></select></div>
                <div><label className="label">Día de pago</label><select className="select" value={form.dia_pago} onChange={e => set('dia_pago', e.target.value)}><option>Semanal</option><option>Quincenal</option><option>Mensual</option></select></div>
                <div><label className="label">Salario base ($)</label><input className="input" type="number" value={form.salario_base} onChange={e => set('salario_base', parseFloat(e.target.value)||0)} /></div>
                <div><label className="label">Banco</label><input className="input" placeholder="Nombre del banco" value={form.banco} onChange={e => set('banco', e.target.value)} /></div>
                <div><label className="label">Número de cuenta</label><input className="input" placeholder="Número de cuenta" value={form.num_cuenta_bancaria} onChange={e => set('num_cuenta_bancaria', e.target.value)} /></div>
                <div><label className="label">CLABE interbancaria</label><input className="input" placeholder="18 dígitos" value={form.clabe_interbancaria} onChange={e => set('clabe_interbancaria', e.target.value)} /></div>
                <div><label className="label">NSS</label><input className="input" placeholder="Número de Seguro Social" value={form.nss} onChange={e => set('nss', e.target.value)} /></div>
              </div>
            )}

            {tab === 'emergencia' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label className="label">Nombre del contacto</label><input className="input" placeholder="Nombre completo" value={form.contacto_emergencia_nombre} onChange={e => set('contacto_emergencia_nombre', e.target.value)} /></div>
                <div><label className="label">Teléfono del contacto</label><input className="input" placeholder="55 1234 5678" value={form.contacto_emergencia_telefono} onChange={e => set('contacto_emergencia_telefono', e.target.value)} /></div>
                <div><label className="label">Parentesco</label><input className="input" placeholder="Mamá, Esposa, Hijo..." value={form.contacto_emergencia_parentesco} onChange={e => set('contacto_emergencia_parentesco', e.target.value)} /></div>
              </div>
            )}

            {tab === 'permisos' && (
              <div>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>Define qué módulos puede usar este empleado dentro de Centra.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                  {permisos.map(p => (
                    <label key={p.key} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                      background: form[p.key] ? 'rgba(34,197,94,0.1)' : 'var(--surface2)',
                      border: `1px solid ${form[p.key] ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                      borderRadius: 8, cursor: 'pointer', fontSize: 14,
                      color: form[p.key] ? 'var(--green)' : 'var(--text-muted)',
                    }}>
                      <input type="checkbox" checked={form[p.key]} onChange={e => set(p.key, e.target.checked)} style={{ accentColor: 'var(--green)' }} />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="btn-primary" onClick={guardar} disabled={loading}>{loading ? 'Guardando...' : 'Guardar Empleado'}</button>
              <button className="btn-secondary" onClick={() => { setShowForm(false); setEditId(null) }}>Cancelar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
