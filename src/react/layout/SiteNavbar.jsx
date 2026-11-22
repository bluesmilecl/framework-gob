import { useState } from 'react'
import Icon from '../Icon.jsx'

/**
 * Navbar de sitio público (estilo gob.cl) con menú móvil: marca, enlaces y acciones.
 *  links: [{ label, href, active }]   actions: nodo (botones)   dark: variante oscura
 */
export function SiteNavbar({ logo = '/img/gob-header.svg', brandHref = '#', links = [], actions, dark = false, sticky = true }) {
  const [open, setOpen] = useState(false)
  return (
    <nav className={`navbar ${dark ? 'navbar-dark' : 'navbar-light'} navbar-expand-lg ${sticky ? 'sticky-top' : ''}`} aria-label="Principal">
      <div className="container">
        <a className="navbar-brand" href={brandHref}><img src={logo} alt="Gobierno de Chile" /></a>
        <button type="button" className={`navbar-toggler ${open ? '' : 'collapsed'}`} aria-expanded={open} aria-controls="site-nav" aria-label="Abrir menú" onClick={() => setOpen((v) => !v)}><Icon name={open ? 'x' : 'burger'} style={{ fontSize: '1.5rem' }} /></button>
        <div className={`navbar-collapse collapse ${open ? 'show' : ''}`} id="site-nav">
          <ul className="navbar-nav ml-auto">
            {links.map((l) => <li className="nav-item" key={l.label}><a className="nav-link" href={l.href} aria-current={l.active ? 'page' : undefined} style={l.active ? { textDecoration: 'underline', fontWeight: 700 } : undefined}>{l.label}</a></li>)}
            {actions && <li className="nav-item d-flex align-items-center" style={{ gap: '0.5rem', padding: '0.5rem 0.9rem' }}>{actions}</li>}
          </ul>
        </div>
      </div>
    </nav>
  )
}
