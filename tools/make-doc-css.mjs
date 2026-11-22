// Aísla las reglas propias del sitio de documentación oficial (site/css/doc.css = gob.cl.css + estilos del sitio)
// restando textualmente las reglas que ya existen en gob.cl.css, y las anexa a dist/gob.css.
// Uso: node tools/make-doc-css.mjs <site-oficial> <site-copia>
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import postcss from 'postcss'

const [, , refDir, mineDir] = process.argv
const parse = (f) => postcss.parse(readFileSync(join(refDir, 'css', f), 'utf8'), { from: f })
const base = new Set()
const key = (r, media) => `${media || ''}|${r.toString()}`
parse('gob.cl.css').each((n) => {
  if (n.type === 'atrule' && n.name === 'media') n.each((c) => base.add(key(c, n.params)))
  else base.add(key(n, ''))
})
const out = []
parse('doc.css').each((n) => {
  if (n.type === 'atrule' && n.name === 'media') {
    const keep = []
    n.each((c) => !base.has(key(c, n.params)) && keep.push(c.toString()))
    if (keep.length) out.push(`@media ${n.params}{${keep.join('')}}`)
  } else if (n.type === 'rule' && !base.has(key(n, ''))) out.push(n.toString())
  else if (n.type === 'atrule' && n.name !== 'charset' && !base.has(key(n, ''))) out.push(n.toString())
})
const mine = readFileSync(join(process.cwd(), 'dist/gob.css'), 'utf8')
writeFileSync(join(mineDir, 'css/doc.css'), `${mine}\n/* reglas del sitio de documentación */\n@layer components{${out.join('\n')}}\n`)
writeFileSync(join(mineDir, 'css/gob.cl.css'), mine)
console.log('reglas propias del sitio:', out.length)
