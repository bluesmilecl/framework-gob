import { useState } from 'react'
import { dedent } from '../lib.js'

/** Bloque de código con botón "Copiar". */
export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const text = dedent(code)
  const copy = async () => {
    try { await navigator.clipboard.writeText(text) } catch { /* sin portapapeles */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="code-block">
      <button type="button" onClick={copy}>{copied ? 'Copiado' : 'Copiar'}</button>
      <pre><code>{text}</code></pre>
    </div>
  )
}
