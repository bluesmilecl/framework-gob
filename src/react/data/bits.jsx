import Icon from '../Icon.jsx'

const TONES = { ok: 'is-ok', off: 'is-off', warn: 'is-warn', danger: 'is-danger', info: '' }

/** Etiqueta de estado con punto de color. tone: ok | warn | danger | off | info */
export function StatusBadge({ tone = 'info', children }) { return <span className={`app-status ${TONES[tone] ?? ''}`}>{children}</span> }

/** Avatar con iniciales (o imagen). size: sm | md | lg */
export function Avatar({ name = '', src, size = 'md', alt = false }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase() || '?'
  return src
    ? <img className={`app-avatar ${size === 'lg' ? 'is-lg' : size === 'sm' ? 'is-sm' : ''}`} src={src} alt={name} style={{ objectFit: 'cover' }} />
    : <span className={`app-avatar ${size === 'lg' ? 'is-lg' : size === 'sm' ? 'is-sm' : ''} ${alt ? 'is-alt' : ''}`} aria-hidden="true">{initials}</span>
}

export function EmptyState({ icon = 'inbox', title, children, action }) {
  return (
    <div className="app-empty">
      <Icon name={icon} />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}

export function Skeleton({ width = '100%', height }) { return <span className="app-skeleton" style={{ width, height }} aria-hidden="true" /> }
