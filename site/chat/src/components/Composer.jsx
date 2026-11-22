import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import Attachment from './Attachment.jsx'
import { ACCEPT, LIMITS, readAttachment, validateFiles } from '../lib/files.js'
import useDictation from '../hooks/useDictation.js'

/** Caja de redacción: texto autoajustable, adjuntos (clic, arrastrar, pegar), dictado y envío/detención. */
export default function Composer({ ref, onSend, onStop, generating, focusKey, toast, draftRef }) {
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])
  const [reading, setReading] = useState(0)
  const area = useRef(null)
  const picker = useRef(null)

  const addFiles = useCallback(async (list) => {
    const { accepted, rejected } = validateFiles(Array.from(list), files.length)
    rejected.forEach((r) => toast(`${r.name}: ${r.reason}`, 'error'))
    if (!accepted.length) return
    setReading((n) => n + accepted.length)
    const read = await Promise.all(accepted.map(readAttachment))
    setReading((n) => n - accepted.length)
    setFiles((f) => [...f, ...read])
  }, [files.length, toast])

  useImperativeHandle(ref, () => ({ addFiles, setText, focus: () => area.current?.focus(), openPicker: () => picker.current?.click() }), [addFiles])
  if (draftRef) draftRef.current = text

  const dictation = useDictation((t) => setText((v) => `${v}${v && !v.endsWith(' ') ? ' ' : ''}${t}`), (m) => toast(m, 'error'))

  // Autoajuste de altura
  useEffect(() => {
    const el = area.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 192)}px`
  }, [text])
  useEffect(() => { area.current?.focus() }, [focusKey])

  const over = text.length > LIMITS.maxMessageChars
  const canSend = !generating && !reading && !over && (text.trim() || files.length) && !files.some((f) => f.error)

  const submit = () => {
    if (!canSend) return
    onSend({ text, attachments: files })
    setText(''); setFiles([])
  }
  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit() }
  }
  const onPaste = (e) => {
    const fs = Array.from(e.clipboardData?.files ?? [])
    if (fs.length) { e.preventDefault(); addFiles(fs) }
  }

  return (
    <div className="chat-composer-wrap">
      <div className="chat-composer-inner">
        <form className="chat-composer" onSubmit={(e) => { e.preventDefault(); submit() }}>
          {(files.length > 0 || reading > 0) && (
            <div className="chat-attachments" aria-label="Archivos adjuntos">
              {files.map((f) => <Attachment key={f.id} a={f} onRemove={(id) => setFiles((l) => l.filter((x) => x.id !== id))} />)}
              {reading > 0 && <div className="chat-attachment"><span className="chat-attachment-icon"><Icon name="loader-circle" className="cl-spin" /></span><span className="chat-attachment-text">Leyendo archivo…</span></div>}
            </div>
          )}
          <label htmlFor="chat-input" className="sr-only">Escribe tu mensaje</label>
          <textarea
            id="chat-input" ref={area} rows={1} value={text} placeholder="Escribe tu mensaje… (Enter envía, Shift+Enter nueva línea)"
            onChange={(e) => setText(e.target.value)} onKeyDown={onKeyDown} onPaste={onPaste}
            aria-describedby="chat-disclaimer"
          />
          <div className="chat-composer-bar">
            <input ref={picker} type="file" multiple accept={ACCEPT} hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
            <button type="button" className="chat-iconbtn" title="Adjuntar archivos" aria-label="Adjuntar archivos" onClick={() => picker.current.click()}><Icon name="paperclip" /></button>
            {dictation.supported && (
              <button type="button" className={`chat-iconbtn ${dictation.listening ? 'is-on' : ''}`} aria-pressed={dictation.listening} title="Dictar por voz" aria-label="Dictar por voz" onClick={dictation.toggle}><Icon name="mic" /></button>
            )}
            <span className="grow" />
            {text.length > LIMITS.maxMessageChars * 0.8 && <span className={`chat-counter ${over ? 'is-over' : ''}`} aria-live="polite">{text.length}/{LIMITS.maxMessageChars}</span>}
            {generating ? (
              <button type="button" className="chat-send is-stop" title="Detener (Esc)" aria-label="Detener generación" onClick={onStop}><Icon name="square" /></button>
            ) : (
              <button type="submit" className="chat-send" title="Enviar (Enter)" aria-label="Enviar mensaje" disabled={!canSend}><Icon name="send" /></button>
            )}
          </div>
        </form>
        <p className="chat-disclaimer" id="chat-disclaimer">Las respuestas generadas por IA pueden contener errores. Verifica la información importante en fuentes oficiales.</p>
      </div>
    </div>
  )
}
