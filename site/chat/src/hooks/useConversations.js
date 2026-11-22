import { useEffect, useReducer, useRef } from 'react'
import { loadState, saveState } from '../lib/storage.js'

const touch = (c) => ({ ...c, updatedAt: Date.now() })
const mapConv = (state, id, fn) => ({ ...state, conversations: state.conversations.map((c) => (c.id === id ? fn(c) : c)) })

function reducer(state, a) {
  switch (a.type) {
    case 'select': return { ...state, activeId: a.id }
    case 'draft': return { ...state, activeId: null }
    case 'create': return { conversations: [a.conv, ...state.conversations], activeId: a.conv.id }
    case 'rename': return mapConv(state, a.id, (c) => touch({ ...c, title: a.title }))
    case 'pin': return mapConv(state, a.id, (c) => ({ ...c, pinned: !c.pinned }))
    case 'setModel': return mapConv(state, a.id, (c) => ({ ...c, model: a.model }))
    case 'delete': {
      const conversations = state.conversations.filter((c) => c.id !== a.id)
      return { conversations, activeId: state.activeId === a.id ? null : state.activeId }
    }
    case 'addMessages': return mapConv(state, a.id, (c) => touch({ ...c, messages: [...c.messages, ...a.messages] }))
    case 'patchMessage':
      return mapConv(state, a.id, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === a.mid ? { ...m, ...a.patch } : m)) }))
    case 'appendToken':
      return mapConv(state, a.id, (c) => ({ ...c, messages: c.messages.map((m) => (m.id === a.mid ? { ...m, content: m.content + a.token } : m)) }))
    case 'truncate': // elimina los mensajes posteriores a `mid` (y `mid` si inclusive)
      return mapConv(state, a.id, (c) => {
        const i = c.messages.findIndex((m) => m.id === a.mid)
        return i < 0 ? c : touch({ ...c, messages: c.messages.slice(0, a.inclusive ? i : i + 1) })
      })
    case 'clear': return { conversations: [], activeId: null }
    default: return state
  }
}

export default function useConversations() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)
  const latest = useRef(state)
  latest.current = state
  // Guardado con pequeño retardo para no escribir en cada token del streaming
  useEffect(() => {
    const t = setTimeout(() => saveState(state), 400)
    return () => clearTimeout(t)
  }, [state])
  // Al ocultar o cerrar la página se guarda de inmediato, para no perder el último cambio
  useEffect(() => {
    const flush = () => saveState(latest.current)
    const onVis = () => document.visibilityState === 'hidden' && flush()
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => { window.removeEventListener('pagehide', flush); document.removeEventListener('visibilitychange', onVis) }
  }, [])
  const active = state.conversations.find((c) => c.id === state.activeId) ?? null
  return { state, dispatch, active }
}
