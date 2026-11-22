import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Icon from '../Icon.jsx'
import DropdownMenu from '../nav/DropdownMenu.jsx'
import { Avatar } from '../data/bits.jsx'
import useAccessibility from '../hooks/useAccessibility.js'

const DEFAULTS = { sidebar: 'expanded', navbar: 'light', density: 'comfortable', container: 'fixed' }
const Ctx = createContext(null)
/** Acceso al estado del shell: prefs { sidebar, navbar, density, container }, setPrefs(patch), mobileOpen, setMobileOpen. */
export const useShell = () => useContext(Ctx)

const defaultLink = ({ item, className, children, onClick }) => <a href={item.href || '#'} className={className} title={item.label} onClick={onClick} aria-current={item.active ? 'page' : undefined}>{children}</a>

function Sidebar({ brand, nav, user, onUser, renderLink }) {
  const { setMobileOpen } = useShell()
  return (
    <aside className="app-sidebar" aria-label="Navegación principal">
      <div className="app-sidebar-head">
        <a className="app-brand" href={brand.href || '#'} onClick={() => setMobileOpen(false)}>
          <img src={brand.logo || '/img/gob-footer.svg'} alt="Gobierno de Chile" />
          <span className="app-brand-name">{brand.name}{brand.subtitle && <small>{brand.subtitle}</small>}</span>
        </a>
        <div className="line" />
      </div>
      <nav className="app-nav">
        {nav.map((g) => (
          <section key={g.group}>
            {g.group && <h2 className="app-nav-title">{g.group}</h2>}
            <ul>
              {g.items.map((it) => (
                <li key={it.label}>
                  {(renderLink || defaultLink)({ item: it, className: `app-nav-link ${it.active ? 'is-active' : ''}`, onClick: () => setMobileOpen(false),
                    children: <><Icon name={it.icon} /><span>{it.label}</span>{it.badge != null && <span className="app-nav-badge">{it.badge}</span>}</> })}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      {user && (
        <div className="app-sidebar-foot">
          <button type="button" className="app-usercard" onClick={onUser} title="Mi cuenta"><Avatar name={user.name} /><div><strong>{user.name}</strong><small>{user.role}</small></div></button>
        </div>
      )}
    </aside>
  )
}

/**
 * Estructura de aplicación: sidebar (expandido | riel | oculto | móvil) + navbar + contenedor + footer.
 *  brand: { name, subtitle, logo, href }       nav: [{ group, items: [{ label, icon, href, active, badge, ...tuyo }] }]
 *  user: { name, role }   userMenu: items de DropdownMenu   actions: nodo a la derecha del navbar   breadcrumbs: nodo (<Breadcrumbs/>)
 *  onSearch: abre tu paleta/buscador   renderLink: ({ item, className, children, onClick }) => nodo (para integrar tu router)
 */
export function AppShell({ brand, nav, user, userMenu, actions, breadcrumbs, onSearch, onUser, renderLink, footer, storageKey = 'gob-shell', accessibilityTools = true, children }) {
  const a11y = useAccessibility()
  const [prefs, setPrefsState] = useState(() => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(storageKey) || '{}') } } catch { return DEFAULTS } })
  const [mobileOpen, setMobileOpen] = useState(false)
  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(prefs)) } catch { /* sin almacenamiento */ } }, [prefs, storageKey])
  const setPrefs = useCallback((p) => setPrefsState((x) => ({ ...x, ...p })), [])
  const toggleSide = useCallback(() => {
    if (window.matchMedia('(min-width: 992px)').matches) setPrefs({ sidebar: prefs.sidebar === 'expanded' ? 'rail' : 'expanded' })
    else setMobileOpen((v) => !v)
  }, [prefs.sidebar, setPrefs])

  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); toggleSide() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleSide])

  const value = useMemo(() => ({ prefs, setPrefs, reset: () => setPrefsState(DEFAULTS), mobileOpen, setMobileOpen, a11y }), [prefs, setPrefs, mobileOpen, a11y])
  const cls = `app-shell ${prefs.sidebar === 'rail' ? 'is-rail' : ''} ${prefs.sidebar === 'hidden' ? 'is-hidden-side' : ''} ${mobileOpen ? 'is-mobile-open' : ''} ${prefs.density === 'compact' ? 'is-compact' : ''}`

  return (
    <Ctx.Provider value={value}>
      <div className={cls}>
        <a className="skip-link" href="#contenido">Saltar al contenido</a>
        <Sidebar brand={brand} nav={nav} user={user} onUser={onUser} renderLink={renderLink} />
        <div className="app-scrim" onClick={() => setMobileOpen(false)} aria-hidden="true" />
        <header className={`app-navbar ${prefs.navbar === 'dark' ? 'is-dark' : ''}`}>
          <button type="button" className="app-iconbtn" aria-label="Mostrar u ocultar menú lateral" title="Menú lateral (Ctrl+B)" onClick={toggleSide}><Icon name="menu" /></button>
          {breadcrumbs}
          <span className="spacer" />
          {onSearch && <div className="app-search"><button type="button" onClick={onSearch}><Icon name="search" />Buscar o ir a… <kbd>Ctrl K</kbd></button></div>}
          {accessibilityTools && (
            <>
              <button type="button" className="app-iconbtn app-hide-sm" aria-label="Alto contraste" aria-pressed={a11y.contrast} title="Alto contraste" onClick={a11y.toggleContrast}><Icon name="contrast" /></button>
              <button type="button" className="app-iconbtn app-hide-sm" aria-label="Cambiar tamaño de texto" title={`Tamaño de texto (${['normal', 'grande', 'muy grande'][a11y.font]})`} onClick={() => a11y.setFont((a11y.font + 1) % 3)}><Icon name="increase-text" /></button>
            </>
          )}
          {actions}
          {userMenu && <DropdownMenu label="Cuenta" items={userMenu} trigger={(p) => <button type="button" className="app-iconbtn" aria-label="Cuenta" {...p}><Icon name="circle-user" /></button>} />}
        </header>
        <main className="app-main" id="contenido" tabIndex={-1}>
          {children}
          {footer}
        </main>
      </div>
    </Ctx.Provider>
  )
}

/** Marca los ítems activos según una función (ej. comparar con la ruta actual). */
export const markActive = (nav, isActive) => nav.map((g) => ({ ...g, items: g.items.map((i) => ({ ...i, active: isActive(i) })) }))
