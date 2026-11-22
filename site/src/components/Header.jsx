/** Navbar oficial con toolbar de accesibilidad (la lógica la aporta el JS del paquete por delegación de eventos). */
export default function Header() {
  return (
    <nav className="navbar navbar-light navbar-expand-lg sticky-top">
      <div className="container">
        <a className="navbar-brand" href="#inicio"><img src="/img/gob-header.svg" alt="Gobierno de Chile" /></a>
        <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Abrir menú">
          <i className="cl cl-burger" style={{ fontSize: '1.5rem' }} />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item"><a className="nav-link" href="#instalacion">Instalación</a></li>
            <li className="nav-item"><a className="nav-link" href="#iconos">Íconos</a></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-expanded="false">Componentes</a>
              <div className="dropdown-menu">
                <a className="dropdown-item" href="#botones">Botones</a>
                <a className="dropdown-item" href="#cards">Cards</a>
                <a className="dropdown-item" href="#formularios">Formularios</a>
                <a className="dropdown-item" href="#nuevos">Nuevos (Bootstrap 6)</a>
              </div>
            </li>
            <li className="nav-item"><a className="nav-link" href="#react">React</a></li>
            <li className="nav-item"><a className="nav-link" href="#chat-ia">Chat IA</a></li>
            <li className="nav-item"><a className="nav-link" href="#migracion">Migración</a></li>
            <li className="nav-separator" />
            <li className="nav-behavior"><a className="nav-link toolbar-behavior-contrast" href="#" title="Alto contraste" aria-label="Alto contraste"><i className="cl cl-contrast" /></a></li>
            <li className="nav-behavior"><a className="nav-link toolbar-behavior-decrease" href="#" title="Disminuir texto" aria-label="Disminuir texto"><i className="cl cl-decrease-text" /></a></li>
            <li className="nav-behavior"><a className="nav-link toolbar-behavior-increase" href="#" title="Aumentar texto" aria-label="Aumentar texto"><i className="cl cl-increase-text" /></a></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
