import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Alert, Avatar, FileUpload, Icon, PageHeader, Panel, RadioGroup, SelectField, StatusBadge, Switch, TextField, TextareaField, downloadFile, useAccessibility, useForm, useModal, useToast } from 'gob-cl-tailwind/react'
import { useAuth } from '../lib/auth.jsx'
import { MODELS } from '../lib/models.js'
import { clearAll, loadSettings, saveSettings } from '../lib/storage.js'

const SECTIONS = [
  { id: 'perfil', label: 'Perfil', icon: 'user' }, { id: 'asistente', label: 'Personalización', icon: 'sparkles' }, { id: 'proveedor', label: 'Proveedor de IA', icon: 'bot' },
  { id: 'apariencia', label: 'Apariencia', icon: 'palette' }, { id: 'datos', label: 'Datos y privacidad', icon: 'database' },
]

export default function Settings() {
  const { section = 'perfil' } = useParams()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const a11y = useAccessibility()
  const { user, logout } = useAuth()
  const [saving, setSaving] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const f = useForm({
    initial: { ...loadSettings(), name: user.name, email: user.email },
    validate: (v) => ({ ...(v.provider === 'openai' && !/^https?:\/\//.test(v.baseUrl) && { baseUrl: 'La URL debe comenzar con http:// o https://' }), ...(v.name.trim().length < 3 && { name: 'Ingresa tu nombre' }), ...(v.instructions.length > 600 && { instructions: 'Máximo 600 caracteres' }) }),
  })
  if (!SECTIONS.some((s) => s.id === section)) return <Navigate to="/ajustes/perfil" replace />

  const save = async () => {
    f.touch(Object.keys(f.values))
    if (!f.valid) { toast('Revisa los campos con error', 'error'); return }
    setSaving(true); await new Promise((r) => setTimeout(r, 600))
    const { name, email, ...settings } = f.values
    saveSettings(settings); f.reset(f.values); setSaving(false); toast('Ajustes guardados', 'ok')
  }
  const exportConvs = () => { let raw = '{}'; try { raw = localStorage.getItem('gob-chat:v1') || '{}' } catch { /* sin datos */ } downloadFile('conversaciones.json', JSON.stringify(JSON.parse(raw), null, 2), 'application/json'); toast('Conversaciones exportadas', 'ok') }
  const clearConvs = async () => { if (await modal.confirm({ title: 'Borrar todas las conversaciones', tone: 'danger', text: 'Se eliminará el historial de este navegador. No se puede deshacer.', confirmLabel: 'Borrar historial', requireText: 'BORRAR' })) { clearAll(); toast('Historial eliminado', 'ok') } }
  const deleteAccount = async () => { if (await modal.confirm({ title: 'Eliminar cuenta', tone: 'danger', text: 'Se eliminarán tu cuenta y tus datos en este navegador.', confirmLabel: 'Eliminar mi cuenta', requireText: 'ELIMINAR' })) { clearAll(); logout(); nav('/login'); toast('Cuenta eliminada (demostración)', 'ok') } }

  return (
    <div className="app-container">
      <PageHeader title="Ajustes" description="Configura tu perfil, el asistente y tus datos." />
      <div className="app-settings">
        <nav className="app-subnav" aria-label="Secciones de ajustes">{SECTIONS.map((s) => <Link key={s.id} to={`/ajustes/${s.id}`} className={s.id === section ? 'is-active' : ''} aria-current={s.id === section ? 'page' : undefined}><Icon name={s.icon} />{s.label}</Link>)}</nav>
        <div>
          {section === 'perfil' && (
            <>
              <Panel title="Foto de perfil"><div className="app-person" style={{ gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}><Avatar name={f.values.name} src={avatar} size="lg" /><div style={{ flex: '1 1 16rem' }}><FileUpload compact multiple={false} maxFiles={1} accept="image/*" maxBytes={2 * 1024 * 1024} hint="JPG o PNG, hasta 2 MB." onChange={(items) => setAvatar(items.find((x) => x.kind === 'image' && x.dataUrl)?.dataUrl ?? null)} /></div></div></Panel>
              <Panel title="Datos de la cuenta" className="mt-3"><TextField label="Nombre" required {...f.bind('name')} /><TextField label="Correo electrónico" type="email" {...f.bind('email')} disabled hint="El correo no se puede cambiar en esta demostración." /></Panel>
            </>
          )}
          {section === 'asistente' && (
            <>
              <Panel title="Comportamiento">
                <SelectField label="Modelo por defecto" options={MODELS.map((m) => ({ value: m.id, label: `${m.label} — ${m.hint}` }))} {...f.bind('defaultModel')} />
                <RadioGroup cards label="Tono de las respuestas" name="tone" value={f.values.tone} onChange={f.bind('tone').onChange} options={[{ value: 'neutral', label: 'Neutro', icon: 'message-square', description: 'Claro y directo.' }, { value: 'formal', label: 'Formal', icon: 'landmark', description: 'Lenguaje institucional.' }, { value: 'cercano', label: 'Cercano', icon: 'message-square-heart', description: 'Amable y simple.' }]} />
              </Panel>
              <Panel title="Instrucciones personalizadas" className="mt-3"><TextareaField label="¿Qué debería saber el asistente sobre ti?" rows={5} maxLength={600} hint="Se envían como contexto al proveedor de IA (no se usan en el modo demostración)." {...f.bind('instructions')} /></Panel>
            </>
          )}
          {section === 'proveedor' && (
            <Panel title="Conexión con un modelo de IA">
              <RadioGroup cards label="Proveedor" name="provider" value={f.values.provider} onChange={f.bind('provider').onChange} options={[{ value: 'demo', label: 'Demostración', icon: 'sparkles', description: 'Respuestas simuladas, sin conexión.' }, { value: 'openai', label: 'API compatible con OpenAI', icon: 'bot', description: 'Tu propio servicio o backend.' }]} />
              {f.values.provider === 'demo' ? <Alert tone="info">El modo demostración <strong>no usa un modelo de IA</strong>: genera respuestas de ejemplo para probar la interfaz.</Alert> : (
                <>
                  <TextField label="URL del servicio" placeholder="https://tu-servidor/v1" {...f.bind('baseUrl')} />
                  <TextField label="Nombre del modelo" hint="El modelo que expone tu servicio." {...f.bind('modelName')} />
                  <TextField label="Clave de acceso (opcional)" type="password" autoComplete="off" {...f.bind('apiKey')} />
                  <Alert tone="warning" title="Seguridad">Una clave escrita aquí queda guardada en este navegador y es visible para quien lo use. En producción apunta la URL a tu propio backend, que guarda la clave y controla el uso.</Alert>
                </>
              )}
            </Panel>
          )}
          {section === 'apariencia' && (
            <>
              <Panel title="Tema"><RadioGroup cards name="tema" value={a11y.contrast ? 'c' : 'n'} onChange={(e) => { if ((e.target.value === 'c') !== a11y.contrast) a11y.toggleContrast() }} options={[{ value: 'n', label: 'Normal', icon: 'sun', description: 'Colores institucionales.' }, { value: 'c', label: 'Alto contraste', icon: 'contrast', description: 'Máxima legibilidad.' }]} /></Panel>
              <Panel title="Tamaño de texto" className="mt-3"><RadioGroup cards name="font" value={String(a11y.font)} onChange={(e) => a11y.setFont(Number(e.target.value))} options={[{ value: '0', label: 'Normal', description: '16 px' }, { value: '1', label: 'Grande', description: '20 px' }, { value: '2', label: 'Muy grande', description: '24 px' }]} /></Panel>
            </>
          )}
          {section === 'datos' && (
            <>
              <Panel title="Tus conversaciones"><p>Se guardan solo en este navegador. Los archivos adjuntos no se conservan, solo sus nombres.</p><div className="app-page-actions"><button type="button" className="btn btn-outline-primary btn-compact" onClick={exportConvs}><Icon name="download" />Exportar JSON</button><button type="button" className="btn btn-outline-primary btn-compact" onClick={clearConvs}><Icon name="trash-2" />Borrar historial</button></div></Panel>
              <Panel danger title="Zona de riesgo" className="mt-3"><p>Eliminar tu cuenta es permanente.</p><button type="button" className="btn btn-danger btn-compact" onClick={deleteAccount}><Icon name="trash-2" />Eliminar mi cuenta</button></Panel>
            </>
          )}
          {f.dirty && ['perfil', 'asistente', 'proveedor'].includes(section) && (
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
