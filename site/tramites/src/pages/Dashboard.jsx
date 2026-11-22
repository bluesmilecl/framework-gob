import { Link, useNavigate } from 'react-router-dom'
import { Avatar, DataTable, Icon, PageHeader, Panel, StatCard, StatusBadge } from 'gob-cl-tailwind/react'
import { useData } from '../lib/store.jsx'
import { estadoOf, fmtDate, fmtDateTime, tipoOf } from '../lib/catalog.js'

export default function Dashboard() {
  const { tramites, loading } = useData()
  const nav = useNavigate()
  const by = (e) => tramites.filter((t) => t.estado === e).length
  const weeks = Array.from({ length: 12 }, (_, i) => tramites.filter((t) => { const d = (Date.now() - new Date(t.creado)) / 864e5; return d >= (11 - i) * 7 && d < (12 - i) * 7 }).length)
  const max = Math.max(1, ...weeks)
  const recent = [...tramites].sort((a, b) => new Date(b.creado) - new Date(a.creado)).slice(0, 5)
  const activity = tramites.flatMap((t) => t.timeline.map((x) => ({ ...x, id: t.id }))).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6)

  return (
    <div className="app-container">
      <PageHeader title="Panel" description="Resumen de la actividad de trámites." actions={<Link className="btn btn-primary btn-compact" to="/tramites/nuevo"><Icon name="plus" />Nuevo trámite</Link>} />
      <div className="app-grid cols-4 mb-4">
        <StatCard icon="file-text" label="Trámites totales" value={loading ? '…' : tramites.length} delta="+8 esta semana" />
        <StatCard icon="clock" label="En revisión" value={loading ? '…' : by('en-revision')} delta="Atención prioritaria" />
        <StatCard icon="triangle-alert" label="Observados" value={loading ? '…' : by('observado')} delta="Esperan documentos" down />
        <StatCard icon="circle-check" label="Aprobados" value={loading ? '…' : by('aprobado')} delta="Tiempo promedio: 6 días" />
      </div>
      <div className="row">
        <div className="col-lg-7 mb-4">
          <Panel title="Ingresos por semana" actions={<small className="text-gray-b">Últimas 12 semanas</small>}>
            <div className="app-bars" role="img" aria-label={`Ingresos por semana: ${weeks.join(', ')}`}>{weeks.map((n, i) => <div key={i} style={{ height: `${Math.max(4, (n / max) * 100)}%` }} title={`${n} trámites`} />)}</div>
            <div className="app-bars-axis" aria-hidden="true">{weeks.map((_, i) => <span key={i}>S{i + 1}</span>)}</div>
          </Panel>
        </div>
        <div className="col-lg-5 mb-4">
          <Panel title="Actividad reciente">
            <ul className="app-timeline">{activity.map((a, i) => <li key={i}><Link to={`/tramites/${a.id}`}>{a.id}</Link> · {a.text}<small>{a.by} · {fmtDateTime(a.at)}</small></li>)}</ul>
          </Panel>
        </div>
      </div>
      <Panel title="Últimos trámites ingresados" flush actions={<Link to="/tramites" className="btn btn-link btn-compact btn-sm">Ver todos</Link>}>
        <DataTable loading={loading} rows={recent} pageSizes={[5]} defaultPageSize={5} caption="Últimos trámites" onRowClick={(r) => nav(`/tramites/${r.id}`)}
          columns={[
            { key: 'id', header: 'Folio', render: (r) => <strong className="text-nowrap">{r.id}</strong> },
            { key: 'tipo', header: 'Trámite', render: (r) => tipoOf(r.tipo).label, hideBelow: 'sm' },
            { key: 'sol', header: 'Solicitante', render: (r) => <span className="app-person"><Avatar name={r.solicitante.nombre} size="sm" /><span><strong>{r.solicitante.nombre}</strong></span></span> },
            { key: 'estado', header: 'Estado', render: (r) => <StatusBadge tone={estadoOf(r.estado).tone}>{estadoOf(r.estado).label}</StatusBadge> },
            { key: 'creado', header: 'Ingreso', render: (r) => <span className="text-nowrap">{fmtDate(r.creado)}</span>, hideBelow: 'md' },
          ]} />
      </Panel>
    </div>
  )
}
