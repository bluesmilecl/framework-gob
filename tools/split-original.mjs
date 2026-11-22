// Herramienta de traspaso: parte el CSS compilado oficial (@gobdigital-cl/gob.cl) por módulo SCSS de origen usando su sourcemap.
// Uso: node tools/split-original.mjs [--write]
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import { SourceMapConsumer } from 'source-map'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'node_modules/@gobdigital-cl/gob.cl/dist/css')
const css = readFileSync(join(dist, 'gob.cl.css'), 'utf8')
const map = JSON.parse(readFileSync(join(dist, 'gob.cl.css.map'), 'utf8'))
const consumer = await new SourceMapConsumer(map)
const ast = postcss.parse(css, { from: 'gob.cl.css' })

const clean = (s) => s.replace(/^.*?(?:node_modules\/bootstrap\/scss\/)/, 'bootstrap/').replace(/^.*?\/src\/scss\//, 'gob/').replace(/^(?:\.\.\/)+/, '').replace(/^.*\/node_modules\//, '')
const isHelper = (f) => /(^|\/)(mixins|vendor|abstracts|functions|variables)\b|_rfs|_mixins|_functions|_variables/.test(f)

const srcOf = (node) => {
  const s = node.source.start
  for (const bias of [SourceMapConsumer.GREATEST_LOWER_BOUND, SourceMapConsumer.LEAST_UPPER_BOUND]) {
    const o = consumer.originalPositionFor({ line: s.line, column: s.column - 1, bias })
    if (o.source) return clean(o.source)
  }
  return null
}

const entries = [] // { group, media, node }
let last = 'bootstrap/_root.scss'
const push = (node, media) => {
  let f = srcOf(node)
  if (!f || isHelper(f)) f = last
  else last = f
  entries.push({ group: f, media, node })
}
const WRAPPERS = new Set(['media', 'supports'])
const walk = (n, path) => {
  if (n.type === 'comment') return
  if (n.type === 'atrule' && WRAPPERS.has(n.name)) {
    n.each((c) => walk(c, [...path, `@${n.name} ${n.params}`]))
  } else if (n.type === 'atrule' && n.name === 'charset') {
    /* omitido */
  } else push(n, path.length ? path : null)
}
ast.each((n) => walk(n, []))

const groups = new Map()
for (const e of entries) {
  if (!groups.has(e.group)) groups.set(e.group, [])
  groups.get(e.group).push(e)
}
if (process.argv[1] && process.argv[1].endsWith('split-original.mjs') && !process.argv.includes('--write')) {
  for (const [g, es] of groups) console.log(String(es.length).padStart(5), g)
  console.log('total reglas', entries.length)
}
export { groups, entries, root }
