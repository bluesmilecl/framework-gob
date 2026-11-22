import { useEffect, useState } from 'react'
import Icon from '../Icon.jsx'
import Alert from '../feedback/Alert.jsx'
import useForm from '../hooks/useForm.js'
import { CheckboxField, PasswordField, RunField, TextField } from '../forms/inputs.jsx'
import OtpInput from '../forms/OtpInput.jsx'
import { validEmail, validPhone, validRun } from '../forms/validators.js'

const Submit = ({ busy, children, ...rest }) => (
  <button type="submit" className="btn btn-primary btn-block btn-compact" disabled={busy} {...rest}>
    {busy && <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true" />}{children}
  </button>
)

/** Pantalla de autenticación en dos columnas: panel institucional + formulario. */
export function AuthLayout({ title, subtitle, children, footer, aside = {}, logo = '/img/gob-footer.svg', home = '#' }) {
  return (
    <div className="auth-page">
      <aside className="auth-aside">
        <a href={home}><img src={logo} alt="Gobierno de Chile" style={{ height: 38 }} /></a>
        <div className="auth-aside-body">
          <div className="line" />
          <h2>{aside.title}</h2>
          {aside.text && <p>{aside.text}</p>}
          {aside.points && <ul>{aside.points.map((p) => <li key={p}><Icon name="circle-check" />{p}</li>)}</ul>}
        </div>
        <small>{aside.note ?? 'Sitio de demostración construido con el framework Gob.cl.'}</small>
      </aside>
      <main className="auth-main" id="contenido">
        <div className="auth-card">
          <img className="auth-mobile-logo" src="/img/gob-header.svg" alt="Gobierno de Chile" />
          <h1>{title}</h1>
          {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          {children}
          {footer && <div className="auth-footer">{footer}</div>}
        </div>
      </main>
    </div>
  )
}

/** Inicio de sesión. onSubmit({ identifier, password, remember }) debe lanzar Error para mostrarlo. */
export function LoginForm({ onSubmit, links = {}, identifierLabel = 'RUN o correo electrónico', onClaveUnica }) {
  const f = useForm({
    initial: { identifier: '', password: '', remember: true },
    validate: (v) => ({ ...(!v.identifier.trim() && { identifier: 'Ingresa tu RUN o correo' }), ...(!v.password && { password: 'Ingresa tu clave' }) }),
    onSubmit,
  })
  return (
    <form onSubmit={f.handleSubmit} noValidate>
      {f.submitError && <Alert tone="danger" onClose={() => f.setSubmitError('')}>{f.submitError}</Alert>}
      <TextField label={identifierLabel} autoComplete="username" autoFocus {...f.bind('identifier')} />
      <PasswordField label="Clave" autoComplete="current-password" {...f.bind('password')} />
      <div className="auth-row">
        <CheckboxField label="Mantener sesión iniciada" {...f.bindCheck('remember')} className="mb-0" />
        {links.forgot && <a href={links.forgot}>¿Olvidaste tu clave?</a>}
      </div>
      <Submit busy={f.submitting}>Ingresar</Submit>
      {onClaveUnica && (
        <>
          <div className="auth-divider"><span>o</span></div>
          <button type="button" className="btn btn-outline-primary btn-block btn-compact" onClick={onClaveUnica}><Icon name="claveunica" /> Ingresar con ClaveÚnica (simulado)</button>
        </>
      )}
      {links.register && <p className="auth-alt">¿No tienes cuenta? <a href={links.register}>Regístrate</a></p>}
    </form>
  )
}

/** Registro de cuenta con RUN, correo, clave con medidor y aceptación de términos. */
export function RegisterForm({ onSubmit, links = {} }) {
  const f = useForm({
    initial: { names: '', lastNames: '', run: '', email: '', phone: '', password: '', confirm: '', terms: false },
    validate: (v) => ({
      ...(!v.names.trim() && { names: 'Ingresa tus nombres' }), ...(!v.lastNames.trim() && { lastNames: 'Ingresa tus apellidos' }),
      ...(!validRun(v.run) && { run: 'El RUN no es válido' }), ...(!validEmail(v.email) && { email: 'Ingresa un correo válido' }),
      ...(!validPhone(v.phone) && { phone: 'Teléfono no válido' }),
      ...(v.password.length < 8 && { password: 'Debe tener al menos 8 caracteres' }),
      ...(v.confirm !== v.password && { confirm: 'Las claves no coinciden' }),
      ...(!v.terms && { terms: 'Debes aceptar los términos para continuar' }),
    }),
    onSubmit,
  })
  return (
    <form onSubmit={f.handleSubmit} noValidate>
      {f.submitError && <Alert tone="danger">{f.submitError}</Alert>}
      <div className="app-field-row">
        <TextField label="Nombres" required autoComplete="given-name" {...f.bind('names')} />
        <TextField label="Apellidos" required autoComplete="family-name" {...f.bind('lastNames')} />
      </div>
      <div className="app-field-row">
        <RunField required {...f.bind('run')} />
        <TextField label="Teléfono (opcional)" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" {...f.bind('phone')} />
      </div>
      <TextField label="Correo electrónico" type="email" required autoComplete="email" {...f.bind('email')} />
      <PasswordField label="Clave" required strength autoComplete="new-password" {...f.bind('password')} />
      <PasswordField label="Repite tu clave" required autoComplete="new-password" {...f.bind('confirm')} />
      <CheckboxField label={<>Acepto los <a href="#terminos">términos y condiciones</a> y la política de privacidad</>} {...f.bindCheck('terms')} />
      <Submit busy={f.submitting}>Crear cuenta</Submit>
      {links.login && <p className="auth-alt">¿Ya tienes cuenta? <a href={links.login}>Inicia sesión</a></p>}
    </form>
  )
}

const useCountdown = (start) => {
  const [n, setN] = useState(0)
  useEffect(() => { if (n <= 0) return undefined; const t = setTimeout(() => setN(n - 1), 1000); return () => clearTimeout(t) }, [n])
  return [n, () => setN(start)]
}

/** Recuperar contraseña: pide el correo, confirma el envío y permite reenviar tras una espera. */
export function ForgotPasswordForm({ onSubmit, links = {}, resendAfter = 30 }) {
  const [sent, setSent] = useState(false)
  const [wait, startWait] = useCountdown(resendAfter)
  const f = useForm({
    initial: { email: '' },
    validate: (v) => (validEmail(v.email) ? {} : { email: 'Ingresa un correo válido' }),
    onSubmit: async (v) => { await onSubmit(v); setSent(true); startWait() },
  })
  if (sent) {
    return (
      <div role="status">
        <Alert tone="success" title="Revisa tu correo">Si <strong>{f.values.email}</strong> está registrado, te enviamos las instrucciones para restablecer tu clave. El enlace vence en 30 minutos.</Alert>
        <button type="button" className="btn btn-outline-primary btn-block btn-compact" disabled={wait > 0 || f.submitting} onClick={() => f.handleSubmit()}>{wait > 0 ? `Reenviar en ${wait} s` : 'Reenviar correo'}</button>
        {links.login && <p className="auth-alt"><a href={links.login}>Volver a iniciar sesión</a></p>}
      </div>
    )
  }
  return (
    <form onSubmit={f.handleSubmit} noValidate>
      {f.submitError && <Alert tone="danger">{f.submitError}</Alert>}
      <p className="auth-subtitle" style={{ marginTop: 0 }}>Escribe el correo de tu cuenta y te enviaremos un enlace para crear una nueva clave.</p>
      <TextField label="Correo electrónico" type="email" autoComplete="email" autoFocus {...f.bind('email')} />
      <Submit busy={f.submitting}>Enviar instrucciones</Submit>
      {links.login && <p className="auth-alt"><a href={links.login}>Volver a iniciar sesión</a></p>}
    </form>
  )
}

/** Restablecer contraseña (pantalla a la que llega el enlace del correo). */
export function ResetPasswordForm({ onSubmit, links = {} }) {
  const [done, setDone] = useState(false)
  const f = useForm({
    initial: { password: '', confirm: '' },
    validate: (v) => ({ ...(v.password.length < 8 && { password: 'Debe tener al menos 8 caracteres' }), ...(v.confirm !== v.password && { confirm: 'Las claves no coinciden' }) }),
    onSubmit: async (v) => { await onSubmit(v); setDone(true) },
  })
  if (done) return <div role="status"><Alert tone="success" title="Clave actualizada">Ya puedes ingresar con tu nueva clave.</Alert>{links.login && <a className="btn btn-primary btn-block btn-compact" href={links.login}>Ir a iniciar sesión</a>}</div>
  return (
    <form onSubmit={f.handleSubmit} noValidate>
      {f.submitError && <Alert tone="danger">{f.submitError}</Alert>}
      <PasswordField label="Nueva clave" strength autoComplete="new-password" autoFocus {...f.bind('password')} />
      <PasswordField label="Repite la nueva clave" autoComplete="new-password" {...f.bind('confirm')} />
      <Submit busy={f.submitting}>Guardar nueva clave</Submit>
    </form>
  )
}

/** Verificación en dos pasos con código de 6 dígitos. onSubmit(code) debe lanzar Error si es inválido. */
export function TwoFactorForm({ onSubmit, onResend, links = {}, destination = 'tu aplicación autenticadora' }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [wait, startWait] = useCountdown(30)
  const submit = async (c = code) => {
    if (c.length < 6) { setError('Ingresa los 6 dígitos'); return }
    setBusy(true); setError('')
    try { await onSubmit(c) } catch (e) { setError(e?.message || 'Código incorrecto'); setCode('') } finally { setBusy(false) }
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit() }} noValidate>
      <p className="auth-subtitle" style={{ marginTop: 0 }}>Ingresa el código de 6 dígitos que genera {destination}.</p>
      <OtpInput value={code} onChange={(v) => { setCode(v); setError('') }} onComplete={submit} error={error} disabled={busy} />
      <Submit busy={busy}>Verificar</Submit>
      <p className="auth-alt">
        {onResend && <button type="button" className="btn btn-link btn-compact btn-sm" disabled={wait > 0} onClick={() => { onResend(); startWait() }}>{wait > 0 ? `Reenviar código en ${wait} s` : 'Reenviar código'}</button>}
        {links.login && <> · <a href={links.login}>Cancelar</a></>}
      </p>
    </form>
  )
}
