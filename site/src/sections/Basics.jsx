import Section from '../components/Section.jsx'
import Example from '../components/Example.jsx'
import CodeBlock from '../components/CodeBlock.jsx'
import icons from '../../../dist/icons.json'
import pkg from '../../../package.json'

const COLORS = [
  ['primary', '#006fb3', 'Azul institucional · acciones y enlaces'], ['secondary', '#fe6565', 'Rojo · acentos y énfasis'],
  ['tertiary', '#0a132d', 'Azul oscuro · footer, títulos'], ['accent', '#a8b7c7', 'Gris azulado · bordes y detalles'],
  ['neutral', '#eeeeee', 'Fondos neutros'], ['success', '#2d717c', 'Éxito'], ['info', '#17a2b8', 'Información'],
  ['warning', '#f2c728', 'Advertencia'], ['danger', '#fe6565', 'Peligro / error'], ['light', '#f8f9fa', 'Claro'], ['dark', '#343a40', 'Oscuro'],
]
const GRAYS = [['gray-a', '#4a4a4a'], ['gray-b', '#8a8a8a'], ['gray-c', '#eeeeee'], ['gray-100', '#f8f9fa'], ['gray-200', '#e9ecef'], ['gray-300', '#dee2e6'], ['gray-400', '#ced4da'], ['gray-500', '#adb5bd'], ['gray-600', '#6c757d'], ['gray-700', '#495057'], ['gray-800', '#343a40'], ['gray-900', '#212529']]

export function Inicio() {
  return (
    <Section id="inicio" title="Comenzando" lead={<>Esta librería mantiene el sistema visual oficial (azul <code>#006fb3</code>, Roboto + Roboto Slab, esquinas rectas, línea azul/roja) y conserva los nombres de clase del framework original (<code>.btn-primary</code>, <code>.card-news</code>, <code>.navbar</code>…), por lo que el HTML existente se migra sin cambios.</>}>
      <div className="row">
        <div className="col-md-4"><div className="card-detail"><div className="card-detail-body"><h4><i className="cl cl-ok text-primary" /> Core verificado</h4><p>El core sale del CSS oficial: 100&nbsp;% de las clases y 99,5&nbsp;% de paridad de estilos con la documentación oficial.</p></div></div></div>
        <div className="col-md-4"><div className="card-detail"><div className="card-detail-body"><h4><i className="cl cl-ok text-primary" /> Tailwind 4 nativo</h4><p>Tokens en <code>@theme</code> y capas CSS: <code>bg-primary</code>, <code>text-tertiary</code>, <code>md:</code>… y {icons.length} íconos.</p></div></div></div>
        <div className="col-md-4"><div className="card-detail"><div className="card-detail-body"><h4><i className="cl cl-ok text-primary" /> Sin jQuery</h4><p>JS vanilla de ~9&nbsp;KB, y capa opcional con los componentes nuevos de Bootstrap&nbsp;6.</p></div></div></div>
      </div>
    </Section>
  )
}

export function Instalacion() {
  const v = pkg.version
  return (
    <Section id="instalacion" title="Instalación" lead="Tres formas de usarlo, según tu proyecto.">
      <h3>1 · Proyecto con Tailwind CSS 4 (recomendado)</h3>
      <CodeBlock code={'npm install tailwindcss @tailwindcss/vite gob-cl-tailwind'} />
      <CodeBlock code={`/* app.css — sin preflight: el reboot de Bootstrap ya viene en el core de gob.cl */
@import "tailwindcss/theme.css" layer(theme);
@import "gob-cl-tailwind/fonts.css";   /* Roboto + Roboto Slab auto-alojadas */
@import "gob-cl-tailwind";             /* tokens + core Bootstrap 4/gob.cl + alto contraste + íconos */
@import "tailwindcss/utilities.css" layer(utilities);

/* Opcionales */
@import "gob-cl-tailwind/compat.css";  /* utilidades Bootstrap 4 (m-*, p-*, d-*, flex…) + modo a11y-fonts */
@import "gob-cl-tailwind/next.css";    /* componentes nuevos de Bootstrap 6 (alpha) */`} />
      <CodeBlock code={`// main.jsx
import "gob-cl-tailwind/js";        // colapsables, dropdown, tabs, modal, toolbar (data-toggle)
import "gob-cl-tailwind/next/js";   // opcional: dialog, drawer, menu, combobox… (data-bs-toggle)`} />
      <p>Los componentes viven en <code>@layer components</code>: una utilidad de Tailwind siempre los sobrescribe (<code>btn btn-primary p-2</code>). Esta documentación es una app React/Vite que consume el paquete exactamente así.</p>

      <h3>2 · CSS precompilado (sin build)</h3>
      <CodeBlock code={`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gob-cl-tailwind@${v}/dist/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gob-cl-tailwind@${v}/dist/gob.min.css">
<script src="https://cdn.jsdelivr.net/npm/gob-cl-tailwind@${v}/dist/gob.min.js" defer></script>`} />
      <p><code>dist/gob.min.css</code> es un reemplazo directo de <code>gob.cl.css</code>: el HTML oficial funciona sin cambios.</p>

      <h3>Breakpoints</h3>
      <div className="table-responsive" style={{ maxWidth: '34rem' }}>
        <table className="table table-sm">
          <thead><tr><th>Tamaño</th><th>Desde</th><th>Prefijo</th></tr></thead>
          <tbody>
            <tr><td>Extra small</td><td>0</td><td>—</td></tr>
            <tr><td>Small</td><td>576px</td><td><code>sm:</code></td></tr>
            <tr><td>Medium</td><td>768px</td><td><code>md:</code></td></tr>
            <tr><td>Large</td><td>992px</td><td><code>lg:</code></td></tr>
            <tr><td>Extra large</td><td>1200px</td><td><code>xl:</code></td></tr>
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export function Colores() {
  return (
    <Section id="colores" title="Colores" lead={<>Paleta oficial expuesta como tokens de Tailwind: <code>bg-primary</code>, <code>text-secondary</code>, <code>border-accent</code>, <code>from-primary</code>…</>}>
      <div className="swatches">
        {COLORS.map(([n, hex, d]) => (
          <div className="swatch" key={n}>
            <div className="swatch-chip" style={{ background: `var(--color-${n})` }} />
            <div className="swatch-meta"><strong>{n}</strong><code>{hex}</code><small>{d}</small></div>
          </div>
        ))}
      </div>
      <h3>Grises</h3>
      <div className="swatches">
        {GRAYS.map(([n, h]) => (
          <div className="swatch swatch-sm" key={n}>
            <div className="swatch-chip" style={{ background: `var(--color-${n})` }} />
            <div className="swatch-meta"><strong>{n}</strong><code>{h}</code></div>
          </div>
        ))}
      </div>
      <h3>Línea institucional</h3>
      <Example html={`<div class="line">Título con línea institucional</div><br><br><div class="line line-primary">Línea sólida (primary)</div>`} />
    </Section>
  )
}

export function Tipografia() {
  return (
    <Section id="tipografia" title="Tipografía" lead="Roboto para texto y Roboto Slab para títulos (h1–h3, h5, h6). Los tamaños cambian a partir de 768px.">
      <Example html={`
        <div class="type-row"><code>h1</code><h1 class="mb-0">Gobierno de Chile</h1></div>
        <div class="type-row"><code>h2</code><h2 class="mb-0">Gobierno de Chile</h2></div>
        <div class="type-row"><code>h3</code><h3 class="mb-0">Gobierno de Chile</h3></div>
        <div class="type-row"><code>h4</code><h4 class="mb-0">Gobierno de Chile (Roboto Light)</h4></div>
        <div class="type-row"><code>h5</code><h5 class="mb-0">Gobierno de Chile</h5></div>
        <div class="type-row"><code>h6</code><h6 class="mb-0">Gobierno de Chile</h6></div>
        <div class="type-row"><code>p</code><p class="mb-0">La alternativa para digitalizar los trámites de la ciudadanía. <a href="#">Enlace de ejemplo</a></p></div>
        <div class="type-row"><code>small</code><small>Texto pequeño 13 de julio de 2026</small></div>
        <div class="type-row"><code>q</code><q>Cita corta en cursiva</q></div>
      `} />
      <p>Clases utilitarias: <code>.font-level-1</code> … <code>.font-level-8</code>, <code>.font-accent</code> (slab), <code>.font-primary</code> (sans), <code>.text-lines-{'{nivel}'}-{'{n}'}</code> (limita a n líneas).</p>
    </Section>
  )
}
