import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Alert, Avatar, CheckboxField, DropdownMenu, FileUpload, Icon, Modal, OtpInput, PageHeader, Panel, PasswordField, RadioGroup, SelectField, StatusBadge, Switch, TextField, TextareaField, downloadFile, useForm, useModal, useShell, useToast } from 'gob-cl-tailwind/react'
import { useAuth, DEMO } from '../lib/auth.jsx'
import { useData } from '../lib/store.jsx'

const SECTIONS = [
  { id: 'perfil', label: 'Perfil', icon: 'user' }, { id: 'seguridad', label: 'Seguridad', icon: 'shield-check' }, { id: 'notificaciones', label: 'Notificaciones', icon: 'bell' },
  { id: 'apariencia', label: 'Apariencia y accesibilidad', icon: 'palette' }, { id: 'datos', label: 'Datos y privacidad', icon: 'database' },
]
const KEY = 'tramites:settings'
const EVENTS = [['asignado', 'Me asignan un trámite'], ['observado', 'Un trámite queda observado'], ['vencimiento', 'Un trámite está por vencer'], ['resumen', 'Resumen semanal de actividad']]
const DEFAULTS = {
  nombre: 'María Rojas', email: 'demo@example.com', telefono: '+56 9 1234 5678', cargo: 'Jefa de unidad', institucion: 'Servicio de ejemplo', bio: '', zona: 'America/Santiago', idioma: 'es',
  notif: { asignado: { email: true, push: true, sms: false }, observado: { email: true, push: true, sms: false }, vencimiento: { email: true, push: false, sms: true }, resumen: { email: true, push: false, sms: false } }, frecuencia: 'inmediata', silencio: false, desde: '22:00', hasta: '07:00',
}
const load = () => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULTS } }

function PasswordModal({ open, onClose }) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const f = useForm({ initial: { actual: '', nueva: '', confirmar: '' }, validate: (v) => ({ ...(!v.actual && { actual: 'Ingresa tu clave actual' }), ...(v.nueva.length < 8 && { nueva: 'Debe tener al menos 8 caracteres' }), ...(v.nueva === v.actual && v.nueva && { nueva: 'Debe ser distinta a la actual' }), ...(v.confirmar !== v.nueva && { confirmar: 'Las claves no coinciden' }) }) })
  const submit = async (e) => {
    e.preventDefault(); f.touch(['actual', 'nueva', 'confirmar'])
    if (!f.valid) return
    setBusy(true); await new Promise((r) => setTimeout(r, 800)); setBusy(false); toast('Clave actualizada', 'ok'); f.reset(); onClose()
  }
  return (
    <Modal open={open} onClose={() => { f.reset(); onClose() }} busy={busy} icon="key-round" title="Cambiar clave" subtitle="Te recomendamos usar una clave única."
      footer={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={onClose} disabled={busy}>Cancelar</button><button type="submit" form="pw-form" className="btn btn-primary btn-compact" disabled={busy}>{busy && <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true" />}Actualizar clave</button></>}>
      <form id="pw-form" onSubmit={submit} noValidate>
        <PasswordField label="Clave actual" autoComplete="current-password" {...f.bind('actual')} />
        <PasswordField label="Nueva clave" strength autoComplete="new-password" {...f.bind('nueva')} />
        <PasswordField label="Repite la nueva clave" autoComplete="new-password" {...f.bind('confirmar')} />
      </form>
    </Modal>
  )
}

function TwoFactorModal({ open, onClose, onEnabled }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const verify = (c = code) => { if (c === DEMO.code) { setCode(''); onEnabled() } else { setError('Código incorrecto. Prueba con ' + DEMO.code); setCode('') } }
  // QR decorativo determinista (no es un código escaneable)
  const cells = Array.from({ length: 169 }, (_, i) => ((i * 7 + (i >> 3) * 5) % 11 < 5))
  return (
    <Modal open={open} onClose={() => { setCode(''); setError(''); onClose() }} icon="smartphone" title="Activar verificación en dos pasos" subtitle="Escanea el código con tu aplicación autenticadora" size="md"
      footer={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={onClose}>Cancelar</button><button type="button" className="btn btn-primary btn-compact" onClick={() => verify()} disabled={code.length < 6}>Activar</button></>}>
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
        <svg viewBox="0 0 13 13" width="132" height="132" role="img" aria-label="Código QR de demostración" style={{ border: '1px solid var(--app-border)', padding: 6, background: '#fff', flex: 'none' }}>{cells.map((on, i) => on && <rect key={i} x={i % 13} y={Math.floor(i / 13)} width="1" height="1" fill="#0a132d" />)}</svg>
        <div style={{ flex: '1 1 12rem' }}><p className="mb-1"><strong>¿No puedes escanear?</strong></p><p className="mb-0" style={{ fontSize: '0.88rem' }}>Clave manual (demostración): <code>GOBC-LDEM-OTAL-LER1</code></p></div>
      </div>
      <OtpInput value={code} onChange={(v) => { setCode(v); setError('') }} onComplete={verify} error={error} label="Código de 6 dígitos" />
      <small className="text-gray-b">Código de demostración: {DEMO.code}</small>
    </Modal>
  )
}

function Security() {
  const modal = useModal()
  const toast = useToast()
  const [pw, setPw] = useState(false)
  const [tfaOpen, setTfaOpen] = useState(false)
  const [tfa, setTfa] = useState(false)
  const [sessions, setSessions] = useState([{ id: 1, device: 'Chrome en Windows', place: 'Santiago, Chile', when: 'Sesión actual', current: true, icon: 'laptop' }, { id: 2, device: 'Safari en iPhone', place: 'Valparaíso, Chile', when: 'Hace 2 horas', icon: 'smartphone' }, { id: 3, device: 'Firefox en Linux', place: 'Concepción, Chile', when: 'Hace 3 días', icon: 'monitor' }])
  const [tokens, setTokens] = useState([{ id: 1, name: 'Integración de reportes', created: '12 may 2026', last: 'hace 1 día' }])

  const toggle2fa = async (on) => {
    if (on) setTfaOpen(true)
    else if (await modal.confirm({ title: 'Desactivar verificación en dos pasos', tone: 'warning', text: 'Tu cuenta quedará protegida solo por la clave. ¿Deseas continuar?', confirmLabel: 'Desactivar' })) { setTfa(false); toast('Verificación en dos pasos desactivada', 'warn') }
  }
  const closeSession = async (s) => { if (await modal.confirm({ title: 'Cerrar sesión remota', text: `Se cerrará la sesión en ${s.device}.`, confirmLabel: 'Cerrar sesión' })) { setSessions((l) => l.filter((x) => x.id !== s.id)); toast('Sesión cerrada', 'ok') } }
  const createToken = async () => {
    const name = await modal.prompt({ title: 'Nuevo token de acceso', label: 'Nombre del token', placeholder: 'Ej: Integración con planilla', icon: 'key-round', confirmLabel: 'Crear token', validate: (v) => (v.trim().length < 3 ? 'Escribe al menos 3 caracteres' : '') })
    if (!name) return
    const secret = `gob_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 14)}`
    setTokens((l) => [...l, { id: Date.now(), name: name.trim(), created: 'hoy', last: 'nunca' }])
    await modal.alert({ title: 'Copia tu token ahora', tone: 'warning', subtitle: 'No podrás verlo de nuevo', text: <div><p>Guárdalo en un lugar seguro:</p><code style={{ display: 'block', padding: '0.6rem', wordBreak: 'break-all', background: 'var(--app-surface)' }}>{secret}</code><button type="button" className="btn btn-outline-primary btn-compact btn-sm mt-2" onClick={() => { navigator.clipboard?.writeText(secret); toast('Token copiado', 'ok') }}><Icon name="copy" />Copiar</button></div>, confirmLabel: 'Ya lo guardé' })
  }

  return (
    <>
      <Panel title="Clave de acceso" actions={<button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => setPw(true)}>Cambiar clave</button>}><p className="mb-0">Último cambio: hace 4 meses.</p></Panel>
      <Panel title="Verificación en dos pasos" className="mt-3"><Switch label="Usar una aplicación autenticadora" description="Pediremos un código de 6 dígitos al iniciar sesión." checked={tfa} onChange={(e) => toggle2fa(e.target.checked)} />{tfa && <Alert tone="success">La verificación en dos pasos está activa.</Alert>}</Panel>
      <Panel title="Sesiones activas" className="mt-3" flush footer={<button type="button" className="btn btn-outline-primary btn-compact btn-sm" disabled={sessions.length < 2} onClick={async () => { if (await modal.confirm({ title: 'Cerrar las demás sesiones', text: 'Se cerrarán todas las sesiones excepto la actual.', confirmLabel: 'Cerrar sesiones' })) { setSessions((l) => l.filter((s) => s.current)); toast('Sesiones cerradas', 'ok') } }}>Cerrar todas las demás</button>}>
        <ul className="app-list" style={{ padding: '0 1.25rem' }}>{sessions.map((s) => <li key={s.id}><span className="app-file-icon"><Icon name={s.icon} /></span><div className="grow"><strong>{s.device} {s.current && <StatusBadge tone="ok">Esta sesión</StatusBadge>}</strong><small>{s.place} · {s.when}</small></div>{!s.current && <button type="button" className="btn btn-link btn-compact btn-sm" onClick={() => closeSession(s)}>Cerrar sesión</button>}</li>)}</ul>
      </Panel>
      <Panel title="Tokens de acceso" className="mt-3" actions={<button type="button" className="btn btn-primary btn-compact btn-sm" onClick={createToken}><Icon name="plus" />Crear token</button>}>
        {tokens.length === 0 ? <p className="mb-0 text-gray-b">No tienes tokens.</p> : <ul className="app-list">{tokens.map((t) => <li key={t.id}><span className="app-file-icon"><Icon name="key-round" /></span><div className="grow"><strong>{t.name}</strong><small>Creado {t.created} · último uso {t.last}</small></div><button type="button" className="btn btn-link btn-compact btn-sm" onClick={async () => { if (await modal.confirm({ title: 'Revocar token', tone: 'danger', text: `El token «${t.name}» dejará de funcionar.`, confirmLabel: 'Revocar' })) { setTokens((l) => l.filter((x) => x.id !== t.id)); toast('Token revocado', 'ok') } }}>Revocar</button></li>)}</ul>}
      </Panel>
      <PasswordModal open={pw} onClose={() => setPw(false)} />
      <TwoFactorModal open={tfaOpen} onClose={() => setTfaOpen(false)} onEnabled={() => { setTfa(true); setTfaOpen(false); toast('Verificación en dos pasos activada', 'ok') }} />
    </>
  )
}

function Appearance() {
  const { prefs, setPrefs, a11y } = useShell()
  const [motion, setMotion] = useState(() => document.documentElement.classList.contains('reduce-motion'))
  return (
    <>
      <Panel title="Tema"><RadioGroup cards name="tema" value={a11y.contrast ? 'contraste' : 'normal'} onChange={(e) => { if ((e.target.value === 'contraste') !== a11y.contrast) a11y.toggleContrast() }} options={[{ value: 'normal', label: 'Normal', icon: 'sun', description: 'Colores institucionales.' }, { value: 'contraste', label: 'Alto contraste', icon: 'contrast', description: 'Máxima legibilidad.' }]} /></Panel>
      <Panel title="Tamaño de texto" className="mt-3"><RadioGroup cards name="font" value={String(a11y.font)} onChange={(e) => a11y.setFont(Number(e.target.value))} options={[{ value: '0', label: 'Normal', description: '16 px' }, { value: '1', label: 'Grande', description: '20 px' }, { value: '2', label: 'Muy grande', description: '24 px' }]} /></Panel>
      <Panel title="Interfaz" className="mt-3">
        <RadioGroup label="Densidad de tablas" name="density" value={prefs.density} onChange={(e) => setPrefs({ density: e.target.value })} options={[{ value: 'comfortable', label: 'Cómoda' }, { value: 'compact', label: 'Compacta' }]} />
        <Switch label="Reducir animaciones" description="Desactiva transiciones y movimientos." checked={motion} onChange={(e) => { setMotion(e.target.checked); document.documentElement.classList.toggle('reduce-motion', e.target.checked) }} />
      </Panel>
    </>
  )
}

export default function Settings() {
  const { section = 'perfil' } = useParams()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const { logout } = useAuth()
  const { dispatch } = useData()
  const f = useForm({ initial: load(), validate: (v) => ({ ...(v.nombre.trim().length < 3 && { nombre: 'Ingresa tu nombre' }), ...(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) && { email: 'Correo no válido' }) }) })
  const [saving, setSaving] = useState(false)
  const [avatar, setAvatar] = useState(null)
  if (!SECTIONS.some((s) => s.id === section)) return <Navigate to="/configuracion/perfil" replace />

  const save = async () => {
    f.touch(Object.keys(f.values))
    if (!f.valid) { toast('Revisa los campos con error', 'error'); return }
    setSaving(true); await new Promise((r) => setTimeout(r, 700))
    try { localStorage.setItem(KEY, JSON.stringify(f.values)) } catch { /* sin almacenamiento */ }
    f.reset(f.values); setSaving(false); toast('Cambios guardados', 'ok')
  }
  const setNotif = (ev, ch, on) => f.setValue('notif', { ...f.values.notif, [ev]: { ...f.values.notif[ev], [ch]: on } })

  const deleteAccount = async () => { if (await modal.confirm({ title: 'Eliminar cuenta', tone: 'danger', text: 'Se eliminarán tu cuenta y tus datos de forma permanente. Esta acción no se puede deshacer.', confirmLabel: 'Eliminar mi cuenta', requireText: 'ELIMINAR' })) { logout(); nav('/login'); toast('Cuenta eliminada (demostración)', 'ok') } }

  return (
    <div className="app-container">
      <PageHeader title="Configuración" description="Administra tu perfil, seguridad y preferencias." />
      <div className="app-settings">
        <nav className="app-subnav" aria-label="Secciones de configuración">
          {SECTIONS.map((s) => <Link key={s.id} to={`/configuracion/${s.id}`} className={s.id === section ? 'is-active' : ''} aria-current={s.id === section ? 'page' : undefined}><Icon name={s.icon} />{s.label}</Link>)}
        </nav>
        <div>
          {section === 'perfil' && (
            <>
              <Panel title="Foto de perfil"><div className="app-person" style={{ gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}><Avatar name={f.values.nombre} src={avatar} size="lg" /><div style={{ flex: '1 1 16rem' }}><FileUpload compact multiple={false} maxFiles={1} accept="image/*" maxBytes={2 * 1024 * 1024} hint="JPG o PNG, hasta 2 MB." onChange={(items) => setAvatar(items.find((x) => x.kind === 'image' && x.dataUrl)?.dataUrl ?? null)} /></div></div></Panel>
              <Panel title="Información personal" className="mt-3">
                <div className="app-field-row"><TextField label="Nombre completo" required {...f.bind('nombre')} /><TextField label="Correo electrónico" type="email" required {...f.bind('email')} /></div>
                <div className="app-field-row"><TextField label="Teléfono" type="tel" {...f.bind('telefono')} /><TextField label="Cargo" {...f.bind('cargo')} /></div>
                <TextField label="Institución" {...f.bind('institucion')} />
                <TextareaField label="Sobre mí" rows={3} maxLength={200} hint="Se muestra a otros usuarios de la plataforma." {...f.bind('bio')} />
                <div className="app-field-row"><SelectField label="Zona horaria" options={[{ value: 'America/Santiago', label: 'Santiago (GMT-3/-4)' }, { value: 'Pacific/Easter', label: 'Isla de Pascua' }, { value: 'America/Punta_Arenas', label: 'Punta Arenas' }]} {...f.bind('zona')} /><SelectField label="Idioma" options={[{ value: 'es', label: 'Español (Chile)' }, { value: 'en', label: 'English' }]} {...f.bind('idioma')} /></div>
              </Panel>
            </>
          )}
          {section === 'seguridad' && <Security />}
          {section === 'notificaciones' && (
            <>
              <Panel title="¿Cuándo quieres que te avisemos?" flush>
                <div className="app-table-wrap"><table className="app-matrix"><thead><tr><th scope="col">Evento</th><th scope="col">Correo</th><th scope="col">En la app</th><th scope="col">SMS</th></tr></thead>
                  <tbody>{EVENTS.map(([ev, text]) => <tr key={ev}><th scope="row" style={{ fontWeight: 400 }}>{text}</th>{['email', 'push', 'sms'].map((ch) => <td key={ch}><input type="checkbox" className="app-check" aria-label={`${text}: ${ch}`} checked={f.values.notif[ev][ch]} onChange={(e) => setNotif(ev, ch, e.target.checked)} /></td>)}</tr>)}</tbody></table></div>
              </Panel>
              <Panel title="Frecuencia y horario" className="mt-3">
                <RadioGroup label="Frecuencia de los avisos por correo" name="frecuencia" value={f.values.frecuencia} onChange={f.bind('frecuencia').onChange} options={[{ value: 'inmediata', label: 'Inmediata' }, { value: 'diaria', label: 'Resumen diario' }, { value: 'semanal', label: 'Resumen semanal' }]} />
                <Switch label="Horario silencioso" description="No enviar avisos durante este periodo." checked={f.values.silencio} onChange={(e) => f.setValue('silencio', e.target.checked)} />
                {f.values.silencio && <div className="app-field-row mt-3"><TextField label="Desde" type="time" {...f.bind('desde')} /><TextField label="Hasta" type="time" {...f.bind('hasta')} /></div>}
              </Panel>
            </>
          )}
          {section === 'apariencia' && <Appearance />}
          {section === 'datos' && (
            <>
              <Panel title="Tus datos"><p>Descarga una copia de la información de tu cuenta.</p><button type="button" className="btn btn-outline-primary btn-compact" onClick={() => { downloadFile('mis-datos.json', JSON.stringify({ perfil: f.values, exportado: new Date().toISOString() }, null, 2), 'application/json'); toast('Datos exportados', 'ok') }}><Icon name="download" />Descargar mis datos</button></Panel>
              <Panel title="Datos de ejemplo" className="mt-3"><p>Restablece los trámites y usuarios de demostración a su estado inicial.</p><button type="button" className="btn btn-outline-primary btn-compact" onClick={async () => { if (await modal.confirm({ title: 'Restablecer datos de ejemplo', text: 'Se perderán los cambios que hiciste en trámites y usuarios.', confirmLabel: 'Restablecer', tone: 'warning' })) { dispatch({ type: 'reset' }); toast('Datos restablecidos', 'ok') } }}><Icon name="rotate-ccw" />Restablecer</button></Panel>
              <Panel danger title="Zona de riesgo" className="mt-3"><p>Eliminar tu cuenta es permanente y no se puede deshacer.</p><button type="button" className="btn btn-danger btn-compact" onClick={deleteAccount}><Icon name="trash-2" />Eliminar mi cuenta</button></Panel>
            </>
          )}
          {f.dirty && ['perfil', 'notificaciones'].includes(section) && (
            <div className="app-savebar" role="region" aria-label="Cambios sin guardar">
              <strong><Icon name="triangle-alert" /> Tienes cambios sin guardar</strong>
              <span><button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => f.reset()} disabled={saving}>Descartar</button>{' '}<button type="button" className="btn btn-primary btn-compact btn-sm" onClick={save} disabled={saving}>{saving && <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true" />}Guardar cambios</button></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
