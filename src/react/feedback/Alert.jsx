import Icon from '../Icon.jsx'

const ICONS = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'triangle-alert' }

/** Mensaje contextual (usa las clases .alert del framework). */
export default function Alert({ tone = 'info', title, children, onClose, className = '' }) {
  return (
    <div className={`alert alert-${tone} ${onClose ? 'alert-dismissible' : ''} ${className}`} role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}>
      <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'flex-start' }}>
        <Icon name={ICONS[tone]} style={{ marginTop: 3, flex: 'none' }} />
        <div style={{ minWidth: 0 }}>{title && <strong className="d-block">{title}</strong>}{children}</div>
      </div>
      {onClose && <button type="button" className="close" aria-label="Cerrar" onClick={onClose}>&times;</button>}
    </div>
  )
}
