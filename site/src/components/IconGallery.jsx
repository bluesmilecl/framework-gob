import { useMemo, useState } from 'react'
import icons from '../../../dist/icons.json'

/** Galería de íconos filtrable; clic copia el HTML del ícono. */
export default function IconGallery() {
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const map = new Map()
    for (const i of icons) {
      if (q && !i.name.includes(q)) continue
      if (!map.has(i.group)) map.set(i.group, [])
      map.get(i.group).push(i)
    }
    return [...map.entries()]
  }, [query])
  const shown = groups.reduce((n, [, l]) => n + l.length, 0)

  const copy = async (cls) => {
    const txt = `<i class="cl ${cls}"></i>`
    try { await navigator.clipboard.writeText(txt) } catch { /* sin portapapeles */ }
    setCopied(cls)
    setTimeout(() => setCopied(''), 1400)
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <input type="search" className="form-control" style={{ maxWidth: '22rem' }} placeholder="Buscar ícono… (ej: user, mail, search)" aria-label="Buscar ícono" value={query} onChange={(e) => setQuery(e.target.value)} />
        <small className="text-gray-b">{shown} de {icons.length} íconos</small>
      </div>
      {groups.map(([group, list]) => (
        <div key={group}>
          <h3 className="h5">{group} <span className="badge badge-neutral">{list.length}</span></h3>
          <div className="icon-grid">
            {list.map((i) => (
              <button key={i.name} type="button" className={`icon-cell ${copied === i.class ? 'copied' : ''}`} title={`.${i.class}`} onClick={() => copy(i.class)}>
                <i className={`cl ${i.class}`} aria-hidden="true" />
                <span>{i.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className={`toast-copy ${copied ? 'on' : ''}`} role="status" aria-live="polite">{copied && `Copiado: <i class="cl ${copied}"></i>`}</div>
    </>
  )
}
