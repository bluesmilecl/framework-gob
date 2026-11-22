# gob-cl-tailwind

Framework CSS del **Gobierno de Chile** ([framework.digital.gob.cl](https://framework.digital.gob.cl/)) reconstruido sobre **Tailwind CSS 4**.
Mantiene la identidad oficial (azul `#006fb3`, Roboto + Roboto Slab, esquinas rectas, línea azul/roja, breakpoints 576/768/992/1200) y **los mismos nombres de clase** del framework original, pero sin Bootstrap 4, jQuery ni Popper, y con **369 íconos** (53 oficiales + 316 extra).

> Proyecto comunitario no oficial. El diseño, marca y logotipos pertenecen al Gobierno de Chile / División de Gobierno Digital.

## Instalación

```bash
npm install gob-cl-tailwind tailwindcss @tailwindcss/vite   # o @tailwindcss/postcss / cli
```

```css
/* app.css */
@import "tailwindcss";
@import "gob-cl-tailwind/fonts.css";   /* Roboto + Roboto Slab auto-alojadas */
@import "gob-cl-tailwind";             /* tokens + componentes + íconos */
@import "gob-cl-tailwind/compat.css";  /* opcional: .row/.col-*, .d-*, .text-lines-* de Bootstrap 4 */
```

```js
import "gob-cl-tailwind/js"; // colapsables, dropdown, tabs, modal, toolbar de accesibilidad
```

### Sin build (CSS precompilado)

```html
<link rel="stylesheet" href="node_modules/gob-cl-tailwind/dist/fonts.css">
<link rel="stylesheet" href="node_modules/gob-cl-tailwind/dist/gob.min.css">
<script src="node_modules/gob-cl-tailwind/dist/gob.min.js" defer></script>
```

## Qué incluye

| Área | Detalle |
|---|---|
| Tokens (`@theme`) | `bg-primary`, `text-tertiary`, `border-accent`, `font-slab`, `md:`… paleta y breakpoints oficiales |
| Componentes | botones (sólido/contorno/píldora), tags, alertas, banners, 10 variantes de cards, navbar, dropdown, tabs, breadcrumb, paginación, colapsables, buscador, toolbar a11y, formularios completos, footer, contingencia/onboarding/redirecting, perfiles, noticia, tablas, list-group, modal, progress |
| Íconos | `<i class="cl cl-search">` — máscaras CSS con `currentColor`, tamaño por `font-size` (`cl-2x`…`cl-10x`) |
| Accesibilidad | alto contraste (`html.a11y-contrast`), tamaños 16/20/24 px, foco visible, `skip-link`, `prefers-reduced-motion` |
| JS | ~9 KB min, vanilla; acepta `data-toggle`/`data-dismiss` de Bootstrap y `data-gob-*` |

Documentación y galería: `docs/index.html` (tras `npm run build`).

## Íconos

El listado completo está en `dist/icons.json`. Si un ícono extra coincide con uno oficial se publica con sufijo `-alt` (p. ej. `cl-search-alt`).
Para agregar los tuyos: copia SVG a `icons/gob/` (se usan tal cual) y ejecuta `npm run build:icons`.

## Personalizar

```css
@import "tailwindcss";
@import "gob-cl-tailwind";
@theme { --color-accent: #8fa3b8; }
```

## Migración desde `@gobdigital-cl/gob.cl`

- Clases de componente: **sin cambios**.
- Utilidades de espaciado/tamaño de Bootstrap cambian de escala: `mb-3` (1rem) → `mb-4`; `w-100` → `w-full`.
- `compat.css` aporta grid `.row/.col-*`, `.d-*`, `justify-content-*`, `font-weight-*`, `text-uppercase`, `text-lines-*`.
- `.collapse` conserva su significado Bootstrap (se neutraliza la utilidad `collapse` de Tailwind); usa `invisible`.
- Variables SCSS → variables CSS (`var(--color-primary)`).

## Desarrollo

```bash
npm install
npm run build   # íconos → fuentes → JS → docs → CSS (dist/)
```

## Licencia

MIT. Ver `LICENSE` para créditos de terceros (Gobierno de Chile, Magnet SpA, Lucide, Simple Icons, Roboto).
