// Indicadores de carga con los componentes oficiales de gob.cl (spinner-border / spinner-grow / progress)

/** Spinner oficial. variant: border | grow. Accesible: role=status con texto oculto. */
export function Spinner({ size = 'md', variant = 'border', tone = 'primary', label = 'Cargando…', className = '' }) {
  const sm = size === 'sm' ? ` spinner-${variant}-sm` : ''
  const big = size === 'lg' ? { width: '3rem', height: '3rem', borderWidth: variant === 'border' ? '.3em' : undefined } : undefined
  return (
    <span className={`spinner-${variant}${sm}${tone ? ` text-${tone}` : ''} ${className}`} style={big} role="status">
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Mensaje de carga en línea: spinner + texto. */
export function Loading({ children = 'Cargando…', size = 'sm', className = '' }) {
  return (
    <span className={`gob-loading ${className}`} role="status" aria-live="polite">
      <Spinner size={size} label="" />
      <span>{children}</span>
    </span>
  )
}

/** Pantalla/bloque de carga centrado, para vistas completas o paneles. */
export function LoadingScreen({ title = 'Cargando', message = 'Un momento, por favor.', minHeight = '16rem', className = '' }) {
  return (
    <div className={`gob-loading-screen ${className}`} style={{ minHeight }} role="status" aria-live="polite">
      <Spinner size="lg" label="" />
      <strong>{title}</strong>
      {message && <span>{message}</span>}
    </div>
  )
}

/** Capa translúcida sobre un contenedor mientras `active`. El contenedor recibe aria-busy. */
export function LoadingOverlay({ active, label = 'Cargando…', children, className = '' }) {
  return (
    <div className={`gob-overlay-wrap ${className}`} aria-busy={active}>
      {children}
      {active && (
        <div className="gob-overlay" role="status" aria-live="polite">
          <Spinner label="" />
          <span>{label}</span>
        </div>
      )}
    </div>
  )
}

/** Barra de progreso oficial. value 0–100; sin value = indeterminada (rayada animada). */
export function ProgressBar({ value, label, tone = '', striped = false, height, className = '' }) {
  const indeterminate = value == null
  const v = indeterminate ? 100 : Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div className={className}>
      {label && <div className="gob-progress-label"><span>{label}</span>{!indeterminate && <span>{v}%</span>}</div>}
      <div className="progress" style={height ? { height } : undefined} role="progressbar" aria-label={label || 'Progreso'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={indeterminate ? undefined : v}>
        <div className={`progress-bar${tone ? ` bg-${tone}` : ''}${striped || indeterminate ? ' progress-bar-striped progress-bar-animated' : ''}`} style={{ width: `${v}%` }} />
      </div>
    </div>
  )
}

/** Líneas de texto «esqueleto» para contenido que aún no llega. */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`gob-skeleton-text ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => <span key={i} className="app-skeleton" style={{ width: i === lines - 1 ? '60%' : '100%' }} />)}
    </div>
  )
}

/** Tarjeta esqueleto (avatar + líneas). */
export function SkeletonCard({ className = '' }) {
  return (
    <div className={`gob-skeleton-card ${className}`} aria-hidden="true">
      <span className="app-skeleton gob-skeleton-avatar" />
      <SkeletonText lines={3} />
    </div>
  )
}
