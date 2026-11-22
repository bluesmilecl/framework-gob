import { useRef, useState } from 'react'
import Icon from './Icon.jsx'
import ModelSelect from './ModelSelect.jsx'
import useDismiss from './useDismiss.js'
import { toolbar } from '../../../../src/js/gob.js'

export default function ChatHeader({ title, demo, model, onModel, collapsed, onToggleSidebar, hasMessages, onExport, onClear }) {
  const [menu, setMenu] = useState(false)
  const ref = useRef(null)
  useDismiss(menu, ref, () => setMenu(false))
  return (
    <header className="chat-header">
      <button type="button" className="chat-iconbtn" onClick={onToggleSidebar} aria-label={collapsed ? 'Mostrar historial' : 'Ocultar historial'} aria-pressed={!collapsed} title="Historial (Ctrl+B)">
        <Icon name={collapsed ? 'panel-left-open' : 'panel-left-close'} />
      </button>
      <h1 className="chat-header-title">{title}</h1>
      {demo && <span className="badge badge-warning" title="Las respuestas son simuladas; no las genera un modelo de IA" style={{ flex: 'none' }}>Demo</span>}
      <ModelSelect value={model} onChange={onModel} />
      <button type="button" className="chat-iconbtn chat-hide-sm" aria-label="Alto contraste" title="Alto contraste" onClick={() => toolbar.toggleContrast()}><Icon name="contrast" /></button>
      <button type="button" className="chat-iconbtn chat-hide-sm" aria-label="Disminuir texto" title="Disminuir texto" onClick={() => toolbar.index() > 0 && toolbar.setFont(toolbar.index() - 1)}><Icon name="decrease-text" /></button>
      <button type="button" className="chat-iconbtn chat-hide-sm" aria-label="Aumentar texto" title="Aumentar texto" onClick={() => toolbar.index() < 2 && toolbar.setFont(toolbar.index() + 1)}><Icon name="increase-text" /></button>
      <div style={{ position: 'relative' }} ref={ref}>
        <button type="button" className="chat-iconbtn" aria-label="Más acciones" aria-haspopup="menu" aria-expanded={menu} disabled={!hasMessages} onClick={() => setMenu((v) => !v)}><Icon name="ellipsis-vertical" /></button>
        {menu && (
          <div className="chat-menu" role="menu" style={{ top: 'calc(100% + 4px)', right: 0 }}>
            <button type="button" role="menuitem" onClick={() => { setMenu(false); onExport('md') }}><Icon name="download" />Exportar como Markdown</button>
            <button type="button" role="menuitem" onClick={() => { setMenu(false); onExport('json') }}><Icon name="file-code" />Exportar como JSON</button>
            <hr />
            <button type="button" role="menuitem" className="is-danger" onClick={() => { setMenu(false); onClear() }}><Icon name="trash-2" />Eliminar conversación</button>
          </div>
        )}
      </div>
    </header>
  )
}
