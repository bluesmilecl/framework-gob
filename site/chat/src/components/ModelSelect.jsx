import { useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { useDismiss } from 'gob-cl-tailwind/react'
import { MODELS, modelLabel } from '../lib/models.js'

export default function ModelSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useDismiss(open, ref, () => setOpen(false))
  return (
    <div className="chat-model" ref={ref}>
      <button type="button" className="chat-model-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <Icon name="sparkles" /><span>{modelLabel(value)}</span><Icon name="m-arrow-down" style={{ fontSize: '0.7rem' }} />
      </button>
      {open && (
        <div className="chat-menu" role="menu" aria-label="Seleccionar modelo">
          {MODELS.map((m) => (
            <button key={m.id} type="button" role="menuitemradio" aria-checked={m.id === value} className="chat-model-item" onClick={() => { onChange(m.id); setOpen(false) }}>
              <span><strong style={{ fontWeight: 500 }}>{m.label}</strong><small>{m.hint}</small></span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
