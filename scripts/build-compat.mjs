// Genera src/compat.css: capa opcional de compatibilidad con las utilidades Bootstrap 4 usadas por el HTML original de gob.cl
// (grid, display, flex helpers, text-lines, etc.). NO incluye espaciado/tamaños: usar utilidades Tailwind.
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BP = { '': 0, sm: 576, md: 768, lg: 992, xl: 1200 }
const out = ['/* AUTO-GENERADO por scripts/build-compat.mjs — compatibilidad Bootstrap 4 (opcional) */', '@layer components {']

const pct = (n) => `${+((n / 12) * 100).toFixed(6)}%`

for (const [bp, min] of Object.entries(BP)) {
  const infix = bp ? `-${bp}` : ''
  const rules = []
  rules.push(`.col${infix} { flex-basis: 0; flex-grow: 1; max-width: 100%; }`)
  rules.push(`.col${infix}-auto { flex: 0 0 auto; width: auto; max-width: 100%; }`)
  for (let i = 1; i <= 12; i++) rules.push(`.col${infix}-${i} { flex: 0 0 ${pct(i)}; max-width: ${pct(i)}; }`)
  for (let i = 0; i <= 11; i++) rules.push(`.offset${infix}-${i} { margin-left: ${i ? pct(i) : 0}; }`)
  for (let i = 0; i <= 12; i++) rules.push(`.order${infix}-${i} { order: ${i}; }`)
  rules.push(`.order${infix}-first { order: -1; } .order${infix}-last { order: 13; }`)
  for (const d of ['none', 'inline', 'inline-block', 'block', 'flex', 'inline-flex', 'table', 'table-cell', 'table-row'])
    rules.push(`.d${infix}-${d} { display: ${d} !important; }`)
  rules.push(`.flex${infix}-row { flex-direction: row !important; } .flex${infix}-column { flex-direction: column !important; }`)
  rules.push(`.flex${infix}-row-reverse { flex-direction: row-reverse !important; } .flex${infix}-column-reverse { flex-direction: column-reverse !important; }`)
  rules.push(`.flex${infix}-wrap { flex-wrap: wrap !important; } .flex${infix}-nowrap { flex-wrap: nowrap !important; }`)
  rules.push(`.flex${infix}-fill { flex: 1 1 auto !important; } .flex${infix}-grow-0 { flex-grow: 0 !important; } .flex${infix}-grow-1 { flex-grow: 1 !important; } .flex${infix}-shrink-0 { flex-shrink: 0 !important; } .flex${infix}-shrink-1 { flex-shrink: 1 !important; }`)
  const jc = { start: 'flex-start', end: 'flex-end', center: 'center', between: 'space-between', around: 'space-around' }
  for (const [k, v] of Object.entries(jc)) rules.push(`.justify-content${infix}-${k} { justify-content: ${v} !important; }`)
  const ai = { start: 'flex-start', end: 'flex-end', center: 'center', baseline: 'baseline', stretch: 'stretch' }
  for (const [k, v] of Object.entries(ai)) {
    rules.push(`.align-items${infix}-${k} { align-items: ${v} !important; }`)
    rules.push(`.align-self${infix}-${k} { align-self: ${v} !important; }`)
  }
  for (const a of ['left', 'right', 'center', 'justify']) rules.push(`.text${infix}-${a} { text-align: ${a} !important; }`)
  rules.push(`.float${infix}-left { float: left !important; } .float${infix}-right { float: right !important; } .float${infix}-none { float: none !important; }`)

  const body = rules.join('\n  ')
  out.push(min ? `  @media (min-width: ${min}px) {\n  ${body}\n  }` : `  ${body}`)
}

out.push(`
  .row { display: flex; flex-wrap: wrap; margin-inline: -0.9375rem; }
  .no-gutters { margin-inline: 0; }
  .no-gutters > .col, .no-gutters > [class*="col-"] { padding-inline: 0; }
  .col, [class*="col-"] { position: relative; width: 100%; padding-inline: 0.9375rem; min-height: 1px; }
  .col-auto { width: auto; }

  .font-weight-light { font-weight: 300 !important; } .font-weight-normal { font-weight: 400 !important; }
  .font-weight-bold { font-weight: 700 !important; } .font-weight-bolder { font-weight: 900 !important; }
  .font-italic { font-style: italic !important; }
  .text-uppercase { text-transform: uppercase !important; } .text-lowercase { text-transform: lowercase !important; } .text-capitalize { text-transform: capitalize !important; }
  .text-nowrap { white-space: nowrap !important; }
  .text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .text-muted { color: var(--color-gray-600) !important; }
  .text-white-50 { color: rgb(255 255 255 / 0.5) !important; }
  .text-break { word-break: break-word !important; overflow-wrap: break-word !important; }
  .position-static { position: static !important; } .position-relative { position: relative !important; }
  .position-absolute { position: absolute !important; } .position-fixed { position: fixed !important; } .position-sticky { position: sticky !important; }
  .overflow-hidden { overflow: hidden !important; } .overflow-auto { overflow: auto !important; }
  .rounded-0 { border-radius: 0 !important; } .rounded-circle { border-radius: 50% !important; } .rounded-pill { border-radius: 50rem !important; }
  .border-0 { border: 0 !important; }
`)

// text-lines-{nivel}-{n}: limita a N líneas según la altura de línea del nivel tipográfico
const LH = { 1: ['2.88rem', '3.6rem'], 2: ['1.625rem', '1.625rem'], 3: ['1.625rem', '1.625rem'], 4: ['1.4625rem', '1.625rem'], 5: ['1.1875rem', '1.625rem'], 6: ['1.5rem', '1.5rem'], 7: ['1.35rem', '1.375rem'], 8: ['1.5rem', '1.5rem'] }
const FS = { 1: ['1.5rem', '2.4rem'], 2: ['1.25rem', '1.6875rem'], 3: ['1.23125rem', '1.4375rem'], 4: ['1.0625rem', '1.25rem'], 5: ['1.0625rem', '1.25rem'], 6: ['1rem', '1.125rem'], 7: ['0.9rem', '1rem'], 8: ['0.6875rem', '0.6875rem'] }
for (const lvl of Object.keys(LH)) {
  for (let n = 1; n <= 10; n++) {
    out.push(`  .text-lines-${lvl}-${n} { height: calc(${LH[lvl][0]} * ${n}) !important; overflow: hidden; font-size: ${FS[lvl][0]} !important; line-height: ${LH[lvl][0]} !important; }`)
  }
  out.push(`  @media (min-width: 768px) {`)
  for (let n = 1; n <= 10; n++) {
    out.push(`    .text-lines-${lvl}-${n} { height: calc(${LH[lvl][1]} * ${n}) !important; font-size: ${FS[lvl][1]} !important; line-height: ${LH[lvl][1]} !important; }`)
  }
  out.push('  }')
}
out.push('}')
writeFileSync(join(root, 'src/compat.css'), out.join('\n') + '\n')
console.log('✔ src/compat.css')
