import { Icon, PageHeader, Panel, RadioGroup, useShell } from 'gob-cl-tailwind/react'

const WIDTHS = { fixed: '1140px', wide: '1400px', narrow: '760px', fluid: '100%' }
const CODE = `import { AppShell, Container, PageHeader, Panel, Breadcrumbs, AppFooter } from 'gob-cl-tailwind/react'
import 'gob-cl-tailwind/app.css'

<AppShell
  brand={{ name: 'Mi plataforma', subtitle: 'Servicio público' }}
  nav={[{ group: 'Gestión', items: [{ label: 'Panel', icon: 'layout-dashboard', href: '#/', active: true }] }]}
  user={{ name: 'María Rojas', role: 'Administradora' }}
  userMenu={[{ label: 'Cerrar sesión', icon: 'log-out', danger: true, onSelect: logout }]}
  breadcrumbs={<Breadcrumbs items={[{ label: 'Inicio' }]} />}
  footer={<AppFooter>© 2026 Mi servicio</AppFooter>}
>
  <Container size="wide">         {/* fixed | wide | narrow | fluid */}
    <PageHeader title="Panel" description="Resumen" />
    <Panel title="Contenido">…</Panel>
  </Container>
</AppShell>`

export default function Layouts() {
  const { prefs, setPrefs, reset } = useShell()
  return (
    <div className={`app-container ${prefs.container === 'fixed' ? '' : `is-${prefs.container}`}`}>
      <PageHeader title="Layouts y contenedores" description="Cambia las opciones y mira cómo responde la estructura de la aplicación en vivo." actions={<button type="button" className="btn btn-outline-primary btn-compact" onClick={reset}><Icon name="rotate-ccw" />Restablecer</button>} />
      <div className="row">
        <div className="col-lg-6 mb-4"><Panel title="Menú lateral"><RadioGroup cards name="sidebar" value={prefs.sidebar} onChange={(e) => setPrefs({ sidebar: e.target.value })} options={[{ value: 'expanded', label: 'Expandido', icon: 'panel-left-open', description: 'Íconos y texto.' }, { value: 'rail', label: 'Riel', icon: 'panel-left-close', description: 'Solo íconos.' }, { value: 'hidden', label: 'Oculto', icon: 'maximize', description: 'Pantalla completa.' }]} /></Panel></div>
        <div className="col-lg-6 mb-4"><Panel title="Barra superior"><RadioGroup cards name="navbar" value={prefs.navbar} onChange={(e) => setPrefs({ navbar: e.target.value })} options={[{ value: 'light', label: 'Clara', icon: 'sun', description: 'Con sombra institucional.' }, { value: 'dark', label: 'Oscura', icon: 'moon', description: 'Azul oscuro.' }]} /></Panel></div>
        <div className="col-12 mb-4"><Panel title="Ancho del contenedor"><RadioGroup cards name="container" value={prefs.container} onChange={(e) => setPrefs({ container: e.target.value })} options={[{ value: 'fixed', label: 'Fijo', description: '1140 px, centrado.' }, { value: 'wide', label: 'Ancho', description: '1400 px.' }, { value: 'narrow', label: 'Angosto', description: '760 px, ideal para formularios.' }, { value: 'fluid', label: 'Fluido', description: '100 % del ancho disponible.' }]} /></Panel></div>
      </div>
      <Panel title="Vista previa de la rejilla" className="mb-4">
        <div className="app-layout-preview"><div className="frame" style={{ maxWidth: WIDTHS[prefs.container] }}>
          <div className="row mb-2"><div className="col-12"><div className="app-demo-box">col-12</div></div></div>
          <div className="row mb-2"><div className="col-md-8 mb-2"><div className="app-demo-box">col-md-8</div></div><div className="col-md-4 mb-2"><div className="app-demo-box">col-md-4</div></div></div>
          <div className="row"><div className="col-6 col-md-3"><div className="app-demo-box">col-3</div></div><div className="col-6 col-md-3"><div className="app-demo-box">col-3</div></div><div className="col-6 col-md-3"><div className="app-demo-box">col-3</div></div><div className="col-6 col-md-3"><div className="app-demo-box">col-3</div></div></div>
        </div><p className="mt-2 mb-0 text-center" style={{ fontSize: '0.8rem' }}>Ancho máximo: <strong>{WIDTHS[prefs.container]}</strong></p></div>
      </Panel>
      <Panel title="Cómo se usa"><pre className="app-code" tabIndex={0}>{CODE}</pre></Panel>
    </div>
  )
}
