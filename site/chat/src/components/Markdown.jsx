import { memo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Icon from './Icon.jsx'

function CodeBlock({ lang, code, onCopied }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setCopied(true); onCopied?.(); setTimeout(() => setCopied(false), 1500) } catch { /* sin portapapeles */ }
  }
  return (
    <div className="chat-code">
      <div className="chat-code-head">
        <span>{lang || 'código'}</span>
        <button type="button" onClick={copy} aria-label="Copiar código">
          <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  )
}

const components = {
  pre: ({ children }) => <>{children}</>,
  code({ className, children }) {
    const text = String(children).replace(/\n$/, '')
    const lang = /language-([\w-]+)/.exec(className || '')?.[1]
    return lang || text.includes('\n') ? <CodeBlock lang={lang} code={text} /> : <code>{children}</code>
  },
  a: ({ node, ...p }) => <a {...p} target="_blank" rel="noopener noreferrer" />,
}

/** Renderiza Markdown (GFM) de forma segura: no interpreta HTML crudo. */
function Markdown({ children }) {
  return (
    <div className="chat-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{children}</ReactMarkdown>
    </div>
  )
}
export default memo(Markdown)
