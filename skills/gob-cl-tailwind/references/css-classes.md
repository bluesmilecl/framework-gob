# Clases del framework y tokens

Los nombres de clase son **idénticos al framework oficial** (`@gobdigital-cl/gob.cl` 3.x sobre Bootstrap 4). Todo vive en `@layer components`: una utilidad de Tailwind siempre lo sobrescribe (`btn btn-primary px-6`). Marcado HTML de cada componente: `site/src/sections/*.jsx` (cada ejemplo trae su HTML) o la documentación publicada.

## Tokens (`@theme`) — úsalos siempre en vez de colores literales

| Token / utilidad Tailwind | Valor | Uso |
|---|---|---|
| `primary` / `blue` | `#006fb3` | Acciones principales, enlaces |
| `secondary` / `red` / `danger` | `#fe6565` | Acento, error, destructivo |
| `tertiary` / `blue-dark` | `#0a132d` | Títulos, fondos oscuros, sidebar |
| `accent` / `blue-light` / `gray` | `#a8b7c7` | Bordes y fondos suaves |
| `neutral` | `#eeeeee` | Fondos neutros |
| `success` `#2d717c` · `info` `#17a2b8` · `warning` `#f2c728` · `light` `#f8f9fa` · `dark` `#343a40` | | Semánticos |
| `orange`, `orange-light`, `yellow`, `green`, `teal`, `cyan`, `indigo`, `purple`, `pink`, `black` `#111`, `white` | | Paleta base |
| `gray-a` `#4a4a4a`, `gray-b`, `gray-c`, `gray-100 … gray-900` | | Texto secundario y grises |

Utilidades: `bg-primary`, `text-tertiary`, `border-accent`, y las del core: `bg-blue-dark`, `text-gray-a`, `bg-layer-*`, `bg-before-*`, `bg-after-*`. **No existen** los colores por defecto de Tailwind (`bg-blue-500`, `text-slate-700`): `--color-*` está reiniciado.
Tipografía: `font-sans` (Roboto) · `font-slab` (Roboto Slab, títulos). Breakpoints: `ss` 375 · `sm` 576 · `md` 768 · `lg` 992 · `xl` 1200 · `2xl` 1400.
Variables CSS disponibles: `var(--color-primary)`, `var(--font-sans)`, etc. Los componentes React definen además `--app-*` (fondo, texto, borde, superficie, primario…) que cambian solas en alto contraste: úsalas en CSS propio dentro de componentes de la librería.

## Botones

`btn` + variante: `btn-primary` · `btn-secondary` · `btn-tertiary` · `btn-success` · `btn-danger` · `btn-warning` · `btn-info` · `btn-light` · `btn-dark` · `btn-neutral` · `btn-accent` · `btn-link`.
Contorno: `btn-outline-*` · Píldora: `btn-pill-*`. Tamaños: `btn-sm`, `btn-lg`, `btn-block`. Grupo: `btn-group`, `btn-toolbar`. Los botones son de esquinas rectas; no agregues `rounded`.

## Alertas, etiquetas y banners

`alert alert-{primary|secondary|success|danger|warning|info|light|dark|tertiary|accent|neutral}` (+ `alert-dismissible`, `alert-heading`, `alert-link`). Etiquetas: `badge badge-{color}` (+ `badge-pill`). Banner institucional: `banner` con `banner-icon`, `banner-text`, `banner-shadow`.

## Cards (todas oficiales gob.cl)

`card` (+ `card-body`, `card-header`, `card-footer`, `card-title`, `card-text`, `card-img-top`) y las de gobierno: `card-featured`, `card-featured-news`, `card-news` (`card-news-image`, `card-news-body`, `card-news-footer`), `card-informative`, `card-category`, `card-function` (persona/cargo), `card-detail`, `card-organization`, `card-links`, `card-data` / `card-data-list` (cifras). Cada una con sufijos `-image`, `-body`, `-title`. Imagen de fondo con `pseudo-background` + `<img class="pseudo-src">` oculta. Truncado de texto: `text-lines-{líneas}-{lineas-móvil}` (p. ej. `text-lines-7-3`).

## Navegación y estructura

`navbar` (+ `navbar-light|dark`, `navbar-expand-{ss|sm|md|lg|xl}`, `navbar-brand`, `navbar-nav`, `nav-item`, `nav-link`, `nav-separator`), `dropdown` / `dropdown-menu` / `dropdown-item`, `nav nav-tabs`, `breadcrumb`, `pagination` / `page-item` / `page-link`, `collapsible-links` (acordeón de enlaces), `list-group`, `jumbotron`, `section` (+ `section-header`, `section-body`, `section-action`, `section-jumbotron`), `profile` (+ `profile-header`, `profile-body`, `profile-charge`), `search` (+ `search-content`, `search-action`, `search-not-found`), `social` / `social-icon`, `footer` (institucional; ver trampas en SKILL.md), `line` (línea azul/roja).
Colapsables/dropdown/tabs/modal por HTML necesitan `import 'gob-cl-tailwind/js'` y atributos `data-toggle` / `data-target`.

## Formularios (Bootstrap 4 + gob.cl)

`form-group` → `<label>` + `form-control` (también `form-control-sm|lg`, `custom-select`), `form-text`, validación `is-invalid` + `invalid-feedback` / `is-valid` + `valid-feedback`, `custom-control custom-checkbox|custom-radio|custom-switch`, `input-group` (+ `input-group-prepend|append`), `form-row`, `form-inline`. En React usa los campos de la librería, que ya implementan todo esto con accesibilidad.

## Grilla y utilidades

Grilla `container` (540/720/960/1140; ≠ Tailwind) · `container-fluid` · `row` · `col`, `col-{ss|sm|md|lg|xl}-{1..12}`. Con `compat.css`: utilidades Bootstrap 4 (`m-*`, `p-*`, `d-*`, `d-md-none`, `flex-*`, `justify-content-*`, `align-items-*`, `text-center`, `text-muted`, `w-100`, `sr-only`, `mb-3`…). Con Tailwind puro: `flex`, `gap-4`, `grid`, `max-w-2xl`, `hidden md:block`… Mezclar está permitido; prioriza una familia por componente. **`.visually-hidden` no existe** (es Bootstrap 5): usa `sr-only`.

## Accesibilidad del framework

`html.a11y-contrast` (alto contraste oficial), `html.a11y-font-{0|1|2}` (16/20/24 px). Toolbar oficial: botones con `toolbar-behavior-contrast` / `toolbar-behavior-font-*` (requiere `gob-cl-tailwind/js`). `skip-link` para "Saltar al contenido".

## Bootstrap 6 opcional (`next.css`, alpha)

Familias nuevas sin equivalente en BS4: `dialog`, `drawer`, `menu`, `stepper`, `avatar`, `chip`, `combobox`, `datepicker`, `otp`, `strength`, `check/radio/switch`, `form-field`, `btn-solid`, `theme-*`. Sus clases y JS (`data-bs-toggle`) son de Bootstrap 6 alpha y pueden cambiar. En React prefiere los componentes de la librería.
