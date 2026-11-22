import icons from '../../../dist/icons.json'

export default function Hero() {
  return (
    <section className="section-jumbotron bg-neutral" style={{ paddingBlock: '3.5rem' }}>
      <div className="container">
        <div className="section-body text-center">
          <h1 className="line">Framework Gob.cl <span className="text-primary">· Tailwind 4</span></h1>
          <p className="font-weight-light" style={{ maxWidth: '40rem', marginTop: '1.5rem' }}>
            El framework oficial del Gobierno de Chile sobre Tailwind CSS 4: mismos lineamientos gráficos, mismas clases y componentes, con {icons.length} íconos y sin jQuery.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <a className="btn btn-primary" href="#instalacion">Instalar</a>
            <a className="btn btn-outline-primary" href="#botones">Ver componentes</a>
          </div>
        </div>
      </div>
    </section>
  )
}
