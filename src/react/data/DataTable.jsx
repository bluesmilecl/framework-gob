import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import Pagination from './Pagination.jsx'
import { EmptyState, Skeleton } from './bits.jsx'
import DropdownMenu from '../nav/DropdownMenu.jsx'
import { SearchInput } from '../forms/inputs.jsx'

/**
 * Barra de filtros: búsqueda + selectores + acciones.
 *   <FilterBar search={q} onSearch={setQ} filters={[{ name, label, value, onChange, options: [{value,label}] }]} onClear={…} actions={<…/>} />
 */
export function FilterBar({ search, onSearch, searchPlaceholder, filters = [], onClear, actions }) {
  const active = Boolean(search) || filters.some((f) => f.value)
  return (
    <div className="app-toolbar" role="search">
      {onSearch && <SearchInput value={search} onChange={onSearch} placeholder={searchPlaceholder} />}
      {filters.map((f) => (
        <select key={f.name} className="form-control" aria-label={f.label} value={f.value} onChange={(e) => f.onChange(e.target.value)}>
          <option value="">{f.label}: todos</option>
          {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ))}
      {onClear && active && <button type="button" className="btn btn-link btn-compact btn-sm" onClick={onClear}>Limpiar filtros</button>}
      <span className="grow" />
      {actions}
    </div>
  )
}

const cmp = (a, b) => (typeof a === 'number' && typeof b === 'number' ? a - b : String(a ?? '').localeCompare(String(b ?? ''), 'es', { numeric: true, sensitivity: 'base' }))

/**
 * Tabla de datos: orden por columna, selección múltiple, acciones por fila, paginación, estados de carga y vacío.
 * columns: [{ key, header, sortable, render(row), sortValue(row), align, hideBelow: 'sm' | 'md', width }]
 * rows se entregan ya filtrados; la tabla ordena y pagina en el cliente.
 */
export default function DataTable({
  columns, rows, rowKey = 'id', loading = false, selectable = false, bulkActions, rowActions, onRowClick, onSelectionChange,
  pageSizes = [10, 20, 50], defaultPageSize = 10, defaultSort, empty, toolbar, caption = 'Tabla de datos', noun = ['registro', 'registros'],
}) {
  const uid = useId()
  const [sort, setSort] = useState(defaultSort ?? null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(defaultPageSize)
  const [selected, setSelected] = useState(() => new Set())

  const sorted = useMemo(() => {
    if (!sort) return rows
    const col = columns.find((c) => c.key === sort.key)
    const val = (r) => (col?.sortValue ? col.sortValue(r) : r[sort.key])
    return [...rows].sort((a, b) => cmp(val(a), val(b)) * (sort.dir === 'asc' ? 1 : -1))
  }, [rows, sort, columns])

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const cur = Math.min(page, pages)
  const view = sorted.slice((cur - 1) * pageSize, cur * pageSize)

  // Si cambia el conjunto de filas: volver a la página 1 y conservar solo la selección vigente
  const sig = rows.length
  useEffect(() => { setPage(1) }, [sig, pageSize])
  useEffect(() => { setSelected((s) => { const keys = new Set(rows.map((r) => r[rowKey])); const n = new Set([...s].filter((k) => keys.has(k))); return n.size === s.size ? s : n }) }, [rows, rowKey])
  useEffect(() => { onSelectionChange?.(rows.filter((r) => selected.has(r[rowKey]))) }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSort = (key) => setSort((s) => (s?.key !== key ? { key, dir: 'asc' } : s.dir === 'asc' ? { key, dir: 'desc' } : null))
  const pageKeys = view.map((r) => r[rowKey])
  const allOnPage = pageKeys.length > 0 && pageKeys.every((k) => selected.has(k))
  const someOnPage = pageKeys.some((k) => selected.has(k)) && !allOnPage
  const headCheck = useRef(null)
  useEffect(() => { if (headCheck.current) headCheck.current.indeterminate = someOnPage }, [someOnPage])
  const selectedRows = rows.filter((r) => selected.has(r[rowKey]))
  const toggleRow = (k) => setSelected((s) => { const n = new Set(s); n.has(k) ? n.delete(k) : n.add(k); return n })
  const togglePage = () => setSelected((s) => { const n = new Set(s); pageKeys.forEach((k) => (allOnPage ? n.delete(k) : n.add(k))); return n })

  const hide = (c) => (c.hideBelow === 'sm' ? 'app-hide-sm' : c.hideBelow === 'md' ? 'app-hide-md' : '')
  const from = sorted.length ? (cur - 1) * pageSize + 1 : 0
  const to = Math.min(cur * pageSize, sorted.length)

  return (
    <div className="app-datatable">
      {toolbar}
      {selectable && selected.size > 0 && (
        <div className="app-bulkbar" role="status">
          <strong>{selected.size} {selected.size === 1 ? noun[0] : noun[1]} seleccionado{selected.size === 1 ? '' : 's'}</strong>
          <span className="grow" />
          {bulkActions?.(selectedRows, () => setSelected(new Set()))}
          <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => setSelected(new Set())}>Quitar selección</button>
        </div>
      )}
      <div className="app-table-wrap">
        <table className="app-table">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {selectable && <th className="col-check"><input ref={headCheck} type="checkbox" className="app-check" aria-label="Seleccionar todos en esta página" checked={allOnPage} onChange={togglePage} /></th>}
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`${hide(c)} ${c.align === 'right' ? 'num' : ''}`} style={{ width: c.width }} aria-sort={sort?.key === c.key ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {c.sortable ? <button type="button" className="app-sort" onClick={() => toggleSort(c.key)}>{c.header}<Icon name={sort?.key === c.key ? (sort.dir === 'asc' ? 'arrow-up' : 'arrow-down') : 'chevrons-up-down'} /></button> : c.header}
                </th>
              ))}
              {rowActions && <th scope="col" className="col-actions"><span className="sr-only">Acciones</span></th>}
            </tr>
          </thead>
          <tbody>
            {loading && Array.from({ length: 5 }, (_, i) => (
              <tr key={`s${i}`} aria-hidden="true">
                {selectable && <td className="col-check" />}
                {columns.map((c) => <td key={c.key} className={hide(c)}><Skeleton width={`${50 + ((i * 17 + c.key.length * 7) % 40)}%`} /></td>)}
                {rowActions && <td />}
              </tr>
            ))}
            {!loading && view.map((r) => {
              const k = r[rowKey]
              return (
                <tr key={k} className={selected.has(k) ? 'is-selected' : ''} onClick={onRowClick ? () => onRowClick(r) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
                  {selectable && <td className="col-check" onClick={(e) => e.stopPropagation()}><input type="checkbox" className="app-check" aria-label={`Seleccionar fila ${k}`} checked={selected.has(k)} onChange={() => toggleRow(k)} /></td>}
                  {columns.map((c) => <td key={c.key} className={`${hide(c)} ${c.align === 'right' ? 'num' : ''}`}>{c.render ? c.render(r) : r[c.key]}</td>)}
                  {rowActions && <td className="col-actions" onClick={(e) => e.stopPropagation()}><DropdownMenu label={`Acciones de la fila ${k}`} items={rowActions(r)} /></td>}
                </tr>
              )
            })}
          </tbody>
        </table>
        {!loading && sorted.length === 0 && (empty ?? <EmptyState icon="search" title="Sin resultados">No encontramos registros con los filtros actuales.</EmptyState>)}
      </div>
      {!loading && sorted.length > 0 && (
        <div className="app-table-foot">
          <span aria-live="polite">Mostrando {from}–{to} de {sorted.length} {sorted.length === 1 ? noun[0] : noun[1]}</span>
          <span>
            <label htmlFor={`${uid}-ps`}>Filas por página</label>
            <select id={`${uid}-ps`} className="form-control" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>{pageSizes.map((n) => <option key={n}>{n}</option>)}</select>
          </span>
          <Pagination page={cur} pages={pages} onChange={setPage} />
        </div>
      )}
    </div>
  )
}
