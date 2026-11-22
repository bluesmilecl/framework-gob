# Recetas de pantallas

Referencia de uso real: `site/tramites/src` (plataforma de trámites) y `site/chat/src` (plataforma de IA). Están construidas **solo** con la librería; copia su estructura.

## 1. App autenticada con router (React Router)

```jsx
// Shell.jsx — AppShell integrado con el router mediante renderLink
const NAV = [{ group: 'Gestión', items: [{ to: '/', label: 'Panel', icon: 'layout-dashboard', end: true }, { to: '/tramites', label: 'Trámites', icon: 'file-text' }] }]
export default function Shell() {
  const { pathname } = useLocation(); const { user, logout } = useAuth(); const modal = useModal()
  const nav = markActive(NAV, (i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)))
  return (
    <AppShell brand={{ name: 'Trámites', subtitle: 'Municipalidad' }} nav={nav} user={user}
      userMenu={[{ label: 'Mi cuenta', icon: 'user', onSelect: () => navigate('/cuenta') }, { separator: true },
        { label: 'Cerrar sesión', icon: 'log-out', danger: true, onSelect: async () => (await modal.confirm({ title: 'Cerrar sesión', text: '¿Quieres salir?' })) && logout() }]}
      renderLink={({ item, className, children, onClick }) => <Link to={item.to} className={className} onClick={onClick} aria-current={item.active ? 'page' : undefined}>{children}</Link>}
      breadcrumbs={<Breadcrumbs items={[{ label: 'Inicio', href: '#/' }, { label: 'Trámites' }]} />}
      footer={<AppFooter links={[{ label: 'Ayuda', href: '#' }]}>© 2026 Gobierno de Chile</AppFooter>}>
      <Outlet />
    </AppShell>
  )
}
// Rutas privadas: si no hay sesión → <Navigate to="/login" replace />
```
HashRouter funciona en hosting estático sin reglas de reescritura; con BrowserRouter configura el fallback a `index.html`.

## 2. Autenticación (login + 2FA + recuperar)

```jsx
<AuthLayout title="Ingresa a tu cuenta" subtitle="Usa tu RUN o correo">
  <LoginForm links={{ forgot: '#/recuperar', register: '#/registro' }}
    onSubmit={async ({ identifier, password }) => { await api.login(identifier, password) /* lanza Error → se muestra */; navigate('/verificar') }} />
</AuthLayout>
```
Flujo estándar: `/login` → `/verificar` (`TwoFactorForm`) → app · `/recuperar` (`ForgotPasswordForm`) → correo → `/restablecer` (`ResetPasswordForm`) → `/login`. No reveles si una cuenta existe en el mensaje de recuperar ("Si el correo existe, enviamos instrucciones").

## 3. CRUD con tabla, filtros y modal de formulario

```jsx
function Usuarios() {
  const [rows, setRows] = useState(seed); const [q, setQ] = useState(''); const [rol, setRol] = useState('')
  const [edit, setEdit] = useState(null)            // null = cerrado; {} = nuevo; fila = editar
  const modal = useModal(); const toast = useToast()
  const view = rows.filter((r) => (!q || r.nombre.toLowerCase().includes(q.toLowerCase())) && (!rol || r.rol === rol))
  const f = useForm({ initial: { nombre: '', email: '', rol: 'Analista' },
    validate: (v) => ({ ...(!v.nombre.trim() && { nombre: 'Ingresa el nombre' }), ...(!validEmail(v.email) && { email: 'Correo inválido' }) }),
    onSubmit: async (v) => { setRows(upsert(rows, { ...edit, ...v })); setEdit(null); toast(edit.id ? 'Usuario actualizado' : 'Usuario creado', 'ok') } })
  useEffect(() => { if (edit) f.reset(edit.id ? edit : undefined) }, [edit])   // al abrir: cargar datos
  const remove = async (r) => {
    if (!(await modal.confirm({ title: `Eliminar a ${r.nombre}`, text: 'Perderá el acceso.', tone: 'danger', confirmLabel: 'Eliminar' }))) return
    const prev = rows; setRows(rows.filter((x) => x.id !== r.id))
    toast('Usuario eliminado', { action: { label: 'Deshacer', onClick: () => setRows(prev) } })
  }
  return (<>
    <PageHeader title="Usuarios" description="Administra las cuentas." actions={<button className="btn btn-primary" onClick={() => setEdit({})}>Nuevo usuario</button>} />
    <Panel flush>
      <FilterBar search={q} onSearch={setQ} onClear={() => { setQ(''); setRol('') }} filters={[{ name: 'rol', label: 'Rol', value: rol, onChange: setRol, options: ROLES }]} />
      <DataTable rows={view} rowKey="id" noun={['usuario', 'usuarios']} columns={COLUMNS}
        rowActions={(r) => [{ label: 'Editar', icon: 'pencil', onSelect: () => setEdit(r) }, { separator: true }, { label: 'Eliminar', icon: 'trash-2', danger: true, onSelect: () => remove(r) }]} />
    </Panel>
    <Modal open={!!edit} onClose={() => setEdit(null)} staticBackdrop={f.dirty} busy={f.submitting} title={edit?.id ? 'Editar usuario' : 'Nuevo usuario'}
      footer={<div className="gob-modal-footer"><button className="btn btn-outline-primary btn-compact" onClick={() => setEdit(null)}>Cancelar</button><button className="btn btn-primary btn-compact" onClick={f.handleSubmit}>Guardar</button></div>}>
      <TextField label="Nombre" required {...f.bind('nombre')} /><TextField label="Correo" type="email" required {...f.bind('email')} />
    </Modal>
  </>)
}
```
Claves: estado vacío y de carga cubiertos por `DataTable`; destructivo = `confirm` + `Deshacer`; `staticBackdrop` solo si el formulario tiene cambios sin guardar.

## 4. Wizard de varios pasos con documentos

```jsx
const STEPS = ['Tipo', 'Datos', 'Documentos', 'Resumen']
const [step, setStep] = useState(0)
<Stepper steps={STEPS} current={step} />
{step === 2 && <FileUpload label="Cédula de identidad" required accept=".pdf,image/*" maxFiles={1} maxBytes={5 * 1024 * 1024}
    onChange={(items) => setDocs(items)} error={tried && !docs.some((d) => d.status === 'done') ? 'Adjunta el documento' : undefined} />}
<button className="btn btn-outline-primary" disabled={step === 0} onClick={() => setStep(step - 1)}>Atrás</button>
<button className="btn btn-primary" onClick={() => (validStep(step) ? setStep(step + 1) : setTried(true))}>{step === 3 ? 'Enviar solicitud' : 'Continuar'}</button>
```
Bloquea "Continuar" mientras haya archivos `status: 'uploading'`. Guarda borrador en `localStorage`/servidor en cada paso. Al enviar: `modal.alert({ tone: 'success', title: 'Solicitud enviada', text: 'Tu folio es TR-…' })`.

## 5. Subir y previsualizar archivos

```jsx
const [files, setFiles] = useState([]); const [view, setView] = useState(null)
<FileUpload label="Adjuntos" onChange={setFiles} upload={(item, onProgress) => api.upload(item.file, onProgress)} />
<ul>{files.filter((f) => f.status === 'done').map((f) => <li key={f.id}>{f.name} <button className="btn btn-link btn-sm" onClick={() => setView(f.file)}>Ver</button></li>)}</ul>
<FilePreviewModal file={view} open={!!view} onClose={() => setView(null)} />
```
Para archivos remotos: `<FilePreview file={{ url, name: 'informe.pdf', type: 'application/pdf' }} />` (el servidor debe permitir CORS si es de otro origen).

## 6. Panel (dashboard)

```jsx
<PageHeader title="Panel" description="Resumen de hoy" />
<div className="row">{[['Ingresados', '128', '+12 %', 'inbox'], ['En revisión', '34', '−3 %', 'clock']].map(([label, value, delta, icon]) =>
  <div className="col-sm-6 col-lg-3 mb-3" key={label}><StatCard label={label} value={value} delta={delta} down={delta.startsWith('−')} icon={icon} /></div>)}</div>
<Panel title="Últimos trámites" flush><DataTable … defaultPageSize={5} /></Panel>
```

## 7. Configuración (ajustes con barra de cambios)

Una `Tabs`/subnav por sección; cada sección con `useForm`. Muestra una **barra de guardado** (`app-savebar`) solo cuando `f.dirty`, con "Descartar" (`f.reset()`) y "Guardar" (`f.handleSubmit`); tras guardar `toast('Ajustes guardados', 'ok')`. Zona de riesgo en `<Panel danger>` con `confirm({ requireText })`. Código completo: `site/tramites/src/pages/Settings.jsx`.

## 8. Chat de IA

CSS: `@import "gob-cl-tailwind/chat.css"`. Componentes de referencia en `site/chat/src/components` (sidebar de conversaciones, composer con adjuntos, mensajes con Markdown y streaming, atajos) y proveedores intercambiables en `site/chat/src/lib/providers` (motor demo local u OpenAI-compatible). Producción: apunta a **tu backend**; nunca pongas claves de API en el navegador; mantén visible el aviso "las respuestas de IA pueden contener errores".

## 9. Estados que siempre hay que cubrir

| Estado | Cómo |
|---|---|
| Cargando datos | `DataTable loading` / `LoadingScreen` / `Skeleton*` |
| Enviando | botón `disabled` + `busy` del `Modal` o `LoadingOverlay` |
| Vacío | `EmptyState` con acción (“Crear el primero”) |
| Error de campo | `error` en el campo (vía `useForm`) |
| Error de operación | `Alert tone="danger"` (persistente) o `toast(…, 'error')` (breve) |
| Éxito | `toast(…, 'ok')`; operaciones relevantes `modal.alert({ tone: 'success' })` |
| Sin permiso / sesión vencida | `Alert tone="warning"` + redirigir a `/login` |
