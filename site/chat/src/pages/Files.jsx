import { useEffect, useMemo, useState } from 'react'
import { Alert, DataTable, EmptyState, FileUpload, FilterBar, Icon, PageHeader, Panel, StatusBadge, attachmentIcon, formatSize, useModal, useToast } from 'gob-cl-tailwind/react'

const KEY = 'chat:files'
const LIMIT = 5 * 1024 * 1024
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const KINDS = [{ value: 'image', label: 'Imágenes' }, { value: 'text', label: 'Texto y código' }, { value: 'file', label: 'Documentos' }]
const when = (t) => new Date(t).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })

/** Biblioteca de archivos: sube, busca, filtra, renombra y elimina. Los archivos < 200 KB se guardan para poder descargarlos. */
export default function Files() {
  const modal = useModal()
  const toast = useToast()
  const [files, setFiles] = useState(load)
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('')
  const [uploadKey, setUploadKey] = useState(0)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(files)) } catch { toast('No hay espacio suficiente para guardar el contenido', 'error') } }, [files]) // eslint-disable-line
  const used = files.reduce((n, f) => n + f.size, 0)

  const rows = useMemo(() => { const s = q.trim().toLowerCase(); return files.filter((f) => (!kind || f.kind === kind) && (!s || f.name.toLowerCase().includes(s))) }, [files, q, kind])

  const onUpload = (items) => {
    const done = items.filter((x) => x.status === 'done')
    if (!done.length || done.length !== items.length) return
    setFiles((l) => [...done.map((x) => ({ id: x.id, name: x.name, size: x.size, type: x.type, kind: x.kind, added: Date.now(), data: x.size < 200 * 1024 ? (x.dataUrl ?? (x.text != null ? `data:text/plain;charset=utf-8,${encodeURIComponent(x.text)}` : null)) : null })), ...l])
    toast(`${done.length} archivo(s) agregados`, 'ok'); setUploadKey((k) => k + 1)
  }
  const rename = async (f) => {
    const name = await modal.prompt({ title: 'Renombrar archivo', label: 'Nombre', initial: f.name, icon: 'pencil', confirmLabel: 'Guardar', validate: (v) => (v.trim() ? '' : 'El nombre no puede estar vacío') })
    if (name) { setFiles((l) => l.map((x) => (x.id === f.id ? { ...x, name: name.trim() } : x))); toast('Archivo renombrado', 'ok') }
  }
  const remove = async (list, done) => {
    if (!await modal.confirm({ title: list.length > 1 ? `Eliminar ${list.length} archivos` : 'Eliminar archivo', tone: 'danger', text: list.length > 1 ? 'Se eliminarán los archivos seleccionados.' : `Se eliminará «${list[0].name}».`, confirmLabel: 'Eliminar' })) return
    const ids = new Set(list.map((x) => x.id)); setFiles((l) => l.filter((x) => !ids.has(x.id))); done?.()
    toast(`${list.length} archivo(s) eliminados`, { action: { label: 'Deshacer', onClick: () => setFiles((l) => [...list, ...l]) } })
  }
  const download = (f) => { if (!f.data) return toast('El contenido de este archivo no se guardó (supera 200 KB)', 'warn'); const a = Object.assign(document.createElement('a'), { href: f.data, download: f.name }); document.body.appendChild(a); a.click(); a.remove() }

  return (
    <div className="app-container is-wide">
      <PageHeader title="Biblioteca de archivos" description="Los archivos que subas quedan disponibles para tus conversaciones." />
      <div className="row">
        <div className="col-lg-5 mb-4">
          <Panel title="Subir archivos">
            <FileUpload key={uploadKey} maxFiles={6} onChange={onUpload} hint="Imágenes, PDF, documentos y texto." />
            <div className="mt-3"><div className="d-flex justify-content-between" style={{ fontSize: '0.82rem' }}><span>Almacenamiento (demostración)</span><span>{formatSize(used)} de {formatSize(LIMIT)}</span></div>
              <div className="progress mt-1" role="progressbar" aria-valuenow={Math.round((used / LIMIT) * 100)} aria-valuemin="0" aria-valuemax="100" aria-label="Almacenamiento usado"><div className="progress-bar" style={{ width: `${Math.min(100, (used / LIMIT) * 100)}%` }} /></div></div>
          </Panel>
        </div>
        <div className="col-lg-7 mb-4">
          <Alert tone="info" title="¿Cómo se guardan?">Solo se conserva el contenido de los archivos pequeños (menos de 200 KB) en este navegador. Es una maqueta: no se sube nada a ningún servidor.</Alert>
        </div>
      </div>
      <Panel flush>
        <DataTable rows={rows} selectable caption="Biblioteca de archivos" noun={['archivo', 'archivos']} defaultSort={{ key: 'added', dir: 'desc' }} pageSizes={[5, 10, 25]} defaultPageSize={10}
          toolbar={<FilterBar search={q} onSearch={setQ} searchPlaceholder="Buscar por nombre…" onClear={() => { setQ(''); setKind('') }} filters={[{ name: 'kind', label: 'Tipo', value: kind, onChange: setKind, options: KINDS }]} />}
          columns={[
            { key: 'name', header: 'Nombre', sortable: true, render: (f) => <span className="app-person"><span className="app-file-icon"><Icon name={attachmentIcon(f)} /></span><span><strong>{f.name}</strong><small>{f.type || 'archivo'}</small></span></span> },
            { key: 'kind', header: 'Tipo', sortable: true, render: (f) => <StatusBadge tone={f.kind === 'image' ? 'info' : f.kind === 'text' ? 'ok' : 'warn'}>{KINDS.find((k) => k.value === f.kind)?.label ?? 'Archivo'}</StatusBadge>, hideBelow: 'sm' },
            { key: 'size', header: 'Tamaño', sortable: true, align: 'right', render: (f) => formatSize(f.size) },
            { key: 'added', header: 'Agregado', sortable: true, render: (f) => when(f.added), hideBelow: 'md' },
          ]}
          bulkActions={(sel, done) => <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => remove(sel, done)}><Icon name="trash-2" />Eliminar</button>}
          rowActions={(f) => [{ label: 'Descargar', icon: 'download', onSelect: () => download(f), disabled: !f.data }, { label: 'Renombrar', icon: 'pencil', onSelect: () => rename(f) }, { separator: true }, { label: 'Eliminar', icon: 'trash-2', danger: true, onSelect: () => remove([f]) }]}
          empty={<EmptyState icon="folder-open" title={files.length ? 'Sin resultados' : 'Aún no hay archivos'}>{files.length ? 'Prueba con otra búsqueda o filtro.' : 'Sube tu primer archivo con el panel de la izquierda.'}</EmptyState>} />
      </Panel>
    </div>
  )
}
