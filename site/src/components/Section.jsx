export default function Section({ id, title, lead, children }) {
  return (
    <section id={id} className="doc-section">
      <h2 className="line line-primary doc-h2">{title}</h2>
      {lead && <p className="doc-lead">{lead}</p>}
      {children}
    </section>
  )
}
