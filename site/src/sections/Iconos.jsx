import Section from '../components/Section.jsx'
import Example from '../components/Example.jsx'
import IconGallery from '../components/IconGallery.jsx'
import icons from '../../../dist/icons.json'

export default function Iconos() {
  return (
    <Section id="iconos" title={<>Íconos <span className="badge badge-primary" style={{ verticalAlign: 'middle', fontSize: '.5em' }}>{icons.length}</span></>} lead={<>Se usan como <code>&lt;i class="cl cl-search"&gt;&lt;/i&gt;</code>. Son máscaras CSS: toman el color del texto (<code>text-primary</code>) y el tamaño de la fuente (<code>text-2xl</code>, <code>.cl-3x</code>). Haz clic en un ícono para copiar su HTML.</>}>
      <Example html={`<div class="flex flex-wrap items-center gap-6">
        <i class="cl cl-search"></i>
        <i class="cl cl-login text-primary" style="font-size:2rem"></i>
        <i class="cl cl-accessibility cl-3x text-tertiary"></i>
        <i class="cl cl-ok text-success text-5xl"></i>
        <span class="text-primary">Texto con <i class="cl cl-download"></i> ícono en línea</span>
      </div>`} />
      <IconGallery />
      <p className="mt-4"><small>Íconos oficiales © Gobierno de Chile (MIT). Extras: <a href="https://lucide.dev">Lucide</a> (ISC) y <a href="https://simpleicons.org">Simple Icons</a> (CC0). Si un nombre extra coincide con uno oficial, se publica con sufijo <code>-alt</code>.</small></p>
    </Section>
  )
}
