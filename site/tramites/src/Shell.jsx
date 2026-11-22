import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppFooter, AppShell, Breadcrumbs, DropdownMenu, Icon, Modal, markActive, useModal, useToast } from 'gob-cl-tailwind/react'
import { useAuth } from './lib/auth.jsx'
import { useData } from './lib/store.jsx'

const NAV = [
  { group: 'Gestión', items: [
    { to: '/', label: 'Panel', icon: 'layout-dashboard', end: true },
    { to: '/tramites', label: 'Trámites', icon: 'file-text' },
    { to: '/tramites/nuevo', label: 'Nuevo trámite', icon: 'plus' },
  ] },
  { group: 'Administración', items: [
    { to: '/usuarios', label: 'Usuarios', icon: 'users' },
    { to: '/configuracion', label: 'Configuración', icon: 'settings' },
  ] },
  { group: 'Ejemplos', items: [
    { to: '/layouts', label: 'Layouts y contenedores', icon: 'layout-panel-left' },
    { href: '../chat/', label: 'Plataforma de IA', icon: 'bot' },
    { href: '../', label: 'Documentación', icon: 'book-open' },
  ] },
]
const TITLES = { '/': 'Panel', '/tramites': 'Trámites', '/tramites/nuevo': 'Nuevo trámite', '/usuarios': 'Usuarios', '/layouts': 'Layouts y contenedores' }

const COMMANDS = [
  { id: 'panel', label: 'Ir al Panel', icon: 'layout-dashboard', to: '/' },
  { id: 'list', label: 'Ver todos los trámites', icon: 'file-text', to: '/tramites' },
  { id: 'new', label: 'Crear un trámite', icon: 'plus', to: '/tramites/nuevo' },
  { id: 'users', label: 'Ir a Usuarios', icon: 'users', to: '/usuarios' },
  { id: 'new-user', label: 'Crear usuario', icon: 'user-plus', to: '/usuarios?nuevo=1' },
  { id: 'cfg', label: 'Configuración', icon: 'settings', to: '/configuracion' },
  { id: 'sec', label: 'Configuración: Seguridad', icon: 'shield-check', to: '/configuracion/seguridad' },
  { id: 'lay', label: 'Layouts y contenedores', icon: 'layout-panel-left', to: '/layouts' },
]

/** Paleta de comandos (Ctrl+K) construida con el Modal de la librería. */
function Palette({ open, onClose }) {
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const [i, setI] = useState(0)
  const items = useMemo(() => COMMANDS.filter((c) => c.label.toLowerCase().includes(q.trim().toLowerCase())), [q])
  useEffect(() => { if (open) { setQ(''); setI(0) } }, [open])
  useEffect(() => { setI(0) }, [q])
  const go = (c) => { onClose(); setTimeout(() => nav(c.to), 120) }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(v + 1, items.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(v - 1, 0)) }
    else if (e.key === 'Enter' && items[i]) { e.preventDefault(); go(items[i]) }
  }
  return (
    <Modal open={open} onClose={onClose} title="Buscar o ir a…" subtitle="Páginas y acciones rápidas" icon="command">
      <div className="app-field">
        <label htmlFor="cmd-q" className="sr-only">Buscar</label>
        <input id="cmd-q" className="form-control" placeholder="Escribe para filtrar…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={items[i] ? `cmd-${items[i].id}` : undefined} autoComplete="off" data-autofocus />
      </div>
      <ul id="cmd-list" role="listbox" aria-label="Resultados" className="app-list" style={{ maxHeight: '18rem', overflowY: 'auto' }}>
        {items.length === 0 && <li className="app-section-desc">Sin resultados para «{q}».</li>}
        {items.map((c, k) => (
          <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={k === i} onMouseEnter={() => setI(k)} onClick={() => go(c)}
            style={{ cursor: 'pointer', padding: '0.65rem 0.7rem', background: k === i ? 'var(--app-surface)' : undefined, borderLeft: `3px solid ${k === i ? 'var(--app-primary)' : 'transparent'}` }}>
            <Icon name={c.icon} /><span className="grow">{c.label}</span>{k === i && <kbd>Enter</kbd>}
          </li>
        ))}
      </ul>
    </Modal>
  )
}

export default function Shell() {
  const { user, logout } = useAuth()
  const { tramites } = useData()
  const { pathname } = useLocation()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const [palette, setPalette] = useState(false)

  const pending = tramites.filter((t) => t.estado === 'observado').length
  const navItems = useMemo(() => markActive(NAV.map((g) => ({ ...g, items: g.items.map((i) => (i.to === '/tramites' ? { ...i, badge: pending || null } : i)) })),
    (i) => (i.to ? (i.end ? pathname === i.to : i.to === '/tramites' ? pathname.startsWith('/tramites') && pathname !== '/tramites/nuevo' : pathname.startsWith(i.to)) : false)), [pathname, pending])

  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPalette((v) => !v) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const doLogout = async () => {
    if (await modal.confirm({ title: 'Cerrar sesión', text: '¿Quieres cerrar tu sesión en este dispositivo?', icon: 'log-out', confirmLabel: 'Cerrar sesión' })) { logout(); nav('/login'); toast('Sesión cerrada', 'ok') }
  }
  const crumbs = [{ label: 'Inicio', to: '/' }, ...(pathname === '/' ? [] : [{ label: TITLES[pathname] ?? (pathname.startsWith('/tramites/') ? 'Detalle' : pathname.startsWith('/configuracion') ? 'Configuración' : 'Página') }])]

  return (
    <>
      <AppShell
        brand={{ name: 'Trámites en línea', subtitle: 'Plataforma de ejemplo', href: '#/' }} nav={navItems} user={{ name: user.name, role: user.role }}
        onUser={() => nav('/configuracion/perfil')} storageKey="tramites:shell" onSearch={() => setPalette(true)}
        breadcrumbs={<Breadcrumbs items={crumbs} as={Link} />}
        renderLink={({ item, className, children, onClick }) => (item.to ? <Link to={item.to} className={className} title={item.label} onClick={onClick} aria-current={item.active ? 'page' : undefined}>{children}</Link> : <a href={item.href} className={className} title={item.label}>{children}</a>)}
        actions={<DropdownMenu label="Notificaciones" width="20rem" items={[{ header: 'Notificaciones' }, { label: `${pending} trámite(s) observado(s) esperan documentos`, icon: 'triangle-alert', onSelect: () => nav('/tramites') }, { label: 'Nuevo usuario registrado', icon: 'user-plus', onSelect: () => nav('/usuarios') }]} trigger={(p) => <button type="button" className="app-iconbtn" aria-label="Notificaciones" {...p}><Icon name="bell" />{pending > 0 && <span className="app-dot" />}</button>} />}
        userMenu={[{ header: user.email }, { label: 'Mi perfil', icon: 'user', onSelect: () => nav('/configuracion/perfil') }, { label: 'Configuración', icon: 'settings', onSelect: () => nav('/configuracion') }, { separator: true }, { label: 'Cerrar sesión', icon: 'log-out', danger: true, onSelect: doLogout }]}
        footer={<AppFooter links={[{ label: 'Términos' }, { label: 'Privacidad' }, { label: 'Accesibilidad' }]}>© 2026 Plataforma de ejemplo · Construida con gob-cl-tailwind</AppFooter>}
      >
        <Outlet />
      </AppShell>
      <Palette open={palette} onClose={() => setPalette(false)} />
    </>
  )
}
