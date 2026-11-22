import Icon from './Icon.jsx'

const SUGGESTIONS = [
  { icon: 'document-verified', title: 'Pasos de un trámite', text: 'Explícame cómo hacer un trámite en línea paso a paso', prompt: 'Explícame cómo hacer un trámite en línea paso a paso' },
  { icon: 'file-code', title: 'Escribir código', text: 'Dame una función en JavaScript para validar un RUN chileno', prompt: 'Dame una función en JavaScript para validar un RUN chileno' },
  { icon: 'table', title: 'Comparar opciones', text: 'Compara los canales de atención en una tabla', prompt: 'Compara los canales de atención en una tabla' },
  { icon: 'paperclip', title: 'Analizar un archivo', text: 'Adjunta un documento y pídeme un resumen', action: 'attach' },
]

export default function EmptyState({ onPrompt, onAttach }) {
  return (
    <div className="chat-empty">
      <div className="chat-empty-logo"><Icon name="bot" /></div>
      <h1 className="line">¿En qué te puedo ayudar hoy?</h1>
      <p>Escribe un mensaje, adjunta archivos o elige una sugerencia para comenzar. Esta es una interfaz de demostración construida con el framework Gob.cl.</p>
      <div className="chat-suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s.title} type="button" className="chat-suggestion" onClick={() => (s.action === 'attach' ? onAttach() : onPrompt(s.prompt))}>
            <strong><Icon name={s.icon} />{s.title}</strong>
            <span>{s.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
