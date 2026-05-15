async function handleCrear() {
  setError('')
  if (!form.nombre || !form.giro) {
    setError('Nombre y giro son obligatorios')
    return
  }

  setLoading(true)
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/login'); return }

  // Busca o crea el usuario en la tabla usuarios
  let { data: usuarioData } = await supabase
    .from('usuarios').select('id').eq('auth_id', user.id).single()

  if (!usuarioData) {
    const { data: nuevoUsuario } = await supabase.from('usuarios').insert({
      auth_id: user.id,
      email: user.email,
      nombre_completo: user.user_metadata?.nombre_completo || user.email,
      estado_plan: 'Free',
    }).select('id').single()
    usuarioData = nuevoUsuario
  }

  if (!usuarioData) { setError('Error al obtener usuario'); setLoading(false); return }

  const { error: negocioError } = await supabase.from('negocios').insert({
    usuario_id: usuarioData.id,
    nombre: form.nombre,
    giro: form.giro,
    telefono: form.telefono,
    correo: form.correo,
    activo: true,
  })

  if (negocioError) {
    setError('Error al crear el negocio: ' + negocioError.message)
    setLoading(false)
    return
  }

  router.push('/seleccion-negocio')
}