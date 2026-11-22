import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Icon from '../Icon.jsx'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

const ICONS = { error: 'triangle-alert', ok: 'circle-check', warn: 'triangle-alert' }

/**
 * Avisos breves en una región aria-live.
 * toast('Texto', 'ok' | 'error' | 'warn' | '' )  ó  toast('Texto', { kind, action: { label, onClick }, duration })
 */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const n = useRef(0)
  const dismiss = useCallback((id) => setItems((l) => l.filter((t) => t.id !== id)), [])
  const toast = useCallback((text, opts = '') => {
    const o = typeof opts === 'string' ? { kind: opts } : opts
    const id = ++n.current
    setItems((l) => [...l.slice(-3), { id, text, kind: o.kind || '', action: o.action }])
    setTimeout(() => dismiss(id), o.duration ?? (o.action ? 6500 : 3200))
  }, [dismiss])
  const value = useMemo(() => toast, [toast])
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="gob-toasts chat-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`gob-toast chat-toast ${t.kind ? `is-${t.kind}` : ''}`}>
            <Icon name={ICONS[t.kind] || 'info'} />
            <span>{t.text}</span>
            {t.action && <button type="button" className="gob-toast-action" onClick={() => { t.action.onClick(); dismiss(t.id) }}>{t.action.label}</button>}
            <button type="button" className="gob-toast-close" aria-label="Cerrar aviso" onClick={() => dismiss(t.id)}><Icon name="x" /></button>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
