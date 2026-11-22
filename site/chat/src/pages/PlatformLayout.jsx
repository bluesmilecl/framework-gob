import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppFooter, AppShell, Breadcrumbs, markActive, useModal, useToast } from 'gob-cl-tailwind/react'
import { useAuth } from '../lib/auth.jsx'

const NAV = [{ group: 'Asistente', items: [{ to: '/', label: 'Volver al chat', icon: 'messages-square' }, { to: '/archivos', label: 'Biblioteca de archivos', icon: 'folder-open' }, { to: '/ajustes', label: 'Ajustes', icon: 'settings' }] },
  { group: 'Ejemplos', items: [{ href: '../tramites/', label: 'Plataforma de trámites', icon: 'file-text' }, { href: '../', label: 'Documentación', icon: 'book-open' }] }]
const TITLES = { '/archivos': 'Biblioteca de archivos', '/ajustes': 'Ajustes' }

/** Páginas de gestión de la plataforma de IA (archivos, ajustes) con el AppShell de la librería. */
export default function PlatformLayout() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const items = markActive(NAV, (i) => (i.to ? (i.to === '/' ? false : pathname.startsWith(i.to)) : false))
  const title = pathname.startsWith('/ajustes') ? 'Ajustes' : TITLES[pathname] ?? 'Página'
  const doLogout = async () => { if (await modal.confirm({ title: 'Cerrar sesión', text: '¿Quieres cerrar tu sesión?', icon: 'log-out', confirmLabel: 'Cerrar sesión' })) { logout(); nav('/login'); toast('Sesión cerrada', 'ok') } }
  return (
    <AppShell brand={{ name: 'Asistente IA', subtitle: 'Gestión de la cuenta', href: '#/' }} nav={items} user={{ name: user.name, role: user.email }} storageKey="chat:shell" onUser={() => nav('/ajustes/perfil')}
      breadcrumbs={<Breadcrumbs as={Link} items={[{ label: 'Chat', to: '/' }, { label: title }]} />}
      renderLink={({ item, className, children, onClick }) => (item.to ? <Link to={item.to} className={className} title={item.label} onClick={onClick} aria-current={item.active ? 'page' : undefined}>{children}</Link> : <a href={item.href} className={className} title={item.label}>{children}</a>)}
      userMenu={[{ header: user.email }, { label: 'Ajustes', icon: 'settings', onSelect: () => nav('/ajustes') }, { separator: true }, { label: 'Cerrar sesión', icon: 'log-out', danger: true, onSelect: doLogout }]}
      footer={<AppFooter links={[{ label: 'Privacidad' }, { label: 'Términos' }]}>© 2026 Plataforma de IA de ejemplo · gob-cl-tailwind</AppFooter>}>
      <Outlet />
    </AppShell>
  )
}
