---
name: gob-cl-tailwind
description: Construye interfaces con la identidad oficial del Gobierno de Chile (gob.cl) usando el paquete gob-cl-tailwind (Tailwind CSS 4 + componentes React). Úsala cuando el usuario pida una web, app, formulario, panel, trámite, login, tabla, chat o cualquier UI "gob.cl", "Gobierno de Chile", "Gobierno Digital", "framework.digital.gob.cl", o cuando el proyecto ya importe gob-cl-tailwind.
---

# gob-cl-tailwind

Framework CSS oficial del Gobierno de Chile reconstruido sobre **Tailwind CSS 4** (mismos nombres de clase que `@gobdigital-cl/gob.cl`, que usaba Bootstrap 4), más una **librería de componentes React** (`gob-cl-tailwind/react`) con 427 íconos. Proyecto comunitario: el diseño y la marca pertenecen al Gobierno de Chile.

## Regla de oro

**Usa los componentes y clases que ya existen; no inventes estilos.** El valor de este framework es la fidelidad visual al diseño oficial. Antes de escribir CSS propio, busca en este orden:

1. Un componente React de la librería (`references/components.md`).
2. Una clase del framework (`references/css-classes.md`): `btn btn-primary`, `card-news`, `alert alert-info`…
3. Una utilidad de Tailwind (`flex`, `gap-4`, `p-2`) — siempre gana sobre los componentes porque estos viven en `@layer components`.
4. Solo si nada sirve: CSS propio **usando los tokens** (`var(--color-primary)`), nunca colores literales.

## Instalación (proyecto React + Vite)

```bash
npm install gob-cl-tailwind tailwindcss @tailwindcss/vite react react-dom
# solo si se previsualizan Word/Excel/PowerPoint:
npm install mammoth jszip
```

```css
/* app.css — SIN preflight de Tailwind: el reboot de Bootstrap ya viene incluido */
@import "tailwindcss/theme.css" layer(theme);
@import "gob-cl-tailwind/fonts.css";
@import "gob-cl-tailwind";
@import "gob-cl-tailwind/app.css";      /* estilos de los componentes React */
@import "tailwindcss/utilities.css" layer(utilities);
/* Opcionales: */
@import "gob-cl-tailwind/compat.css";   /* utilidades Bootstrap 4 (m-*, p-*, d-*…) */
@import "gob-cl-tailwind/chat.css";     /* interfaz tipo ChatGPT */
```

```jsx
// main.jsx — los proveedores habilitan modales imperativos y toasts
import 'gob-cl-tailwind/js'  // solo si usas HTML con data-toggle (colapsables, dropdown, tabs…)
import { ToastProvider, ModalProvider } from 'gob-cl-tailwind/react'
<ToastProvider><ModalProvider><App /></ModalProvider></ToastProvider>
```

Sin build (HTML plano): `<link href="…/dist/gob.min.css">` + `<script src="…/dist/gob.min.js" defer>`. El HTML del framework oficial funciona sin cambios.

## Identidad visual (no negociable)

- **Azul primario** `#006fb3` (`--color-primary`); secundario rojo `#fe6565`; azul oscuro `#0a132d` (`--color-tertiary`); acento `#a8b7c7`.
- **Tipografía**: Roboto (texto) y Roboto Slab (títulos). Ya viene en el reboot; no cambies `font-family`.
- **Esquinas rectas** (sin `border-radius` en botones, cards, inputs) y **línea azul/roja** (`<div class="line"></div>`) bajo cabeceras.
- Un solo botón primario (`btn btn-primary`) por vista; acciones secundarias `btn-outline-primary`; destructivas `btn-danger`.
- Idioma de la interfaz: **español de Chile**, tono formal-cercano ("Ingresa tu RUN", no "Introduce tu DNI"). Fechas `22 nov 2026`, RUN con puntos y guion (`12.345.678-5`), moneda `$125.000`.

## Componentes React: elegir el correcto

| Necesidad | Usa |
|---|---|
| Panel autenticado (sidebar + navbar + contenido) | `AppShell` + `Container` + `PageHeader` + `Panel` |
| Sitio público (header/footer institucional) | `SiteNavbar` + `Footer` |
| Login, registro, recuperar clave, 2FA | `AuthLayout` + `LoginForm` / `RegisterForm` / `ForgotPasswordForm` / `ResetPasswordForm` / `TwoFactorForm` |
| Formulario | `useForm` + `TextField`, `RunField`, `PasswordField`, `SelectField`, `DateField`, `TextareaField`, `CheckboxField`, `Switch`, `RadioGroup` |
| Subir archivos | `FileUpload` (valida tipo/tamaño, progreso) |
| Vista previa de archivos | `FilePreview` / `FilePreviewModal` (PDF, imagen, Word, Excel, PowerPoint, CSV, texto, DXF) |
| Listado de datos | `FilterBar` + `DataTable` (orden, selección, paginación, acciones por fila) |
| Confirmar / pedir un dato | `useModal().confirm / alert / prompt` |
| Diálogo propio / lateral | `Modal` (`variant="drawer"` para panel lateral) |
| Aviso breve (con "Deshacer") | `useToast()` |
| Mensaje persistente | `Alert` |
| Carga | `Spinner`, `Loading`, `LoadingScreen`, `LoadingOverlay`, `ProgressBar`, `SkeletonText`, `SkeletonCard` |
| Menú contextual / de usuario | `DropdownMenu` |
| Pestañas, pasos, migas | `Tabs`, `Stepper`, `Breadcrumbs` |
| Estados vacíos y etiquetas | `EmptyState`, `StatusBadge`, `Avatar` |
| Íconos | `<Icon name="search" />` |

Firmas y props completas: **`references/components.md`**. Recetas de pantallas completas (login, CRUD, wizard con documentos, chat): **`references/patterns.md`**.

## Patrones imprescindibles

```jsx
// Validación: errores solo después de tocar el campo o enviar
const f = useForm({
  initial: { run: '', email: '' },
  validate: (v) => ({ ...(!validRun(v.run) && { run: 'RUN inválido' }), ...(!validEmail(v.email) && { email: 'Correo inválido' }) }),
  onSubmit: async (v) => { await api.save(v); toast('Guardado', 'ok') },
})
<form onSubmit={f.handleSubmit} noValidate>
  <RunField label="RUN" required {...f.bind('run')} />
  <TextField label="Correo" type="email" required {...f.bind('email')} />
  <button className="btn btn-primary" disabled={f.submitting}>Guardar</button>
</form>
```

```jsx
// Acciones destructivas: confirmación con tono de peligro y, si es grave, texto a escribir; luego "Deshacer"
const modal = useModal(); const toast = useToast()
if (await modal.confirm({ title: 'Eliminar trámite', text: 'Esta acción no se puede deshacer.', tone: 'danger', confirmLabel: 'Eliminar', requireText: 'ELIMINAR' })) {
  remove(id); toast('Trámite eliminado', { action: { label: 'Deshacer', onClick: () => restore(id) } })
}
```

```jsx
// Tabla: filtra tú (rows ya filtrados); la tabla ordena y pagina
<FilterBar search={q} onSearch={setQ} filters={[{ name: 'estado', label: 'Estado', value: estado, onChange: setEstado, options }]} onClear={reset} />
<DataTable columns={[{ key: 'folio', header: 'Folio', sortable: true }, { key: 'estado', header: 'Estado', render: (r) => <StatusBadge tone="ok">{r.estado}</StatusBadge> }]}
  rows={rows} loading={loading} selectable rowActions={(r) => [{ label: 'Ver', icon: 'eye', onSelect: () => open(r) }, { label: 'Eliminar', icon: 'trash-2', danger: true, onSelect: () => del(r) }]} />
```

## Accesibilidad (requisito, no extra)

El framework oficial exige WCAG: mantenlo.
- Todo campo con `label` visible; errores asociados (los campos de la librería ya lo hacen). Nunca solo `placeholder`.
- Íconos decorativos con `aria-hidden` (`<Icon>` ya lo hace); botones de solo ícono con `aria-label`.
- Foco visible siempre; no uses `outline: none`. Probar todo con teclado (Tab, Enter, Esc, flechas en menús/tabs).
- **Alto contraste** (`html.a11y-contrast`) y **tamaño de texto** (`a11y-font-N`): `AppShell` los incluye; en otros casos usa el hook `useAccessibility()`. Todo estilo propio debe verse bien en alto contraste: usa tokens y variables `--app-*`, no colores fijos.
- Mensajes dinámicos en regiones `aria-live` (`useToast`, `Alert`, `Loading` ya lo hacen).

## Trampas conocidas (ahorra tiempo)

1. **No importes el preflight de Tailwind** (`@import "tailwindcss"`): choca con el reboot de Bootstrap. Importa `theme.css` y `utilities.css` por separado, como arriba.
2. **Elementos HTML globales**: el core estiliza `footer`, `main`, `header`, `nav` con estilos institucionales. Para bloques propios usa `<div role="contentinfo">` en vez de `<footer>`; usa `<main>` solo una vez, en el contenido principal.
3. **`container`** conserva el significado de Bootstrap (540/720/960/1140), no el de Tailwind. Para ancho propio usa `max-w-*` con `mx-auto`.
4. **`collapse`** es el colapsable de Bootstrap, no la utilidad de Tailwind.
5. **Íconos**: `cl cl-<nombre>`; 427 disponibles (`dist/icons.json`, grupo "Oficiales gob.cl" primero). Si dudas del nombre, búscalo en `references/icons.md`; no inventes uno. Si un nombre extra coincide con uno oficial se publica con sufijo `-alt`.
6. **Colores en `color-mix`/`bg-*`**: usa los tokens del tema (`bg-primary`, `text-tertiary`, `border-accent`); `--color-*` está reiniciado, no existen los colores por defecto de Tailwind (`bg-blue-500` no existe; sí `bg-blue`, `bg-blue-dark`, `bg-gray-a`).
7. **Breakpoints propios**: `ss` 375, `sm` 576, `md` 768, `lg` 992, `xl` 1200, `2xl` 1400. Diseña mobile-first; verifica 390 px de ancho sin scroll horizontal.
8. **`<dialog>` nativo**: `Modal` usa `<dialog>`; no apiles modales a mano, usa `useModal()` o varios `Modal` (se apilan solos).
9. **Bootstrap 6 (`next.css`) es alpha**: solo si necesitas `dialog`, `drawer`, `combobox`, `datepicker`, `otp`… vía HTML; en React prefiere los componentes de la librería. No mezcles `btn-solid` con `btn-primary` en una misma pantalla.
10. **JS de `gob-cl-tailwind/js`** solo se necesita para HTML con `data-toggle`. En React no lo uses: los componentes ya manejan su estado.
11. **Autenticación real**: las maquetas simulan login en el navegador. En producción valida en servidor; nunca claves de API en el cliente; en `AuthPages` reemplaza el `onSubmit` por llamadas reales.
12. **Uso de logos/marca**: usa los SVG oficiales incluidos en `brand/` y `site/public/img/`; no redibujes ni deformes el logo de Gobierno de Chile.

## Verificación antes de entregar

- [ ] `npm run build` del proyecto pasa y no hay errores de consola.
- [ ] Toda la UI usa componentes/clases del framework; ningún color literal nuevo.
- [ ] Probado a 390 px y a 1280 px (sin scroll horizontal).
- [ ] Probado con teclado y con alto contraste activado (`document.documentElement.classList.add('a11y-contrast')`).
- [ ] Textos en español de Chile; estados vacío, cargando y error cubiertos (`EmptyState`, `Loading*`, `Alert`).

## Dónde mirar más

- **`references/components.md`** — API de todos los componentes React.
- **`references/patterns.md`** — recetas de pantallas (auth, CRUD, wizard, subir y previsualizar, chat).
- **`references/css-classes.md`** — clases del framework (botones, cards, alertas, grillas, utilidades) y tokens.
- **`references/icons.md`** — cómo encontrar y usar íconos.
- Documentación en vivo: la raíz del sitio de documentación (`/`), maquetas `/tramites/` y `/chat/` (código en `site/tramites` y `site/chat`: son la mejor referencia de uso real).
- `llms.txt` / `llms-full.txt` en la raíz del sitio: versión para modelos de este mismo contenido.
