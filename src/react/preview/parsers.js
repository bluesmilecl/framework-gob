// Lectores de documentos en el navegador. Las dependencias pesadas se cargan solo al necesitarlas.

const xmlDoc = (s) => new DOMParser().parseFromString(s, 'application/xml')
const textOf = (el) => (el ? el.textContent : '')

/** Elimina scripts, manejadores on* y URLs javascript: de HTML generado a partir de un documento. */
export const sanitizeHtml = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  doc.querySelectorAll('script,iframe,object,embed,link,style,form').forEach((n) => n.remove())
  doc.body.querySelectorAll('*').forEach((el) => {
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name) || (/^(href|src|xlink:href)$/i.test(a.name) && /^\s*javascript:/i.test(a.value))) el.removeAttribute(a.name)
    }
    if (el.tagName === 'A') { el.setAttribute('target', '_blank'); el.setAttribute('rel', 'noopener noreferrer') }
  })
  return doc.body.innerHTML
}

/** .docx → HTML (mammoth). */
export async function parseDocx(buffer) {
  const mammoth = (await import('mammoth')).default || (await import('mammoth'))
  const { value, messages } = await mammoth.convertToHtml({ arrayBuffer: buffer })
  return { html: sanitizeHtml(value), warnings: messages.length }
}

const colIndex = (ref) => [...ref.replace(/\d+/g, '')].reduce((n, c) => n * 26 + c.charCodeAt(0) - 64, 0) - 1

/** .xlsx → hojas con filas de texto (sin dependencias de hoja de cálculo: ZIP + XML). */
export async function parseXlsx(buffer, { maxRows = 500, maxCols = 40 } = {}) {
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(buffer)
  const read = async (p) => { const f = zip.file(p); return f ? f.async('string') : null }
  const shared = []
  const ss = await read('xl/sharedStrings.xml')
  if (ss) xmlDoc(ss).querySelectorAll('si').forEach((si) => shared.push([...si.querySelectorAll('t')].map(textOf).join('')))
  const wb = xmlDoc((await read('xl/workbook.xml')) || '<x/>')
  const rels = xmlDoc((await read('xl/_rels/workbook.xml.rels')) || '<x/>')
  const target = {}
  rels.querySelectorAll('Relationship').forEach((r) => { target[r.getAttribute('Id')] = r.getAttribute('Target') })
  const sheets = []
  for (const s of [...wb.querySelectorAll('sheet')]) {
    const rid = s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id')
    let path = target[rid] || `worksheets/sheet${sheets.length + 1}.xml`
    path = path.startsWith('/') ? path.slice(1) : `xl/${path}`
    const xml = await read(path)
    if (!xml) continue
    const rows = []
    let total = 0
    xmlDoc(xml).querySelectorAll('sheetData > row').forEach((row) => {
      total++
      if (rows.length >= maxRows) return
      const out = []
      row.querySelectorAll('c').forEach((c) => {
        const i = colIndex(c.getAttribute('r') || 'A1')
        if (i >= maxCols) return
        const t = c.getAttribute('t')
        const v = textOf(c.querySelector('v'))
        out[i] = t === 's' ? shared[+v] ?? '' : t === 'inlineStr' ? textOf(c.querySelector('is')) : t === 'b' ? (v === '1' ? 'VERDADERO' : 'FALSO') : v
      })
      rows.push(Array.from(out, (x) => x ?? ''))
    })
    sheets.push({ name: s.getAttribute('name'), rows, truncated: total > rows.length })
  }
  return sheets
}

/** .pptx → diapositivas con título y texto (vista de contenido; no reproduce el diseño). */
export async function parsePptx(buffer) {
  const JSZip = (await import('jszip')).default
  const zip = await JSZip.loadAsync(buffer)
  const names = Object.keys(zip.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]))
  const slides = []
  for (const n of names) {
    const doc = xmlDoc(await zip.file(n).async('string'))
    const paras = [...doc.querySelectorAll('p')].map((p) => [...p.querySelectorAll('t')].map(textOf).join('')).filter(Boolean)
    slides.push({ title: paras[0] || `Diapositiva ${slides.length + 1}`, lines: paras.slice(1) })
  }
  return slides
}

const DWG_VERSIONS = {
  AC1006: 'AutoCAD R10', AC1009: 'AutoCAD R11/R12', AC1012: 'AutoCAD R13', AC1014: 'AutoCAD R14', AC1015: 'AutoCAD 2000', AC1018: 'AutoCAD 2004',
  AC1021: 'AutoCAD 2007', AC1024: 'AutoCAD 2010', AC1027: 'AutoCAD 2013', AC1032: 'AutoCAD 2018+',
}

/** .dwg: el formato es binario propietario; se lee solo la cabecera (versión). */
export const parseDwgHeader = (buffer) => {
  const code = new TextDecoder('ascii').decode(new Uint8Array(buffer.slice(0, 6)))
  return DWG_VERSIONS[code] ? { code, version: DWG_VERSIONS[code] } : { code, version: null }
}

/** .dxf (texto) → geometría 2D simple (LINE, CIRCLE, ARC, LWPOLYLINE) para dibujar en SVG. */
export function parseDxf(text, maxEntities = 20000) {
  const raw = text.split(/\r?\n/)
  const pairs = []
  for (let i = 0; i + 1 < raw.length; i += 2) pairs.push([raw[i].trim(), raw[i + 1].trim()])
  const shapes = []
  let cur = null
  const flush = () => { if (cur && shapes.length < maxEntities) shapes.push(cur); cur = null }
  let inEntities = false
  for (const [code, val] of pairs) {
    if (code === '0') {
      flush()
      if (val === 'SECTION') continue
      if (val === 'ENDSEC') { inEntities = false; continue }
      if (inEntities && ['LINE', 'CIRCLE', 'ARC', 'LWPOLYLINE'].includes(val)) cur = { type: val, pts: [], closed: false }
      continue
    }
    if (code === '2' && val === 'ENTITIES') { inEntities = true; continue }
    if (!cur) continue
    const n = parseFloat(val)
    if (cur.type === 'LINE') {
      if (code === '10') cur.x1 = n; else if (code === '20') cur.y1 = n; else if (code === '11') cur.x2 = n; else if (code === '21') cur.y2 = n
    } else if (cur.type === 'CIRCLE' || cur.type === 'ARC') {
      if (code === '10') cur.cx = n; else if (code === '20') cur.cy = n; else if (code === '40') cur.r = n; else if (code === '50') cur.a0 = n; else if (code === '51') cur.a1 = n
    } else if (cur.type === 'LWPOLYLINE') {
      if (code === '70') cur.closed = (parseInt(val) & 1) === 1; else if (code === '10') cur.pts.push([n, 0]); else if (code === '20' && cur.pts.length) cur.pts[cur.pts.length - 1][1] = n
    }
  }
  flush()
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
  const ext = (x, y) => { if (Number.isFinite(x) && Number.isFinite(y)) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y) } }
  for (const s of shapes) {
    if (s.type === 'LINE') { ext(s.x1, s.y1); ext(s.x2, s.y2) }
    else if (s.type === 'LWPOLYLINE') s.pts.forEach(([x, y]) => ext(x, y))
    else { ext(s.cx - s.r, s.cy - s.r); ext(s.cx + s.r, s.cy + s.r) }
  }
  return { shapes, bounds: shapes.length ? { minX, minY, maxX, maxY } : null }
}

/** CSV/TSV → filas de texto (sin interpretar encabezados). Soporta comillas. */
export const parseRows = (text, delimiter) => {
  const src = text.replace(/^﻿/, '')
  const first = src.split('\n')[0]
  const sep = delimiter || (['\t', ';', ','].map((d) => [d, first.split(d).length]).sort((a, b) => b[1] - a[1])[0][0])
  const rows = []
  let row = [], cell = '', q = false
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (q) { if (c === '"' && src[i + 1] === '"') { cell += '"'; i++ } else if (c === '"') q = false; else cell += c }
    else if (c === '"') q = true
    else if (c === sep) { row.push(cell); cell = '' }
    else if (c === '\n' || c === '\r') { if (c === '\r' && src[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = '' }
    else cell += c
  }
  if (cell || row.length) { row.push(cell); rows.push(row) }
  return rows.filter((r) => r.some((x) => x.trim()))
}
