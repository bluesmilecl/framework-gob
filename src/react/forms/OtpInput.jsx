import { useEffect, useRef } from 'react'

/** Código de un solo uso: una casilla por dígito, avance automático, borrar con retroceso, flechas y pegado. */
export default function OtpInput({ length = 6, value = '', onChange, onComplete, error, label = 'Código de verificación', autoFocus = true, disabled }) {
  const refs = useRef([])
  const chars = Array.from({ length }, (_, i) => value[i] ?? '')
  // Al terminar de verificar (o tras un error) el foco vuelve a la primera casilla vacía
  useEffect(() => { if (!disabled && !value && (error || document.activeElement === document.body)) refs.current[0]?.focus() }, [disabled, error]) // eslint-disable-line react-hooks/exhaustive-deps
  const set = (next) => { const v = next.replace(/\D/g, '').slice(0, length); onChange?.(v); if (v.length === length) onComplete?.(v) }
  const focus = (i) => refs.current[Math.max(0, Math.min(length - 1, i))]?.focus()

  const onInput = (i, e) => {
    const d = e.target.value.replace(/\D/g, '')
    if (!d) return
    const next = chars.slice(); d.split('').forEach((c, k) => { if (i + k < length) next[i + k] = c })
    set(next.join('')); focus(i + d.length)
  }
  const onKey = (i, e) => {
    if (e.key === 'Backspace') { e.preventDefault(); const next = chars.slice(); if (next[i]) next[i] = ''; else { next[Math.max(0, i - 1)] = ''; focus(i - 1) } onChange?.(next.join('')) }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focus(i - 1) } else if (e.key === 'ArrowRight') { e.preventDefault(); focus(i + 1) }
  }
  return (
    <div className="app-field">
      <div className="label" id="otp-label" style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.35rem' }}>{label}</div>
      <div className="app-otp" role="group" aria-labelledby="otp-label" onPaste={(e) => { e.preventDefault(); set(e.clipboardData.getData('text')); focus(length) }}>
        {chars.map((c, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el }} className={`form-control ${error ? 'is-invalid' : ''}`} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'} maxLength={length} value={c} disabled={disabled}
            aria-label={`Dígito ${i + 1} de ${length}`} aria-invalid={error ? 'true' : undefined} autoFocus={autoFocus && i === 0} onChange={(e) => onInput(i, e)} onKeyDown={(e) => onKey(i, e)} onFocus={(e) => e.target.select()} />
        ))}
      </div>
      {error && <div className="invalid-feedback d-block" role="alert">{error}</div>}
    </div>
  )
}
