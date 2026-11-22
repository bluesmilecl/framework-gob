// Copia las fuentes Roboto / Roboto Slab (latin + latin-ext) a dist/fonts y genera dist/fonts.css
import { mkdirSync, copyFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
mkdirSync(join(root, 'dist/fonts'), { recursive: true })
const families = [
  { name: 'Roboto', pkg: 'roboto', weights: [300, 400, 500, 700] },
  { name: 'Roboto Slab', pkg: 'roboto-slab', weights: [300, 400, 700] },
]
const subsets = {
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
}
let css = '/* Roboto + Roboto Slab (SIL OFL) — auto-generado */\n'
for (const f of families) for (const w of f.weights) for (const [s, range] of Object.entries(subsets)) {
  const file = `${f.pkg}-${s}-${w}-normal.woff2`
  const src = join(root, 'node_modules/@fontsource', f.pkg, 'files', file)
  if (!existsSync(src)) { console.warn('⚠ falta', file); continue }
  copyFileSync(src, join(root, 'dist/fonts', file))
  css += `@font-face{font-family:"${f.name}";font-style:normal;font-weight:${w};font-display:swap;src:url("./fonts/${file}") format("woff2");unicode-range:${range}}\n`
}
writeFileSync(join(root, 'dist/fonts.css'), css)
console.log('✔ dist/fonts.css')
