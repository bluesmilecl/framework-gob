# gob-cl-tailwind

Framework CSS del **Gobierno de Chile** ([framework.digital.gob.cl](https://framework.digital.gob.cl/)) sobre **Tailwind CSS 4**.
Traspaso íntegro del framework oficial (`@gobdigital-cl/gob.cl` 3.0.10, que dependía de Bootstrap 4 + jQuery + Popper): mismo diseño, mismos nombres de clase, ahora con tokens de Tailwind, capas CSS, JS sin dependencias, **369 íconos** y una capa opcional con los componentes nuevos de **Bootstrap 6**.

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
| `src/icons.generated.css` | 369 íconos como máscaras CSS (`.cl-*`) | `scripts/build-icons.mjs` |
| `src/next/*` | Componentes nuevos de Bootstrap 6 reteñidos | `tools/build-next.mjs` |
| `src/extras.css` | `container`/`collapse` sin choque con Tailwind, skip-link, foco | Propio |

El core **no se reescribió a mano**: `tools/build-core.mjs` parte el CSS oficial por módulo SCSS usando su sourcemap, conserva el orden exacto de la cascada, convierte los colores literales en tokens (`var(--color-primary)`…) y el icon-font en máscaras. Se regenera con `npm run build:core`.

Los componentes están en `@layer components`, por lo que una utilidad de Tailwind siempre los sobrescribe (`btn btn-primary p-2`).

## Íconos

`<i class="cl cl-search"></i>`: máscaras CSS que heredan `currentColor` y se dimensionan con `font-size` (`cl-2x` … `cl-10x`, `text-2xl`). 53 oficiales + 316 extra (Lucide, Simple Icons). Si un nombre extra coincide con uno oficial se publica con sufijo `-alt`. Listado en `dist/icons.json`.

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

## Desarrollo

```bash
npm install
npm run build        # íconos → fuentes → JS → next → docs → CSS (dist/)
npm run build:core   # regenera src/core desde el CSS oficial
NODE_PATH=$(npm root -g) node tools/parity.cjs <site-oficial> <site-copia>   # arnés de paridad
```

## Licencia

MIT. Ver `LICENSE` (Gobierno de Chile, Magnet SpA, The Bootstrap Authors, Lucide, Simple Icons, Roboto).
