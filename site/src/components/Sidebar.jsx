import useScrollSpy from './useScrollSpy.js'

export const NAV = [
  ['inicio', 'Comenzando'], ['instalacion', 'Instalación'], ['colores', 'Colores'], ['tipografia', 'Tipografía'],
  ['iconos', 'Íconos'], ['botones', 'Botones'], ['tags', 'Tags'], ['alertas', 'Alertas y banners'], ['cards', 'Cards'],
  ['navegacion', 'Navegación'], ['colapsables', 'Colapsables'], ['formularios', 'Formularios'], ['nuevos', 'Componentes nuevos (BS6)'],
  ['busqueda', 'Búsqueda y toolbar'], ['componentes', 'Tablas, listas y modal'], ['footer', 'Footer'],
  ['chat-ia', 'Chat de IA'], ['accesibilidad', 'Accesibilidad'], ['migracion', 'Migrar desde Bootstrap 4'],
]
const IDS = NAV.map(([id]) => id)

export default function Sidebar() {
  const active = useScrollSpy(IDS)
  return (
    <aside className="doc-side" aria-label="Navegación de la documentación">
      <nav>
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''}>{label}</a>
        ))}
      </nav>
    </aside>
  )
}
