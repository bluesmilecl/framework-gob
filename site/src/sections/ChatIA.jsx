import Section from '../components/Section.jsx'
import CodeBlock from '../components/CodeBlock.jsx'

export default function ChatIA() {
  return (
    <Section id="chat-ia" title="Chat de IA" lead={<>Interfaz de conversación con IA construida con este framework: historial, adjuntos, Markdown, streaming y accesibilidad. Los estilos viven en <code>gob-cl-tailwind/chat.css</code> (clases <code>.chat-*</code>) y la app de referencia en React está en <code>site/chat</code>.</>}>
      <p><a className="btn btn-primary btn-default-size" href="chat/">Abrir el asistente de demostración</a></p>
      <div className="row">
        <div className="col-md-4"><div className="card-detail"><div className="card-detail-body"><h4>Conversación</h4><p>Streaming con cursor, detener (Esc), regenerar, editar mensajes, copiar y valorar. Markdown con tablas y bloques de código con botón de copia.</p></div></div></div>
        <div className="col-md-4"><div className="card-detail"><div className="card-detail-body"><h4>Archivos</h4><p>Adjuntar con el clip, arrastrar a la ventana o pegar. Vista previa de imágenes, validación de tipo y tamaño, lectura de archivos de texto.</p></div></div></div>
        <div className="col-md-4"><div className="card-detail"><div className="card-detail-body"><h4>Historial y accesibilidad</h4><p>Sidebar con búsqueda, fijar, renombrar y eliminar; exportar a Markdown/JSON; atajos de teclado, alto contraste y tamaño de texto.</p></div></div></div>
      </div>
      <h3>Conectar un modelo real</h3>
      <p>Por defecto responde un <strong>motor de demostración local</strong> (respuestas simuladas, rotuladas como tales). Para usar un modelo de IA, implementa un proveedor con esta interfaz o apunta <em>Ajustes → Proveedor</em> a un servicio compatible con la API de OpenAI:</p>
      <CodeBlock code={`// site/chat/src/lib/providers/miProveedor.js
export const miProveedor = {
  async stream({ messages, model, signal, onToken }) {
    const res = await fetch('/api/chat', {          // TU backend: guarda la clave y controla el uso
      method: 'POST', signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages }),
    })
    if (!res.ok) throw new Error('El servicio no respondió')
    const reader = res.body.getReader()
    const dec = new TextDecoder()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      onToken(dec.decode(value, { stream: true }))   // entrega cada fragmento de texto
    }
  },
}`} />
      <div className="alert alert-warning" role="note"><strong>Seguridad:</strong> no pongas claves de API en el navegador ni expongas un endpoint sin autenticación ni límites de uso: cualquiera podría consumir tu cuota. Las respuestas de IA pueden contener errores; mantén siempre el aviso visible.</div>
    </Section>
  )
}
