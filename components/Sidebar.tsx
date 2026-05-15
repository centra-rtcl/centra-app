'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'

const nav = [
  { grupo: 'PRINCIPAL', items: [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  ]},
  { grupo: 'CATÁLOGOS', items: [
    { href: '/medios-pago', label: 'Medios de Pago', icon: '💳' },
    { href: '/proveedores', label: 'Proveedores', icon: '🏭' },
    { href: '/productos', label: 'Productos', icon: '📦' },
    { href: '/clientes', label: 'Clientes', icon: '👥' },
    { href: '/empleados', label: 'Empleados', icon: '👤' },
  ]},
  { grupo: 'OPERACIONES', items: [
    { href: '/caja', label: 'Caja', icon: '💰' },
    { href: '/ventas', label: 'Ventas', icon: '🏷️' },
    { href: '/compras', label: 'Compras', icon: '🛒' },
    { href: '/recepciones', label: 'Recepciones', icon: '📬' },
    { href: '/inventario', label: 'Inventario', icon: '📋' },
    { href: '/ajustes', label: 'Ajustes', icon: '⚖️' },
    { href: '/salidas', label: 'Salidas', icon: '📤' },
  ]}
]

export default function Sidebar() {
  const path = usePathname()
  const router = useRouter()
  const [negocio, setNegocio] = useState<any>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    if (id) {
      createClient().from('negocios').select('nombre,giro').eq('id', id).single()
        .then(({ data }) => setNegocio(data))
    }
  }, [])

  async function cerrarSesion() {
    await createClient().auth.signOut()
    localStorage.removeItem('negocio_id')
    router.push('/login')
  }

  return (
    <aside style={{
      width: 240, minHeight: '100vh', background: 'var(--surface)',
      borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Image src="/CENTRA.png" alt="Centra" width={32} height={32} style={{ borderRadius: 6 }} />
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 16, color: 'var(--text)' }}>CENTRA</div>
        </div>
        {negocio && (
          <div
            onClick={() => router.push('/seleccion-negocio')}
            style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 8, padding: '8px 10px', cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>{negocio.nombre}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{negocio.giro} · Cambiar →</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {nav.map(grupo => (
          <div key={grupo.grupo} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600, padding: '0 10px', marginBottom: 6 }}>
              {grupo.grupo}
            </div>
            {grupo.items.map(item => {
              const active = path === item.href
              return (
                <Link key={item.href} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
                  borderRadius: 8, fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? 'var(--green)' : 'var(--text-muted)',
                  background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
                  textDecoration: 'none', transition: 'all 0.15s', marginBottom: 2,
                }}>
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <button onClick={cerrarSesion} style={{
          width: '100%', background: 'transparent', border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px', color: 'var(--text-muted)', fontSize: 12,
          cursor: 'pointer', fontFamily: 'DM Sans'
        }}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
