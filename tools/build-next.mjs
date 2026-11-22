// Capa opt-in "next": componentes nuevos de Bootstrap 6 (6.0.0-alpha.1) con la identidad gob.cl.
//  · Extrae SOLO familias de clases nuevas (sin equivalente en Bootstrap 4/gob.cl): no pisa el core verificado.
//  · Reteñe los tokens de BS6 (--bs-*) con la paleta oficial y esquinas rectas.
//  · Ajusta breakpoints de BS6 (1024/1280/1536) a los de gob.cl (992/1200/1400).
// Uso: node tools/build-next.mjs
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'
import { root } from './split-original.mjs'

const dist = join(root, 'node_modules/bootstrap-next/dist')
const ast = postcss.parse(readFileSync(join(dist, 'css/bootstrap.css'), 'utf8'))

const FAMILIES = ['avatar', 'chip', 'combobox', 'dialog', 'drawer', 'menu', 'submenu', 'nav-overflow', 'stepper', 'otp', 'strength',
  'check', 'switch', 'radio', 'placeholder', 'status', 'form-field', 'form-adorn', 'form-ghost', 'hover-lift', 'icon-link',
  'focus-ring', 'prose', 'theme', 'datepicker', 'btn-solid', 'btn-subtle', 'btn-outline', 'btn-close']
const famRe = new RegExp(`\\.(?:${FAMILIES.join('|')})(?![\\w])|\\.(?:${FAMILIES.join('|')})-[\\w-]+|\\[data-vc`)
const blockRe = /\.(?:btn(?![\w-])|navbar|nav|card|accordion|alert|badge|modal|toast|carousel|popover|tooltip|progress|spinner|list-group|breadcrumb|pagination|table|form-select|form-check|form-label|form-range|form-floating|form-switch|banner|collapse|dropdown)(?![\w])/

// Matiz de BS6 -> color de gob.cl (la rampa 025–975 se recalcula desde ese color base)
const HUE = { blue: 'primary', red: 'secondary', green: 'success', yellow: 'warning', cyan: 'info', indigo: 'accent', violet: 'accent', purple: 'purple', pink: 'pink', orange: 'orange', teal: 'teal' }

// Divide una lista de selectores por comas de nivel superior (respeta paréntesis y corchetes anidados)
const splitSelectors = (sel) => {
  const out = []; let depth = 0, cur = ''
  for (const ch of sel) {
    if ('([' .includes(ch)) depth++
    if (')]'.includes(ch)) depth--
    if (ch === ',' && depth === 0) { out.push(cur.trim()); cur = '' } else cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}
const keptRules = [] // { wrappers:[...], rule }
const walk = (n, wrappers) => {
  if (n.type === 'atrule' && n.name === 'layer' && n.nodes) return n.each((c) => walk(c, wrappers))
  if (n.type === 'atrule' && ['media', 'supports', 'container'].includes(n.name)) {
    const p = n.params.replace(/\b1024px/g, '992px').replace(/\b1280px/g, '1200px').replace(/\b1536px/g, '1400px')
    return n.each((c) => walk(c, [...wrappers, `@${n.name} ${p}`]))
  }
  if (n.type !== 'rule') return
  if (n.selector.startsWith(':root') || n.selector.startsWith(':host') || /data-bs-theme/.test(n.selector)) return
  const parts = splitSelectors(n.selector).filter((s) => famRe.test(s) && !blockRe.test(s))
  if (!parts.length) return
  const r = n.clone(); r.selector = parts.join(',\n')
  keptRules.push({ wrappers, rule: r })
}
ast.each((n) => walk(n, []))

// at-rules globales usados (keyframes, property)
const bodyText = keptRules.map((k) => k.rule.toString()).join('\n')
const globals = []
ast.walkAtRules((a) => {
  if (a.name === 'keyframes' && new RegExp(`[\\s:]${a.params}\\b`).test(bodyText)) globals.push(a.clone())
  if (a.name === 'property') globals.push(a.clone())
})

// Tokens (:root) necesarios, con cierre transitivo de var()
const defs = new Map()
ast.walkRules((r) => {
  if (!/^(:root|:host)/.test(r.selector) || /data-bs-theme/.test(r.selector)) return
  r.each((d) => { if (d.type === 'decl' && d.prop.startsWith('--')) defs.set(d.prop, d.value) })
})
// Rampas de matiz re-basadas en la paleta gob
for (const [prop, val] of defs) {
  const m = prop.match(/^--bs-([a-z]+)-(\d{3})$/)
  if (m && HUE[m[1]] && /oklch\([^)]*\)/.test(val)) defs.set(prop, val.replace(/oklch\([^)]*\)/g, `var(--color-${HUE[m[1]]})`))
}
const need = new Set()
const collect = (txt) => { for (const m of txt.matchAll(/var\((--[\w-]+)/g)) if (!need.has(m[1])) { need.add(m[1]); if (defs.has(m[1])) collect(defs.get(m[1])) } }
collect(bodyText + globals.map(String).join('\n'))
// Los tokens que redefine src/next/theme.css se emiten igual; los no definidos por BS6 (p. ej. --bs-sc) quedan con su fallback
const tokenLines = [...defs].filter(([k]) => need.has(k)).map(([k, v]) => `  ${k}: ${v};`)

// Armado
const clearRaws = (n) => { n.raws = {}; n.nodes?.forEach(clearRaws) }
const wrap = postcss.atRule({ name: 'layer', params: 'components' })
let lastKey = null, cur = null
for (const { wrappers, rule } of keptRules) {
  const key = wrappers.join(' >> ')
  if (!wrappers.length) { wrap.append(rule); lastKey = null; continue }
  if (key !== lastKey) {
    let outer = null, inner = null
    for (const w of wrappers) { const m = w.match(/^@(\w+)\s+(.*)$/); const a = postcss.atRule({ name: m[1], params: m[2] }); if (inner) inner.append(a); else outer = a; inner = a }
    wrap.append(outer); cur = inner; lastKey = key
  }
  cur.append(rule)
}
clearRaws(wrap)
const header = `/* Bootstrap 6 (6.0.0-alpha.1) · componentes nuevos — AUTO-GENERADO por tools/build-next.mjs (no editar).\n   Solo familias sin equivalente en Bootstrap 4/gob.cl. Tokens y radios se reteñen en src/next/theme.css. */\n`
const css = `${header}:root {\n${tokenLines.join('\n')}\n}\n${globals.map((g) => { clearRaws(g); return g.toString() }).join('\n')}\n${wrap.toString()}\n`
mkdirSync(join(root, 'src/next'), { recursive: true })
writeFileSync(join(root, 'src/next/components.css'), css)
mkdirSync(join(root, 'dist/next'), { recursive: true })
copyFileSync(join(dist, 'js/bootstrap.bundle.min.js'), join(root, 'dist/next/bootstrap6.bundle.min.js'))
console.log(`✔ src/next/components.css · ${(Buffer.byteLength(css) / 1024).toFixed(0)} KB · ${keptRules.length} reglas · ${tokenLines.length} tokens · JS 6.0.0-alpha.1 copiado`)
