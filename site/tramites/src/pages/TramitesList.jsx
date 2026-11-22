import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, DataTable, EmptyState, FilterBar, Icon, PageHeader, Panel, StatusBadge, downloadFile, toCsv, useModal, useToast } from 'gob-cl-tailwind/react'
import { useData } from '../lib/store.jsx'
import { ESTADOS, PRIORIDADES, TIPOS, estadoOf, fmtDate, tipoOf } from '../lib/catalog.js'

const PRIO_TONE = { alta: 'danger', media: 'warn', baja: 'off' }

export default function TramitesList() {
  const { tramites, loading, dispatch } = useData()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [estado, setEstado] = useState('')
  const [tipo, setTipo] = useState('')
  const [prioridad, setPrioridad] = useState('')

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return tramites.filter((t) => (!estado || t.estado === estado) && (!tipo || t.tipo === tipo) && (!prioridad || t.prioridad === prioridad)
      && (!s || t.id.toLowerCase().includes(s) || t.solicitante.nombre.toLowerCase().includes(s) || t.solicitante.run.includes(s)))
  }, [tramites, q, estado, tipo, prioridad])

  const clear = () => { setQ(''); setEstado(''); setTipo(''); setPrioridad('') }
  const exportCsv = (list) => {
    downloadFile('tramites.csv', toCsv(list, [{ key: 'id', label: 'Folio' }, { label: 'Trámite', get: (r) => tipoOf(r.tipo).label }, { label: 'Solicitante', get: (r) => r.solicitante.nombre }, { label: 'RUN', get: (r) => r.solicitante.run }, { label: 'Estado', get: (r) => estadoOf(r.estado).label }, { key: 'prioridad', label: 'Prioridad' }, { label: 'Ingreso', get: (r) => r.creado.slice(0, 10) }]))
    toast(`${list.length} trámite(s) exportados`, 'ok')
  }
  const remove = async (list, done) => {
    const ok = await modal.confirm({ title: list.length > 1 ? `Eliminar ${list.length} trámites` : 'Eliminar trámite', tone: 'danger', text: list.length > 1 ? 'Se eliminarán los trámites seleccionados.' : `Se eliminará el trámite ${list[0].id}.`, confirmLabel: 'Eliminar' })
    if (!ok) return
    const ids = list.map((t) => t.id)
    dispatch({ type: 'tramite/remove', ids }); done?.()
    toast(`${ids.length} trámite(s) eliminados`, { action: { label: 'Deshacer', onClick: () => dispatch({ type: 'tramite/restore', items: list }) } })
  }
  const changeStatus = async (list, value, done) => {
    const label = estadoOf(value).label
    const note = await modal.prompt({ title: `Cambiar a «${label}»`, text: `Se aplicará a ${list.length} trámite(s).`, label: 'Observación (opcional)', multiline: true, confirmLabel: 'Aplicar', icon: 'pencil', initial: '' })
    if (note === null) return
    dispatch({ type: 'tramite/status', ids: list.map((t) => t.id), estado: value, note: note.trim() }); done?.()
    toast(`Estado actualizado a «${label}»`, 'ok')
  }
  const statusItems = (list, done) => ESTADOS.map((e) => ({ label: e.label, onSelect: () => changeStatus(list, e.value, done) }))

  return (
    <div className="app-container is-wide">
      <PageHeader title="Trámites" description="Revisa, filtra y gestiona las solicitudes ingresadas."
        actions={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={() => exportCsv(rows)} disabled={!rows.length}><Icon name="download" />Exportar CSV</button><Link className="btn btn-primary btn-compact" to="/tramites/nuevo"><Icon name="plus" />Nuevo trámite</Link></>} />
      <Panel flush>
        <DataTable
          loading={loading} rows={rows} selectable caption="Listado de trámites" noun={['trámite', 'trámites']} defaultSort={{ key: 'creado', dir: 'desc' }}
          onRowClick={(r) => nav(`/tramites/${r.id}`)}
          toolbar={<FilterBar search={q} onSearch={setQ} searchPlaceholder="Buscar por folio, nombre o RUN…" onClear={clear}
            filters={[{ name: 'estado', label: 'Estado', value: estado, onChange: setEstado, options: ESTADOS }, { name: 'tipo', label: 'Trámite', value: tipo, onChange: setTipo, options: TIPOS.map((t) => ({ value: t.id, label: t.label })) }, { name: 'prio', label: 'Prioridad', value: prioridad, onChange: setPrioridad, options: PRIORIDADES }]} />}
          columns={[
            { key: 'id', header: 'Folio', sortable: true, render: (r) => <strong className="text-nowrap">{r.id}</strong> },
            { key: 'tipo', header: 'Trámite', sortable: true, sortValue: (r) => tipoOf(r.tipo).label, render: (r) => tipoOf(r.tipo).label, hideBelow: 'md' },
            { key: 'sol', header: 'Solicitante', sortable: true, sortValue: (r) => r.solicitante.nombre, render: (r) => <span className="app-person"><Avatar name={r.solicitante.nombre} size="sm" /><span><strong>{r.solicitante.nombre}</strong><small>{r.solicitante.run}</small></span></span> },
            { key: 'estado', header: 'Estado', sortable: true, render: (r) => <StatusBadge tone={estadoOf(r.estado).tone}>{estadoOf(r.estado).label}</StatusBadge> },
            { key: 'prioridad', header: 'Prioridad', sortable: true, sortValue: (r) => ({ alta: 0, media: 1, baja: 2 }[r.prioridad]), render: (r) => <StatusBadge tone={PRIO_TONE[r.prioridad]}>{r.prioridad[0].toUpperCase() + r.prioridad.slice(1)}</StatusBadge>, hideBelow: 'sm' },
            { key: 'creado', header: 'Ingreso', sortable: true, render: (r) => <span className="text-nowrap">{fmtDate(r.creado)}</span>, hideBelow: 'md' },
            { key: 'asignado', header: 'Asignado a', sortable: true, render: (r) => r.asignado || <span className="text-gray-b">Sin asignar</span>, hideBelow: 'md' },
          ]}
          bulkActions={(sel, done) => (
            <>
              <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => exportCsv(sel)}><Icon name="download" />Exportar</button>
              <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => changeStatus(sel, 'en-revision', done)}><Icon name="clock" />Enviar a revisión</button>
              <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => remove(sel, done)}><Icon name="trash-2" />Eliminar</button>
            </>
          )}
          rowActions={(r) => [
            { label: 'Ver detalle', icon: 'eye', onSelect: () => nav(`/tramites/${r.id}`) },
            { header: 'Cambiar estado' }, ...statusItems([r]).map((i) => ({ ...i, icon: 'rotate-ccw' })),
            { separator: true }, { label: 'Eliminar', icon: 'trash-2', danger: true, onSelect: () => remove([r]) },
          ]}
          empty={<EmptyState icon="file-text" title="No hay trámites que coincidan" action={<button type="button" className="btn btn-outline-primary btn-compact" onClick={clear}>Limpiar filtros</button>}>Prueba con otros filtros o crea un nuevo trámite.</EmptyState>}
        />
      </Panel>
    </div>
  )
}
