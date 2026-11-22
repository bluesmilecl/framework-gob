import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import Icon from '../Icon.jsx'

/* ───────────────────────── Bloqueo de scroll (contador, soporta modales apilados) ───────────────────────── */
let locks = 0
const lock = () => { if (locks++ === 0) document.documentElement.classList.add('gob-modal-open') }
const unlock = () => { if (--locks <= 0) { locks = 0; document.documentElement.classList.remove('gob-modal-open') } }

const TONE_ICON = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'triangle-alert' }
const EXIT_MS = 190

/**
 * Modal accesible sobre <dialog> nativo (foco atrapado, Esc y restauración de foco los gestiona el navegador).
 *  size: sm | md | lg | xl | full      variant: '' | 'drawer' (panel lateral; en móvil todos son hoja inferior)
 *  tone: '' | info | success | warning | danger (color de la franja superior y del ícono)
 *  staticBackdrop: no se cierra con clic fuera ni Esc (sacude para avisar)      busy: bloquea cierre (guardando…)
 */
export function Modal({ open, onClose, title, subtitle, icon, tone = '', size = 'md', variant = '', staticBackdrop = false, busy = false, footer, children, className = '' }) {
  const ref = useRef(null)
  const titleId = useId()
  const bodyId = useId()
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const [shake, setShake] = useState(false)
  const down = useRef(false)

  // Apertura / cierre con animación de salida
  useEffect(() => {
    const d = ref.current
    if (open) {
      setMounted(true); setClosing(false)
      return undefined
    }
    if (!mounted || !d?.open) { setMounted(false); return undefined }
    setClosing(true)
    const t = setTimeout(() => { d.close(); setMounted(false); setClosing(false) }, EXIT_MS)
    return () => clearTimeout(t)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const d = ref.current
    if (!mounted || !open || !d || d.open) return undefined
    d.showModal()
    lock()
    // Foco inicial: [data-autofocus] > primer campo del cuerpo > se deja el del navegador
    requestAnimationFrame(() => {
      const target = d.querySelector('[data-autofocus]') || d.querySelector('.gob-modal-body input:not([type=hidden]), .gob-modal-body textarea, .gob-modal-body select')
      target?.focus()
    })
    return () => { unlock() }
  }, [mounted, open])

  // Si el componente se desmonta con el diálogo abierto
  useEffect(() => () => { const d = ref.current; if (d?.open) d.close() }, [])

  const requestClose = () => {
    if (busy) return
    if (staticBackdrop) { setShake(true); setTimeout(() => setShake(false), 400); return }
    onClose?.()
  }

  return (
    <dialog
      ref={ref}
      className={`gob-modal is-${size} ${variant ? `is-${variant}` : ''} ${tone ? `tone-${tone}` : ''} ${closing ? 'is-closing' : ''} ${shake ? 'is-shake' : ''} ${className}`}
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      aria-busy={busy || undefined}
      onCancel={(e) => { e.preventDefault(); requestClose() }}
      onMouseDown={(e) => { down.current = e.target === ref.current }}
      onClick={(e) => { if (down.current && e.target === ref.current) requestClose(); down.current = false }}
    >
      {mounted && (
        <>
          <header className="gob-modal-header">
            {(icon || tone) && <span className="gob-modal-icon"><Icon name={icon || TONE_ICON[tone]} /></span>}
            <div className="gob-modal-titles">
              <h2 id={titleId} className="gob-modal-title">{title}</h2>
              {subtitle && <p className="gob-modal-subtitle">{subtitle}</p>}
            </div>
            <button type="button" className="gob-modal-close" aria-label="Cerrar" disabled={busy} onClick={requestClose}><Icon name="x" /></button>
          </header>
          <div className="gob-modal-body" id={bodyId}>{children}</div>
          {footer && <div className="gob-modal-footer">{footer}</div>}
        </>
      )}
    </dialog>
  )
}

/* ───────────────────────── API imperativa: confirm / alert / prompt / open ───────────────────────── */
const ModalCtx = createContext(null)
export const useModal = () => useContext(ModalCtx)

function ConfirmBody({ text, requireText, value, setValue }) {
  return (
    <>
      {typeof text === 'string' ? <p className="mb-0">{text}</p> : text}
      {requireText && (
        <div className="app-field mt-3 mb-0">
          <label htmlFor="gob-confirm-text">Para confirmar, escribe <strong>{requireText}</strong></label>
          <input id="gob-confirm-text" className="form-control" autoComplete="off" value={value} onChange={(e) => setValue(e.target.value)} data-autofocus />
        </div>
      )}
    </>
  )
}

function PromptBody({ text, label, placeholder, value, setValue, error, multiline }) {
  const Field = multiline ? 'textarea' : 'input'
  return (
    <>
      {text && <p>{text}</p>}
      <div className="app-field mb-0">
        <label htmlFor="gob-prompt">{label}</label>
        <Field id="gob-prompt" className={`form-control ${error ? 'is-invalid' : ''}`} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} rows={multiline ? 4 : undefined} aria-invalid={Boolean(error)} data-autofocus />
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </div>
    </>
  )
}

function ManagedModal({ entry, onResolve }) {
  const { kind, props } = entry
  const [value, setValue] = useState(props.initial ?? '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const close = (result) => onResolve(entry.id, result)
  const needText = kind === 'confirm' && props.requireText && value !== props.requireText

  const submit = async () => {
    if (kind === 'prompt') {
      const err = props.validate?.(value)
      if (err) { setError(err); return }
      close(value)
      return
    }
    if (props.onConfirm) { // acción asíncrona dentro del modal: muestra "guardando" y bloquea el cierre
      setBusy(true)
      try { await props.onConfirm(); close(true) } catch (e) { setBusy(false); setError(e?.message || 'No se pudo completar la acción') }
      return
    }
    close(kind === 'confirm' ? true : undefined)
  }

  const danger = props.tone === 'danger'
  const footer = (
    <>
      {kind !== 'alert' && <button type="button" className="btn btn-outline-primary btn-compact" disabled={busy} onClick={() => close(kind === 'prompt' ? null : false)}>{props.cancelLabel || 'Cancelar'}</button>}
      <button type="button" className={`btn ${danger ? 'btn-danger' : 'btn-primary'} btn-compact`} disabled={needText || busy} onClick={submit}>
        {busy && <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true" />}{props.confirmLabel || (kind === 'alert' ? 'Entendido' : kind === 'prompt' ? 'Aceptar' : 'Confirmar')}
      </button>
    </>
  )
  return (
    <Modal open={entry.open} onClose={() => close(kind === 'prompt' ? null : kind === 'alert' ? undefined : false)} title={props.title} subtitle={props.subtitle}
      tone={props.tone || (kind === 'alert' ? 'info' : '')} icon={props.icon} size={props.size || 'sm'} staticBackdrop={props.static} busy={busy} footer={footer}>
      {kind === 'prompt'
        ? <PromptBody {...props} value={value} setValue={setValue} error={error} />
        : <ConfirmBody text={props.text} requireText={kind === 'confirm' ? props.requireText : null} value={value} setValue={setValue} />}
      {kind !== 'prompt' && error && <div className="alert alert-danger mt-3 mb-0" role="alert">{error}</div>}
    </Modal>
  )
}

export function ModalProvider({ children }) {
  const [stack, setStack] = useState([])
  const seq = useRef(0)
  const resolvers = useRef(new Map())

  const push = useCallback((kind, props) => new Promise((resolve) => {
    const id = ++seq.current
    resolvers.current.set(id, resolve)
    setStack((s) => [...s, { id, kind, props, open: true }])
  }), [])

  const onResolve = useCallback((id, result) => {
    resolvers.current.get(id)?.(result)
    resolvers.current.delete(id)
    setStack((s) => s.map((e) => (e.id === id ? { ...e, open: false } : e)))
    setTimeout(() => setStack((s) => s.filter((e) => e.id !== id)), EXIT_MS + 120)
  }, [])

  const api = useMemo(() => ({
    confirm: (props) => push('confirm', props),
    alert: (props) => push('alert', props),
    prompt: (props) => push('prompt', props),
  }), [push])

  return (
    <ModalCtx.Provider value={api}>
      {children}
      {stack.map((e) => <ManagedModal key={e.id} entry={e} onResolve={onResolve} />)}
    </ModalCtx.Provider>
  )
}
