// Arnés de paridad visual: compara estilos computados y cajas entre la documentación oficial (CSS original)
// y la misma documentación servida con dist/gob.css de este paquete.
// Uso:  NODE_PATH=$(npm root -g) node tools/parity.cjs <site-oficial> <site-copia> [pagina.html ...]
//   <site-oficial>  carpeta site/ del paquete @gobdigital-cl/gob.cl
//   <site-copia>    copia de site/ cuyo css/gob.cl.css fue reemplazado por dist/gob.css
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

const [, , refDir, mineDir, ...argPages] = process.argv
const pages = argPages.length ? argPages : fs.readdirSync(refDir).filter((f) => f.endsWith('.html'))
const VIEWPORTS = (process.env.VIEWPORTS || '1280,390').split(',').map(Number)
const CONTRAST = process.env.CONTRAST === '1'

const PROPS = ['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'border-top-style', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-bottom-right-radius', 'color', 'background-color', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing',
  'text-align', 'text-decoration-line', 'text-transform', 'white-space', 'vertical-align', 'overflow-x', 'overflow-y', 'opacity', 'visibility', 'z-index', 'box-shadow',
  'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis', 'align-items', 'align-self', 'justify-content', 'order', 'float', 'cursor', 'list-style-type', 'transform', 'object-fit', 'background-size', 'background-position-x']
const PSEUDO_PROPS = ['content', 'display', 'position', 'width', 'height', 'color', 'background-color', 'margin-left', 'margin-right', 'font-size', 'border-top-width', 'border-top-color', 'border-top-style']

const snapshot = async (page, url, vw) => {
  await page.setViewportSize({ width: vw, height: 900 })
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  if (CONTRAST) await page.evaluate(() => document.documentElement.classList.add('a11y-contrast'))
  await page.waitForTimeout(150)
  return page.evaluate(([PROPS, PSEUDO_PROPS]) => {
    const skip = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TITLE', 'HEAD', 'BR', 'PATH', 'USE', 'G'])
    const out = []
    document.body.querySelectorAll('*').forEach((el) => {
      if (skip.has(el.tagName) || el.closest('pre') || el.closest('svg')) return
      const cs = getComputedStyle(el)
      const r = el.getBoundingClientRect()
      const o = { sig: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : ''), id: el.id, anc: (() => { const a = []; let e = el.parentElement; for (let i = 0; i < 3 && e && e !== document.body; i++, e = e.parentElement) a.push(e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/)[0] : '')); return a.join(' < ') })(), s: {}, r: [Math.round(r.x * 10) / 10, Math.round(r.y * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10] }
      for (const p of PROPS) o.s[p] = cs.getPropertyValue(p)
      for (const ps of ['::before', '::after']) {
        const pcs = getComputedStyle(el, ps)
        const c = pcs.getPropertyValue('content')
        if (c && c !== 'none' && c !== 'normal') { o[ps] = {}; for (const p of PSEUDO_PROPS) o[ps][p] = pcs.getPropertyValue(p) }
      }
      out.push(o)
    })
    return out
  }, [PROPS, PSEUDO_PROPS])
}

// Tolerancia subpíxel (el ancho de glifos de fuente varía ~0.02px)
const same = (a, b) => {
  if (a === b) return true
  const na = parseFloat(a), nb = parseFloat(b)
  return !Number.isNaN(na) && !Number.isNaN(nb) && /px$/.test(a) && /px$/.test(b) && Math.abs(na - nb) < 0.5
}
const isIcon = (sig) => /(^|\.)cl(\.|-|$)/.test(sig) || /\.cl-/.test(sig)

;(async () => {
  const browser = await chromium.launch()
  const mk = async () => {
    const ctx = await browser.newContext()
    await ctx.route(/^https?:/, (r) => r.abort())
    return ctx.newPage()
  }
  const refPage = await mk()
  const minePage = await mk()
  const agg = new Map()
  let totalEls = 0, badEls = 0
  const perPage = []
  for (const pg of pages) {
    for (const vw of VIEWPORTS) {
      const a = await snapshot(refPage, 'file://' + path.resolve(refDir, pg), vw)
      const b = await snapshot(minePage, 'file://' + path.resolve(mineDir, pg), vw)
      let bad = 0
      const n = Math.min(a.length, b.length)
      if (a.length !== b.length) console.log(`  ⚠ ${pg}@${vw}: nº de elementos distinto ${a.length} vs ${b.length}`)
      for (let i = 0; i < n; i++) {
        const x = a[i], y = b[i]
        const diffs = []
        for (const p of PROPS) {
          if (isIcon(x.sig) && ['font-family', 'width', 'height', 'min-width', 'min-height', 'background-color', 'color', 'font-size', 'display', 'vertical-align', 'flex-shrink', 'font-weight', 'font-style', 'line-height', 'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color', 'text-decoration-line', 'letter-spacing', 'text-transform', 'white-space', 'text-align'].includes(p)) continue
          if (!same(x.s[p], y.s[p])) diffs.push([p, x.s[p], y.s[p]])
        }
        for (let k = 0; k < 4; k++) if (!isIcon(x.sig) && Math.abs(x.r[k] - y.r[k]) > 1) { diffs.push([['x', 'y', 'w', 'h'][k] + '(caja)', String(x.r[k]), String(y.r[k])]); break }
        for (const ps of ['::before', '::after']) {
          if (x[ps] || y[ps]) {
            if (isIcon(x.sig)) continue
            const xp = x[ps] || {}, yp = y[ps] || {}
            for (const p of PSEUDO_PROPS) {
              if (p === 'content' && /[-]/.test(xp[p] || '') ) continue
              if (xp[p] !== yp[p]) diffs.push([ps + ' ' + p, xp[p], yp[p]])
            }
          }
        }
        totalEls++
        if (diffs.length) {
          bad++; badEls++
          for (const [p, rv, mv] of diffs) {
            const key = `${x.sig}|${p}|${rv}|${mv}`
            const e = agg.get(key) || { sig: x.sig, p, rv, mv, n: 0, pages: new Set() }
            e.n++; e.pages.add(`${pg}@${vw}`); e.anc = e.anc || x.anc
            agg.set(key, e)
          }
        }
      }
      perPage.push([`${pg}@${vw}`, n, bad])
    }
  }
  await browser.close()
  const rows = [...agg.values()].sort((a, b) => b.n - a.n)
  const top = Number(process.env.TOP || 40)
  console.log('\nPágina@viewport · elementos · con diferencias')
  for (const [k, n, bad] of perPage) console.log(`  ${k.padEnd(34)} ${String(n).padStart(5)} ${String(bad).padStart(5)}  ${((1 - bad / n) * 100).toFixed(1)}%`)
  console.log(`\nPARIDAD GLOBAL: ${((1 - badEls / totalEls) * 100).toFixed(2)}%  (${badEls} de ${totalEls} elementos con alguna diferencia)`)
  console.log(`\nTop ${top} diferencias (selector · propiedad · original → copia · veces):`)
  for (const e of rows.slice(0, top)) console.log(`  ${String(e.n).padStart(4)}× ${e.sig.slice(0, 60)} · ${e.p}: ${String(e.rv).slice(0, 38)} → ${String(e.mv).slice(0, 38)}   [${e.anc || ''}]`)
  if (process.env.REPORT) fs.writeFileSync(process.env.REPORT, JSON.stringify(rows.map((e) => ({ ...e, pages: [...e.pages] })), null, 1))
})()
