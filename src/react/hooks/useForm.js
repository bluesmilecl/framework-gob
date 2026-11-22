import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * Estado de formulario con validación, "tocado", envío asíncrono y detección de cambios.
 *   const f = useForm({ initial, validate: (v) => ({ campo: 'mensaje' }), onSubmit: async (v) => {} })
 *   <TextField label="Correo" {...f.bind('email')} />      <form onSubmit={f.handleSubmit}>
 */
export default function useForm({ initial, validate, onSubmit }) {
  const base = useRef(initial)
  const [values, setValues] = useState(initial)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const validateRef = useRef(validate)
  validateRef.current = validate
  const errors = useMemo(() => validateRef.current?.(values) ?? {}, [values])

  const setValue = useCallback((name, value) => setValues((v) => ({ ...v, [name]: value })), [])
  const errorOf = (name) => ((touched[name] || submitted) ? errors[name] : undefined)

  const bind = (name) => ({
    name,
    value: values[name] ?? '',
    error: errorOf(name),
    onChange: (e) => setValue(name, e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e),
    onBlur: () => setTouched((t) => (t[name] ? t : { ...t, [name]: true })),
  })
  const touch = useCallback((names) => setTouched((t) => ({ ...t, ...Object.fromEntries(names.map((n) => [n, true])) })), [])
  const bindCheck = (name) => ({ ...bind(name), value: undefined, checked: Boolean(values[name]) })

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    setSubmitted(true); setSubmitError('')
    if (Object.keys(errors).length) {
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus())
      return false
    }
    setSubmitting(true)
    try { await onSubmit?.(values); return true } catch (err) { setSubmitError(err?.message || 'No se pudo completar la acción.'); return false } finally { setSubmitting(false) }
  }

  const reset = useCallback((next = base.current) => { base.current = next; setValues(next); setTouched({}); setSubmitted(false); setSubmitError('') }, [])
  const dirty = JSON.stringify(values) !== JSON.stringify(base.current)
  useEffect(() => { base.current = base.current }, [])

  return { values, errors, dirty, submitting, submitError, setSubmitError, setValue, setValues, touch, bind, bindCheck, handleSubmit, reset, valid: !Object.keys(errors).length }
}
