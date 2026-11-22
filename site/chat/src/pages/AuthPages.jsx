import { Link, useNavigate } from 'react-router-dom'
import { Alert, AuthLayout, ForgotPasswordForm, LoginForm, RegisterForm, ResetPasswordForm, useToast } from 'gob-cl-tailwind/react'
import { DEMO, useAuth } from '../lib/auth.jsx'

const ASIDE = {
  title: 'Tu asistente de IA, con la identidad de Gobierno',
  text: 'Conversa, adjunta documentos y organiza tus consultas en un solo lugar.',
  points: ['Historial de conversaciones con búsqueda', 'Adjunta archivos y pega imágenes', 'Accesible: alto contraste y atajos de teclado'],
  note: 'Maqueta de demostración. Las respuestas del asistente son simuladas por defecto.',
}

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  return (
    <AuthLayout title="Ingresa al asistente" subtitle="Inicia sesión para continuar tus conversaciones." aside={ASIDE}>
      <Alert tone="info" title="Cuenta de demostración"><span style={{ fontSize: '0.88rem' }}>Correo <code>{DEMO.identifier}</code> · clave <code>{DEMO.password}</code></span></Alert>
      <LoginForm links={{ forgot: '#/recuperar', register: '#/registro' }} onSubmit={async (v) => { await login(v); nav('/') }} onClaveUnica={() => toast('ClaveÚnica es una simulación en esta maqueta', 'warn')} />
    </AuthLayout>
  )
}
export function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  return <AuthLayout title="Crea tu cuenta" subtitle="Empieza a conversar en un minuto." aside={ASIDE}><RegisterForm links={{ login: '#/login' }} onSubmit={async (v) => { await register(v); toast('Cuenta creada. Ya puedes iniciar sesión.', 'ok'); nav('/login') }} /></AuthLayout>
}
export function Forgot() {
  const { forgot } = useAuth()
  return <AuthLayout title="Recupera tu clave" aside={ASIDE}><ForgotPasswordForm links={{ login: '#/login' }} onSubmit={forgot} /><p className="auth-alt" style={{ marginTop: '0.75rem' }}><Link to="/restablecer">Ya tengo el enlace del correo (demostración)</Link></p></AuthLayout>
}
export function Reset() {
  const { reset } = useAuth()
  return <AuthLayout title="Crea una nueva clave" aside={ASIDE}><ResetPasswordForm links={{ login: '#/login' }} onSubmit={reset} /></AuthLayout>
}
