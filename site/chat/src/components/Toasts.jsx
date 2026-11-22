import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import Icon from './Icon.jsx'

const Ctx = createContext(() => {})
export const useToast = () => useContext(Ctx)

/** Avisos breves (copiado, errores). Región aria-live para lectores de pantalla. */
export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const n = useRef(0)
  const toast = useCallback((text, kind = '') => {
    const id = ++n.current
    setItems((l) => [...l.slice(-3), { id, text, kind }])
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3200)
  }, [])
  const value = useMemo(() => toast, [toast])
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="chat-toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`chat-toast ${t.kind ? `is-${t.kind}` : ''}`}>
            <Icon name={t.kind === 'error' ? 'triangle-alert' : t.kind === 'ok' ? 'circle-check' : 'info'} />
            {t.text}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  )
}
