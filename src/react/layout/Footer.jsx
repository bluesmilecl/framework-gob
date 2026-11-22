import Icon from '../Icon.jsx'

/**
 * Footer institucional (estilo gob.cl): logo, columnas de enlaces, redes y línea legal.
 *  columns: [{ title, links: [{ label, href }] }]   social: [{ icon, label, href }]
 */
export function Footer({ logo = '/img/gob-footer.svg', description, columns = [], social = [], legal, className = '' }) {
  return (
    <footer className={`content-always-on-display ${className}`} style={{ minHeight: 0, padding: '36px 0 56px' }}>
      <div className="container">
        <div className="line" />
        <div className="row">
          <div className="col-md-3 mb-4">
            <img src={logo} alt="Gobierno de Chile" style={{ maxWidth: 170, marginBottom: '1rem' }} />
            {description && <p>{description}</p>}
          </div>
          {columns.map((c) => (
            <div className="col-md-3" key={c.title}>
              <div className="text-uppercase mb-3">{c.title}</div>
              {c.links.map((l) => <a key={l.label} href={l.href || '#'}>{l.label}</a>)}
            </div>
          ))}
        </div>
        {(social.length > 0 || legal) && (
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgb(255 255 255 / 0.18)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
            <small style={{ color: '#fff', lineHeight: 1.4 }}>{legal}</small>
            <ul className="footer-social" style={{ margin: 0 }}>
              {social.map((s) => <li key={s.label}><a href={s.href || '#'} aria-label={s.label}><Icon name={s.icon} /></a></li>)}
            </ul>
          </div>
        )}
      </div>
    </footer>
  )
}

/** Pie delgado para dentro de una aplicación. */
export function AppFooter({ children, links = [] }) {
  return (
    // <div> y no <footer>: el core de gob.cl da estilo de footer institucional (azul, 300 px) a ese elemento
    <div className="app-footer" role="contentinfo">
      <span>{children}</span>
      <nav aria-label="Enlaces legales">{links.map((l) => <a key={l.label} href={l.href || '#'}>{l.label}</a>)}</nav>
    </div>
  )
}
