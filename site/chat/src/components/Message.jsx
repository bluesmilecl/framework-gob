import { memo, useEffect, useRef, useState } from 'react'
import Markdown from './Markdown.jsx'
import Attachment from './Attachment.jsx'
import Icon from './Icon.jsx'

const time = (t) => new Date(t).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })

function EditBox({ initial, onSave, onCancel }) {
  const [v, setV] = useState(initial)
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus(); ref.current?.setSelectionRange(v.length, v.length) }, []) // eslint-disable-line
  const onKey = (e) => {
    if (e.key === 'Escape') onCancel()
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) onSave(v)
  }
  return (
    <div className="chat-edit">
      <textarea ref={ref} value={v} onChange={(e) => setV(e.target.value)} onKeyDown={onKey} aria-label="Editar mensaje" />
      <div className="chat-edit-actions">
        <button type="button" className="btn btn-outline-primary btn-sm" style={{ minHeight: 0 }} onClick={onCancel}>Cancelar</button>
        <button type="button" className="btn btn-primary btn-sm" style={{ minHeight: 0 }} disabled={!v.trim()} onClick={() => onSave(v)}>Guardar y enviar</button>
      </div>
    </div>
  )
}

function Message({ msg, isLast, busy, onCopy, onRegenerate, onEdit, onFeedback }) {
  const [editing, setEditing] = useState(false)
  const isUser = msg.role === 'user'
  const streaming = msg.status === 'streaming'

  return (
    <article className={`chat-msg ${isUser ? 'chat-msg-user' : 'chat-msg-assistant'} ${isLast ? 'is-last' : ''}`} aria-label={isUser ? 'Tu mensaje' : 'Respuesta del asistente'}>
      <div className="chat-avatar" aria-hidden="true">{isUser ? 'Tú' : <Icon name="bot" />}</div>
      <div className="chat-msg-body">
        <p className="chat-msg-meta">{isUser ? 'Tú' : 'Asistente'} · {time(msg.createdAt)}</p>

        {isUser && msg.attachments?.length > 0 && (
          <div className="chat-attachments">{msg.attachments.map((a) => <Attachment key={a.id} a={a} />)}</div>
        )}

        {isUser ? (
          editing ? (
            <EditBox initial={msg.content} onCancel={() => setEditing(false)} onSave={(v) => { setEditing(false); onEdit(msg.id, v) }} />
          ) : (
            msg.content && <div className="chat-bubble">{msg.content}</div>
          )
        ) : (
          <>
            {streaming && !msg.content ? (
              <div className="chat-typing" role="status" aria-label="El asistente está escribiendo"><i /><i /><i /></div>
            ) : (
              <div>
                <Markdown>{msg.content}</Markdown>
                {streaming && <span className="chat-cursor" aria-hidden="true" />}
              </div>
            )}
            {msg.status === 'stopped' && <p className="chat-msg-meta" style={{ marginTop: '0.4rem' }}>Generación detenida.</p>}
            {msg.status === 'error' && (
              <div className="alert alert-danger chat-error" role="alert">
                <strong>No pudimos generar la respuesta.</strong> {msg.error}
                {isLast && !busy && <div className="mt-2"><button type="button" className="btn btn-outline-danger btn-sm" style={{ minHeight: 0 }} onClick={onRegenerate}>Reintentar</button></div>}
              </div>
            )}
          </>
        )}

        {!streaming && !editing && (
          <div className="chat-msg-actions">
            <button type="button" className="chat-iconbtn" title="Copiar" aria-label="Copiar mensaje" onClick={() => onCopy(msg.content)}><Icon name="copy" /></button>
            {isUser && <button type="button" className="chat-iconbtn" title="Editar" aria-label="Editar mensaje" disabled={busy} onClick={() => setEditing(true)}><Icon name="pencil" /></button>}
            {!isUser && msg.status !== 'error' && (
              <>
                <button type="button" className={`chat-iconbtn ${msg.feedback === 'up' ? 'is-on' : ''}`} aria-pressed={msg.feedback === 'up'} title="Buena respuesta" aria-label="Buena respuesta" onClick={() => onFeedback(msg.id, 'up')}><Icon name="thumbs-up" /></button>
                <button type="button" className={`chat-iconbtn ${msg.feedback === 'down' ? 'is-on' : ''}`} aria-pressed={msg.feedback === 'down'} title="Mala respuesta" aria-label="Mala respuesta" onClick={() => onFeedback(msg.id, 'down')}><Icon name="thumbs-down" /></button>
              </>
            )}
            {!isUser && isLast && <button type="button" className="chat-iconbtn" title="Regenerar" aria-label="Regenerar respuesta" disabled={busy} onClick={onRegenerate}><Icon name="refresh-cw" /></button>}
          </div>
        )}
      </div>
    </article>
  )
}
export default memo(Message)
