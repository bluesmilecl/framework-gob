// Traspaso del core: genera src/core/*.css a partir del CSS oficial compilado (Bootstrap 4 + gob.cl) usando su sourcemap.
//  · Conserva el orden exacto de la cascada del original.
//  · Colores literales -> tokens de Tailwind (var(--color-*)), para que el modo alto contraste y @theme los controlen.
//  · Íconos de fuente (font-family: gob-cl) -> máscaras CSS.
//  · Descarta solo las reglas del icon-font (se reemplazan por máscaras).
// Uso: node tools/build-core.mjs
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'
import { entries, root } from './split-original.mjs'

// ───────── Paleta -> tokens ─────────
const PALETTE = {
  '#006fb3': 'primary', '#fe6565': 'secondary', '#0a132d': 'tertiary', '#a8b7c7': 'accent', '#eeeeee': 'neutral',
  '#2d717c': 'success', '#17a2b8': 'info', '#f2c728': 'warning', '#f8f9fa': 'gray-100', '#343a40': 'gray-800',
  '#111111': 'black', '#ffffff': 'white', '#4a4a4a': 'gray-a', '#8a8a8a': 'gray-b',
  '#e9ecef': 'gray-200', '#dee2e6': 'gray-300', '#ced4da': 'gray-400', '#adb5bd': 'gray-500',
  '#6c757d': 'gray-600', '#495057': 'gray-700', '#212529': 'gray-900',
  '#e0701e': 'orange', '#ffa11b': 'orange-light', '#6610f2': 'indigo', '#6633cc': 'purple', '#e83e8c': 'pink',
  '#20c997': 'teal', '#e3e5ef': 'shadow', '#0f69b4': 'brand-blue', '#e22c2c': 'brand-red', '#f5f6f7': 'surface-muted',
  '#00aced': 'twitter', '#3b5998': 'facebook', '#bc2a8d': 'instagram',
}
const tokenize = (v) =>
  v.replace(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g, (m, h) => {
    const full = ('#' + (h.length === 3 ? h.replace(/./g, '$&$&') : h)).toLowerCase()
    const t = PALETTE[full]
    return t ? `var(--color-${t})` : m
  })

// ───────── Íconos oficiales (código de glifo -> svg) ─────────
// El CSS compilado guarda el glifo como carácter Unicode privado (U+EAxx) o como escape \\eaxx
const glyphCode = (v) => {
  const t = v.replace(/["']/g, '')
  return /^\\[0-9a-f]{4}$/i.test(t) ? t.slice(1).toLowerCase() : t.codePointAt(0).toString(16)
}
const isGlyph = (v) => /^["'](?:[\ue000-\uf8ff]|\\ea[0-9a-f]{2})["']$/i.test(v)
const ICON_BY_CODE = new Map()
for (const e of entries) {
  if (e.group !== 'icons/_gob-cl.scss' || e.node.type !== 'rule') continue
  const m = e.node.selector.match(/^\.cl-([\w-]+)::before$/)
  const c = e.node.nodes.find((d) => d.prop === 'content')
  if (m && c) ICON_BY_CODE.set(glyphCode(c.value), m[1])
}
const svgFor = (name) => readFileSync(join(root, 'icons/gob', `${name}.svg`), 'utf8')
const encodeSvg = (svg) =>
  svg.replace(/<\?xml[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/> </g, '><')
    .replace(/"/g, "'").replace(/%/g, '%25').replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').trim()
const maskDecls = (name) => {
  const url = `url("data:image/svg+xml,${encodeSvg(svgFor(name))}")`
  return [
    ['content', '""'], ['display', 'inline-block'], ['width', '1em'], ['height', '1em'], ['vertical-align', '-0.125em'],
    ['background-color', 'currentColor'], ['-webkit-mask', `${url} no-repeat center / contain`], ['mask', `${url} no-repeat center / contain`],
  ]
}

// ───────── Clasificación ─────────
const stats = { dropped: {}, kept: 0 }
const drop = (why) => { stats.dropped[why] = (stats.dropped[why] || 0) + 1; return null }
const sel = (n) => (n.type === 'rule' ? n.selector : '')

const FILES = {
  base: [], components: [], bsutil: [], fonts: [], contrast: [],
}

const isElementOnly = (selector) => selector.split(',').every((p) => !/[.#\[]/.test(p.replace(/::?[\w-]+(\([^)]*\))?/g, '')))

const classify = (e) => {
  const s = sel(e.node)
  const g = e.group
  if (e.node.type === 'atrule' && e.node.name === 'font-face') return drop('font-face')
  if (g === 'icons/_gob-cl.scss') return drop('icon-font')
  if (/a11y-contrast|a11y-contarst/.test(s) || g.startsWith('themes/a11y-contrast')) return 'contrast'
  if (/a11y-font/.test(s) || g.startsWith('themes/a11y-fonts')) return 'fonts'
  if (g.startsWith('bootstrap/utilities') || g === 'bootstrap/_print.scss') return 'bsutil'
  if (/^bootstrap\/_(root|reboot|images|code|type)\.scss$/.test(g)) return 'base'
  // Bootstrap y gob.cl comparten orden de cascada (el optimizador del original fusionó reglas entre ambos): un solo flujo.
  if (g === 'gob.cl.css') return isElementOnly(s) && e.node.type === 'rule' ? 'base' : 'components'
  return 'components'
}

// ───────── Transformaciones por regla ─────────
const stripPseudoForIcons = (selector) =>
  selector.split(',').map((p) => p.replace(/(\.cl(?:-[\w-]+)?)::before/g, '$1')).join(',')

const transformRule = (rule) => {
  const r = rule.clone()
  const decls = []
  r.walkDecls((d) => decls.push(d))
  const content = decls.find((d) => d.prop === 'content')
  const fontGob = decls.find((d) => d.prop === 'font-family' && /gob-cl/.test(d.value))

  // 1) Glifo del icon-font en pseudo-elemento -> máscara
  if (content && isGlyph(content.value)) {
    const code = glyphCode(content.value)
    const name = ICON_BY_CODE.get(code)
    if (name) {
      const keep = decls.filter((d) => !['content', 'font-family', 'font-style', 'font-weight', 'font-variant', 'line-height', 'speak', 'text-transform', '-webkit-font-smoothing', '-moz-osx-font-smoothing'].includes(d.prop))
      r.removeAll()
      for (const [p, v] of maskDecls(name)) r.append({ prop: p, value: v })
      for (const d of keep) {
        r.append({ prop: d.prop, value: d.value }) // `color` se conserva: la máscara usa currentColor
      }
      return r
    }
  }
  // 2) Reglas tipográficas del icon-font (%cl): ya no aplican
  if (fontGob) {
    const rest = decls.filter((d) => !['font-family', 'font-style', 'font-weight', 'font-variant', 'line-height', 'speak', 'text-transform', '-webkit-font-smoothing', '-moz-osx-font-smoothing'].includes(d.prop))
    if (!rest.length) return null
    r.removeAll(); rest.forEach((d) => r.append(d.clone()))
  }
  // 3) Selectores `.cl::before` / `.cl-x::before` con solo color/tamaño -> el propio elemento
  if (/\.cl(?:-[\w-]+)?::before/.test(r.selector) && !content) {
    r.selector = stripPseudoForIcons(r.selector)
  }
  return r
}

const tokenizeNode = (n) => {
  n.walkDecls((d) => { d.value = tokenize(d.value) })
}

// ───────── Armado de archivos ─────────
let lastGroup = null
const emit = (key, e, node) => {
  const bucket = FILES[key]
  if (key === 'components' && e.group !== 'gob.cl.css' && e.group !== lastGroup) {
    lastGroup = e.group
    bucket.push({ media: null, nodes: [postcss.comment({ text: ` ── ${e.group} ── ` })] })
  }
  const last = bucket[bucket.length - 1]
  const mk = e.media ? e.media.join(' >> ') : null
  if (mk) {
    if (last && last.media === mk) last.nodes.push(node)
    else bucket.push({ media: mk, nodes: [node] })
  } else bucket.push({ media: null, nodes: [node] })
  stats.kept++
}

for (const e of entries) {
  const key = classify(e)
  if (!key) continue
  let node = e.node
  if (node.type === 'rule') {
    node = transformRule(node)
    if (!node) { drop('typo-iconfont'); continue }
  } else node = node.clone()
  if (key !== 'contrast') tokenizeNode(node) // el tema de contraste ya trae valores invertidos literales: no se tokeniza
  emit(key, e, node)
}

const clearRaws = (n) => { n.raws = {}; if (n.nodes) n.nodes.forEach(clearRaws) }
const render = (bucket, layer, banner) => {
  const wrap = postcss.atRule({ name: 'layer', params: layer })
  for (const b of bucket) {
    if (b.media) {
      // Cadena de at-rules anidados (p. ej. @media > @supports)
      const parts = b.media.split(' >> ').map((h) => h.match(/^@(\w+)\s+(.*)$/))
      const outer = postcss.atRule({ name: parts[0][1], params: parts[0][2] })
      let cur = outer
      for (const m of parts.slice(1)) { const a = postcss.atRule({ name: m[1], params: m[2] }); cur.append(a); cur = a }
      b.nodes.forEach((n) => cur.append(n))
      wrap.append(outer)
    } else b.nodes.forEach((n) => wrap.append(n))
  }
  clearRaws(wrap)
  return `/* ${banner}\n   AUTO-GENERADO por tools/build-core.mjs a partir del CSS oficial — no editar a mano. */\n${layer ? wrap.toString() : wrap.nodes.map(String).join('\n')}\n`
}

mkdirSync(join(root, 'src/core'), { recursive: true })
const out = (f, s) => { writeFileSync(join(root, 'src/core', f), s); console.log(f.padEnd(26), (Buffer.byteLength(s) / 1024).toFixed(0).padStart(5), 'KB') }
out('reboot.css', render(FILES.base, 'base', 'Bootstrap 4 reboot + tipografía base (con la personalización de gob.cl)'))
out('components.css', render(FILES.components, 'components', 'Bootstrap 4 + gob.cl: grid, formularios, botones, navbar, cards, secciones, footer, etc. (en el orden de cascada original)'))
out('utilities-bootstrap.css', render(FILES.bsutil, 'utilities', 'Utilidades de Bootstrap 4 (spacing, display, flex, text, etc.)'))
out('a11y-contrast.css', render(FILES.contrast, 'components', 'Tema de alto contraste (html.a11y-contrast) del framework original'))
out('a11y-fonts.css', render(FILES.fonts, 'components', 'Modo de fuentes accesibles (html.a11y-font-1/2): re-flujo de grilla'))
console.log('reglas conservadas', stats.kept, '· descartadas', JSON.stringify(stats.dropped))
