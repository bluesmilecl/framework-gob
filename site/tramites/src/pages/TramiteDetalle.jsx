import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Avatar, DropdownMenu, EmptyState, FileUpload, Icon, PageHeader, Panel, StatusBadge, Tabs, TextareaField, downloadFile, formatSize, useModal, useToast } from 'gob-cl-tailwind/react'
import { useData } from '../lib/store.jsx'
import { ESTADOS, estadoOf, fmtDate, fmtDateTime, tipoOf } from '../lib/catalog.js'
import { useAuth } from '../lib/auth.jsx'

export default function TramiteDetalle() {
  const { id } = useParams()
  const { tramites, dispatch } = useData()
  const { user } = useAuth()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const [tab, setTab] = useState('resumen')
  const [comment, setComment] = useState('')
  const t = tramites.find((x) => x.id === id)

  if (!t) return <div className="app-container"><EmptyState icon="file-text" title="Trámite no encontrado" action={<Link className="btn btn-primary btn-compact" to="/tramites">Volver al listado</Link>}>El folio {id} no existe o fue eliminado.</EmptyState></div>

  const tipo = tipoOf(t.tipo)
  const estado = estadoOf(t.estado)
  const changeStatus = async (value) => {
    const note = await modal.prompt({ title: `Cambiar a «${estadoOf(value).label}»`, label: 'Observación (opcional)', multiline: true, confirmLabel: 'Aplicar', icon: 'pencil', initial: '' })
    if (note === null) return
    dispatch({ type: 'tramite/status', ids: [t.id], estado: value, note: note.trim() })
    toast(`Estado actualizado a «${estadoOf(value).label}»`, 'ok')
  }
  const remove = async () => {
    if (!await modal.confirm({ title: 'Eliminar trámite', tone: 'danger', text: `Se eliminará el trámite ${t.id} de forma permanente.`, confirmLabel: 'Eliminar', requireText: t.id })) return
    dispatch({ type: 'tramite/remove', ids: [t.id] }); nav('/tramites')
    toast('Trámite eliminado', { action: { label: 'Deshacer', onClick: () => dispatch({ type: 'tramite/restore', items: [t] }) } })
  }
  const addComment = () => {
    if (!comment.trim()) return
    dispatch({ type: 'tramite/comment', id: t.id, comment: { at: new Date().toISOString(), by: user.name, text: comment.trim() } })
    setComment(''); toast('Comentario agregado', 'ok')
  }
  const receipt = () => downloadFile(`comprobante-${t.id}.txt`, `COMPROBANTE ${t.id}\n${tipo.label}\n${t.solicitante.nombre} (${t.solicitante.run})\nEstado: ${estado.label}\nIngreso: ${fmtDate(t.creado)}\n`, 'text/plain')

  return (
    <div className="app-container">
      <PageHeader breadcrumbs={[{ label: 'Trámites', to: '/tramites' }, { label: t.id }]} breadcrumbAs={Link}
        title={<>{t.id} <StatusBadge tone={estado.tone}>{estado.label}</StatusBadge></>} description={`${tipo.label} · ingresado el ${fmtDate(t.creado)}`}
        actions={<>
          <button type="button" className="btn btn-outline-primary btn-compact" onClick={receipt}><Icon name="download" />Comprobante</button>
          <DropdownMenu label="Acciones del trámite" width="14rem" trigger={(p) => <button type="button" className="btn btn-primary btn-compact" {...p}><Icon name="ellipsis" />Acciones</button>}
            items={[{ header: 'Cambiar estado' }, ...ESTADOS.map((e) => ({ label: e.label, icon: 'rotate-ccw', checked: e.value === t.estado, onSelect: () => changeStatus(e.value) })), { separator: true }, { label: 'Eliminar trámite', icon: 'trash-2', danger: true, onSelect: remove }]} />
        </>} />

      {t.estado === 'observado' && <Alert tone="warning" title="Este trámite tiene observaciones">El solicitante debe adjuntar documentación adicional para continuar. Revisa la línea de tiempo.</Alert>}

      <Tabs value={tab} onChange={setTab} label="Secciones del trámite" tabs={[{ id: 'resumen', label: 'Resumen', icon: 'file-text' }, { id: 'documentos', label: 'Documentos', icon: 'paperclip', badge: t.docs.length }, { id: 'comentarios', label: 'Comentarios', icon: 'message-square-text', badge: t.comentarios.length }]}>
        {tab === 'resumen' && (
          <div className="row">
            <div className="col-lg-7 mb-4">
              <Panel title="Datos de la solicitud">
                <dl className="app-summary">
                  <div><dt>Solicitante</dt><dd><span className="app-person"><Avatar name={t.solicitante.nombre} /><span><strong>{t.solicitante.nombre}</strong><small>{t.solicitante.run}</small></span></span></dd></div>
                  <div><dt>Correo</dt><dd>{t.solicitante.email}</dd></div>
                  <div><dt>Trámite</dt><dd>{tipo.label}<small>Plazo estimado: {tipo.plazo}</small></dd></div>
                  <div><dt>Prioridad</dt><dd style={{ textTransform: 'capitalize' }}>{t.prioridad}</dd></div>
                  <div><dt>Asignado a</dt><dd>{t.asignado || <span className="text-gray-b">Sin asignar</span>}</dd></div>
                </dl>
              </Panel>
            </div>
            <div className="col-lg-5 mb-4">
              <Panel title="Línea de tiempo"><ul className="app-timeline">{[...t.timeline].reverse().map((x, i) => <li key={i}>{x.text}<small>{x.by} · {fmtDateTime(x.at)}</small></li>)}</ul></Panel>
            </div>
          </div>
        )}
        {tab === 'documentos' && (
          <>
            <Panel title="Documentos adjuntos" flush>
              <ul className="app-list" style={{ padding: '0 1.25rem' }}>
                {t.docs.map((d, i) => (
                  <li key={i}>
                    <span className="app-file-icon"><Icon name="file-text" /></span>
                    <div className="grow"><strong>{d.label || d.name}</strong><small>{d.name} · {formatSize(d.size)}</small></div>
                    <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => toast(`Descarga simulada de ${d.name}`)}><Icon name="download" />Descargar</button>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Agregar documentos" className="mt-3">
              <FileUpload maxFiles={3} accept="application/pdf,image/*" hint="Se agregarán al expediente cuando termine la carga." onChange={(items) => {
                const done = items.filter((x) => x.status === 'done' && !t.docs.some((d) => d.name === x.name))
                if (done.length) { dispatch({ type: 'tramite/update', id: t.id, patch: { docs: [...t.docs, ...done.map((x) => ({ label: 'Documento adicional', name: x.name, size: x.size }))] } }); toast(`${done.length} documento(s) agregado(s)`, 'ok') }
              }} />
            </Panel>
          </>
        )}
        {tab === 'comentarios' && (
          <div className="row">
            <div className="col-lg-7 mb-4">
              <Panel title="Comentarios internos" flush>
                {t.comentarios.length === 0 ? <EmptyState icon="message-square-text" title="Aún no hay comentarios">Deja una nota para el equipo que revisa este trámite.</EmptyState>
                  : <ul className="app-list" style={{ padding: '0 1.25rem' }}>{t.comentarios.map((c, i) => <li key={i} style={{ alignItems: 'flex-start' }}><Avatar name={c.by} size="sm" /><div className="grow"><strong>{c.by}</strong><small>{fmtDateTime(c.at)}</small><p className="mb-0 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{c.text}</p></div></li>)}</ul>}
              </Panel>
            </div>
            <div className="col-lg-5 mb-4">
              <Panel title="Nuevo comentario"><TextareaField label="Comentario" rows={4} maxLength={500} value={comment} onChange={(e) => setComment(e.target.value)} /><button type="button" className="btn btn-primary btn-compact" disabled={!comment.trim()} onClick={addComment}>Publicar comentario</button></Panel>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  )
}
