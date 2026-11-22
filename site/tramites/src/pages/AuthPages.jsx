import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Alert, AuthLayout, ForgotPasswordForm, LoginForm, RegisterForm, ResetPasswordForm, TwoFactorForm, useToast } from 'gob-cl-tailwind/react'
import { DEMO, useAuth } from '../lib/auth.jsx'

const ASIDE = {
  title: 'Realiza tus trámites en línea, sin filas ni papeles',
  text: 'Ingresa tu solicitud, adjunta tus documentos y haz seguimiento en cualquier momento.',
  points: ['Seguimiento de cada solicitud', 'Carga segura de documentos', 'Accesible: alto contraste y tamaño de texto'],
}

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  return (
    <AuthLayout title="Inicia sesión" subtitle="Accede a tu cuenta para gestionar tus trámites." aside={ASIDE}
      footer={<>¿Problemas para ingresar? Escríbenos a <a href="mailto:soporte@example.com">soporte@example.com</a>.</>}>
      <Alert tone="info" title="Cuenta de demostración"><span style={{ fontSize: '0.88rem' }}>Correo <code>{DEMO.identifier}</code> · clave <code>{DEMO.password}</code> · código <code>{DEMO.code}</code></span></Alert>
      <LoginForm links={{ forgot: '#/recuperar', register: '#/registro' }}
        onSubmit={async (v) => { await login(v); nav('/verificar') }} onClaveUnica={() => toast('ClaveÚnica es una simulación en esta maqueta', 'warn')} />
    </AuthLayout>
  )
}

export function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const toast = useToast()
  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Solo toma un minuto." aside={ASIDE}>
      <RegisterForm links={{ login: '#/login' }} onSubmit={async (v) => { await register(v); toast('Cuenta creada. Ya puedes iniciar sesión.', 'ok'); nav('/login') }} />
    </AuthLayout>
  )
}

export function Forgot() {
  const { forgot } = useAuth()
  return (
    <AuthLayout title="Recupera tu clave" aside={{ ...ASIDE, title: 'Te ayudamos a volver a ingresar' }}>
      <ForgotPasswordForm links={{ login: '#/login' }} onSubmit={forgot} />
      <p className="auth-alt" style={{ marginTop: '0.75rem' }}><Link to="/restablecer">Ya tengo el enlace del correo (demostración)</Link></p>
    </AuthLayout>
  )
}

export function Reset() {
  const { reset } = useAuth()
  return (
    <AuthLayout title="Crea una nueva clave" subtitle="Elige una clave segura que no uses en otros sitios." aside={{ ...ASIDE, title: 'Protege tu cuenta' }}>
      <ResetPasswordForm links={{ login: '#/login' }} onSubmit={reset} />
    </AuthLayout>
  )
}

export function Verify() {
  const { pending, verify } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const toast = useToast()
  if (!pending) return <AuthLayout title="Sesión no iniciada" aside={ASIDE}><Alert tone="warning">Primero inicia sesión.</Alert><a className="btn btn-primary btn-block btn-compact" href="#/login">Ir a iniciar sesión</a></AuthLayout>
  return (
    <AuthLayout title="Verificación en dos pasos" aside={{ ...ASIDE, title: 'Una capa extra de seguridad' }}>
      <Alert tone="info"><span style={{ fontSize: '0.88rem' }}>Código de demostración: <code>{DEMO.code}</code></span></Alert>
      <TwoFactorForm links={{ login: '#/login' }} onResend={() => toast('Te enviamos un nuevo código (simulado)')} onSubmit={async (c) => { await verify(c); nav(loc.state?.from || '/') }} />
    </AuthLayout>
  )
}
