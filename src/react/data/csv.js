const esc = (v) => {
  const s = v == null ? '' : String(v)
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

/** Filas -> CSV (separador coma, con BOM para que Excel lea bien las tildes). */
export const toCsv = (rows, columns) => `﻿${[columns.map((c) => esc(c.label)).join(','), ...rows.map((r) => columns.map((c) => esc(c.get ? c.get(r) : r[c.key])).join(','))].join('\r\n')}`

/** CSV -> arreglo de objetos con la primera fila como encabezado. Soporta comillas y separador , o ; */
export const parseCsv = (text) => {
  const src = text.replace(/^﻿/, '')
  const sep = (src.split('\n')[0].match(/;/g) || []).length > (src.split('\n')[0].match(/,/g) || []).length ? ';' : ','
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
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim()))
  if (!head) return []
  const keys = head.map((h) => h.trim().toLowerCase())
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] ?? '').trim()])))
}

export const downloadFile = (name, text, mime = 'text/csv') => {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }))
  const a = Object.assign(document.createElement('a'), { href: url, download: name })
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
