import Icon from '../Icon.jsx'

/** Lista de páginas con elipsis: 1 … 4 5 [6] 7 8 … 20 */
export const pageList = (page, pages) => {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const set = new Set([1, pages, page, page - 1, page + 1])
  if (page <= 3) [2, 3, 4].forEach((n) => set.add(n))
  if (page >= pages - 2) [pages - 1, pages - 2, pages - 3].forEach((n) => set.add(n))
  const out = []
  let prev = 0
  for (const n of [...set].filter((x) => x >= 1 && x <= pages).sort((a, b) => a - b)) { if (n - prev > 1) out.push('…'); out.push(n); prev = n }
  return out
}

/** Paginación accesible (usa las clases .pagination del framework). */
export default function Pagination({ page, pages, onChange, label = 'Paginación' }) {
  if (pages <= 1) return null
  return (
    <nav aria-label={label}>
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}><button type="button" className="page-link" aria-label="Página anterior" disabled={page === 1} onClick={() => onChange(page - 1)}><Icon name="arrow-left" /></button></li>
        {pageList(page, pages).map((n, i) => (n === '…'
          ? <li key={`e${i}`} className="page-item disabled" aria-hidden="true"><span className="page-link">…</span></li>
          : <li key={n} className={`page-item ${n === page ? 'active' : ''}`}><button type="button" className="page-link" aria-current={n === page ? 'page' : undefined} aria-label={`Página ${n}`} onClick={() => onChange(n)}>{n}</button></li>))}
        <li className={`page-item ${page === pages ? 'disabled' : ''}`}><button type="button" className="page-link" aria-label="Página siguiente" disabled={page === pages} onClick={() => onChange(page + 1)}><Icon name="arrow-right" /></button></li>
      </ul>
    </nav>
  )
}
