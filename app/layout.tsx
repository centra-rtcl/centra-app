import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Centra — Mini ERP',
  description: 'Control total de tu negocio',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
