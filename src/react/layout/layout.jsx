import Icon from '../Icon.jsx'
import { Breadcrumbs } from '../nav/nav.jsx'

/** Contenedor con ancho controlado: fixed (1140) | wide | narrow (760) | fluid. */
export function Container({ size = 'fixed', as: Tag = 'div', className = '', ...rest }) {
  return <Tag className={`app-container ${size === 'fixed' ? '' : `is-${size}`} ${className}`} {...rest} />
}

/** Encabezado de página: título con línea institucional, descripción y acciones. */
export function PageHeader({ title, description, actions, breadcrumbs, breadcrumbAs }) {
  return (
    <>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} as={breadcrumbAs} />}
      <div className="app-page-head">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {actions && <div className="app-page-actions">{actions}</div>}
      </div>
    </>
  )
}

/** Panel con encabezado, cuerpo y pie opcionales. `flush` quita el relleno del cuerpo (tablas). */
export function Panel({ title, actions, footer, flush = false, danger = false, children, className = '', id }) {
  return (
    <section id={id} className={`app-panel ${danger ? 'app-danger-zone' : ''} ${className}`}>
      {(title || actions) && <div className="app-panel-head"><h2>{title}</h2>{actions && <div className="app-page-actions">{actions}</div>}</div>}
      <div className={flush ? '' : 'app-panel-body'}>{children}</div>
      {footer && <div className="app-panel-foot">{footer}</div>}
    </section>
  )
}

/** Indicador numérico: <StatCard label="Trámites" value="128" delta="+12 %" icon="file-text" /> */
export function StatCard({ label, value, delta, down = false, icon }) {
  return (
    <div className="app-stat">
      <p className="app-stat-label">{icon && <Icon name={icon} />}{label}</p>
      <p className="app-stat-value">{value}</p>
      {delta && <p className={`app-stat-delta ${down ? 'is-down' : ''}`}>{delta}</p>}
    </div>
  )
}
