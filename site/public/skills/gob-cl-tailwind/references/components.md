# API de componentes React (`gob-cl-tailwind/react`)

Todos se importan de `gob-cl-tailwind/react`. Requieren `@import "gob-cl-tailwind/app.css"`. Los textos por defecto están en español de Chile.

## Layout

**`AppShell`** — estructura de aplicación: sidebar (expandido | riel | oculto | móvil) + navbar + contenedor + footer. Incluye atajo `Ctrl/⌘+B`, preferencias persistidas (`storageKey`) y herramientas de accesibilidad.
```jsx
<AppShell
  brand={{ name: 'Mis Trámites', subtitle: 'Municipalidad', logo: '/img/gob-footer.svg', href: '#/' }}
  nav={[{ group: 'General', items: [{ label: 'Panel', icon: 'house', href: '#/', active: true, badge: 3 }] }]}
  user={{ name: 'Camila Rojas', role: 'Analista' }}
  userMenu={[{ label: 'Mi perfil', icon: 'user', onSelect }, { separator: true }, { label: 'Salir', icon: 'log-out', danger: true, onSelect }]}
  breadcrumbs={<Breadcrumbs items={[…]} />}  actions={<button …/>}  onSearch={abrirPaleta}
  renderLink={({ item, className, children, onClick }) => <NavLink to={item.href} className={className} onClick={onClick}>{children}</NavLink>}  // integra tu router
  footer={<AppFooter links={[…]}>© 2026</AppFooter>}
>{children}</AppShell>
```
`useShell()` → `{ prefs, setPrefs, reset, mobileOpen, setMobileOpen, a11y }` (`prefs`: `sidebar` expanded|rail|hidden, `navbar` light|dark, `density` comfortable|compact, `container` fixed|wide|narrow|fluid). `markActive(nav, (item) => boolean)` devuelve `nav` con `active` calculado, p. ej. `markActive(nav, (i) => i.href === pathname)`.

**`Container`** `{ size: 'fixed'|'wide'|'narrow'|'fluid', as }` · **`PageHeader`** `{ title, description, actions, breadcrumbs }` · **`Panel`** `{ title, actions, footer, flush, danger, id }` (tarjeta de sección; `danger` = zona de riesgo) · **`StatCard`** `{ label, value, delta, down, icon }` (indicador).

**`SiteNavbar`** `{ logo, brandHref, links:[{label,href,active}], actions, dark, sticky }` · **`Footer`** `{ logo, description, columns:[{title,links:[{label,href}]}], social:[{icon,label,href}], legal }` · **`AppFooter`** `{ links, children }`.

## Autenticación

`AuthLayout` `{ title, subtitle, children, footer, aside, logo, home }` envuelve la pantalla (panel azul + formulario). Formularios (todos con `links` para enlaces a otras pantallas):

| Componente | `onSubmit` recibe | Notas |
|---|---|---|
| `LoginForm` | `{ identifier, password, remember }` | Lanza `Error('mensaje')` para mostrarlo; `onClaveUnica` agrega botón ClaveÚnica |
| `RegisterForm` | datos del registro | Valida RUN, correo, clave con medidor |
| `ForgotPasswordForm` | `{ identifier }` | Confirmación + reenvío con espera (`resendAfter`) |
| `ResetPasswordForm` | `{ password }` | Medidor y requisitos |
| `TwoFactorForm` | `{ code }` | `onResend`, `destination`; OTP de 6 dígitos |

El `onSubmit` es el punto de integración con tu backend. **Valida siempre en el servidor.**

## Formularios

`useForm({ initial, validate, onSubmit })` → `{ values, errors, dirty, submitting, submitError, setValue, setValues, touch, bind, bindCheck, handleSubmit, reset, valid }`.
- `validate(values)` devuelve `{ campo: 'mensaje' }`; el error se muestra tras tocar el campo o enviar. Al fallar, enfoca el primer campo inválido.
- `<TextField {...f.bind('campo')} />`; para checkbox/switch: `{...f.bindCheck('campo')}`.
- `f.reset(nuevoInicial)` fija un nuevo estado base (útil tras guardar: `dirty` vuelve a `false`).

Campos (todos aceptan `label, hint, error, required, id` y reenvían el resto al `<input>`): `TextField`, `TextareaField` (`maxLength` con contador), `SelectField` (`options:[{value,label}]`, `placeholder`), `DateField`, `RunField` (formatea al salir: `12.345.678-5`), `PasswordField` (`strength` activa medidor), `CheckboxField`, `Switch` `{ label, description, checked, onChange }`, `RadioGroup` `{ label, name, options:[{value,label,description}], value, onChange, cards }`, `SearchInput` `{ value, onChange }`, `OtpInput` `{ length, value, onChange, onComplete, error }`, `Field` (contenedor genérico para tus propios controles).

Validadores: `validRun`, `formatRun`, `cleanRun`, `runDv`, `validEmail`, `validPhone`, `passwordChecks`, `passwordScore`, `STRENGTH_LABELS`.

**`FileUpload`** `{ label, hint, error, required, accept, maxFiles=5, maxBytes=10MB, multiple, disabled, defaultValue, onChange, upload, onReject, compact }`. `onChange(items)` recibe `[{ id, name, size, type, kind, progress, status: 'uploading'|'done'|'error', error?, file }]`. Sin `upload` simula el progreso; para subir de verdad: `upload={(item, onProgress) => promesa}`. Arrastrar, pegar y teclado incluidos. Helpers: `ACCEPT`, `LIMITS`, `formatSize`, `kindOf`, `validateFiles`.

## Datos

**`FilterBar`** `{ search, onSearch, searchPlaceholder, filters:[{name,label,value,onChange,options:[{value,label}]}], onClear, actions }`.

**`DataTable`** — tú filtras `rows`; la tabla ordena y pagina en cliente.
`{ columns, rows, rowKey='id', loading, selectable, bulkActions, rowActions, onRowClick, onSelectionChange, pageSizes=[10,20,50], defaultPageSize, defaultSort:{key,dir}, empty, toolbar, caption, noun:['trámite','trámites'] }`
- `columns: [{ key, header, sortable, render(row), sortValue(row), align, hideBelow:'sm'|'md', width }]`
- `rowActions(row)` → items de `DropdownMenu`; `bulkActions(selectedRows, clearSelection)` → nodo (barra al seleccionar).
- `loading` muestra esqueletos; sin filas muestra `EmptyState` (personalizable con `empty`).
- Para datos de servidor muy grandes, pagina en servidor y pasa solo la página (la tabla paginará esa porción).

`Pagination` `{ page, pages, onChange }` (la usa `DataTable`; también suelta) · `StatusBadge` `{ tone: 'ok'|'warn'|'danger'|'off'|'info' }` · `Avatar` `{ name, src, size }` · `EmptyState` `{ icon, title, children, action }` · `Skeleton` `{ width, height }`.
CSV: `toCsv(rows, columns)`, `parseCsv(text)` (→ objetos por encabezado), `downloadFile(nombre, texto, mime)`.

## Navegación

`DropdownMenu` `{ trigger, items, align:'left'|'right', side:'bottom'|'top', label, width }`; `items`: `{ label, icon, onSelect, href, danger, disabled, checked }`, `{ separator: true }`, `{ header: 'Texto' }`. Teclado: ↑↓ Inicio Fin, tecla inicial, Esc. `trigger` puede ser nodo o función `(props) => botón` (usa `props` en tu botón).
`Tabs` `{ tabs:[{id,label,icon,badge}], value, onChange, children }` · `Stepper` `{ steps:['A','B'], current, onStepClick }` · `Breadcrumbs` `{ items:[{label,href}], as }`.

## Feedback

**`Modal`** `{ open, onClose, title, subtitle, icon, tone:''|'info'|'success'|'warning'|'danger', size:'sm'|'md'|'lg'|'xl'|'full', variant:'drawer', staticBackdrop, busy, footer }` — `<dialog>` nativo: foco atrapado y restaurado, Esc, animación, hoja inferior en móvil. `staticBackdrop` evita cerrar por error (formularios con cambios).
Pie recomendado: `<div className="gob-modal-footer">` con botones `btn btn-outline-primary btn-compact` + `btn btn-primary btn-compact`.

**`useModal()`** (requiere `ModalProvider`) — devuelve promesas:
- `await modal.confirm({ title, text, tone:'danger', confirmLabel, cancelLabel, requireText:'ELIMINAR', icon, size })` → `true|false`
- `await modal.alert({ title, text, tone })` → `undefined`
- `await modal.prompt({ title, label, initial, placeholder, multiline, validate: (v) => 'error'|'' })` → `string|null`

**`useToast()`** (requiere `ToastProvider`) → `toast('Texto', 'ok'|'error'|'warn')` o `toast('Texto', { kind, action:{label,onClick}, duration })`. Úsalo para confirmar acciones; añade `action: Deshacer` en eliminaciones.

**`Alert`** `{ tone:'info'|'success'|'warning'|'danger', title, onClose }` para mensajes que deben quedarse visibles.

## Carga

`Spinner` `{ size:'sm'|'md'|'lg', variant:'border'|'grow', tone, label }` · `Loading` `{ children, size }` (spinner + texto en línea) · `LoadingScreen` `{ title, message, minHeight }` (bloque centrado) · `LoadingOverlay` `{ active, label, children }` (bloquea un contenedor mientras guarda) · `ProgressBar` `{ value 0–100, label, tone, striped, height }` (sin `value` = indeterminada) · `SkeletonText` `{ lines }` · `SkeletonCard`.
Regla: listas → `loading` de `DataTable`/`Skeleton*`; botón enviando → `disabled` + spinner; acción larga bloqueante → `LoadingOverlay`.

## Vista previa de archivos

`FilePreview` `{ file, name, height='28rem', toolbar, onDownload }` — `file`: `File | Blob | { url, name, type, size }`.
Se muestran: imagen (zoom), PDF, video/audio, texto/código, CSV/TSV, **Word `.docx`**, **Excel `.xlsx`** (pestañas por hoja), **PowerPoint `.pptx`** (texto por diapositiva), **DXF** (SVG 2D). **DWG** y Office antiguo (`.doc/.xls/.ppt`) **no se pueden dibujar en un navegador**: muestran información (versión de AutoCAD) y descarga; sugiere exportar a PDF/DXF. Word/Excel/PowerPoint requieren `mammoth` y `jszip` (se cargan bajo demanda). `FilePreviewModal` `{ file, open, onClose }` lo abre en un modal. `previewKind(name, type)` devuelve el tipo detectado.

## Accesibilidad y utilidades

`useAccessibility()` → `{ contrast, font (0–2 = 16/20/24 px), toggleContrast, setFont(i), maxFont }` (alto contraste y tamaño de texto; estado compartido, persistido en las mismas claves de localStorage que gob.cl y aplicado como clases `a11y-contrast` / `a11y-font-N` en `<html>`). `useDismiss(open, ref, close)` cierra al clic fuera/Esc. `Icon` `{ name }` (ver `icons.md`).
