import Section from '../components/Section.jsx'
import Example from '../components/Example.jsx'
import CodeBlock from '../components/CodeBlock.jsx'

export function Componentes() {
  return (
    <Section id="componentes" title="Tablas, listas y modal">
      <Example html={`<div class="row">
        <div class="col-md-7"><table class="table table-striped table-hover"><thead><tr><th>Trámite</th><th>Estado</th><th>Fecha</th></tr></thead><tbody>
          <tr><td>Certificado de nacimiento</td><td><span class="badge badge-success">Listo</span></td><td>12/07/2026</td></tr>
          <tr><td>Cédula de identidad</td><td><span class="badge badge-warning">En proceso</span></td><td>10/07/2026</td></tr>
          <tr><td>Licencia de conducir</td><td><span class="badge badge-danger">Rechazado</span></td><td>08/07/2026</td></tr></tbody></table></div>
        <div class="col-md-5"><div class="list-group"><a class="list-group-item list-group-item-action active" href="#">Mis trámites</a><a class="list-group-item list-group-item-action" href="#">Mis documentos</a><a class="list-group-item list-group-item-action" href="#">Ayuda</a></div>
          <div class="progress mt-4"><div class="progress-bar" style="width:65%" role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">65%</div></div></div></div>
      <button class="btn btn-outline-primary mt-4" data-toggle="modal" data-target="#demoModal">Abrir modal</button>
      <div class="modal" id="demoModal" tabindex="-1" role="dialog" aria-labelledby="demoModalTitle" aria-hidden="true"><div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content">
        <div class="modal-header"><h4 class="modal-title" id="demoModalTitle">Confirmar acción</h4><button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">&times;</button></div>
        <div class="modal-body"><p class="mb-0">¿Deseas continuar con el trámite?</p></div>
        <div class="modal-footer"><button class="btn btn-outline-primary" data-dismiss="modal" style="min-height:0">Cancelar</button><button class="btn btn-primary" data-dismiss="modal" style="min-height:0">Continuar</button></div></div></div></div>`} />
    </Section>
  )
}

export function FooterDoc() {
  const soc = [['facebook', 'Facebook', '@GobiernoDeChile'], ['x-twitter', 'X', '@GobiernodeChile'], ['instagram', 'Instagram', '@gobiernodechile'], ['youtube', 'YouTube', 'GobiernoChile']]
  return (
    <Section id="footer" title="Footer" lead="Footer oficial con línea institucional y columnas de enlaces (se colapsa a una franja en móvil).">
      <Example className="p-0 overflow-hidden" html={`<footer class="content-always-on-display" style="width:auto"><div class="container"><div class="line"></div><div class="row">
        <div class="col-md-3"><img class="mb-3" src="/img/gob-footer.svg" alt="Gobierno de Chile" style="max-width:170px"><p>La alternativa para digitalizar los trámites de la ciudadanía.</p></div>
        <div class="col-md-3"><div class="text-uppercase mb-3">Secciones</div><a href="#">Conjuntos de datos</a><a href="#">Organizaciones</a><a href="#">Categorías</a></div>
        <div class="col-md-3"><div class="text-uppercase mb-3">Enlaces internos</div><a href="#">Políticas de privacidad</a><a href="#">Términos y condiciones</a><a href="#">Licenciamiento</a></div>
        <div class="col-md-3"><div class="text-uppercase mb-3">Ayuda institucional</div><a href="#">Ingreso de solicitud</a><b class="d-block mt-3">Mesa de ayuda</b><p class="mb-0">Lu - Vi / 9:00 - 18:00</p><a href="tel:6003970000">600 397 0000</a></div></div></div></footer>`} />
      <h3>Redes sociales</h3>
      <Example html={`<div class="row">${soc.map(([c, n, u]) => `<div class="col-6 col-lg-3"><a class="social" href="#"><div class="social-icon"><i class="cl cl-${c}"></i></div><div class="social-name">${n}</div><div class="social-url">${u}</div></a></div>`).join('')}</div>`} />
    </Section>
  )
}

export function Accesibilidad() {
  return (
    <Section id="accesibilidad" title="Accesibilidad" lead="Cumple con los lineamientos de la guía de accesibilidad del Estado.">
      <ul>
        <li><strong>Alto contraste</strong>: clase <code>a11y-contrast</code> en <code>&lt;html&gt;</code> (o el botón de la toolbar). Aplica el tema oficial del framework original a todos sus componentes. Para utilidades Tailwind y componentes Bootstrap 6 importa además <code>gob-cl-tailwind/contrast-tokens.css</code>.</li>
        <li><strong>Tamaño de texto</strong>: <code>a11y-font-1</code> (20px) y <code>a11y-font-2</code> (24px). Todo el sistema usa <code>rem</code>.</li>
        <li><strong>Foco visible</strong> en todos los elementos interactivos y enlace “Saltar al contenido” (<code>.skip-link</code>).</li>
        <li><strong>Movimiento reducido</strong>: se respeta <code>prefers-reduced-motion</code>.</li>
        <li>Tabs con navegación por teclado (flechas, Home, End) y ESC cierra dropdown/modal.</li>
      </ul>
      <Example html={`<button class="btn btn-outline-primary toolbar-behavior-contrast">Alternar alto contraste</button>`} />
    </Section>
  )
}

export function Migracion() {
  return (
    <Section id="migracion" title="Migrar desde Bootstrap 4" lead="El framework original dependía de Bootstrap 4 + jQuery + Popper. Estos son los equivalentes.">
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead><tr><th>Antes (Bootstrap 4)</th><th>Ahora</th><th>Nota</th></tr></thead>
          <tbody>
            <tr><td><code>npm i @gobdigital-cl/gob.cl</code></td><td><code>npm i gob-cl-tailwind tailwindcss</code></td><td>Sin jQuery ni Popper</td></tr>
            <tr><td><code>.btn-primary</code>, <code>.card-news</code>, <code>.navbar</code>…</td><td>Igual</td><td>Mismos nombres de clase</td></tr>
            <tr><td><code>.row</code>, <code>.col-md-4</code>, <code>.d-flex</code>, <code>.mb-3</code>…</td><td>Igual con <code>compat.css</code></td><td>Utilidades Bootstrap 4 (<code>!important</code>)</td></tr>
            <tr><td><code>.mb-3</code> en un proyecto Tailwind-nativo</td><td><code>.mb-4</code> (n × 0.25rem)</td><td>La escala cambia</td></tr>
            <tr><td><code>.w-100</code> · <code>.mw-100</code></td><td><code>.w-full</code> · <code>.max-w-full</code></td><td>Con <code>compat.css</code> siguen funcionando</td></tr>
            <tr><td><code>$(…).collapse()</code>, <code>data-toggle</code></td><td><code>data-toggle</code> · <code>Gob.collapse.toggle(el)</code></td><td>JS vanilla</td></tr>
            <tr><td>Variables SCSS (<code>$primary</code>)</td><td><code>var(--color-primary)</code></td><td>Personalizable con <code>@theme</code></td></tr>
          </tbody>
        </table>
      </div>
      <h3>Personalizar el tema</h3>
      <CodeBlock code={`@import "tailwindcss/theme.css" layer(theme);
@import "gob-cl-tailwind";
@import "tailwindcss/utilities.css" layer(utilities);

/* Sobrescribe tokens (p. ej. otro acento para un sitio institucional) */
@theme {
  --color-accent: #8fa3b8;
}`} />
    </Section>
  )
}
