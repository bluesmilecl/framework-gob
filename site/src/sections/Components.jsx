import Section from '../components/Section.jsx'
import Example from '../components/Example.jsx'
import { VARIANTS, cap, img } from '../lib.js'

const btns = (prefix, list = VARIANTS) => `<div class="flex flex-wrap gap-3">${list.map((v) => `<a href="#" class="btn btn-${prefix}${v}">${cap(v)}</a>`).join('')}</div>`
const pills = `<div class="flex flex-wrap gap-3">${VARIANTS.slice(0, 7).map((v) => `<a href="#" class="btn btn-pill-${v}">${cap(v)}</a>`).join('')}</div>`

export function Botones() {
  return (
    <Section id="botones" title="Botones" lead="Altura estándar de 60 px, esquinas rectas y texto subrayado, como el original.">
      <h3>Sólidos</h3><Example html={btns('')} />
      <h3>Contorno</h3><Example tone="ex-muted" html={btns('outline-')} />
      <h3>Píldora</h3><Example html={pills} />
      <h3>Tamaños, bloque e íconos</h3>
      <Example html={`<div class="flex flex-wrap items-center gap-3">
        <button class="btn btn-primary btn-sm">Pequeño</button>
        <button class="btn btn-primary btn-lg">Grande</button>
        <button class="btn btn-primary"><i class="cl cl-download"></i> Descargar</button>
        <button class="btn btn-outline-primary">Continuar <i class="cl cl-arrow-right"></i></button>
        <button class="btn btn-primary" disabled>Deshabilitado</button>
        <button class="btn btn-link">Botón enlace</button>
      </div>
      <div class="mt-4"><a href="#" class="btn btn-primary btn-block">Botón de ancho completo</a></div>
      <div class="mt-3"><a href="#" class="btn btn-secondary btn-default-size">Tamaño estándar (360px en desktop)</a></div>`} />
    </Section>
  )
}

export function Tags() {
  return (
    <Section id="tags" title="Tags" lead={<>Etiquetas <code>.badge</code> en todos los colores. Variante <code>.badge-pill</code>.</>}>
      <Example html={`<div class="flex flex-wrap gap-2">${VARIANTS.map((v) => `<span class="badge badge-${v}">${v}</span>`).join('')}</div>
      <div class="flex flex-wrap gap-2 mt-3">${VARIANTS.slice(0, 5).map((v) => `<span class="badge badge-pill badge-${v}">${v}</span>`).join('')}</div>`} />
    </Section>
  )
}

export function Alertas() {
  return (
    <Section id="alertas" title="Alertas y banners">
      <h3>Alertas</h3>
      <Example html={`<div class="alert alert-info" role="alert"><strong>Información:</strong> tu solicitud está en revisión.</div>
      <div class="alert alert-success" role="alert"><strong>Listo:</strong> trámite ingresado correctamente.</div>
      <div class="alert alert-warning" role="alert"><strong>Atención:</strong> revisa los datos antes de continuar.</div>
      <div class="alert alert-danger alert-dismissible" role="alert"><strong>Error:</strong> no pudimos validar tu identidad.
        <button type="button" class="close" data-dismiss="alert" aria-label="Cerrar">&times;</button></div>`} />
      <h3>Banners</h3>
      <Example html={`<div class="row">
        <div class="col-md-6"><a href="#" class="banner mb-3"><div class="line"></div><i class="cl cl-claveunica banner-icon"></i><p class="banner-text mb-0">Ingresa con ClaveÚnica a todos los trámites del Estado</p></a></div>
        <div class="col-md-6"><a href="#" class="banner banner-shadow mb-3"><div class="line"></div><i class="cl cl-document-verified banner-icon"></i><p class="banner-text mb-0">Valida tus certificados de forma digital</p></a></div>
      </div>`} />
    </Section>
  )
}

const news = (tag) => `<div class="col-md-4"><div class="card-news">
  <div class="card-news-image pseudo-background" style="background-image:url('${img(360, 125, 'Imagen')}')">${tag ? `<span class="badge badge-primary">${tag}</span>` : ''}<img class="pseudo-src" src="${img(360, 125, 'Imagen')}" alt="" style="visibility:hidden"></div>
  <div class="card-news-body"><small>13 de julio de 2026</small><a class="text-lines-7-3" href="#">¿Cómo disfrutar estas vacaciones de invierno? Sigue estas recomendaciones para que sean entretenidas y seguras</a></div>
</div></div>`

export function Cards() {
  const bg = (w, h, l) => `style="background-image:url('${img(w, h, l)}')"`
  return (
    <Section id="cards" title="Cards" lead="Todas las variantes oficiales. Las imágenes usan marcadores de posición.">
      <h3>Featured</h3>
      <Example html={`<div class="row">${[1, 2, 3].map(() => `<div class="col-md-4"><a class="card-featured" href="#">
        <div class="card-featured-image pseudo-background" ${bg(360, 125, 'Imagen')}><span class="badge badge-primary">Tag</span></div>
        <div class="card-featured-body"><small>Salud</small><p class="mb-0">Conoce el nuevo calendario de vacunación para este año</p></div></a></div>`).join('')}</div>`} />
      <h3>News</h3>
      <Example html={`<div class="row">${news('') + news('Tag') + news('')}</div>`} />
      <h3>Informative</h3>
      <Example html={`<div class="row">${[1, 2, 3].map((i) => `<div class="col-md-4"><div class="card-informative">
        <div class="card-informative-image pseudo-background" ${bg(360, 200, 'Imagen')}></div>
        <div class="card-informative-body"><a href="#">Título informativo ${i}</a><p>Descripción breve del contenido que se muestra en esta tarjeta informativa de dos líneas.</p></div></div></div>`).join('')}</div>`} />
      <h3>Data list</h3>
      <Example html={`<div class="card-data-list">
        <div class="card-data"><div class="card-data-title"><div class="card-data-quantity">1.250</div><h5>Conjuntos de datos</h5></div><p>Información pública disponible para su reutilización.</p></div>
        <div class="card-data"><div class="card-data-title"><div class="card-data-quantity">87</div><h5>Organizaciones</h5></div><p>Instituciones que publican datos abiertos.</p></div>
        <div class="card-data"><div class="card-data-title"><div class="card-data-quantity">24</div><h5>Categorías</h5></div><p>Temáticas para explorar el catálogo.</p></div></div>`} />
      <h3>Category · Detail · Organization</h3>
      <Example html={`<div class="row">
        <div class="col-md-4"><div class="card-category"><div class="card-category-image pseudo-background" ${bg(360, 110, 'Categoría')}></div><div class="card-category-body"><h4 class="mb-0">Salud</h4></div></div></div>
        <div class="col-md-4"><div class="card-detail"><div class="card-detail-image-container"><img src="/img/gob-header.svg" alt="Gobierno de Chile"></div><div class="card-detail-body"><h4>Detalle</h4><p>Contenido descriptivo con borde redondeado de .25rem.</p></div></div></div>
        <div class="col-md-4"><div class="card-organization"><div class="card-organization-image-container"><img src="/img/gob-icon.svg" alt="" style="height:64px"></div><div class="card-organization-body"><h4 class="mb-1">Ministerio</h4><small>12 conjuntos de datos</small></div></div></div></div>`} />
      <h3>Links · Function · Featured news</h3>
      <Example html={`<div class="row">
        <div class="col-md-6"><div class="card-links"><div class="card-links-image"><i class="cl cl-document-verified"></i></div><div class="card-links-body"><h4>Trámites</h4><ul class="list-unstyled"><li><a href="#">Certificado de nacimiento</a></li><li><a href="#">Cédula de identidad</a></li></ul></div></div></div>
        <div class="col-md-6"><div class="card-function"><img class="card-function-image" src="${img(200, 124, 'Foto')}" alt=""><div class="card-function-body"><h4 class="card-function-title">Nombre Apellido</h4><p>Subsecretario de Gobierno Digital</p></div></div></div></div>
      <div class="card-featured-news mt-4"><div class="card-featured-news-image"><img class="img-fluid" src="${img(480, 280, 'Noticia')}" alt=""></div>
        <div class="card-featured-news-body"><small class="d-block">13 de julio de 2026</small><h3><a href="#">Noticia destacada con imagen a la izquierda</a></h3><p>Resumen de la noticia destacada que acompaña a la imagen principal.</p></div></div>`} />
    </Section>
  )
}
