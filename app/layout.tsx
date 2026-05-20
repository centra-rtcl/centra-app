import type { Metadata } from 'next'
import './globals.css'

export const metadata = {
  title: "Centra",
  description: "El centro de control para micronegocios.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
