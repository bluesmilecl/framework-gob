import { useCallback, useSyncExternalStore } from 'react'

// Misma convención que el JS del framework (dist/gob.js): clases a11y-* en <html> y claves de localStorage compartidas.
const KEY = 'gob.cl:toolbar'
const SIZES = ['16px', '20px', '24px']
const read = (k) => { try { return localStorage.getItem(`${KEY}.${k}`) } catch { return null } }
const write = (k, v) => { try { v == null ? localStorage.removeItem(`${KEY}.${k}`) : localStorage.setItem(`${KEY}.${k}`, v) } catch { /* sin almacenamiento */ } }

// Estado compartido entre todas las instancias del hook (barra superior, ajustes, etc.)
let state = { contrast: read('contrast') === 'active', font: Math.min(Math.max(parseInt(read('index') ?? '0', 10) || 0, 0), 2) }
const listeners = new Set()
const apply = () => {
  if (typeof document === 'undefined') return
  const h = document.documentElement
  h.classList.toggle('a11y-contrast', state.contrast)
  h.classList.remove('a11y-font-0', 'a11y-font-1', 'a11y-font-2')
  h.classList.add(`a11y-font-${state.font}`)
  h.style.fontSize = SIZES[state.font]
}
const set = (patch) => { state = { ...state, ...patch }; apply(); listeners.forEach((l) => l()) }
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l) }
apply()

/** Alto contraste y tamaño de texto (16/20/24 px). Persiste, aplica al cargar y se mantiene sincronizado entre componentes. */
export default function useAccessibility() {
  const s = useSyncExternalStore(subscribe, () => state, () => state)
  const toggleContrast = useCallback(() => { write('contrast', state.contrast ? null : 'active'); set({ contrast: !state.contrast }) }, [])
  const setFont = useCallback((i) => { const n = Math.min(Math.max(i, 0), 2); write('index', String(n)); set({ font: n }) }, [])
  return { contrast: s.contrast, font: s.font, toggleContrast, setFont, maxFont: 2 }
}
