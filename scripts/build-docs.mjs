// Genera docs/index.html: documentación + galería de componentes (usa dist/gob.css)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const icons = JSON.parse(readFileSync(join(root, 'dist/icons.json'), 'utf8'))
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

// Recursos de marca para la documentación
mkdirSync(join(root, 'docs/img'), { recursive: true })
for (const f of readdirSync(join(root, 'brand'))) copyFileSync(join(root, 'brand', f), join(root, 'docs/img', f))

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const dedent = (s) => {
  const lines = s.replace(/^\n/, '').replace(/\s+$/, '').split('\n')
  const min = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length))
  return lines.map((l) => l.slice(min)).join('\n')
}
/** Ejemplo: vista previa + código */
const ex = (html, { cls = '', bg = '' } = {}) => {
  const code = dedent(html)
  return `<div class="ex ${bg}"><div class="ex-preview ${cls}">${code}</div><details class="ex-code"><summary>Ver código</summary><pre><code>${esc(code)}</code></pre></details></div>`
}
const sec = (id, title, intro, body) => `
<section id="${id}" class="doc-section">
  <h2 class="line line-primary doc-h2">${title}</h2>
  ${intro ? `<p class="doc-lead">${intro}</p>` : ''}
  ${body}
</section>`
const code = (txt, lang = '') => `<pre class="code-block"><code>${esc(dedent(txt))}</code></pre>`

/* ───────── Contenido ───────── */
const colors = [
  ['primary', '#006fb3', 'Azul institucional · acciones y enlaces'],
  ['secondary', '#fe6565', 'Rojo · acentos y énfasis'],
  ['tertiary', '#0a132d', 'Azul oscuro · footer, títulos'],
  ['accent', '#a8b7c7', 'Gris azulado · bordes y detalles'],
  ['neutral', '#eeeeee', 'Fondos neutros'],
  ['success', '#2d717c', 'Éxito'],
  ['info', '#17a2b8', 'Información'],
  ['warning', '#f2c728', 'Advertencia'],
  ['danger', '#fe6565', 'Peligro / error'],
  ['light', '#f8f9fa', 'Claro'],
  ['dark', '#343a40', 'Oscuro'],
]
const swatches = colors
  .map(([n, hex, d]) => `<div class="swatch"><div class="swatch-chip bg-${n}"></div><div class="swatch-meta"><strong>${n}</strong><code>${hex}</code><small>${d}</small></div></div>`)
  .join('')
const grays = [['gray-a', '#4a4a4a'], ['gray-b', '#8a8a8a'], ['gray-c', '#eeeeee'], ['gray-100', '#f8f9fa'], ['gray-200', '#e9ecef'], ['gray-300', '#dee2e6'], ['gray-400', '#ced4da'], ['gray-500', '#adb5bd'], ['gray-600', '#6c757d'], ['gray-700', '#495057'], ['gray-800', '#343a40'], ['gray-900', '#212529']]
const graySw = grays.map(([n, h]) => `<div class="swatch swatch-sm"><div class="swatch-chip bg-${n}"></div><div class="swatch-meta"><strong>${n}</strong><code>${h}</code></div></div>`).join('')

const variants = ['primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'accent', 'neutral']

const groups = {}
for (const i of icons) (groups[i.group] ||= []).push(i)
const iconHtml = Object.entries(groups)
  .map(([g, list]) => `
  <div class="icon-group" data-group>
    <h3 class="h5 icon-group-title">${g} <span class="badge badge-neutral">${list.length}</span></h3>
    <div class="icon-grid">${list.map((i) => `<button type="button" class="icon-cell" data-name="${i.name}" title=".${i.class}" data-copy="${i.class}"><i class="cl ${i.class}" aria-hidden="true"></i><span>${i.name}</span></button>`).join('')}</div>
  </div>`)
  .join('')

const navItems = [
  ['inicio', 'Comenzando'], ['instalacion', 'Instalación'], ['colores', 'Colores'], ['tipografia', 'Tipografía'],
  ['iconos', 'Íconos'], ['botones', 'Botones'], ['tags', 'Tags'], ['alertas', 'Alertas y banners'], ['cards', 'Cards'],
  ['navegacion', 'Navegación'], ['colapsables', 'Colapsables'], ['formularios', 'Formularios'], ['busqueda', 'Búsqueda y toolbar'],
  ['componentes', 'Tablas, listas y modal'], ['footer', 'Footer'], ['accesibilidad', 'Accesibilidad'], ['migracion', 'Migrar desde Bootstrap 4'],
]

const img = (w, h, label = '') => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#a8b7c7'/><stop offset='1' stop-color='#006fb3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' fill='white' font-family='Roboto,sans-serif' font-size='${Math.round(h / 6)}' text-anchor='middle' dominant-baseline='middle' opacity='.8'>${label}</text></svg>`)}`

const newsCard = (tag) => `
<div class="col-md-4"><div class="card-news">
  <div class="card-news-image pseudo-background">${tag ? `<span class="badge badge-primary">${tag}</span>` : ''}<img class="pseudo-src" src="${img(360, 125, 'Imagen')}" alt=""></div>
  <div class="card-news-body"><small>13 de julio de 2026</small>
    <a class="text-lines-7-3" href="#">¿Cómo disfrutar estas vacaciones de invierno? Sigue estas recomendaciones para que sean entretenidas y seguras</a></div>
</div></div>`

const page = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Framework Gob.cl · Tailwind 4</title>
  <meta name="description" content="Framework CSS del Gobierno de Chile reconstruido con Tailwind CSS 4: mismo diseño oficial, componentes e íconos.">
  <link rel="icon" href="img/gob-icon.svg">
  <link rel="stylesheet" href="../dist/fonts.css">
  <link rel="stylesheet" href="../dist/gob.css">
  <style>
    .doc-layout { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; padding-block: 1.5rem; }
    .doc-side nav { display: flex; flex-wrap: wrap; gap: .25rem; }
    .doc-side a { border: 1px solid var(--color-neutral); }
    @media (min-width: 992px) { .doc-side nav { display: block; } .doc-side a { border: 0; border-left: 3px solid transparent; } }
    @media (min-width: 992px) { .doc-layout { grid-template-columns: 240px minmax(0, 1fr); } }
    .doc-side { padding-block: .5rem; }
    @media (min-width: 992px) { .doc-side { position: sticky; top: 69px; align-self: start; max-height: calc(100vh - 69px); overflow: auto; padding-block: 1rem; } }
    .doc-side a { display: block; padding: .25rem .75rem; font-size: .9rem; color: var(--color-gray-a); text-decoration: none; border-left: 3px solid transparent; }
    .doc-side a:hover { color: var(--color-primary); }
    .doc-side a.is-active { color: var(--color-primary); border-left-color: var(--color-primary) !important; font-weight: 700; }
    .doc-section { padding-top: 2.5rem; scroll-margin-top: 80px; }
    .doc-h2 { display: block; width: fit-content; min-width: 0 !important; margin-bottom: 2.5rem; padding-right: 3rem; font-size: 1.6875rem; text-align: left; }
    .doc-lead { max-width: 46rem; }
    .doc-section h3 { margin: 2rem 0 .75rem; color: var(--color-tertiary); }
    .ex { margin: 1rem 0 1.5rem; border: 1px solid var(--color-neutral); }
    .ex-preview { padding: 1.5rem; }
    .ex.ex-dark .ex-preview { background: var(--color-tertiary); color: #fff; }
    .ex.ex-muted .ex-preview { background: var(--color-surface-muted); }
    .ex-code { border-top: 1px solid var(--color-neutral); background: var(--color-gray-100); }
    .ex-code summary { padding: .5rem 1rem; font-size: .8rem; color: var(--color-gray-a); cursor: pointer; }
    .ex-code pre, .code-block { margin: 0; padding: 1rem; overflow: auto; font-size: .8rem; line-height: 1.5; color: #e6edf6; background: #0f1b33; }
    .code-block { margin: 1rem 0; }
    .ex-code pre { background: #0f1b33; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    p code, td code, li code { padding: .1em .35em; font-size: .85em; color: var(--color-tertiary); background: var(--color-neutral); }
    .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1rem; }
    .swatch { border: 1px solid var(--color-neutral); }
    .swatch-chip { height: 72px; }
    .swatch-meta { display: flex; flex-direction: column; padding: .6rem .75rem; }
    .swatch-meta code { background: none; padding: 0; color: var(--color-gray-a); }
    .swatch-meta small { line-height: 1.2; color: var(--color-gray-b); }
    .swatch-sm .swatch-chip { height: 40px; }
    .icon-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(104px, 1fr)); gap: .5rem; }
    .icon-cell { display: flex; flex-direction: column; align-items: center; gap: .5rem; padding: 1rem .25rem .6rem; font: inherit; color: var(--color-tertiary); background: #fff; border: 1px solid var(--color-neutral); cursor: pointer; }
    .icon-cell:hover, .icon-cell.copied { color: var(--color-primary); border-color: var(--color-primary); }
    .icon-cell .cl { font-size: 28px; }
    .icon-cell span { max-width: 100%; overflow: hidden; font-size: .68rem; line-height: 1.1; text-overflow: ellipsis; color: var(--color-gray-a); }
    .icon-group-title { margin: 2rem 0 .75rem !important; }
    .type-row { display: grid; gap: .5rem; padding: .75rem 0; border-bottom: 1px solid var(--color-neutral); }
    @media (min-width: 768px) { .type-row { grid-template-columns: 120px 1fr; align-items: baseline; } }
    .type-row > code { color: var(--color-gray-b); }
    .toast-copy { position: fixed; right: 1rem; bottom: 1rem; z-index: 3000; padding: .6rem 1rem; color: #fff; background: var(--color-tertiary); opacity: 0; transform: translateY(8px); transition: .2s; pointer-events: none; }
    .toast-copy.on { opacity: 1; transform: none; }
    .nav-demo .navbar { box-shadow: none; border: 1px solid var(--color-neutral); }
    .mig td, .mig th { font-size: .9rem; }
  </style>
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>

  <nav class="navbar navbar-light navbar-expand-lg sticky-top">
    <div class="container">
      <a class="navbar-brand" href="#inicio"><img src="img/gob-header.svg" alt="Gobierno de Chile"></a>
      <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menú">
        <i class="cl cl-burger" style="font-size:1.5rem"></i>
      </button>
      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item"><a class="nav-link" href="#instalacion">Instalación</a></li>
          <li class="nav-item"><a class="nav-link" href="#iconos">Íconos</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">Componentes</a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#botones">Botones</a>
              <a class="dropdown-item" href="#cards">Cards</a>
              <a class="dropdown-item" href="#formularios">Formularios</a>
            </div>
          </li>
          <li class="nav-item"><a class="nav-link" href="#migracion">Migración</a></li>
          <li class="nav-separator"></li>
          <li class="nav-behavior"><a class="nav-link toolbar-behavior-contrast" href="#" title="Alto contraste" aria-label="Alto contraste"><i class="cl cl-contrast"></i></a></li>
          <li class="nav-behavior"><a class="nav-link toolbar-behavior-decrease" href="#" title="Disminuir texto" aria-label="Disminuir texto"><i class="cl cl-decrease-text"></i></a></li>
          <li class="nav-behavior"><a class="nav-link toolbar-behavior-increase" href="#" title="Aumentar texto" aria-label="Aumentar texto"><i class="cl cl-increase-text"></i></a></li>
        </ul>
      </div>
    </div>
  </nav>

  <section class="section-jumbotron bg-neutral" style="padding-block:3.5rem">
    <div class="container">
      <div class="section-body text-center">
        <h1 class="line">Framework Gob.cl <span class="text-primary">· Tailwind 4</span></h1>
        <p class="font-weight-light" style="max-width:40rem;margin-top:1.5rem">
          El framework oficial del Gobierno de Chile, reconstruido sobre Tailwind CSS 4: mismos lineamientos gráficos, mismos nombres de clase y componentes, con ${icons.length} íconos y sin jQuery.
        </p>
        <div class="flex flex-wrap justify-center gap-3 mt-4">
          <a class="btn btn-primary" href="#instalacion">Instalar</a>
          <a class="btn btn-outline-primary" href="#componentes-lista" onclick="document.getElementById('botones').scrollIntoView();return false">Ver componentes</a>
        </div>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="doc-layout">
      <aside class="doc-side" aria-label="Navegación de la documentación">
        <nav>${navItems.map(([id, t]) => `<a href="#${id}">${t}</a>`).join('')}</nav>
      </aside>

      <main id="contenido" style="min-height:0;padding-bottom:3rem">

${sec('inicio', 'Comenzando', 'Esta librería mantiene el sistema visual oficial (azul <code>#006fb3</code>, Roboto + Roboto Slab, esquinas rectas, línea azul/roja) y conserva los nombres de clase del framework original (<code>.btn-primary</code>, <code>.card-news</code>, <code>.navbar</code>…), por lo que el HTML existente se migra con cambios mínimos.', `
<div class="row">
  <div class="col-md-4"><div class="card-detail"><div class="card-detail-body"><h4><i class="cl cl-ok text-primary"></i> Tailwind 4 nativo</h4><p>Tokens en <code>@theme</code>: <code>bg-primary</code>, <code>text-tertiary</code>, <code>md:</code> con breakpoints oficiales.</p></div></div></div>
  <div class="col-md-4"><div class="card-detail"><div class="card-detail-body"><h4><i class="cl cl-ok text-primary"></i> Más íconos</h4><p>53 oficiales + ${icons.length - 53} extra como máscaras CSS: heredan <code>currentColor</code>.</p></div></div></div>
  <div class="col-md-4"><div class="card-detail"><div class="card-detail-body"><h4><i class="cl cl-ok text-primary"></i> Sin jQuery</h4><p>JS vanilla de ~9&nbsp;KB (min) para colapsables, tabs, dropdown, modal y accesibilidad.</p></div></div></div>
</div>`)}

${sec('instalacion', 'Instalación', 'Tres formas de usarlo, según tu proyecto.', `
<h3>1 · Proyecto con Tailwind CSS 4 (recomendado)</h3>
${code(`npm install tailwindcss @tailwindcss/vite gob-cl-tailwind`)}
${code(`/* app.css */
@import "tailwindcss";
@import "gob-cl-tailwind/fonts.css";   /* Roboto + Roboto Slab auto-alojadas */
@import "gob-cl-tailwind";             /* tokens + componentes + íconos */
@import "gob-cl-tailwind/compat.css";  /* (opcional) grid .row/.col-* y d-* de Bootstrap 4 */`)}
${code(`// main.js
import "gob-cl-tailwind/js";   // activa colapsables, dropdown, tabs, modal, toolbar…`)}
<p>Con esto tienes <code>bg-primary</code>, <code>text-tertiary</code>, <code>border-accent</code>, <code>font-slab</code>, <code>md:flex</code>… más todas las clases de componentes.</p>

<h3>2 · CSS precompilado (sin build)</h3>
${code(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gob-cl-tailwind@${pkg.version}/dist/fonts.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/gob-cl-tailwind@${pkg.version}/dist/gob.min.css">
<script src="https://cdn.jsdelivr.net/npm/gob-cl-tailwind@${pkg.version}/dist/gob.min.js" defer></script>`)}

<h3>3 · Desde el repositorio</h3>
${code(`npm install
npm run build      # genera dist/ (CSS, JS, fuentes, íconos, docs)`)}

<h3>Plantilla inicial</h3>
${code(`<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="dist/fonts.css">
  <link rel="stylesheet" href="dist/gob.min.css">
</head>
<body>
  <header><nav class="navbar navbar-light navbar-expand-lg">…</nav></header>
  <main>…</main>
  <footer>…</footer>
  <script src="dist/gob.min.js"></script>
</body>
</html>`)}
<h3>Breakpoints</h3>
<table class="table table-sm" style="max-width:34rem"><thead><tr><th>Tamaño</th><th>Desde</th><th>Prefijo</th></tr></thead><tbody>
<tr><td>Extra small</td><td>0</td><td>—</td></tr><tr><td>Small</td><td>576px</td><td><code>sm:</code></td></tr><tr><td>Medium</td><td>768px</td><td><code>md:</code></td></tr><tr><td>Large</td><td>992px</td><td><code>lg:</code></td></tr><tr><td>Extra large</td><td>1200px</td><td><code>xl:</code></td></tr></tbody></table>
`)}

${sec('colores', 'Colores', 'Paleta oficial expuesta como tokens de Tailwind: <code>bg-primary</code>, <code>text-secondary</code>, <code>border-accent</code>, <code>from-primary</code>… Todos se redefinen automáticamente en modo alto contraste.', `
<div class="swatches">${swatches}</div>
<h3>Grises</h3>
<div class="swatches">${graySw}</div>
<h3>Línea institucional</h3>
${ex(`<div class="line">Título con línea institucional</div>
<br><br>
<div class="line line-primary">Línea sólida (primary)</div>`)}
`)}

${sec('tipografia', 'Tipografía', 'Roboto para texto y Roboto Slab para títulos (h1–h3, h5, h6). Los tamaños cambian a partir de 768px.', `
${ex(`
<div class="type-row"><code>h1</code><h1 class="mb-0">Gobierno de Chile</h1></div>
<div class="type-row"><code>h2</code><h2 class="mb-0">Gobierno de Chile</h2></div>
<div class="type-row"><code>h3</code><h3 class="mb-0">Gobierno de Chile</h3></div>
<div class="type-row"><code>h4</code><h4 class="mb-0">Gobierno de Chile (Roboto Light)</h4></div>
<div class="type-row"><code>h5</code><h5 class="mb-0">Gobierno de Chile</h5></div>
<div class="type-row"><code>h6</code><h6 class="mb-0">Gobierno de Chile</h6></div>
<div class="type-row"><code>p</code><p class="mb-0">La alternativa para digitalizar los trámites de la ciudadanía. <a href="#">Enlace de ejemplo</a></p></div>
<div class="type-row"><code>small</code><small>Texto pequeño 13 de julio de 2026</small></div>
<div class="type-row"><code>q</code><q>Cita corta en cursiva</q></div>
`)}
<p>Clases utilitarias: <code>.font-level-1</code> … <code>.font-level-8</code>, <code>.font-accent</code> (slab), <code>.font-primary</code> (sans), <code>.text-lines-{nivel}-{n}</code> (limita a n líneas).</p>
`)}

${sec('iconos', `Íconos <span class="badge badge-primary" style="vertical-align:middle;font-size:.5em">${icons.length}</span>`, `Se usan como <code>&lt;i class="cl cl-search"&gt;&lt;/i&gt;</code>. Son máscaras CSS: toman el color del texto (<code>text-primary</code>) y el tamaño de la fuente (<code>text-2xl</code>, <code>.cl-3x</code>). Haz clic en un ícono para copiar su clase.`, `
${ex(`<div class="flex flex-wrap items-center gap-6">
  <i class="cl cl-search"></i>
  <i class="cl cl-login text-primary" style="font-size:2rem"></i>
  <i class="cl cl-accessibility cl-3x text-tertiary"></i>
  <i class="cl cl-ok text-success text-5xl"></i>
  <span class="text-primary">Texto con <i class="cl cl-download"></i> ícono en línea</span>
</div>`)}
<div class="flex flex-wrap items-center gap-3 mb-3">
  <input id="iconFilter" type="search" class="form-control" style="max-width:22rem" placeholder="Buscar ícono… (ej: salud, user, mail)" aria-label="Buscar ícono">
  <small id="iconCount" class="text-gray-b"></small>
</div>
${iconHtml}
<p class="mt-4"><small>Íconos oficiales © Gobierno de Chile (MIT). Extras: <a href="https://lucide.dev">Lucide</a> (ISC) y <a href="https://simpleicons.org">Simple Icons</a> (CC0). Si un nombre extra coincide con uno oficial, se publica con sufijo <code>-alt</code>.</small></p>
`)}

${sec('botones', 'Botones', 'Altura estándar de 60&nbsp;px, esquinas rectas y texto subrayado, como el original.', `
<h3>Sólidos</h3>
${ex(`<div class="flex flex-wrap gap-3">${variants.map((v) => `<a href="#" class="btn btn-${v}">${v[0].toUpperCase() + v.slice(1)}</a>`).join('')}</div>`)}
<h3>Contorno</h3>
${ex(`<div class="flex flex-wrap gap-3">${variants.map((v) => `<a href="#" class="btn btn-outline-${v}">${v[0].toUpperCase() + v.slice(1)}</a>`).join('')}</div>`, { bg: 'ex-muted' })}
<h3>Píldora</h3>
${ex(`<div class="flex flex-wrap gap-3">${variants.slice(0, 7).map((v) => `<a href="#" class="btn btn-pill-${v}">${v[0].toUpperCase() + v.slice(1)}</a>`).join('')}</div>`)}
<h3>Tamaños, bloque e íconos</h3>
${ex(`<div class="flex flex-wrap items-center gap-3">
  <button class="btn btn-primary btn-sm">Pequeño</button>
  <button class="btn btn-primary btn-lg">Grande</button>
  <button class="btn btn-primary"><i class="cl cl-download"></i> Descargar</button>
  <button class="btn btn-outline-primary">Continuar <i class="cl cl-arrow-right"></i></button>
  <button class="btn btn-primary" disabled>Deshabilitado</button>
  <button class="btn btn-link">Botón enlace</button>
</div>
<div class="mt-4"><a href="#" class="btn btn-primary btn-block">Botón de ancho completo</a></div>
<div class="mt-3"><a href="#" class="btn btn-secondary btn-default-size">Tamaño estándar (360px en desktop)</a></div>`)}
`)}

${sec('tags', 'Tags', 'Etiquetas <code>.badge</code> en todos los colores. Variante <code>.badge-pill</code>.', `
${ex(`<div class="flex flex-wrap gap-2">${variants.map((v) => `<span class="badge badge-${v}">${v}</span>`).join('')}</div>
<div class="flex flex-wrap gap-2 mt-3">${variants.slice(0, 5).map((v) => `<span class="badge badge-pill badge-${v}">${v}</span>`).join('')}</div>`)}
`)}

${sec('alertas', 'Alertas y banners', '', `
<h3>Alertas</h3>
${ex(`<div class="alert alert-info" role="alert"><strong>Información:</strong> tu solicitud está en revisión.</div>
<div class="alert alert-success" role="alert"><strong>Listo:</strong> trámite ingresado correctamente.</div>
<div class="alert alert-warning" role="alert"><strong>Atención:</strong> revisa los datos antes de continuar.</div>
<div class="alert alert-danger alert-dismissible" role="alert"><strong>Error:</strong> no pudimos validar tu identidad.
  <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar">&times;</button></div>`)}
<h3>Banners</h3>
${ex(`<div class="row">
  <div class="col-md-6"><a href="#" class="banner mb-3"><div class="line"></div><i class="cl cl-claveunica banner-icon"></i><p class="banner-text mb-0">Ingresa con ClaveÚnica a todos los trámites del Estado</p></a></div>
  <div class="col-md-6"><a href="#" class="banner banner-shadow mb-3"><div class="line"></div><i class="cl cl-document-verified banner-icon"></i><p class="banner-text mb-0">Valida tus certificados de forma digital</p></a></div>
</div>`)}
`)}

${sec('cards', 'Cards', 'Todas las variantes oficiales. Las imágenes usan marcadores de posición.', `
<h3>Featured</h3>
${ex(`<div class="row">${[1, 2, 3].map(() => `
  <div class="col-md-4"><a class="card-featured" href="#">
    <div class="card-featured-image pseudo-background"><span class="badge badge-primary">Tag</span><img class="pseudo-src" src="${img(360, 125, 'Imagen')}" alt=""></div>
    <div class="card-featured-body"><small>Salud</small><p class="mb-0">Conoce el nuevo calendario de vacunación para este año</p></div>
  </a></div>`).join('')}</div>`)}
<h3>News</h3>
${ex(`<div class="row">${newsCard('') + newsCard('Tag') + newsCard('')}</div>`)}
<h3>Informative</h3>
${ex(`<div class="row">${[1, 2, 3].map((i) => `
  <div class="col-md-4"><div class="card-informative">
    <div class="card-informative-image pseudo-background"><img class="pseudo-src" src="${img(360, 200, 'Imagen')}" alt=""></div>
    <div class="card-informative-body"><a href="#">Título informativo ${i}</a><p>Descripción breve del contenido que se muestra en esta tarjeta informativa de dos líneas.</p></div>
  </div></div>`).join('')}</div>`)}
<h3>Data list</h3>
${ex(`<div class="card-data-list">
  <div class="card-data"><div class="card-data-title"><div class="card-data-quantity">1.250</div><h5>Conjuntos de datos</h5></div><p>Información pública disponible para su reutilización.</p></div>
  <div class="card-data"><div class="card-data-title"><div class="card-data-quantity">87</div><h5>Organizaciones</h5></div><p>Instituciones que publican datos abiertos.</p></div>
  <div class="card-data"><div class="card-data-title"><div class="card-data-quantity">24</div><h5>Categorías</h5></div><p>Temáticas para explorar el catálogo.</p></div>
</div>`)}
<h3>Category · Detail · Organization</h3>
${ex(`<div class="row">
  <div class="col-md-4"><div class="card-category"><div class="card-category-image pseudo-background"><img class="pseudo-src" src="${img(360, 110, 'Categoría')}" alt=""></div><div class="card-category-body"><h4 class="mb-0">Salud</h4></div></div></div>
  <div class="col-md-4"><div class="card-detail"><div class="card-detail-image-container"><img src="img/gob-header.svg" alt="Gobierno de Chile"></div><div class="card-detail-body"><h4>Detalle</h4><p>Contenido descriptivo con borde redondeado de .25rem.</p></div></div></div>
  <div class="col-md-4"><div class="card-organization"><div class="card-organization-image-container"><img src="img/gob-icon.svg" alt="" style="height:64px"></div><div class="card-organization-body"><h4 class="mb-1">Ministerio</h4><small>12 conjuntos de datos</small></div></div></div>
</div>`)}
<h3>Links · Function · Featured news</h3>
${ex(`<div class="row">
  <div class="col-md-6"><div class="card-links"><div class="card-links-image"><i class="cl cl-document-verified"></i></div><div class="card-links-body"><h4>Trámites</h4><ul class="list-unstyled"><li><a href="#">Certificado de nacimiento</a></li><li><a href="#">Cédula de identidad</a></li></ul></div></div></div>
  <div class="col-md-6"><div class="card-function"><img class="card-function-image" src="${img(200, 124, 'Foto')}" alt=""><div class="card-function-body"><h4 class="card-function-title">Nombre Apellido</h4><p>Subsecretario de Gobierno Digital</p></div></div></div>
</div>
<div class="card-featured-news mt-4">
  <div class="card-featured-news-image"><img class="img-fluid" src="${img(480, 280, 'Noticia')}" alt=""></div>
  <div class="card-featured-news-body"><small class="d-block">13 de julio de 2026</small><h3><a href="#">Noticia destacada con imagen a la izquierda</a></h3><p>Resumen de la noticia destacada que acompaña a la imagen principal.</p></div>
</div>`)}
`)}

${sec('navegacion', 'Navegación', 'Navbar, tabs, breadcrumb y paginación.', `
<h3>Navbar clara y oscura</h3>
<div class="nav-demo">
${ex(`<nav class="navbar navbar-light navbar-expand-lg">
  <div class="container">
    <a class="navbar-brand" href="#"><img src="img/gob-header.svg" alt="Gobierno de Chile"></a>
    <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navDemo1" aria-expanded="false" aria-label="Menú"><i class="cl cl-burger" style="font-size:1.5rem"></i></button>
    <div class="collapse navbar-collapse" id="navDemo1">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item"><a class="nav-link" href="#">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Servicios</a></li>
        <li class="nav-item"><a class="btn btn-primary" href="#">Iniciar sesión</a></li>
      </ul>
    </div>
  </div>
</nav>`, { cls: 'p-0' })}
${ex(`<nav class="navbar navbar-dark navbar-expand-lg">
  <div class="container">
    <a class="navbar-brand text-white" href="#">Gob.cl</a>
    <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navDemo2" aria-expanded="false" aria-label="Menú"><i class="cl cl-burger" style="font-size:1.5rem"></i></button>
    <div class="collapse navbar-collapse" id="navDemo2">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item"><a class="nav-link" href="#">Inicio</a></li>
        <li class="nav-item"><a class="nav-link" href="#">Servicios</a></li>
      </ul>
    </div>
  </div>
</nav>`, { cls: 'p-0' })}
</div>
<h3>Tabs</h3>
${ex(`<ul class="nav nav-tabs" role="tablist">
  <li class="nav-item"><a class="nav-link active" role="tab" href="#tab1" data-toggle="tab" aria-selected="true">Resumen</a></li>
  <li class="nav-item"><a class="nav-link" role="tab" href="#tab2" data-toggle="tab" aria-selected="false" tabindex="-1">Detalle</a></li>
  <li class="nav-item"><a class="nav-link" role="tab" href="#tab3" data-toggle="tab" aria-selected="false" tabindex="-1">Historial</a></li>
</ul>
<div class="tab-content p-4 border border-t-0 border-accent">
  <div class="tab-pane active" id="tab1" role="tabpanel"><p class="mb-0">Contenido del resumen.</p></div>
  <div class="tab-pane" id="tab2" role="tabpanel"><p class="mb-0">Contenido del detalle.</p></div>
  <div class="tab-pane" id="tab3" role="tabpanel"><p class="mb-0">Contenido del historial.</p></div>
</div>`)}
<h3>Breadcrumb</h3>
${ex(`<nav aria-label="breadcrumb"><ol class="breadcrumb">
  <li class="breadcrumb-item"><a href="#">Inicio</a></li>
  <li class="breadcrumb-item"><a href="#">Servicios</a></li>
  <li class="breadcrumb-item active" aria-current="page">Trámite</li>
</ol></nav>`)}
<h3>Paginación</h3>
${ex(`<div class="pagination-container flex-col">
  <ul class="pagination">
    <li class="page-item"><a class="page-link disabled" href="#" aria-label="Anterior"><i class="cl cl-arrow-left"></i></a></li>
    <li class="page-item active"><a class="page-link" href="#">1</a></li>
    <li class="page-item"><a class="page-link" href="#">2</a></li>
    <li class="page-item"><a class="page-link" href="#">3</a></li>
    <li class="page-item"><a class="page-link" href="#" aria-label="Siguiente"><i class="cl cl-arrow-right"></i></a></li>
  </ul>
  <div class="pagination-jump"><span class="page-text">Ir a la página</span><input class="form-control page-input" type="number" value="1" aria-label="Página"><button class="btn btn-outline-primary btn-sm ml-2">Ir</button></div>
</div>`)}
`)}

${sec('colapsables', 'Colapsables', 'Listas de enlaces colapsables y acordeón, accesibles con <code>aria-expanded</code>.', `
${ex(`<div class="row">
<div class="col-md-6">
<ol class="collapsible-links" id="cl-acc">
  <li class="collapsible-links-item">
    <button class="collapsible-links-heading" type="button" data-toggle="collapse" data-target="#clc1" aria-controls="clc1" aria-expanded="true">1. Preguntas generales</button>
    <div id="clc1" class="collapse show" data-parent="#cl-acc"><ol class="collapsible-links-list">
      <li class="collapsible-links-list-item"><a href="#cl-acc">¿Qué es Datos.gob.cl?</a></li>
      <li class="collapsible-links-list-item"><a href="#cl-acc">¿Cómo publico datos?</a></li></ol></div>
  </li>
  <li class="collapsible-links-item">
    <button class="collapsible-links-heading" type="button" data-toggle="collapse" data-target="#clc2" aria-controls="clc2" aria-expanded="false">2. Preguntas de la institución</button>
    <div id="clc2" class="collapse" data-parent="#cl-acc"><ol class="collapsible-links-list">
      <li class="collapsible-links-list-item"><a href="#cl-acc">¿Quién administra la plataforma?</a></li></ol></div>
  </li>
</ol></div>
<div class="col-md-6">
<div class="accordion-gob" id="acc2">
  <div class="accordion-item"><button class="accordion-button" type="button" data-toggle="collapse" data-target="#a1" aria-expanded="false" aria-controls="a1">¿Cómo ingreso con ClaveÚnica?</button>
    <div id="a1" class="collapse" data-parent="#acc2"><div class="accordion-body"><p class="mb-0">Haz clic en “Iniciar sesión” e ingresa tu RUN y clave.</p></div></div></div>
  <div class="accordion-item"><button class="accordion-button" type="button" data-toggle="collapse" data-target="#a2" aria-expanded="false" aria-controls="a2">¿Dónde veo mis solicitudes?</button>
    <div id="a2" class="collapse" data-parent="#acc2"><div class="accordion-body"><p class="mb-0">En el menú “Mis trámites”.</p></div></div></div>
</div></div></div>`)}
`)}

${sec('formularios', 'Formularios', 'Controles con la misma apariencia oficial: borde recto, foco azul, validación y marcadores personalizados.', `
${ex(`<form class="row" onsubmit="return false">
  <div class="col-md-6 form-group"><label for="f-name">Nombre</label><input id="f-name" class="form-control" placeholder="Ej: María González"></div>
  <div class="col-md-6 form-group"><label for="f-mail">Correo electrónico</label><input id="f-mail" type="email" class="form-control is-invalid" value="correo@"><div class="invalid-feedback">Ingresa un correo válido.</div></div>
  <div class="col-md-6 form-group"><label for="f-sel">Región</label><select id="f-sel" class="form-control"><option>Metropolitana</option><option>Valparaíso</option><option>Biobío</option></select></div>
  <div class="col-md-6 form-group"><label for="f-dis">Deshabilitado</label><input id="f-dis" class="form-control" value="No editable" disabled></div>
  <div class="col-12 form-group"><label for="f-txt">Mensaje</label><textarea id="f-txt" class="form-control" rows="3"></textarea></div>
  <div class="col-md-6 form-group">
    <div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="c1" checked><label class="custom-control-label" for="c1">Acepto los términos y condiciones</label></div>
    <div class="custom-control custom-checkbox"><input type="checkbox" class="custom-control-input" id="c2"><label class="custom-control-label" for="c2">Quiero recibir novedades</label></div>
  </div>
  <div class="col-md-6 form-group">
    <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" name="r" id="r1" checked><label class="custom-control-label" for="r1">Persona natural</label></div>
    <div class="custom-control custom-radio"><input type="radio" class="custom-control-input" name="r" id="r2"><label class="custom-control-label" for="r2">Persona jurídica</label></div>
  </div>
  <div class="col-md-6 form-group"><div class="custom-control custom-switch"><input type="checkbox" class="custom-control-input" id="sw1"><label class="custom-control-label" for="sw1">Notificaciones por correo</label></div></div>
  <div class="col-md-6 form-group"><label for="rng">Rango</label><input type="range" class="custom-range" id="rng"></div>
  <div class="col-12 form-group"><label>Archivo</label><div class="custom-file"><input type="file" class="custom-file-input" id="cf"><label class="custom-file-label" for="cf" data-browse="Seleccionar">Escoge un archivo</label></div></div>
  <div class="col-12"><button class="btn btn-primary" type="submit">Enviar</button></div>
</form>`)}
<h3>Grupo de input</h3>
${ex(`<div class="input-group" style="max-width:26rem"><div class="input-group-prepend"><span class="input-group-text">RUN</span></div><input class="form-control" placeholder="12.345.678-9" aria-label="RUN"><div class="input-group-append"><button class="btn btn-primary" style="min-height:0;padding-block:.375rem">Validar</button></div></div>`)}
`)}

${sec('busqueda', 'Búsqueda y toolbar', '', `
<h3>Buscador</h3>
${ex(`<form class="search"><input class="form-control" type="text" placeholder="Buscar trámites, servicios…" aria-label="Buscar"><div class="search-action"><button class="btn" type="submit" aria-label="Buscar"><i class="cl cl-search"></i></button></div></form>`)}
<h3>Toolbar de accesibilidad</h3>
${ex(`<div class="toolbar">
  <a href="#" class="toolbar-btn toolbar-behavior-contrast" aria-label="Alto contraste"><i class="cl cl-contrast"></i></a>
  <div class="toolbar-btn-group">
    <a href="#" class="toolbar-btn toolbar-behavior-decrease" aria-label="Disminuir texto"><i class="cl cl-decrease-text"></i></a>
    <a href="#" class="toolbar-btn toolbar-behavior-increase" aria-label="Aumentar texto"><i class="cl cl-increase-text"></i></a>
  </div>
  <a href="#" class="toolbar-btn toolbar-toggler" aria-label="Accesibilidad"><i class="cl cl-accessibility toolbar-behavior-on"></i><span class="toolbar-behavior-off">X</span></a>
</div>`)}
<p>Guarda en <code>localStorage</code> el contraste y el tamaño de texto (16 / 20 / 24&nbsp;px).</p>
`)}

${sec('componentes', 'Tablas, listas y modal', '', `
${ex(`<div class="row">
<div class="col-md-7"><table class="table table-striped table-hover"><thead><tr><th>Trámite</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
<tr><td>Certificado de nacimiento</td><td><span class="badge badge-success">Listo</span></td><td>12/07/2026</td></tr>
<tr><td>Cédula de identidad</td><td><span class="badge badge-warning">En proceso</span></td><td>10/07/2026</td></tr>
<tr><td>Licencia de conducir</td><td><span class="badge badge-danger">Rechazado</span></td><td>08/07/2026</td></tr></tbody></table></div>
<div class="col-md-5"><div class="list-group"><a class="list-group-item list-group-item-action active" href="#">Mis trámites</a><a class="list-group-item list-group-item-action" href="#">Mis documentos</a><a class="list-group-item list-group-item-action" href="#">Ayuda</a></div>
<div class="progress mt-4" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100"><div class="progress-bar" style="width:65%">65%</div></div></div>
</div>
<button class="btn btn-outline-primary mt-4" data-toggle="modal" data-target="#demoModal">Abrir modal</button>
<div class="modal" id="demoModal" tabindex="-1" role="dialog" aria-labelledby="demoModalTitle" aria-hidden="true"><div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content">
  <div class="modal-header"><h4 class="modal-title" id="demoModalTitle">Confirmar acción</h4><button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">&times;</button></div>
  <div class="modal-body"><p class="mb-0">¿Deseas continuar con el trámite?</p></div>
  <div class="modal-footer"><button class="btn btn-outline-primary" data-dismiss="modal" style="min-height:0">Cancelar</button><button class="btn btn-primary" data-dismiss="modal" style="min-height:0">Continuar</button></div>
</div></div></div>`)}
`)}

${sec('footer', 'Footer', 'Footer oficial con línea institucional y columnas de enlaces (se colapsa a una franja en móvil).', `
${ex(`<footer class="content-always-on-display" style="margin:-1.5rem;width:auto">
  <div class="container"><div class="line"></div>
    <div class="row">
      <div class="col-md-3"><img class="mb-3" src="img/gob-footer.svg" alt="Gobierno de Chile" style="max-width:170px"><p>La alternativa para digitalizar los trámites de la ciudadanía.</p></div>
      <div class="col-md-3"><div class="text-uppercase mb-3">Secciones</div><a href="#">Conjuntos de datos</a><a href="#">Organizaciones</a><a href="#">Categorías</a></div>
      <div class="col-md-3"><div class="text-uppercase mb-3">Enlaces internos</div><a href="#">Políticas de privacidad</a><a href="#">Términos y condiciones</a><a href="#">Licenciamiento</a></div>
      <div class="col-md-3"><div class="text-uppercase mb-3">Ayuda institucional</div><a href="#">Ingreso de solicitud</a><b class="d-block mt-3">Mesa de ayuda</b><p class="mb-0">Lu - Vi / 9:00 - 18:00</p><a href="tel:6003970000">600 397 0000</a></div>
    </div>
  </div>
</footer>`, { cls: 'p-0 overflow-hidden' })}
<h3>Redes sociales</h3>
${ex(`<div class="row">
  ${[['facebook', 'Facebook', '@GobiernoDeChile'], ['x-twitter', 'X', '@GobiernodeChile'], ['instagram', 'Instagram', '@gobiernodechile'], ['youtube', 'YouTube', 'GobiernoChile']].map(([c, n, u]) => `<div class="col-6 col-lg-3"><a class="social" href="#"><div class="social-icon"><i class="cl cl-${c}"></i></div><div class="social-name">${n}</div><div class="social-url">${u}</div></a></div>`).join('')}
</div>`)}
`)}

${sec('accesibilidad', 'Accesibilidad', 'Cumple con los lineamientos de la guía de accesibilidad del Estado.', `
<ul>
  <li><strong>Alto contraste</strong>: añade la clase <code>a11y-contrast</code> a <code>&lt;html&gt;</code> (o usa el botón de la toolbar). Todos los tokens de color se invierten, igual que en el framework original.</li>
  <li><strong>Tamaño de texto</strong>: <code>a11y-font-1</code> (20px) y <code>a11y-font-2</code> (24px). Todo el sistema usa <code>rem</code>.</li>
  <li><strong>Foco visible</strong> en todos los elementos interactivos (<code>:focus-visible</code>) y enlace “Saltar al contenido” (<code>.skip-link</code>).</li>
  <li><strong>Movimiento reducido</strong>: se respeta <code>prefers-reduced-motion</code>.</li>
  <li>Tabs con navegación por teclado (flechas, Home, End) y ESC cierra dropdown/modal.</li>
</ul>
${ex(`<button class="btn btn-outline-primary toolbar-behavior-contrast">Alternar alto contraste</button>`)}
`)}

${sec('migracion', 'Migrar desde Bootstrap 4', 'El framework original dependía de Bootstrap 4 + jQuery + Popper. Estos son los equivalentes.', `
<div class="table-responsive"><table class="table mig table-bordered"><thead><tr><th>Antes (Bootstrap 4)</th><th>Ahora</th><th>Nota</th></tr></thead><tbody>
<tr><td><code>npm i @gobdigital-cl/gob.cl</code></td><td><code>npm i gob-cl-tailwind tailwindcss</code></td><td>Sin jQuery ni Popper</td></tr>
<tr><td><code>.btn-primary</code>, <code>.card-news</code>, <code>.navbar</code>…</td><td>Igual</td><td>Mismos nombres de clase</td></tr>
<tr><td><code>.row</code>, <code>.col-md-4</code>, <code>.d-flex</code>, <code>.justify-content-*</code></td><td>Igual con <code>compat.css</code> · o <code>grid</code>/<code>flex</code> de Tailwind</td><td>Compatibilidad opcional</td></tr>
<tr><td><code>.mb-3</code>, <code>.p-4</code> (Bootstrap: 1rem, 1.5rem)</td><td><code>.mb-4</code>, <code>.p-6</code> (Tailwind: n × 0.25rem)</td><td>Los números cambian</td></tr>
<tr><td><code>.w-100</code> · <code>.mw-100</code></td><td><code>.w-full</code> · <code>.max-w-full</code></td><td></td></tr>
<tr><td><code>.ml-auto</code>, <code>.mr-2</code></td><td><code>.ml-auto</code> · <code>.mr-2</code> (0.5rem)</td><td>Igual</td></tr>
<tr><td><code>.text-lines-7-3</code></td><td>Igual (o <code>line-clamp-3</code>)</td><td>En <code>compat.css</code></td></tr>
<tr><td><code>&lt;i class="cl cl-search"&gt;</code> (icon-font)</td><td>Igual (máscara CSS)</td><td>Tamaño con <code>font-size</code></td></tr>
<tr><td><code>$(…).collapse()</code>, <code>data-toggle</code></td><td><code>data-toggle</code> · <code>Gob.collapse.toggle(el)</code></td><td>JS vanilla</td></tr>
<tr><td>Variables SCSS (<code>$primary</code>)</td><td>Variables CSS (<code>var(--color-primary)</code>)</td><td>Personalizables con <code>@theme</code></td></tr>
</tbody></table></div>
<h3>Personalizar el tema</h3>
${code(`@import "tailwindcss";
@import "gob-cl-tailwind";

/* Sobrescribe tokens (p. ej. para un sitio institucional con otro acento) */
@theme {
  --color-accent: #8fa3b8;
}`)}
`)}

      </main>
    </div>
  </div>

  <footer class="content-always-on-display" style="min-height:0;padding:30px 0 50px">
    <div class="container"><div class="line"></div>
      <div class="row">
        <div class="col-md-6"><img class="mb-3" src="img/gob-footer.svg" alt="Gobierno de Chile" style="max-width:170px"><p>Reconstrucción comunitaria del framework de <a href="https://framework.digital.gob.cl/" style="display:inline;width:auto;height:auto;padding:0;white-space:normal;color:#fff">framework.digital.gob.cl</a> sobre Tailwind CSS 4. Licencia MIT.</p></div>
        <div class="col-md-6"><div class="text-uppercase mb-3">Créditos</div><p class="mb-0">Diseño y marca © Gobierno de Chile · División de Gobierno Digital. Framework original © Magnet SpA (MIT). Íconos extra: Lucide (ISC), Simple Icons (CC0).</p></div>
      </div>
    </div>
  </footer>
  <div class="toast-copy" id="toast" role="status" aria-live="polite"></div>
  <script src="../dist/gob.js"></script>
  <script>
    // Filtro y copia de íconos
    (function () {
      var input = document.getElementById('iconFilter'), count = document.getElementById('iconCount'), cells = [].slice.call(document.querySelectorAll('.icon-cell')), toast = document.getElementById('toast');
      function filter() {
        var q = input.value.trim().toLowerCase(), n = 0;
        cells.forEach(function (c) { var ok = !q || c.dataset.name.indexOf(q) > -1; c.hidden = !ok; if (ok) n++; });
        document.querySelectorAll('[data-group]').forEach(function (g) { g.hidden = !g.querySelector('.icon-cell:not([hidden])'); });
        count.textContent = n + ' de ' + cells.length + ' íconos';
      }
      input.addEventListener('input', filter); filter();
      document.addEventListener('click', function (e) {
        var b = e.target.closest('[data-copy]'); if (!b) return;
        var txt = '<i class="cl ' + b.dataset.copy + '"></i>';
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).catch(function () {}).then(function () {
          toast.textContent = 'Copiado: ' + txt; toast.classList.add('on'); b.classList.add('copied');
          setTimeout(function () { toast.classList.remove('on'); b.classList.remove('copied'); }, 1400);
        });
      });
      // Resaltar sección activa en el menú lateral
      var links = [].slice.call(document.querySelectorAll('.doc-side a'));
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
          es.forEach(function (en) { if (en.isIntersecting) { links.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id); }); } });
        }, { rootMargin: '-20% 0px -70% 0px' });
        document.querySelectorAll('.doc-section').forEach(function (s) { io.observe(s); });
      }
    })();
  </script>
</body>
</html>
`

writeFileSync(join(root, 'docs/index.html'), page)
console.log('✔ docs/index.html')
