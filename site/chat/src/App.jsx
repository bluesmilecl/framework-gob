import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ChatHeader from './components/ChatHeader.jsx'
import Message from './components/Message.jsx'
import Composer from './components/Composer.jsx'
import EmptyState from './components/EmptyState.jsx'
import Icon from './components/Icon.jsx'
import { ConfirmDialog, SettingsDialog, ShortcutsDialog } from './components/Dialogs.jsx'
import { useToast } from './components/Toasts.jsx'
import useConversations from './hooks/useConversations.js'
import useChat from './hooks/useChat.js'
import useAutoScroll from './hooks/useAutoScroll.js'
import { groupConversations } from './lib/groups.js'
import { DEFAULT_MODEL } from './lib/models.js'
import { clearAll, loadSettings, saveSettings } from './lib/storage.js'
import { download, safeName, toMarkdown } from './lib/exporters.js'

const isDesktop = () => window.matchMedia('(min-width: 992px)').matches

export default function App() {
  const toast = useToast()
  const { state, dispatch, active } = useConversations()
  const [settings, setSettings] = useState(loadSettings)
  const [model, setModel] = useState(active?.model ?? DEFAULT_MODEL)
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dialog, setDialog] = useState(null) // 'settings' | 'shortcuts' | { confirm: {...} }
  const [dragging, setDragging] = useState(false)
  const [announce, setAnnounce] = useState('')
  const composer = useRef(null)
  const searchRef = useRef(null)
  const scroller = useRef(null)
  const dragDepth = useRef(0)

  const { streaming, send, stop, regenerate, editAndResend } = useChat({ active, dispatch, settings, model })
  const busy = Boolean(streaming)
  const messages = active?.messages ?? []
  const last = messages[messages.length - 1]
  const { atBottom, scrollToBottom } = useAutoScroll(scroller, [messages.length, last?.content, active?.id])
  const groups = useMemo(() => groupConversations(state.conversations, query), [state.conversations, query])

  // Mantiene el selector de modelo sincronizado con la conversación activa
  useEffect(() => { if (active) setModel(active.model) }, [active?.id]) // eslint-disable-line

  // Anuncio accesible del estado de la respuesta (el contenedor del hilo no es aria-live para no leer cada token)
  useEffect(() => {
    if (!last || last.role !== 'assistant') return
    if (last.status === 'streaming') setAnnounce('Generando respuesta…')
    else if (last.status === 'done') setAnnounce('Respuesta completa.')
    else if (last.status === 'error') setAnnounce('Error al generar la respuesta.')
  }, [last?.id, last?.status]) // eslint-disable-line

  const newChat = useCallback(() => {
    if (busy) stop()
    dispatch({ type: 'draft' }); setMobileOpen(false); composer.current?.focus()
  }, [busy, dispatch, stop])

  const toggleSidebar = useCallback(() => (isDesktop() ? setCollapsed((v) => !v) : setMobileOpen((v) => !v)), [])

  // Atajos de teclado
  useEffect(() => {
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey
      if (e.key === 'Escape' && busy && !dialog) { stop(); return }
      if (e.altKey && e.key.toLowerCase() === 'n') { e.preventDefault(); newChat() }
      else if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); if (collapsed && isDesktop()) setCollapsed(false); setMobileOpen(true); setTimeout(() => searchRef.current?.focus(), 30) }
      else if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleSidebar() }
      else if (e.key === '?' && !/input|textarea|select/i.test(e.target.tagName) && !e.target.isContentEditable) setDialog('shortcuts')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, collapsed, dialog, newChat, stop, toggleSidebar])

  // Arrastrar y soltar archivos sobre toda la ventana
  useEffect(() => {
    const hasFiles = (e) => Array.from(e.dataTransfer?.types ?? []).includes('Files')
    const enter = (e) => { if (hasFiles(e)) { e.preventDefault(); dragDepth.current++; setDragging(true) } }
    const over = (e) => { if (hasFiles(e)) e.preventDefault() }
    const leave = (e) => { if (hasFiles(e) && --dragDepth.current <= 0) { dragDepth.current = 0; setDragging(false) } }
    const drop = (e) => {
      if (!hasFiles(e)) return
      e.preventDefault(); dragDepth.current = 0; setDragging(false)
      composer.current?.addFiles(e.dataTransfer.files); composer.current?.focus()
    }
    window.addEventListener('dragenter', enter); window.addEventListener('dragover', over); window.addEventListener('dragleave', leave); window.addEventListener('drop', drop)
    return () => { window.removeEventListener('dragenter', enter); window.removeEventListener('dragover', over); window.removeEventListener('dragleave', leave); window.removeEventListener('drop', drop) }
  }, [])

  const copy = useCallback(async (text) => {
    try { await navigator.clipboard.writeText(text); toast('Copiado al portapapeles', 'ok') } catch { toast('No se pudo copiar', 'error') }
  }, [toast])

  const requestDelete = (conv) => setDialog({ confirm: { title: 'Eliminar conversación', text: `Se eliminará «${conv.title}» de forma permanente.`, run: () => { if (streaming?.convId === conv.id) stop(); dispatch({ type: 'delete', id: conv.id }); toast('Conversación eliminada') } } })

  const exportConv = (kind) => {
    if (!active) return
    const name = safeName(active.title)
    if (kind === 'md') download(`${name}.md`, toMarkdown(active), 'text/markdown')
    else download(`${name}.json`, JSON.stringify(active, (k, v) => (k === 'dataUrl' || k === 'text' ? undefined : v), 2), 'application/json')
    toast('Conversación exportada', 'ok')
  }

  const onModel = (m) => { setModel(m); if (active) dispatch({ type: 'setModel', id: active.id, model: m }) }
  const feedback = (mid, v) => {
    const cur = messages.find((m) => m.id === mid)?.feedback
    dispatch({ type: 'patchMessage', id: active.id, mid, patch: { feedback: cur === v ? null : v } })
    if (cur !== v) toast('Gracias por tu comentario', 'ok')
  }

  const confirm = dialog?.confirm

  return (
    <div className={`chat-app ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
      <a className="skip-link" href="#chat-input">Ir al cuadro de mensaje</a>
      <Sidebar
        groups={groups} activeId={active?.id} query={query} setQuery={setQuery} searchRef={searchRef}
        onSelect={(id) => dispatch({ type: 'select', id })} onNew={newChat} onClose={() => setMobileOpen(false)}
        onRename={(id, title) => dispatch({ type: 'rename', id, title })} onPin={(id) => dispatch({ type: 'pin', id })} onDelete={requestDelete}
        onSettings={() => { setMobileOpen(false); setDialog('settings') }} onShortcuts={() => { setMobileOpen(false); setDialog('shortcuts') }}
      />
      <div className="chat-overlay" onClick={() => setMobileOpen(false)} aria-hidden="true" />

      <main className="chat-main">
        <ChatHeader
          title={active?.title ?? 'Nueva conversación'} demo={settings.provider === 'demo'} model={model} onModel={onModel}
          collapsed={isDesktop() ? collapsed : !mobileOpen} onToggleSidebar={toggleSidebar}
          hasMessages={Boolean(active)} onExport={exportConv}
          onClear={() => active && requestDelete(active)}
        />
        <div className="chat-messages" ref={scroller} tabIndex={-1}>
          {messages.length === 0 ? (
            <EmptyState onPrompt={(p) => send({ text: p })} onAttach={() => composer.current?.openPicker()} />
          ) : (
            <div className="chat-thread" role="log" aria-label="Conversación" aria-live="off">
              {messages.map((m, i) => (
                <Message
                  key={m.id} msg={m} isLast={i === messages.length - 1} busy={busy}
                  onCopy={copy} onRegenerate={regenerate} onEdit={editAndResend} onFeedback={feedback}
                />
              ))}
            </div>
          )}
        </div>
        {!atBottom && messages.length > 0 && (
          <button type="button" className="chat-scroll-btn" onClick={() => scrollToBottom()} aria-label="Ir al final de la conversación"><Icon name="arrow-down" /></button>
        )}
        <Composer ref={composer} onSend={(p) => { send(p); scrollToBottom(false) }} onStop={stop} generating={busy} focusKey={active?.id ?? 'draft'} toast={toast} />
        <div className="sr-only" role="status" aria-live="polite">{announce}</div>
      </main>

      {dragging && (
        <div className="chat-drop" aria-hidden="true"><div><Icon name="paperclip" style={{ fontSize: '2.5rem' }} /><strong>Suelta los archivos para adjuntarlos</strong><p>Imágenes, PDF, documentos y archivos de texto (hasta 10 MB cada uno)</p></div></div>
      )}

      <SettingsDialog key={dialog === 'settings' ? 'open' : 'closed'} open={dialog === 'settings'} onClose={() => setDialog(null)} settings={settings}
        onSave={(s) => { setSettings(s); saveSettings(s); toast('Ajustes guardados', 'ok') }}
        onClearAll={() => { if (busy) stop(); dispatch({ type: 'clear' }); clearAll(); toast('Conversaciones eliminadas') }} />
      <ShortcutsDialog open={dialog === 'shortcuts'} onClose={() => setDialog(null)} />
      <ConfirmDialog open={Boolean(confirm)} title={confirm?.title} text={confirm?.text} onConfirm={() => confirm?.run()} onClose={() => setDialog(null)} />
    </div>
  )
}
