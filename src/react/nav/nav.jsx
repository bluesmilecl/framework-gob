import { useRef } from 'react'
import Icon from '../Icon.jsx'

/** Pestañas con roles ARIA y teclado (← → Inicio Fin). tabs: [{ id, label, icon, badge }] */
export function Tabs({ tabs, value, onChange, label = 'Secciones', children }) {
  const list = useRef(null)
  const onKey = (e) => {
    const i = tabs.findIndex((t) => t.id === value)
    const go = (n) => { const t = tabs[(n + tabs.length) % tabs.length]; onChange(t.id); requestAnimationFrame(() => list.current?.querySelector(`#tab-${t.id}`)?.focus()) }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1) } else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1) }
    else if (e.key === 'Home') { e.preventDefault(); go(0) } else if (e.key === 'End') { e.preventDefault(); go(tabs.length - 1) }
  }
  return (
    <>
      <div className="app-tabs" role="tablist" aria-label={label} ref={list} onKeyDown={onKey}>
        {tabs.map((t) => (
          <button key={t.id} id={`tab-${t.id}`} type="button" role="tab" aria-selected={t.id === value} aria-controls={`panel-${t.id}`} tabIndex={t.id === value ? 0 : -1} className={t.id === value ? 'is-active' : ''} onClick={() => onChange(t.id)}>
            {t.icon && <Icon name={t.icon} />}{t.label}{t.badge != null && <span className="app-nav-badge">{t.badge}</span>}
          </button>
        ))}
      </div>
      {children && <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} tabIndex={0} className="app-tabpanel">{children}</div>}
    </>
  )
}

/** Indicador de pasos. steps: ['Tipo', 'Datos', …]; current: índice (0..n-1). */
export function Stepper({ steps, current, onStepClick }) {
  return (
    <ol className="app-stepper" aria-label="Progreso">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo'
        const label = typeof s === 'string' ? s : s.label
        return (
          <li key={label} className={`is-${state}`} aria-current={state === 'current' ? 'step' : undefined}>
            <button type="button" disabled={!onStepClick || i > current} onClick={() => onStepClick?.(i)}>
              <span className="app-step-dot">{state === 'done' ? <Icon name="check" /> : i + 1}</span>
              <span className="app-step-label">{label}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}

/** Migas de pan con las clases del framework. items: [{ label, to?, href? }]; el último es la página actual. `as` = componente de enlace (p. ej. Link de react-router). */
export function Breadcrumbs({ items, as: LinkAs = 'a' }) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="breadcrumb">
        {items.map((it, i) => (i === items.length - 1
          ? <li key={i} className="breadcrumb-item active" aria-current="page">{it.label}</li>
          : <li key={i} className="breadcrumb-item">{LinkAs === 'a' ? <a href={it.href || '#'}>{it.label}</a> : <LinkAs to={it.to}>{it.label}</LinkAs>}</li>))}
      </ol>
    </nav>
  )
}
