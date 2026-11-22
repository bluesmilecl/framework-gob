import { useId } from 'react'

/** Envoltorio etiqueta + control + ayuda + error (accesible: aria-describedby / aria-invalid se aplican con `fieldProps`). */
export function Field({ id, label, hint, error, required, children, className = '' }) {
  return (
    <div className={`app-field ${className}`}>
      {label && <label htmlFor={id}>{label}{required && <span className="req" aria-hidden="true"> *</span>}</label>}
      {children}
      {error ? <div className="invalid-feedback d-block" id={`${id}-err`} role="alert">{error}</div> : hint ? <span className="hint" id={`${id}-hint`}>{hint}</span> : null}
    </div>
  )
}

/** Props de accesibilidad para el control interno. */
export const fieldProps = (id, error, hint) => ({
  id, 'aria-invalid': error ? 'true' : undefined,
  'aria-describedby': error ? `${id}-err` : hint ? `${id}-hint` : undefined,
})

export const useFieldId = (id) => { const auto = useId(); return id || auto }
