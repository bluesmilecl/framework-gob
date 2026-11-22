import Section from '../components/Section.jsx'
import Example from '../components/Example.jsx'

const nav = (id, dark) => `<nav class="navbar ${dark ? 'navbar-dark' : 'navbar-light'} navbar-expand-lg"><div class="container">
  <a class="navbar-brand ${dark ? 'text-white' : ''}" href="#">${dark ? 'Gob.cl' : '<img src="/img/gob-header.svg" alt="Gobierno de Chile">'}</a>
  <button class="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#${id}" aria-expanded="false" aria-label="Menú"><i class="cl cl-burger" style="font-size:1.5rem"></i></button>
  <div class="collapse navbar-collapse" id="${id}"><ul class="navbar-nav ml-auto">
    <li class="nav-item"><a class="nav-link" href="#">Inicio</a></li><li class="nav-item"><a class="nav-link" href="#">Servicios</a></li>
    ${dark ? '' : '<li class="nav-item"><a class="btn btn-primary" href="#">Iniciar sesión</a></li>'}
  </ul></div></div></nav>`

export function Navegacion() {
  return (
    <Section id="navegacion" title="Navegación" lead="Navbar, tabs, breadcrumb y paginación.">
      <h3>Navbar clara y oscura</h3>
      <div className="nav-demo">
        <Example className="p-0" html={nav('navDemo1', false)} />
        <Example className="p-0" html={nav('navDemo2', true)} />
      </div>
      <h3>Tabs</h3>
      <Example html={`<ul class="nav nav-tabs" role="tablist">
        <li class="nav-item"><a class="nav-link active" role="tab" href="#tab1" data-toggle="tab" aria-selected="true">Resumen</a></li>
        <li class="nav-item"><a class="nav-link" role="tab" href="#tab2" data-toggle="tab" aria-selected="false" tabindex="-1">Detalle</a></li>
        <li class="nav-item"><a class="nav-link" role="tab" href="#tab3" data-toggle="tab" aria-selected="false" tabindex="-1">Historial</a></li></ul>
      <div class="tab-content p-4 border border-t-0 border-accent">
        <div class="tab-pane active" id="tab1" role="tabpanel"><p class="mb-0">Contenido del resumen.</p></div>
        <div class="tab-pane" id="tab2" role="tabpanel"><p class="mb-0">Contenido del detalle.</p></div>
        <div class="tab-pane" id="tab3" role="tabpanel"><p class="mb-0">Contenido del historial.</p></div></div>`} />
      <h3>Breadcrumb</h3>
      <Example html={`<nav aria-label="breadcrumb"><ol class="breadcrumb"><li class="breadcrumb-item"><a href="#">Inicio</a></li><li class="breadcrumb-item"><a href="#">Servicios</a></li><li class="breadcrumb-item active" aria-current="page">Trámite</li></ol></nav>`} />
      <h3>Paginación</h3>
      <Example html={`<div class="pagination-container flex-col"><ul class="pagination">
        <li class="page-item"><a class="page-link disabled" href="#" aria-label="Anterior"><i class="cl cl-arrow-left"></i></a></li>
        <li class="page-item active"><a class="page-link" href="#">1</a></li><li class="page-item"><a class="page-link" href="#">2</a></li><li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item"><a class="page-link" href="#" aria-label="Siguiente"><i class="cl cl-arrow-right"></i></a></li></ul>
        <div class="pagination-jump"><span class="page-text">Ir a la página</span><input class="form-control page-input" type="number" value="1" aria-label="Página"><button class="btn btn-outline-primary btn-sm ml-2">Ir</button></div></div>`} />
    </Section>
  )
}

export function Colapsables() {
  return (
    <Section id="colapsables" title="Colapsables" lead={<>Listas de enlaces colapsables y acordeón, accesibles con <code>aria-expanded</code>.</>}>
      <Example html={`<div class="row"><div class="col-md-6">
      <ol class="collapsible-links" id="cl-acc">
        <li class="collapsible-links-item"><button class="collapsible-links-heading" type="button" data-toggle="collapse" data-target="#clc1" aria-controls="clc1" aria-expanded="true">1. Preguntas generales</button>
          <div id="clc1" class="collapse show" data-parent="#cl-acc"><ol class="collapsible-links-list"><li class="collapsible-links-list-item"><a href="#cl-acc">¿Qué es Datos.gob.cl?</a></li><li class="collapsible-links-list-item"><a href="#cl-acc">¿Cómo publico datos?</a></li></ol></div></li>
        <li class="collapsible-links-item"><button class="collapsible-links-heading" type="button" data-toggle="collapse" data-target="#clc2" aria-controls="clc2" aria-expanded="false">2. Preguntas de la institución</button>
          <div id="clc2" class="collapse" data-parent="#cl-acc"><ol class="collapsible-links-list"><li class="collapsible-links-list-item"><a href="#cl-acc">¿Quién administra la plataforma?</a></li></ol></div></li></ol></div>
      <div class="col-md-6"><div class="accordion-gob" id="acc2">
        <div class="accordion-item"><button class="accordion-button" type="button" data-toggle="collapse" data-target="#a1" aria-expanded="false" aria-controls="a1">¿Cómo ingreso con ClaveÚnica?</button><div id="a1" class="collapse" data-parent="#acc2"><div class="accordion-body"><p class="mb-0">Haz clic en “Iniciar sesión” e ingresa tu RUN y clave.</p></div></div></div>
        <div class="accordion-item"><button class="accordion-button" type="button" data-toggle="collapse" data-target="#a2" aria-expanded="false" aria-controls="a2">¿Dónde veo mis solicitudes?</button><div id="a2" class="collapse" data-parent="#acc2"><div class="accordion-body"><p class="mb-0">En el menú “Mis trámites”.</p></div></div></div></div></div></div>`} />
    </Section>
  )
}

export function Busqueda() {
  return (
    <Section id="busqueda" title="Búsqueda y toolbar">
      <h3>Buscador</h3>
      <Example html={`<form class="search"><input class="form-control" type="text" placeholder="Buscar trámites, servicios…" aria-label="Buscar"><div class="search-action"><button class="btn" type="submit" aria-label="Buscar"><i class="cl cl-search"></i></button></div></form>`} />
      <h3>Toolbar de accesibilidad</h3>
      <Example html={`<div class="toolbar">
        <a href="#" class="toolbar-btn toolbar-behavior-contrast" aria-label="Alto contraste"><i class="cl cl-contrast"></i></a>
        <div class="toolbar-btn-group"><a href="#" class="toolbar-btn toolbar-behavior-decrease" aria-label="Disminuir texto"><i class="cl cl-decrease-text"></i></a><a href="#" class="toolbar-btn toolbar-behavior-increase" aria-label="Aumentar texto"><i class="cl cl-increase-text"></i></a></div>
        <a href="#" class="toolbar-btn toolbar-toggler" aria-label="Accesibilidad"><i class="cl cl-accessibility toolbar-behavior-on"></i><span class="toolbar-behavior-off">X</span></a></div>`} />
      <p>Guarda en <code>localStorage</code> el contraste y el tamaño de texto (16 / 20 / 24&nbsp;px).</p>
    </Section>
  )
}
