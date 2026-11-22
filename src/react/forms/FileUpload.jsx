import { useCallback, useEffect, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import { Field, useFieldId } from './Field.jsx'
import { ACCEPT, LIMITS, attachmentIcon, formatSize, readAttachment, validateFiles } from './files.js'

/**
 * Carga de archivos: zona de arrastre (también por teclado), vista previa, validación, progreso de subida y quitar.
 * - `onChange(items)` recibe la lista completa: [{ id, name, size, type, kind, dataUrl?, text?, progress, status: 'uploading'|'done'|'error', error?, file }]
 * - `upload(item, onProgress)` (opcional) sube de verdad el archivo y devuelve una promesa; sin él se simula el progreso.
 */
export default function FileUpload({ label, hint, error, required, id, accept = ACCEPT, maxFiles = 5, maxBytes = LIMITS.maxBytes, multiple = true, disabled, defaultValue = [], onChange, upload, onReject, compact }) {
  const fid = useFieldId(id)
  const [items, setItems] = useState(defaultValue)
  const [drag, setDrag] = useState(false)
  const [rejects, setRejects] = useState([])
  const input = useRef(null)
  const depth = useRef(0)
  const first = useRef(true)

  useEffect(() => { if (first.current) { first.current = false; return } onChange?.(items) }, [items]) // eslint-disable-line react-hooks/exhaustive-deps

  const patch = useCallback((idv, p) => setItems((l) => l.map((x) => (x.id === idv ? { ...x, ...p } : x))), [])

  const startUpload = useCallback((item) => {
    if (upload) {
      upload(item, (progress) => patch(item.id, { progress })).then(() => patch(item.id, { progress: 100, status: 'done' })).catch((e) => patch(item.id, { status: 'error', error: e?.message || 'Error al subir' }))
      return
    }
    let p = 0 // simulación de progreso
    const t = setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 22)
      if (p >= 100) { clearInterval(t); patch(item.id, { progress: 100, status: 'done' }) } else patch(item.id, { progress: Math.round(p) })
    }, 140)
  }, [upload, patch])

  const add = useCallback(async (list) => {
    const files = Array.from(list || [])
    const { accepted, rejected } = validateFiles(files, items.length, { maxFiles, maxBytes })
    setRejects(rejected); if (rejected.length) onReject?.(rejected)
    if (!accepted.length) return
    const read = await Promise.all((multiple ? accepted : accepted.slice(0, 1)).map(async (f) => ({ ...(await readAttachment(f)), progress: 0, status: 'uploading', file: f })))
    setItems((l) => (multiple ? [...l, ...read] : read))
    read.forEach((r) => { if (r.error) patch(r.id, { status: 'error' }); else startUpload(r) })
  }, [items.length, maxFiles, maxBytes, multiple, onReject, patch, startUpload])

  const remove = (idv) => setItems((l) => l.filter((x) => x.id !== idv))
  const retry = (it) => { patch(it.id, { status: 'uploading', progress: 0, error: undefined }); startUpload(it) }
  const full = items.length >= maxFiles

  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required}>
      <div
        className={`app-drop ${drag ? 'is-drag' : ''} ${disabled || full ? 'is-disabled' : ''} ${compact ? 'is-compact' : ''}`}
        role="button" tabIndex={disabled || full ? -1 : 0} aria-disabled={disabled || full} aria-describedby={`${fid}-help`}
        onClick={() => !disabled && !full && input.current?.click()}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !disabled && !full) { e.preventDefault(); input.current?.click() } }}
        onDragEnter={(e) => { e.preventDefault(); depth.current++; setDrag(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => { if (--depth.current <= 0) { depth.current = 0; setDrag(false) } }}
        onDrop={(e) => { e.preventDefault(); depth.current = 0; setDrag(false); if (!disabled && !full) add(e.dataTransfer.files) }}
      >
        <Icon name="upload" />
        <strong>{drag ? 'Suelta los archivos aquí' : full ? 'Alcanzaste el máximo de archivos' : 'Arrastra archivos o haz clic para seleccionar'}</strong>
        <small id={`${fid}-help`}>Hasta {maxFiles} archivo{maxFiles > 1 ? 's' : ''} · máx. {formatSize(maxBytes)} cada uno</small>
        <input ref={input} id={fid} type="file" hidden multiple={multiple} accept={accept} disabled={disabled} onChange={(e) => { add(e.target.files); e.target.value = '' }} />
      </div>
      {rejects.length > 0 && (
        <ul className="app-upload-errors" role="alert">{rejects.map((r, i) => <li key={i}><Icon name="triangle-alert" /><strong>{r.name}</strong>: {r.reason}</li>)}</ul>
      )}
      {items.length > 0 && (
        <ul className="app-files" aria-label="Archivos seleccionados">
          {items.map((it) => (
            <li key={it.id} className={`app-file ${it.status === 'error' ? 'is-error' : ''}`}>
              {it.kind === 'image' && it.dataUrl ? <img className="app-file-thumb" src={it.dataUrl} alt="" /> : <span className="app-file-icon"><Icon name={attachmentIcon(it)} /></span>}
              <div className="grow">
                <strong title={it.name}>{it.name}</strong>
                <small>{formatSize(it.size)} · {it.status === 'done' ? 'Listo' : it.status === 'error' ? it.error || 'Error' : `Subiendo… ${it.progress}%`}</small>
                {it.status === 'uploading' && <div className="progress app-file-progress" role="progressbar" aria-valuenow={it.progress} aria-valuemin="0" aria-valuemax="100" aria-label={`Subiendo ${it.name}`}><div className="progress-bar" style={{ width: `${it.progress}%` }} /></div>}
              </div>
              {it.status === 'done' && <Icon name="circle-check" className="app-file-ok" />}
              {it.status === 'error' && !it.error?.includes('leer') && <button type="button" className="app-iconbtn" aria-label={`Reintentar ${it.name}`} onClick={() => retry(it)}><Icon name="refresh-cw" /></button>}
              <button type="button" className="app-iconbtn" aria-label={`Quitar ${it.name}`} onClick={() => remove(it.id)}><Icon name="x" /></button>
            </li>
          ))}
        </ul>
      )}
    </Field>
  )
}
