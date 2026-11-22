// Genera src/icons.generated.css y dist/icons.json
//  - Íconos oficiales gob.cl (icons/gob/*.svg)         -> .cl-<nombre>
//  - Íconos extra (Lucide, ISC + Simple Icons, CC0)    -> .cl-<nombre>  (si choca con un oficial: .cl-<nombre>-alt)
// Todos se renderizan como máscara CSS: toman el color del texto (currentColor).
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const lucideDir = join(root, 'node_modules/lucide-static/icons')
const simpleDir = join(root, 'node_modules/simple-icons/icons')

/** Categorías del set extra (nombre Lucide -> grupo). */
const LUCIDE = {
  'Interfaz': `house menu x check plus minus ellipsis-vertical chevron-up chevron-down chevron-left chevron-right
    chevrons-up chevrons-down chevrons-left chevrons-right arrow-up arrow-down arrow-up-right arrow-down-left arrow-up-down move
    external-link link unlink copy clipboard clipboard-check clipboard-list pencil square-pen trash-2 save undo-2 redo-2
    eye eye-off settings sliders-horizontal list-filter search-x zoom-in zoom-out maximize minimize expand shrink
    refresh-cw rotate-cw loader-circle upload share-2 printer qr-code scan-line grip-vertical layout-grid layout-list
    panel-left table list-checks list-ordered toggle-left toggle-right bell bell-off bookmark star heart thumbs-up thumbs-down
    flag tag tags pin arrow-up-narrow-wide arrow-down-wide-narrow ellipsis`,
  'Estado y alertas': `circle-check circle-x circle-alert triangle-alert info circle-help octagon-alert shield-check shield-alert
    shield-x badge-check badge-alert badge-info badge-help ban siren bell-ring lightbulb`,
  'Usuarios y cuenta': `user users user-round user-check user-plus user-minus user-x user-cog user-search circle-user
    id-card fingerprint lock lock-open key key-round log-in log-out contact hand-helping handshake`,
  'Comunicación': `mail mail-open inbox send message-circle message-square messages-square phone phone-call phone-off
    megaphone newspaper rss at-sign mic mic-off headphones video video-off captions voicemail`,
  'Documentos': `file file-text file-check file-search file-plus file-x file-down file-up file-badge file-pen files
    folder folder-open folder-check archive book book-open book-open-check notebook-pen library scroll-text stamp award
    paperclip`,
  'Lugares y mapas': `map map-pin map-pinned navigation compass globe locate building building-2 landmark school hospital
    church hotel warehouse store factory tent-tree trees mountain waves`,
  'Tiempo': `calendar calendar-days calendar-check calendar-clock calendar-plus calendar-x clock timer hourglass history alarm-clock`,
  'Finanzas y trámites': `credit-card wallet banknote coins receipt receipt-text piggy-bank hand-coins badge-dollar-sign
    calculator briefcase scale gavel vote`,
  'Salud': `stethoscope pill syringe heart-pulse activity ambulance baby thermometer hospital brain bandage cross
    accessibility ear ear-off eye-closed glasses hand`,
  'Educación y trabajo': `graduation-cap school book-marked pencil-ruler backpack briefcase-business hard-hat wrench hammer
    drill construction tractor`,
  'Transporte': `car bus train-front plane bike ship truck navigation-2 route signpost circle-parking fuel`,
  'Medio ambiente y clima': `leaf sprout trees droplets droplet flame zap sun moon cloud cloud-rain cloud-snow cloud-lightning
    wind snowflake thermometer-sun recycle umbrella tornado earth`,
  'Tecnología y datos': `smartphone tablet laptop monitor wifi wifi-off bluetooth server database cloud-upload cloud-download
    code terminal cpu hard-drive qr-code scan chart-pie chart-line trending-up trending-down
    chart-column chart-bar`,
  'Multimedia': `image images camera play pause square circle-play circle-pause skip-back skip-forward volume-2 volume-x
    music film`,
  'IA y chat': `bot sparkles wand-sparkles brain message-square-plus message-square-text message-square-heart keyboard circle-stop
    corner-down-left paperclip file-code file-spreadsheet file-image file-archive audio-lines languages quote panel-left-close
    panel-left-open square-pen text-cursor-input arrow-big-up thumbs-up thumbs-down flag-triangle-right pin-off history
    messages-square list-restart rotate-ccw clipboard-copy share download-cloud`,
  'Redes sociales (línea)': `linkedin`,
}

/** Redes sociales de marca (Simple Icons, CC0). */
const SIMPLE = ['x', 'whatsapp', 'tiktok', 'telegram', 'threads', 'flickr', 'github', 'spotify', 'mastodon']

const GOB_GROUPS = {
  'Oficiales gob.cl': null, // todos los de icons/gob
}

const encode = (svg) =>
  svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/g, '')
    .replace(/<title>[\s\S]*?<\/title>/g, '')
    .replace(/\sclass="[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .replace(/currentColor/g, '#000')
    .replace(/"/g, "'")
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')
    .trim()

const icons = [] // { name, group, source, svg }
const taken = new Set()

// 1) Oficiales
for (const f of readdirSync(join(root, 'icons/gob')).sort()) {
  if (!f.endsWith('.svg')) continue
  const name = f.replace(/\.svg$/, '')
  const svg = readFileSync(join(root, 'icons/gob', f), 'utf8')
  icons.push({ name, group: 'Oficiales gob.cl', source: 'gob.cl', svg })
  taken.add(name)
}

// 2) Lucide
const add = (file, base, group, source) => {
  let name = base
  if (taken.has(name)) name = `${base}-alt`
  if (taken.has(name)) return
  taken.add(name)
  icons.push({ name, group, source, svg: readFileSync(file, 'utf8') })
}
const missing = []
for (const [group, list] of Object.entries(LUCIDE)) {
  for (const n of list.split(/\s+/).filter(Boolean)) {
    const file = join(lucideDir, `${n}.svg`)
    if (!existsSync(file)) { missing.push(n); continue }
    if (icons.some((i) => i.source === 'lucide' && i.file === n)) continue
    add(file, n, group, 'lucide')
  }
}

// 3) Simple Icons (redes)
for (const n of SIMPLE) {
  const file = join(simpleDir, `${n}.svg`)
  if (!existsSync(file)) { missing.push(`simple:${n}`); continue }
  add(file, n === 'x' ? 'x-twitter' : n, 'Redes sociales (marca)', 'simple-icons')
}

// Ordenar: oficiales primero, luego por grupo/nombre
const css = []
css.push(`/* AUTO-GENERADO por scripts/build-icons.mjs — no editar a mano */
@layer components {
  .cl {
    display: inline-block;
    flex: none;
    width: 1em;
    height: 1em;
    font-style: normal;
    line-height: 1;
    vertical-align: -0.125em;
    background-color: currentColor;
    -webkit-mask: var(--cl-icon) no-repeat center / contain;
    mask: var(--cl-icon) no-repeat center / contain;
  }
`)
// Variables internas usadas por los componentes (flechas, separadores, etc.)
const INTERNAL = ['burger', 'arrow', 'breadcrumb', 'm-arrow-down', 'm-arrow-up', 'm-arrow-left', 'm-arrow-right', 'close', 'ok', 'search']
css.push('  :root {')
for (const n of INTERNAL) {
  const i = icons.find((x) => x.name === n)
  if (i) css.push(`    --cl-icon-${n}: url("data:image/svg+xml,${encode(i.svg)}");`)
}
css.push('  }')
for (const i of icons) {
  css.push(`  .cl-${i.name} { --cl-icon: url("data:image/svg+xml,${encode(i.svg)}"); }`)
}
css.push('}\n')
writeFileSync(join(root, 'src/icons.generated.css'), css.join('\n'))

mkdirSync(join(root, 'dist'), { recursive: true })
writeFileSync(
  join(root, 'dist/icons.json'),
  JSON.stringify(icons.map(({ name, group, source }) => ({ name, class: `cl-${name}`, group, source })), null, 2),
)

const bytes = Buffer.byteLength(css.join('\n'))
console.log(`✔ ${icons.length} íconos (${icons.filter((i) => i.source === 'gob.cl').length} oficiales) · ${(bytes / 1024).toFixed(0)} KB`)
if (missing.length) console.warn(`⚠ No encontrados (omitidos): ${missing.join(', ')}`)
