export default function Footer() {
  return (
    <footer className="content-always-on-display" style={{ minHeight: 0, padding: '30px 0 50px' }}>
      <div className="container">
        <div className="line" />
        <div className="row">
          <div className="col-md-6">
            <img className="mb-3" src="/img/gob-footer.svg" alt="Gobierno de Chile" style={{ maxWidth: 170 }} />
            <p>Traspaso del framework de <a href="https://framework.digital.gob.cl/" style={{ display: 'inline', width: 'auto', height: 'auto', padding: 0, whiteSpace: 'normal', color: '#fff' }}>framework.digital.gob.cl</a> sobre Tailwind CSS 4. Licencia MIT.</p>
          </div>
          <div className="col-md-6">
            <div className="text-uppercase mb-3">Créditos</div>
            <p className="mb-0">Diseño y marca © Gobierno de Chile · División de Gobierno Digital. Framework original © Magnet SpA (MIT). Bootstrap © The Bootstrap Authors. Íconos extra: Lucide (ISC), Simple Icons (CC0).</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
