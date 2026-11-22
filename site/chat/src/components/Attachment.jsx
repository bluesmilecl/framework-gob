import Icon from './Icon.jsx'
import { attachmentIcon, formatSize } from '../lib/files.js'

/** Adjunto: miniatura si es imagen, ficha con ícono en otro caso. `onRemove` solo en el composer. */
export default function Attachment({ a, onRemove }) {
  const remove = onRemove && (
    <button type="button" className="chat-iconbtn" aria-label={`Quitar ${a.name}`} onClick={() => onRemove(a.id)}><Icon name="x" /></button>
  )
  if (a.kind === 'image' && a.dataUrl) {
    return (
      <div className="chat-attachment is-image" title={a.name}>
        <img className="chat-thumb" src={a.dataUrl} alt={a.name} />
        {remove}
      </div>
    )
  }
  return (
    <div className={`chat-attachment ${a.error ? 'is-error' : ''}`} title={a.name}>
      <span className="chat-attachment-icon"><Icon name={a.error ? 'triangle-alert' : attachmentIcon(a)} /></span>
      <span className="chat-attachment-text">
        <span className="chat-attachment-name" style={{ display: 'block' }}>{a.name}</span>
        <span className="chat-attachment-meta">{a.error || (a.expired ? `${formatSize(a.size)} · contenido no guardado` : formatSize(a.size))}</span>
      </span>
      {remove}
    </div>
  )
}
