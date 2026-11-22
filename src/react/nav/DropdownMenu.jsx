import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Icon from '../Icon.jsx'
import useDismiss from '../hooks/useDismiss.js'

/**
 * Menú desplegable accesible con teclado (↑ ↓ Inicio Fin, Esc, escribir para saltar).
 * items: [{ label, icon, onSelect, href, danger, disabled, checked } | { separator: true } | { header: 'Texto' }]
 * align: left | right    side: bottom | top (abre hacia arriba, p. ej. en un pie de sidebar)
 * trigger: (props) => nodo   — recibe { ref, 'aria-haspopup', 'aria-expanded', 'aria-controls', onClick } o un nodo (se envuelve en un botón)
 */
export default function DropdownMenu({ trigger, items, align = 'right', side = 'bottom', label = 'Menú', width, className = '' }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef(null)
  const menu = useRef(null)
  const id = useId()
  const close = useCallback(() => setOpen(false), [])
  useDismiss(open, wrap, close)

  const focusables = () => Array.from(menu.current?.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])') ?? [])
  useEffect(() => { if (open) requestAnimationFrame(() => focusables()[0]?.focus()) }, [open])

  const onKey = (e) => {
    const f = focusables(); const i = f.indexOf(document.activeElement)
    if (e.key === 'ArrowDown') { e.preventDefault(); f[(i + 1) % f.length]?.focus() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); f[(i - 1 + f.length) % f.length]?.focus() }
    else if (e.key === 'Home') { e.preventDefault(); f[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); f[f.length - 1]?.focus() }
    else if (e.key === 'Tab') close()
    else if (e.key.length === 1 && /\S/.test(e.key)) { const hit = f.find((n) => n.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase())); hit?.focus() }
  }
  const select = (it) => { close(); wrap.current?.querySelector('[aria-haspopup]')?.focus(); it.onSelect?.() }

  const props = { 'aria-haspopup': 'menu', 'aria-expanded': open, 'aria-controls': open ? id : undefined, onClick: () => setOpen((v) => !v) }
  return (
    <div className={`app-menu-wrap ${className}`} ref={wrap}>
      {typeof trigger === 'function' ? trigger(props) : <button type="button" className="app-iconbtn" aria-label={label} {...props}>{trigger ?? <Icon name="ellipsis-vertical" />}</button>}
      {open && (
        <div id={id} ref={menu} className="app-menu" role="menu" aria-label={label} style={{ [align === 'left' ? 'left' : 'right']: 0, width, ...(side === 'top' ? { top: 'auto', bottom: 'calc(100% + 6px)' } : null) }} onKeyDown={onKey}>
          {items.map((it, k) => {
            if (it.separator) return <hr key={k} />
            if (it.header) return <div key={k} className="app-menu-head">{it.header}</div>
            const common = { role: it.checked !== undefined ? 'menuitemcheckbox' : 'menuitem', 'aria-checked': it.checked, 'aria-disabled': it.disabled || undefined, tabIndex: -1, className: it.danger ? 'is-danger' : '' }
            return it.href && !it.disabled
              ? <a key={k} href={it.href} {...common} onClick={close}>{it.icon && <Icon name={it.icon} />}{it.label}</a>
              : <button key={k} type="button" {...common} disabled={it.disabled} onClick={() => select(it)}>{it.icon && <Icon name={it.icon} />}{it.label}{it.checked && <Icon name="check" style={{ marginLeft: 'auto' }} />}</button>
          })}
        </div>
      )}
    </div>
  )
}
