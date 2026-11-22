# gob-cl-tailwind

Framework CSS del **Gobierno de Chile** ([framework.digital.gob.cl](https://framework.digital.gob.cl/)) sobre **Tailwind CSS 4**.
Traspaso íntegro del framework oficial (`@gobdigital-cl/gob.cl` 3.0.10, que dependía de Bootstrap 4 + jQuery + Popper): mismo diseño, mismos nombres de clase, ahora con tokens de Tailwind, capas CSS, JS sin dependencias, **427 íconos** y una capa opcional con los componentes nuevos de **Bootstrap 6**.

> Proyecto comunitario no oficial. El diseño, marca y logotipos pertenecen al Gobierno de Chile / División de Gobierno Digital.

## Estado verificado

| Medición | Resultado |
|---|---|
| Clases del CSS oficial (8.206) presentes en `dist/gob.css` | **100 %** (0 faltantes) |
| Íconos oficiales (53) | **100 %** |
| Paridad de estilos computados contra la documentación oficial (26 páginas, escritorio y móvil, 24.572 elementos) | **99,52 %** |
| Ídem en modo alto contraste (`a11y-contrast`) | **99,47 %** |

La paridad se mide con `tools/parity.cjs`, que renderiza la documentación oficial con el CSS original y con éste y compara ~60 propiedades por elemento. Diferencias conocidas: los íconos son máscaras CSS en lugar de icon-font (varían ±2 px de alto de línea en algunos enlaces con ícono).

## Instalación

```bash
npm install gob-cl-tailwind tailwindcss @tailwindcss/vite
```

```css
/* app.css — sin preflight: el reboot de Bootstrap ya viene en el core */
@import "tailwindcss/theme.css" layer(theme);
@import "gob-cl-tailwind/fonts.css";   /* Roboto + Roboto Slab */
@import "gob-cl-tailwind";             /* tokens + core Bootstrap 4/gob.cl + alto contraste + íconos */
@import "tailwindcss/utilities.css" layer(utilities);

/* Opcionales */
@import "gob-cl-tailwind/compat.css";  /* utilidades Bootstrap 4 (m-*, p-*, d-*, flex…) + modo a11y-fonts */
@import "gob-cl-tailwind/next.css";    /* componentes nuevos de Bootstrap 6 (alpha) con identidad gob.cl */
```

```js
import "gob-cl-tailwind/js";       // colapsables, dropdown, tabs, modal, toolbar (data-toggle)
import "gob-cl-tailwind/next/js";  // opcional: dialog, drawer, menu, combobox… (data-bs-toggle)
```

### Sin build (reemplazo directo de `gob.cl.css`)

```html
<link rel="stylesheet" href="node_modules/gob-cl-tailwind/dist/fonts.css">
<link rel="stylesheet" href="node_modules/gob-cl-tailwind/dist/gob.min.css">
<script src="node_modules/gob-cl-tailwind/dist/gob.min.js" defer></script>
```

`dist/gob.min.css` incluye core, compat, alto contraste, a11y-fonts e íconos (146 KB comprimido). El HTML del framework oficial funciona sin cambios.

## Arquitectura

| Archivo | Contenido | Origen |
|---|---|---|
| `src/theme.css` | `@theme`: paleta oficial, breakpoints 375/576/768/992/1200, tipografía | Variables SCSS oficiales |
| `src/core/reboot.css` | Reboot + tipografía base (`@layer base`) | CSS oficial compilado |
| `src/core/components.css` | Bootstrap 4 (grid, forms, botones, navbar, cards, modal…) + componentes gob.cl (`@layer components`) | CSS oficial compilado |
| `src/core/a11y-contrast.css` | Tema oficial `html.a11y-contrast` | CSS oficial compilado |
| `src/core/utilities-bootstrap.css` | Utilidades de Bootstrap 4 (`compat.css`) | CSS oficial compilado |
| `src/core/a11y-fonts.css` | Re-flujo de grilla con fuentes ampliadas (`compat.css`) | CSS oficial compilado |
| `src/icons.generated.css` | 427 íconos como máscaras CSS (`.cl-*`) | `scripts/build-icons.mjs` |
| `src/next/*` | Componentes nuevos de Bootstrap 6 reteñidos | `tools/build-next.mjs` |
| `src/extras.css` | `container`/`collapse` sin choque con Tailwind, skip-link, foco | Propio |

El core **no se reescribió a mano**: `tools/build-core.mjs` parte el CSS oficial por módulo SCSS usando su sourcemap, conserva el orden exacto de la cascada, convierte los colores literales en tokens (`var(--color-primary)`…) y el icon-font en máscaras. Se regenera con `npm run build:core`.

Los componentes están en `@layer components`, por lo que una utilidad de Tailwind siempre los sobrescribe (`btn btn-primary p-2`).

## Íconos

`<i class="cl cl-search"></i>`: máscaras CSS que heredan `currentColor` y se dimensionan con `font-size` (`cl-2x` … `cl-10x`, `text-2xl`). 53 oficiales + 374 extra (Lucide, Simple Icons). Si un nombre extra coincide con uno oficial se publica con sufijo `-alt`. Listado en `dist/icons.json`.

## Bootstrap 6 (opcional)

Bootstrap 6 está en **`6.0.0-alpha.1`** (pre-lanzamiento, rompe compatibilidad con v5) y reemplaza clases (`btn-solid theme-primary`, `sm:col-2`…). Por eso **no sustituye** al core: la capa `next` agrega solo familias sin equivalente en Bootstrap 4/gob.cl —`dialog`, `drawer`, `menu`, `stepper`, `avatar`, `chip`, `combobox`, `datepicker`, `otp`, `strength`, `check/radio/switch`, `form-field`, `btn-solid`, `theme-*`…— con la paleta oficial y esquinas rectas. El JS (`dist/next/bootstrap6.bundle.min.js`) es un módulo ES: sírvelo por http, no `file://`. Al ser alpha, su API puede cambiar.

## Alto contraste

`html.a11y-contrast` aplica el tema oficial (cubre todos los componentes de gob.cl). Si construyes con utilidades Tailwind o usas la capa `next`, añade `gob-cl-tailwind/contrast-tokens.css`, que además invierte los tokens `--color-*`.

## Migración desde `@gobdigital-cl/gob.cl`

- Clases de componente y utilidades Bootstrap 4: **sin cambios** (con `compat.css`).
- Tailwind usa otra escala de espaciado: `mb-3` (1rem en Bootstrap) → `mb-4`. Con `compat.css` los `m-*`/`p-*` de Bootstrap siguen funcionando (`!important`).
- `.collapse` y `.container` conservan su significado Bootstrap (se neutralizan las utilidades homónimas de Tailwind; usa `invisible` para `visibility: collapse`).
- Variables SCSS → variables CSS (`var(--color-primary)`); personaliza con `@theme`.
- jQuery/Popper ya no se necesitan: `data-toggle`, `data-dismiss`, `data-parent` funcionan con el JS incluido.

## Librería de componentes React (`gob-cl-tailwind/react`)

Componentes funcionales, accesibles y reutilizables, con su CSS (`gob-cl-tailwind/app.css`):

| Categoría | Componentes |
|---|---|
| Layout | `AppShell` (sidebar expandido / riel / oculto / móvil + navbar + contenedor + footer), `Container`, `PageHeader`, `Panel`, `StatCard`, `Footer`, `AppFooter`, `SiteNavbar` |
| Navegación | `DropdownMenu` (teclado completo), `Tabs`, `Stepper`, `Breadcrumbs`, `Pagination` |
| Formularios | `Field`, `TextField`, `TextareaField`, `SelectField`, `DateField`, `RunField`, `PasswordField` (medidor de fortaleza), `CheckboxField`, `Switch`, `RadioGroup`, `SearchInput`, `OtpInput`, `FileUpload` (arrastrar, vista previa, validación, progreso), `useForm` |
| Datos | `DataTable` (orden, selección, acciones por fila, paginación, estados de carga/vacío), `FilterBar`, `StatusBadge`, `Avatar`, `EmptyState`, `Skeleton`, `toCsv` / `parseCsv` |
| Feedback | `Modal` (tamaños, tonos, drawer, hoja inferior en móvil, apilado, animación de salida), `useModal` (`confirm`, `alert`, `prompt`), `ToastProvider` (con acción «Deshacer»), `Alert` |
| Autenticación | `AuthLayout`, `LoginForm`, `RegisterForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `TwoFactorForm` |
| Accesibilidad | `useAccessibility` (alto contraste y tamaño de texto, sincronizado entre componentes) |

```css
@import "tailwindcss/theme.css" layer(theme);
@import "gob-cl-tailwind";
@import "gob-cl-tailwind/app.css";
@import "tailwindcss/utilities.css" layer(utilities);
```

```jsx
import { ToastProvider, ModalProvider, DataTable, FilterBar, useModal } from 'gob-cl-tailwind/react'
```

El código fuente está en `src/react`; `npm run build:react` genera `dist/react/index.js` (ESM, `react` como dependencia externa).

## Maquetas (hechas solo con la librería)

- **`/tramites/` — Plataforma de gestión de trámites**: autenticación (login, registro, recuperar, restablecer, verificación en dos pasos), panel, listado con filtros/orden/paginación/acciones masivas/exportar CSV, asistente de nuevo trámite (carga de documentos, borrador automático, comprobante), detalle con línea de tiempo y comentarios, usuarios (CRUD con modal, drawer, importación CSV y deshacer), configuración (perfil, seguridad con 2FA y tokens, notificaciones, apariencia, zona de riesgo) y página de layouts con controles en vivo.
- **`/chat/` — Plataforma de IA tipo ChatGPT**: autenticación, chat (historial, streaming, adjuntos, Markdown), biblioteca de archivos (tabla + carga) y ajustes (perfil, personalización, proveedor, apariencia, datos).
- Cuenta de demostración de ambas: `demo@example.com` / `Demo1234!` (en trámites, código de verificación `123456`). **La autenticación es simulada**: no hay servidor.

## Chat de IA

Interfaz de conversación con IA lista para usar, con la identidad gob.cl (sidebar azul oscuro, línea azul/roja, esquinas rectas, alto contraste y tamaño de texto):

- **Estilos reutilizables**: `gob-cl-tailwind/chat.css` (clases `.chat-*`, también para quien no use React).
- **App de referencia en React**: `site/chat` (se publica en `/chat/` junto a la documentación). Incluye historial con búsqueda, fijar/renombrar/eliminar, streaming con detener (Esc), Markdown con tablas y código con copia, adjuntos (clic, arrastrar, pegar; imágenes con vista previa), editar/regenerar/copiar/valorar, exportar a Markdown/JSON, atajos de teclado, persistencia local y dictado por voz.
- **Proveedores intercambiables** (`site/chat/src/lib/providers`): por defecto un **motor de demostración local** (respuestas simuladas y rotuladas como tales, sin red); o cualquier servicio compatible con la API de OpenAI desde *Ajustes*. Para producción apunta la URL a tu propio backend: no pongas claves de API en el navegador ni expongas un endpoint sin autenticación ni límites.
- Las respuestas de IA pueden contener errores: el aviso bajo el cuadro de mensaje se mantiene siempre visible.

## Documentación (React)

`site/` es una app **React 19 + Vite** que consume el paquete igual que cualquier proyecto Tailwind 4 (con `@tailwindcss/vite`). Incluye todos los componentes con su código, galería de íconos filtrable, scrollspy y tabla de migración.

```bash
npm run docs:dev       # desarrollo
npm run docs:build     # genera site/dist
```

Despliegue en Vercel: `vercel.json` ya define `buildCommand: npm run docs:build` y `outputDirectory: site/dist`.

## Desarrollo

```bash
npm install
npm run build        # íconos → fuentes → JS → next → CSS (dist/)
npm run build:core   # regenera src/core desde el CSS oficial
NODE_PATH=$(npm root -g) node tools/parity.cjs <site-oficial> <site-copia>   # arnés de paridad
```

## Licencia

MIT. Ver `LICENSE` (Gobierno de Chile, Magnet SpA, The Bootstrap Authors, Lucide, Simple Icons, Roboto).
