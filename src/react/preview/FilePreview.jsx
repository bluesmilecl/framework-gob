import { useEffect, useMemo, useState } from 'react'
import Icon from '../Icon.jsx'
import { Modal } from '../feedback/Modal.jsx'
import { LoadingScreen } from '../feedback/Loading.jsx'
import { formatSize } from '../forms/files.js'
import { parseRows, parseDocx, parseXlsx, parsePptx, parseDwgHeader, parseDxf } from './parsers.js'

const ext = (name = '') => (name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase()

/** Clasifica el archivo para elegir visor. */
export const previewKind = (name = '', type = '') => {
  const e = ext(name)
  if (type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(e)) return 'image'
  if (type === 'application/pdf' || e === 'pdf') return 'pdf'
  if (type.startsWith('video/') || ['mp4', 'webm', 'ogv', 'mov'].includes(e)) return 'video'
  if (type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(e)) return 'audio'
  if (e === 'docx') return 'docx'
  if (e === 'xlsx') return 'xlsx'
  if (e === 'pptx') return 'pptx'
  if (e === 'csv' || e === 'tsv') return 'csv'
  if (e === 'dxf') return 'dxf'
  if (e === 'dwg') return 'dwg'
  if (['doc', 'xls', 'ppt', 'odt', 'ods', 'odp', 'rtf'].includes(e)) return 'legacy'
  if (type.startsWith('text/') || type === 'application/json' || ['txt', 'md', 'json', 'xml', 'yaml', 'yml', 'html', 'css', 'js', 'jsx', 'ts', 'tsx', 'py', 'sql', 'log', 'ini', 'toml', 'sh'].includes(e)) return 'text'
  return 'unknown'
}

const KIND_META = {
  image: ['file-image', 'Imagen'], pdf: ['file-text', 'PDF'], video: ['file', 'Video'], audio: ['file', 'Audio'],
  docx: ['file-text', 'Documento Word'], xlsx: ['file-spreadsheet', 'Planilla Excel'], pptx: ['file', 'Presentación PowerPoint'],
  csv: ['file-spreadsheet', 'Datos CSV'], dxf: ['ruler', 'Plano DXF'], dwg: ['ruler', 'Plano DWG'], legacy: ['file', 'Documento Office'],
  text: ['file-code', 'Texto'], unknown: ['file', 'Archivo'],
}
const LEGACY_HINT = { doc: 'Word 97-2003', xls: 'Excel 97-2003', ppt: 'PowerPoint 97-2003', odt: 'OpenDocument', ods: 'OpenDocument', odp: 'OpenDocument', rtf: 'RTF' }

function Fallback({ name, kind, size, reason, onDownload, children }) {
  return (
    <div className="gob-pv-fallback">
      <Icon name={KIND_META[kind]?.[0] || 'file'} className="gob-pv-fallback-icon" />
      <strong>{name}</strong>
      <span className="gob-pv-muted">{[KIND_META[kind]?.[1], size != null && formatSize(size)].filter(Boolean).join(' · ')}</span>
      {children}
      <p className="gob-pv-muted mb-0">{reason}</p>
      {onDownload && <button type="button" className="btn btn-primary btn-sm" onClick={onDownload}><Icon name="download" /> Descargar archivo</button>}
    </div>
  )
}

function Table({ rows }) {
  const width = Math.max(0, ...rows.map((r) => r.length))
  return (
    <div className="gob-pv-table-wrap">
      <table className="gob-pv-table">
        <thead><tr><th className="gob-pv-rownum" />{Array.from({ length: width }, (_, i) => <th key={i}>{String.fromCharCode(65 + (i % 26)).repeat(Math.floor(i / 26) + 1)}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}><th className="gob-pv-rownum">{i + 1}</th>{Array.from({ length: width }, (_, j) => <td key={j}>{r[j] ?? ''}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

function DxfView({ model }) {
  const b = model.bounds
  if (!b) return <p className="gob-pv-muted p-3">El plano no contiene entidades 2D reconocibles (LINE, CIRCLE, ARC, LWPOLYLINE).</p>
  const w = b.maxX - b.minX || 1, h = b.maxY - b.minY || 1, pad = Math.max(w, h) * 0.04
  const sw = Math.max(w, h) / 600
  const Y = (y) => b.maxY - y // el eje Y del CAD crece hacia arriba
  const arc = (s) => {
    const a0 = (s.a0 * Math.PI) / 180, a1 = (s.a1 * Math.PI) / 180
    const x0 = s.cx + s.r * Math.cos(a0), y0 = s.cy + s.r * Math.sin(a0), x1 = s.cx + s.r * Math.cos(a1), y1 = s.cy + s.r * Math.sin(a1)
    const large = ((s.a1 - s.a0 + 360) % 360) > 180 ? 1 : 0
    return `M${x0} ${Y(y0)} A${s.r} ${s.r} 0 ${large} 0 ${x1} ${Y(y1)}`
  }
  return (
    <svg className="gob-pv-dxf" viewBox={`${b.minX - pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`} role="img" aria-label={`Plano con ${model.shapes.length} entidades`} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {model.shapes.map((s, i) => s.type === 'LINE' ? <line key={i} x1={s.x1} y1={Y(s.y1)} x2={s.x2} y2={Y(s.y2)} />
        : s.type === 'CIRCLE' ? <circle key={i} cx={s.cx} cy={Y(s.cy)} r={s.r} />
        : s.type === 'ARC' ? <path key={i} d={arc(s)} />
        : <polyline key={i} points={s.pts.map(([x, y]) => `${x},${Y(y)}`).join(' ') + (s.closed && s.pts.length ? ` ${s.pts[0][0]},${Y(s.pts[0][1])}` : '')} />)}
    </svg>
  )
}

/**
 * Vista previa de archivos. `file`: File | Blob | { url, name, type, size }.
 * Soporta imagen, PDF, video/audio, texto/código, CSV, Word (.docx), Excel (.xlsx), PowerPoint (.pptx) y planos DXF;
 * DWG y formatos Office antiguos muestran la información disponible y ofrecen la descarga.
 */
export default function FilePreview({ file, name: nameProp, height = '28rem', toolbar = true, onDownload, className = '' }) {
  const meta = useMemo(() => ({
    name: nameProp || file?.name || 'archivo', type: file?.type || '', size: file?.size ?? null, url: file?.url || null,
  }), [file, nameProp])
  const kind = previewKind(meta.name, meta.type)
  const [raw, setState] = useState({ status: 'loading' })
  // El estado pertenece a un archivo concreto: si cambió el archivo, aún se está cargando
  const state = raw.file === file && raw.kind === kind ? raw : { status: 'loading' }
  const [zoom, setZoom] = useState(1)
  const [tab, setTab] = useState(0)

  // URL del archivo (blob para File/Blob; la propia para {url})
  const objectUrl = useMemo(() => (file instanceof Blob ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }, [objectUrl])
  const src = objectUrl || meta.url

  useEffect(() => {
    let off = false
    setZoom(1); setTab(0)
    const set = (s) => { if (!off) setState({ ...s, file, kind }) }
    const getBuffer = async () => (file instanceof Blob ? file.arrayBuffer() : (await fetch(meta.url)).arrayBuffer())
    const getText = async () => (file instanceof Blob ? file.text() : (await fetch(meta.url)).text())
    ;(async () => {
      try {
        if (['image', 'pdf', 'video', 'audio'].includes(kind)) return set({ status: 'ready' })
        if (kind === 'text') { const t = await getText(); return set({ status: 'ready', text: t.length > 200000 ? t.slice(0, 200000) : t, cut: t.length > 200000 }) }
        if (kind === 'csv') { const t = await getText(); const rows = parseRows(t, ext(meta.name) === 'tsv' ? '\t' : undefined); return set({ status: 'ready', rows: rows.slice(0, 500), cut: rows.length > 500 }) }
        if (kind === 'docx') return set({ status: 'ready', ...(await parseDocx(await getBuffer())) })
        if (kind === 'xlsx') { const sheets = await parseXlsx(await getBuffer()); return set({ status: 'ready', sheets }) }
        if (kind === 'pptx') return set({ status: 'ready', slides: await parsePptx(await getBuffer()) })
        if (kind === 'dxf') return set({ status: 'ready', model: parseDxf(await getText()) })
        if (kind === 'dwg') return set({ status: 'ready', dwg: parseDwgHeader(await getBuffer()) })
        set({ status: 'ready' })
      } catch (e) {
        set({ status: 'error', message: e?.message || 'No se pudo leer el archivo' })
      }
    })()
    return () => { off = true }
  }, [file, kind, meta.name, meta.url])

  const download = onDownload || (() => { if (src) Object.assign(document.createElement('a'), { href: src, download: meta.name }).click() })
  const fb = (reason, extra) => <Fallback name={meta.name} kind={kind} size={meta.size} reason={reason} onDownload={download}>{extra}</Fallback>

  let body
  if (state.status === 'loading') body = <LoadingScreen title="Cargando vista previa" message={meta.name} minHeight="100%" />
  else if (state.status === 'error') body = fb(`No se pudo generar la vista previa: ${state.message}`)
  else if (kind === 'image') body = <div className="gob-pv-image"><img src={src} alt={meta.name} style={{ transform: `scale(${zoom})` }} draggable="false" /></div>
  else if (kind === 'pdf') body = <object className="gob-pv-frame" data={src} type="application/pdf" aria-label={meta.name}>{fb('Tu navegador no puede mostrar PDF integrados.')}</object>
  else if (kind === 'video') body = <div className="gob-pv-media"><video src={src} controls preload="metadata" /></div>
  else if (kind === 'audio') body = <div className="gob-pv-media"><audio src={src} controls preload="metadata" /></div>
  else if (kind === 'text') body = <pre className="gob-pv-text" tabIndex={0}>{state.text}{state.cut ? '\n… (archivo truncado)' : ''}</pre>
  else if (kind === 'csv') body = <Table rows={state.rows} />
  else if (kind === 'docx') body = <article className="gob-pv-doc" dangerouslySetInnerHTML={{ __html: state.html || '<p>(documento vacío)</p>' }} />
  else if (kind === 'xlsx') {
    const sheets = state.sheets || []
    const cur = sheets[Math.min(tab, sheets.length - 1)]
    body = !cur ? fb('La planilla no tiene hojas con datos.') : (
      <div className="gob-pv-sheets">
        <Table rows={cur.rows} />
        <div className="gob-pv-sheetbar" role="tablist" aria-label="Hojas">
          {sheets.map((s, i) => <button key={s.name + i} type="button" role="tab" aria-selected={i === tab} className={i === tab ? 'is-active' : ''} onClick={() => setTab(i)}>{s.name}</button>)}
          {cur.truncated && <span className="gob-pv-muted">Se muestran las primeras {cur.rows.length} filas</span>}
        </div>
      </div>
    )
  } else if (kind === 'pptx') {
    const slides = state.slides || []
    const s = slides[Math.min(tab, slides.length - 1)]
    body = !s ? fb('La presentación no contiene diapositivas legibles.') : (
      <div className="gob-pv-slides">
        <div className="gob-pv-slide-stage">
          <div className="gob-pv-slide" aria-live="polite">
            <h3>{s.title}</h3>
            <ul>{s.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
          </div>
        </div>
        <div className="gob-pv-slidebar">
          <button type="button" className="btn btn-sm btn-outline-primary" disabled={tab === 0} onClick={() => setTab(tab - 1)} aria-label="Diapositiva anterior"><Icon name="chevron-left" /></button>
          <span>Diapositiva {Math.min(tab, slides.length - 1) + 1} de {slides.length}</span>
          <button type="button" className="btn btn-sm btn-outline-primary" disabled={tab >= slides.length - 1} onClick={() => setTab(tab + 1)} aria-label="Diapositiva siguiente"><Icon name="chevron-right" /></button>
          <span className="gob-pv-muted ms-auto">Vista de contenido (texto)</span>
        </div>
      </div>
    )
  } else if (kind === 'dxf') body = <div className="gob-pv-cad"><DxfView model={state.model} /><span className="gob-pv-muted">{state.model.shapes.length} entidades 2D</span></div>
  else if (kind === 'dwg') {
    const d = state.dwg
    body = fb('DWG es un formato binario propietario: no se puede dibujar en el navegador. Abre el archivo en AutoCAD / DWG TrueView, o expórtalo a PDF o DXF para previsualizarlo aquí.',
      <dl className="gob-pv-dl"><dt>Versión</dt><dd>{d.version ? `${d.version} (${d.code})` : `No reconocida (${d.code || 'sin cabecera'})`}</dd></dl>)
  } else if (kind === 'legacy') body = fb(`El formato ${LEGACY_HINT[ext(meta.name)] || 'Office antiguo'} no se puede previsualizar en el navegador. Guárdalo como .docx / .xlsx / .pptx o PDF para verlo aquí.`)
  else body = fb('No hay vista previa disponible para este tipo de archivo.')

  return (
    <div className={`gob-pv ${className}`}>
      {toolbar && (
        <div className="gob-pv-bar">
          <Icon name={KIND_META[kind]?.[0] || 'file'} />
          <span className="gob-pv-name" title={meta.name}>{meta.name}</span>
          <span className="gob-pv-muted gob-pv-hide-sm">{[KIND_META[kind]?.[1], meta.size != null && formatSize(meta.size)].filter(Boolean).join(' · ')}</span>
          <span className="gob-pv-spacer" />
          {kind === 'image' && state.status === 'ready' && (
            <span className="gob-pv-zoom">
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))} aria-label="Alejar"><Icon name="zoom-out" /></button>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setZoom(1)} aria-label="Tamaño original">{Math.round(zoom * 100)}%</button>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))} aria-label="Acercar"><Icon name="zoom-in" /></button>
            </span>
          )}
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={download}><Icon name="download" /> <span className="gob-pv-hide-sm">Descargar</span></button>
        </div>
      )}
      <div className="gob-pv-body" style={{ height }}>{body}</div>
    </div>
  )
}

/** Vista previa dentro de un modal a pantalla casi completa. */
export function FilePreviewModal({ file, open, onClose, onDownload }) {
  return (
    <Modal open={open} onClose={onClose} size="xl" title="Vista previa" className="gob-pv-modal">
      {file && <FilePreview file={file} height="min(70vh, 40rem)" onDownload={onDownload} />}
    </Modal>
  )
}
