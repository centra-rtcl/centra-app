'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/app/lib/supabase-client'

export function useNegocio() {
  const [negocioId, setNegocioId] = useState<string | null>(null)
  const [negocio, setNegocio] = useState<any>(null)

  useEffect(() => {
    const id = localStorage.getItem('negocio_id')
    setNegocioId(id)
    if (id) {
      const supabase = createClient()
      supabase.from('negocios').select('*').eq('id', id).single()
        .then(({ data }) => setNegocio(data))
    }
  }, [])

  return { negocioId, negocio }
}
