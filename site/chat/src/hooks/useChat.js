import { useCallback, useMemo, useRef, useState } from 'react'
import { uid } from '../lib/ids.js'
import { getProvider } from '../lib/providers/index.js'

const titleFrom = (text, atts) => {
  const base = (text || atts?.[0]?.name || 'Nueva conversación').replace(/\s+/g, ' ').trim()
  return base.length > 44 ? `${base.slice(0, 43)}…` : base
}
const toHistory = (msgs) => msgs.map(({ role, content, attachments }) => ({ role, content, attachments }))
const assistantMsg = () => ({ id: uid(), role: 'assistant', content: '', createdAt: Date.now(), status: 'streaming', feedback: null })

/** Motor de la conversación: envío, streaming, detener, regenerar y editar mensajes. */
export default function useChat({ active, dispatch, settings, model }) {
  const [streaming, setStreaming] = useState(null) // { convId, messageId }
  const abortRef = useRef(null)
  const provider = useMemo(() => getProvider(settings), [settings])

  const run = useCallback(async (convId, history, assistantId, convModel) => {
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setStreaming({ convId, messageId: assistantId })
    const patch = (p) => dispatch({ type: 'patchMessage', id: convId, mid: assistantId, patch: p })
    try {
      await provider.stream({
        messages: history, model: convModel, signal: ctrl.signal,
        onToken: (token) => dispatch({ type: 'appendToken', id: convId, mid: assistantId, token }),
      })
      patch({ status: 'done' })
    } catch (e) {
      if (e?.name === 'AbortError') patch({ status: 'stopped' })
      else patch({ status: 'error', error: e?.message || 'No se pudo obtener la respuesta.' })
    } finally {
      abortRef.current = null
      setStreaming(null)
    }
  }, [provider, dispatch])

  const stop = useCallback(() => abortRef.current?.abort(), [])

  const send = useCallback(({ text, attachments = [] }) => {
    if (streaming || (!text.trim() && !attachments.length)) return
    const userMsg = { id: uid(), role: 'user', content: text.trim(), attachments, createdAt: Date.now(), status: 'done' }
    const asst = assistantMsg()
    let convId, history, convModel
    if (active) {
      convId = active.id; convModel = active.model
      history = [...toHistory(active.messages), toHistory([userMsg])[0]]
      dispatch({ type: 'addMessages', id: convId, messages: [userMsg, asst] })
    } else {
      convId = uid(); convModel = model
      history = toHistory([userMsg])
      dispatch({ type: 'create', conv: { id: convId, title: titleFrom(userMsg.content, attachments), createdAt: Date.now(), updatedAt: Date.now(), model, pinned: false, messages: [userMsg, asst] } })
    }
    run(convId, history, asst.id, convModel)
  }, [active, dispatch, model, run, streaming])

  const regenerate = useCallback(() => {
    if (streaming || !active) return
    const last = [...active.messages].reverse().find((m) => m.role === 'assistant')
    if (!last) return
    const idx = active.messages.findIndex((m) => m.id === last.id)
    const history = toHistory(active.messages.slice(0, idx))
    const asst = assistantMsg()
    dispatch({ type: 'truncate', id: active.id, mid: last.id, inclusive: true })
    dispatch({ type: 'addMessages', id: active.id, messages: [asst] })
    run(active.id, history, asst.id, active.model)
  }, [active, dispatch, run, streaming])

  const editAndResend = useCallback((mid, newText) => {
    if (streaming || !active || !newText.trim()) return
    const idx = active.messages.findIndex((m) => m.id === mid)
    if (idx < 0) return
    const edited = { ...active.messages[idx], content: newText.trim() }
    const history = [...toHistory(active.messages.slice(0, idx)), toHistory([edited])[0]]
    const asst = assistantMsg()
    dispatch({ type: 'patchMessage', id: active.id, mid, patch: { content: edited.content } })
    dispatch({ type: 'truncate', id: active.id, mid, inclusive: false })
    dispatch({ type: 'addMessages', id: active.id, messages: [asst] })
    run(active.id, history, asst.id, active.model)
  }, [active, dispatch, run, streaming])

  return { streaming, send, stop, regenerate, editAndResend }
}
