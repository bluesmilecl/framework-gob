import { useState } from 'react'
import { Field, fieldProps, useFieldId } from './Field.jsx'
import Icon from '../Icon.jsx'
import { formatRun, passwordChecks, passwordScore, STRENGTH_LABELS } from './validators.js'

const cls = (error, extra = '') => `form-control ${error ? 'is-invalid' : ''} ${extra}`

/** Campo de texto con etiqueta, ayuda y error. Acepta cualquier prop de <input>. */
export function TextField({ label, hint, error, required, id, className = '', fieldClass = '', ...input }) {
  const fid = useFieldId(id)
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required} className={fieldClass}>
      <input className={cls(error, className)} required={false} {...fieldProps(fid, error, hint)} {...input} />
    </Field>
  )
}

export function TextareaField({ label, hint, error, required, id, maxLength, value = '', className = '', fieldClass = '', rows = 4, ...rest }) {
  const fid = useFieldId(id)
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required} className={fieldClass}>
      <textarea className={cls(error, className)} rows={rows} maxLength={maxLength} value={value} {...fieldProps(fid, error, hint)} {...rest} />
      {maxLength && <span className="hint" style={{ textAlign: 'right' }}>{String(value).length}/{maxLength}</span>}
    </Field>
  )
}

/** options: [{ value, label }] o ['texto'] */
export function SelectField({ label, hint, error, required, id, options = [], placeholder, className = '', fieldClass = '', ...rest }) {
  const fid = useFieldId(id)
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required} className={fieldClass}>
      <select className={cls(error, className)} {...fieldProps(fid, error, hint)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => { const v = typeof o === 'string' ? { value: o, label: o } : o; return <option key={v.value} value={v.value}>{v.label}</option> })}
      </select>
    </Field>
  )
}

export function DateField(props) { return <TextField type="date" {...props} /> }

/** RUN chileno: limpia caracteres no válidos y da formato 12.345.678-5 al salir del campo. Valida con `validRun` en tu `validate`. */
export function RunField({ label = 'RUN', onChange, onBlur, value = '', hint = 'Ej: 12.345.678-5', ...rest }) {
  return (
    <TextField label={label} value={value} autoComplete="off" placeholder="12.345.678-5" hint={hint}
      onChange={(e) => onChange?.({ target: { type: 'text', value: e.target.value.replace(/[^0-9kK.\-]/g, '') } })}
      onBlur={(e) => { onChange?.({ target: { type: 'text', value: formatRun(e.target.value) } }); onBlur?.(e) }}
      {...rest} />
  )
}

/** Clave con botón mostrar/ocultar y medidor de fortaleza opcional. */
export function PasswordField({ label = 'Clave', hint, error, required, id, strength = false, value = '', className = '', fieldClass = '', ...rest }) {
  const fid = useFieldId(id)
  const [show, setShow] = useState(false)
  const score = passwordScore(value)
  return (
    <Field id={fid} label={label} hint={hint} error={error} required={required} className={fieldClass}>
      <div style={{ position: 'relative' }}>
        <input className={cls(error, className)} type={show ? 'text' : 'password'} value={value} autoComplete="current-password" style={{ paddingRight: '3rem' }} {...fieldProps(fid, error, hint)} {...rest} />
        <button type="button" className="app-iconbtn" style={{ position: 'absolute', top: 0, right: 0, height: '100%' }} aria-label={show ? 'Ocultar clave' : 'Mostrar clave'} aria-pressed={show} onClick={() => setShow((v) => !v)}><Icon name={show ? 'eye-off' : 'eye'} /></button>
      </div>
      {strength && value && (
        <>
          <div className={`app-strength s${score}`} aria-hidden="true"><i /><i /><i /><i /></div>
          <span className="hint" aria-live="polite">Fortaleza: <strong>{STRENGTH_LABELS[score]}</strong></span>
          <ul className="app-checklist">{passwordChecks(value).map((c) => <li key={c.id} className={c.ok ? 'ok' : ''}><Icon name={c.ok ? 'circle-check' : 'circle'} />{c.label}</li>)}</ul>
        </>
      )}
    </Field>
  )
}

export function CheckboxField({ label, hint, error, id, className = '', ...rest }) {
  const fid = useFieldId(id)
  return (
    <div className={`app-field ${className}`}>
      <div className="custom-control custom-checkbox">
        <input type="checkbox" className="custom-control-input" {...fieldProps(fid, error, hint)} {...rest} />
        <label className="custom-control-label" htmlFor={fid}>{label}</label>
      </div>
      {error && <div className="invalid-feedback d-block" id={`${fid}-err`} role="alert">{error}</div>}
    </div>
  )
}

/** Interruptor accesible (role="switch"). */
export function Switch({ label, description, id, checked, onChange, disabled, ...rest }) {
  const fid = useFieldId(id)
  return (
    <div className="app-switch-row">
      <div><strong id={`${fid}-l`}>{label}</strong>{description && <small>{description}</small>}</div>
      <label className="app-switch">
        <input type="checkbox" role="switch" id={fid} aria-labelledby={`${fid}-l`} checked={Boolean(checked)} disabled={disabled} onChange={onChange} {...rest} />
        <i />
      </label>
    </div>
  )
}

/** Grupo de radios; con `cards` muestra tarjetas seleccionables. options: [{ value, label, description }] */
export function RadioGroup({ label, name, options, value, onChange, cards = false, error, hint }) {
  const gid = useFieldId()
  return (
    <fieldset className="app-field" style={{ border: 0, padding: 0 }}>
      {label && <legend className="label" style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.35rem' }}>{label}</legend>}
      <div className={cards ? 'app-radio-cards' : ''}>
        {options.map((o) => (cards ? (
          <label key={o.value} className="app-radio-card">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={onChange} />
            <strong>{o.icon && <Icon name={o.icon} />}{o.label}</strong>{o.description && <small>{o.description}</small>}
          </label>
        ) : (
          <div key={o.value} className="custom-control custom-radio">
            <input type="radio" id={`${gid}-${o.value}`} className="custom-control-input" name={name} value={o.value} checked={value === o.value} onChange={onChange} />
            <label className="custom-control-label" htmlFor={`${gid}-${o.value}`}>{o.label}</label>
          </div>
        )))}
      </div>
      {error ? <div className="invalid-feedback d-block" role="alert">{error}</div> : hint ? <span className="hint">{hint}</span> : null}
    </fieldset>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Buscar…', label = 'Buscar', className = '' }) {
  return (
    <div className={`app-toolbar-search ${className}`}>
      <Icon name="search" />
      <input type="search" className="form-control" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={label} />
    </div>
  )
}
