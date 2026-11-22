import { useMemo, useState } from 'react'
import { Alert, Avatar, DataTable, DropdownMenu, FileUpload, FilterBar, Icon, Modal, PasswordField, RunField, SelectField, Stepper, StatusBadge, Switch, Tabs, TextField, useForm, useModal, useToast, validEmail, validRun } from 'gob-cl-tailwind/react'
import Section from '../components/Section.jsx'
import CodeBlock from '../components/CodeBlock.jsx'

const CATALOG = [
  ['Layout', 'AppShell, Container, PageHeader, Panel, StatCard, Footer, AppFooter, SiteNavbar'],
  ['Navegación', 'DropdownMenu, Tabs, Stepper, Breadcrumbs, Pagination'],
  ['Formularios', 'Field, TextField, TextareaField, SelectField, DateField, RunField, PasswordField, CheckboxField, Switch, RadioGroup, SearchInput, OtpInput, FileUpload, useForm'],
  ['Datos', 'DataTable, FilterBar, StatusBadge, Avatar, EmptyState, Skeleton, toCsv / parseCsv / downloadFile'],
  ['Feedback', 'Modal (+ variant drawer), ModalProvider / useModal (confirm, alert, prompt), ToastProvider / useToast, Alert'],
  ['Autenticación', 'AuthLayout, LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, TwoFactorForm'],
  ['Accesibilidad', 'useAccessibility (contraste y tamaño de texto), useDismiss'],
]

const PEOPLE = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, nombre: ['Camila Rojas', 'Matías Soto', 'Valentina Díaz', 'Benjamín Pérez', 'Antonia Silva'][i % 5] + ` ${i + 1}`, rol: ['Analista', 'Revisor', 'Administrador'][i % 3], estado: ['activo', 'inactivo'][i % 2] }))

function ModalDemo() {
  const modal = useModal()
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [drawer, setDrawer] = useState(false)
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary btn-compact" onClick={() => setOpen(true)}>Modal con formulario</button>
        <button type="button" className="btn btn-outline-primary btn-compact" onClick={() => setDrawer(true)}>Drawer lateral</button>
        <button type="button" className="btn btn-outline-primary btn-compact" onClick={async () => toast((await modal.confirm({ title: 'Publicar cambios', text: '¿Quieres publicar los cambios ahora?', confirmLabel: 'Publicar' })) ? 'Publicado' : 'Cancelado')}>confirm()</button>
        <button type="button" className="btn btn-outline-primary btn-compact" onClick={() => modal.alert({ title: 'Mantenimiento programado', text: 'El sistema no estará disponible el sábado de 02:00 a 04:00.', tone: 'warning' })}>alert()</button>
        <button type="button" className="btn btn-outline-primary btn-compact" onClick={async () => { const v = await modal.prompt({ title: 'Renombrar', label: 'Nuevo nombre', initial: 'Informe', validate: (x) => (x.trim() ? '' : 'Requerido') }); if (v) toast(`Nuevo nombre: ${v}`, 'ok') }}>prompt()</button>
        <button type="button" className="btn btn-danger btn-compact" onClick={async () => { if (await modal.confirm({ title: 'Eliminar proyecto', tone: 'danger', text: 'Esta acción no se puede deshacer.', requireText: 'ELIMINAR', confirmLabel: 'Eliminar' })) toast('Eliminado', 'ok') }}>Confirmación escrita</button>
        <button type="button" className="btn btn-outline-primary btn-compact" onClick={async () => { await modal.alert({ title: 'Primer modal', text: 'Se apilará otro encima.' }); modal.alert({ title: 'Segundo modal', tone: 'success', text: 'Los modales se pueden apilar.' }) }}>Apilados</button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} icon="user-plus" title="Nuevo contacto" subtitle="Ejemplo de modal con formulario"
        footer={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={() => setOpen(false)}>Cancelar</button><button type="button" className="btn btn-primary btn-compact" onClick={() => { setOpen(false); toast('Contacto guardado', 'ok') }}>Guardar</button></>}>
        <TextField label="Nombre" /><TextField label="Correo" type="email" />
      </Modal>
      <Modal open={drawer} onClose={() => setDrawer(false)} variant="drawer" title="Filtros avanzados" subtitle="Panel lateral"
        footer={<button type="button" className="btn btn-primary btn-compact" onClick={() => setDrawer(false)}>Aplicar</button>}>
        <SelectField label="Estado" options={['Todos', 'Activo', 'Inactivo']} /><Switch label="Solo con documentos" checked onChange={() => {}} />
      </Modal>
    </>
  )
}

function FormDemo() {
  const toast = useToast()
  const f = useForm({ initial: { run: '', email: '', clave: '' }, validate: (v) => ({ ...(!validRun(v.run) && { run: 'El RUN no es válido' }), ...(!validEmail(v.email) && { email: 'Correo no válido' }), ...(v.clave.length < 8 && { clave: 'Mínimo 8 caracteres' }) }), onSubmit: async () => { await new Promise((r) => setTimeout(r, 500)); toast('Formulario válido', 'ok') } })
  return (
    <form onSubmit={f.handleSubmit} noValidate style={{ maxWidth: '26rem' }}>
      <RunField required {...f.bind('run')} /><TextField label="Correo" type="email" required {...f.bind('email')} /><PasswordField strength required {...f.bind('clave')} />
      <button type="submit" className="btn btn-primary btn-compact" disabled={f.submitting}>Validar</button>
    </form>
  )
}

function TableDemo() {
  const [q, setQ] = useState('')
  const [rol, setRol] = useState('')
  const rows = useMemo(() => PEOPLE.filter((p) => (!rol || p.rol === rol) && (!q || p.nombre.toLowerCase().includes(q.toLowerCase()))), [q, rol])
  return (
    <div className="app-panel">
      <DataTable rows={rows} selectable pageSizes={[5, 10]} defaultPageSize={5} caption="Personas" noun={['persona', 'personas']}
        toolbar={<FilterBar search={q} onSearch={setQ} onClear={() => { setQ(''); setRol('') }} filters={[{ name: 'rol', label: 'Rol', value: rol, onChange: setRol, options: ['Analista', 'Revisor', 'Administrador'].map((r) => ({ value: r, label: r })) }]} />}
        columns={[{ key: 'nombre', header: 'Persona', sortable: true, render: (p) => <span className="app-person"><Avatar name={p.nombre} size="sm" /><strong>{p.nombre}</strong></span> }, { key: 'rol', header: 'Rol', sortable: true }, { key: 'estado', header: 'Estado', sortable: true, render: (p) => <StatusBadge tone={p.estado === 'activo' ? 'ok' : 'off'}>{p.estado}</StatusBadge> }]}
        rowActions={(p) => [{ label: 'Ver', icon: 'eye' }, { label: 'Editar', icon: 'pencil' }, { separator: true }, { label: 'Eliminar', icon: 'trash-2', danger: true }]} />
    </div>
  )
}

function NavDemo() {
  const [tab, setTab] = useState('a')
  const [step, setStep] = useState(1)
  return (
    <>
      <Tabs value={tab} onChange={setTab} tabs={[{ id: 'a', label: 'General', icon: 'settings' }, { id: 'b', label: 'Seguridad', icon: 'shield-check' }, { id: 'c', label: 'Avisos', badge: 3 }]}><p className="mb-0">Contenido de la pestaña «{tab}». Usa ← → Inicio y Fin.</p></Tabs>
      <div className="mt-4"><Stepper steps={['Datos', 'Documentos', 'Revisión', 'Envío']} current={step} onStepClick={setStep} />
        <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => setStep((s) => (s + 1) % 4)}>Siguiente paso</button></div>
      <div className="mt-4"><DropdownMenu label="Acciones" align="left" trigger={(p) => <button type="button" className="btn btn-outline-primary btn-compact" {...p}><Icon name="ellipsis" />Acciones</button>}
        items={[{ header: 'Documento' }, { label: 'Descargar', icon: 'download' }, { label: 'Compartir', icon: 'share-2' }, { label: 'Fijado', checked: true }, { separator: true }, { label: 'Eliminar', icon: 'trash-2', danger: true }]} /></div>
    </>
  )
}

export default function ReactLib() {
  return (
    <Section id="react" title="Componentes React" lead={<>Librería <code>gob-cl-tailwind/react</code>: componentes funcionales, accesibles y reutilizables con la identidad gob.cl. Las dos maquetas de abajo están construidas <strong>solo con estos componentes</strong>.</>}>
      <div className="row mb-4">
        <div className="col-md-6 mb-3"><a className="card-featured" href="tramites/" style={{ display: 'block', padding: '1.25rem' }}><h3 className="h4 mb-1"><Icon name="file-text" /> Plataforma de trámites</h3><p className="mb-0">Autenticación, panel, listado con filtros, asistente con carga de documentos, detalle, usuarios (CRUD) y configuración. Entra con <code>demo@example.com</code> / <code>Demo1234!</code>.</p></a></div>
        <div className="col-md-6 mb-3"><a className="card-featured" href="chat/" style={{ display: 'block', padding: '1.25rem' }}><h3 className="h4 mb-1"><Icon name="bot" /> Plataforma de IA (tipo ChatGPT)</h3><p className="mb-0">Autenticación, chat con adjuntos y streaming, biblioteca de archivos y ajustes. Misma cuenta de demostración.</p></a></div>
      </div>
      <h3>Instalación y uso</h3>
      <CodeBlock code={`npm install gob-cl-tailwind react react-dom`} />
      <CodeBlock code={`/* app.css */
@import "tailwindcss/theme.css" layer(theme);
@import "gob-cl-tailwind";
@import "gob-cl-tailwind/app.css";    /* estilos de los componentes React */
@import "tailwindcss/utilities.css" layer(utilities);

// main.jsx
import { ToastProvider, ModalProvider } from 'gob-cl-tailwind/react'
<ToastProvider><ModalProvider><App /></ModalProvider></ToastProvider>`} />
      <h3>Catálogo</h3>
      <div className="table-responsive"><table className="table table-bordered"><thead><tr><th>Categoría</th><th>Componentes</th></tr></thead><tbody>{CATALOG.map(([c, list]) => <tr key={c}><td><strong>{c}</strong></td><td><code style={{ background: 'none', padding: 0, color: 'inherit' }}>{list}</code></td></tr>)}</tbody></table></div>
      <h3>Modales, drawer y diálogos</h3>
      <p>Sobre <code>&lt;dialog&gt;</code> nativo: foco atrapado y restaurado, Esc, bloqueo de scroll, animación de entrada y salida, apilado, modo estático (no se cierra por error), estado «guardando» y hoja inferior en móvil.</p>
      <div className="ex"><div className="ex-preview"><ModalDemo /></div></div>
      <CodeBlock code={`const modal = useModal()
if (await modal.confirm({ title: 'Eliminar', tone: 'danger', requireText: 'ELIMINAR' })) { … }
const nombre = await modal.prompt({ title: 'Renombrar', label: 'Nombre', validate: (v) => (v ? '' : 'Requerido') })
<Modal open={open} onClose={close} title="Editar" size="lg" footer={…}>…</Modal>
<Modal variant="drawer" …>…</Modal>`} />
      <h3>Formularios con validación</h3>
      <div className="ex"><div className="ex-preview"><FormDemo /></div></div>
      <h3>Carga de archivos</h3>
      <div className="ex"><div className="ex-preview"><FileUpload label="Documentos" maxFiles={3} hint="Arrastra o selecciona; se simula la subida." /></div></div>
      <h3>Tabla de datos con filtros, orden, selección y paginación</h3>
      <TableDemo />
      <h3 className="mt-4">Pestañas, stepper y menú</h3>
      <div className="ex"><div className="ex-preview"><NavDemo /></div></div>
      <Alert tone="info" title="Autenticación y layouts">Mira <a href="tramites/#/login">Login, registro, recuperar y verificación en dos pasos</a> y el <a href="tramites/#/layouts">AppShell con controles en vivo</a> (sidebar expandido, riel u oculto; navbar clara u oscura; ancho del contenedor).</Alert>
    </Section>
  )
}
