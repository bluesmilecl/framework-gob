import { useEffect, useRef, useState } from 'react'
import Icon from './Icon.jsx'
import { DropdownMenu, useDismiss } from 'gob-cl-tailwind/react'

function ConversationItem({ conv, active, onSelect, onRename, onDelete, onPin }) {
  const [menu, setMenu] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [title, setTitle] = useState(conv.title)
  const wrap = useRef(null)
  const input = useRef(null)
  useDismiss(menu, wrap, () => setMenu(false))
  useEffect(() => { if (renaming) { input.current?.focus(); input.current?.select() } }, [renaming])

  const commit = () => {
    const t = title.trim()
    if (t && t !== conv.title) onRename(conv.id, t)
    else setTitle(conv.title)
    setRenaming(false)
  }

  return (
    <li className={`chat-conv ${active ? 'is-active' : ''} ${menu ? 'is-open' : ''}`} ref={wrap}>
      {renaming ? (
        <input
          ref={input} className="chat-conv-rename" value={title} aria-label="Nuevo nombre de la conversación"
          onChange={(e) => setTitle(e.target.value)} onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setTitle(conv.title); setRenaming(false) } }}
        />
      ) : (
        <>
          <button type="button" className="chat-conv-btn" aria-current={active ? 'true' : undefined} onClick={() => onSelect(conv.id)} title={conv.title}>
            {conv.pinned && <Icon name="pin" className="chat-conv-pin" />}{conv.title}
          </button>
          <button type="button" className="chat-conv-menu-btn" aria-label={`Opciones de ${conv.title}`} aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((v) => !v)}>
            <Icon name="ellipsis-vertical" />
          </button>
        </>
      )}
      {menu && (
        <div className="chat-menu" role="menu" style={{ top: '100%', right: 4 }}>
          <button type="button" role="menuitem" onClick={() => { setMenu(false); onPin(conv.id) }}><Icon name={conv.pinned ? 'pin-off' : 'pin'} />{conv.pinned ? 'Desfijar' : 'Fijar'}</button>
          <button type="button" role="menuitem" onClick={() => { setMenu(false); setRenaming(true) }}><Icon name="pencil" />Renombrar</button>
          <hr />
          <button type="button" role="menuitem" className="is-danger" onClick={() => { setMenu(false); onDelete(conv) }}><Icon name="trash-2" />Eliminar</button>
        </div>
      )}
    </li>
  )
}

export default function Sidebar({ groups, activeId, query, setQuery, searchRef, onSelect, onNew, onRename, onDelete, onPin, onSettings, onShortcuts, onFiles, onLogout, user, onClose }) {
  return (
    <aside className="chat-sidebar" aria-label="Historial de conversaciones">
      <div className="chat-sidebar-head">
        <a className="chat-brand" href="#/">
          <img src="/img/gob-footer.svg" alt="Gobierno de Chile" />
          <span className="chat-brand-name">Asistente IA<small>Interfaz de demostración</small></span>
        </a>
        <button type="button" className="chat-new" onClick={onNew}><Icon name="message-square-plus" /> Nueva conversación <kbd>Alt N</kbd></button>
      </div>
      <div className="chat-search">
        <Icon name="search" />
        <input ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar conversaciones" aria-label="Buscar conversaciones" />
      </div>
      <nav className="chat-conv-scroll" aria-label="Conversaciones">
        {groups.length === 0 && <p className="chat-conv-empty">{query ? 'Sin resultados para tu búsqueda.' : 'Aún no tienes conversaciones. Escribe tu primer mensaje para comenzar.'}</p>}
        {groups.map(([name, list]) => (
          <section key={name}>
            <h2 className="chat-group-title">{name}</h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {list.map((c) => (
                <ConversationItem key={c.id} conv={c} active={c.id === activeId} onSelect={(id) => { onSelect(id); onClose() }} onRename={onRename} onDelete={onDelete} onPin={onPin} />
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <div className="chat-sidebar-foot" style={{ position: 'relative' }}>
        <DropdownMenu label="Cuenta y ajustes" align="left" side="top" width="16rem" className="chat-foot-menu"
          items={[{ header: user?.email ?? 'Cuenta' }, { label: 'Biblioteca de archivos', icon: 'folder-open', onSelect: onFiles }, { label: 'Ajustes', icon: 'settings', onSelect: onSettings }, { label: 'Atajos de teclado', icon: 'keyboard', onSelect: onShortcuts }, { separator: true }, { label: 'Cerrar sesión', icon: 'log-out', danger: true, onSelect: onLogout }]}
          trigger={(p) => (
            <button type="button" className="chat-side-link" style={{ width: '100%' }} {...p}>
              <span className="chat-avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.75rem' }}>{(user?.name ?? 'U').split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
              <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name ?? 'Usuario'}</span>
              <Icon name="chevrons-up-down" />
            </button>
          )} />
      </div>
    </aside>
  )
}
