import { useEffect, useMemo, useRef } from 'react'
import parse from 'html-react-parser'
import CodeBlock from './CodeBlock.jsx'
import { dedent } from '../lib.js'
import { initBs6 } from '../bs6.js'

/** Vista previa renderizada como elementos React reales + su código HTML. */
export default function Example({ html, className = '', tone = '' }) {
  const code = useMemo(() => dedent(html), [html])
  const node = useMemo(() => parse(code), [code])
  const ref = useRef(null)
  useEffect(() => initBs6(ref.current), [code])
  return (
    <div className={`ex ${tone}`}>
      <div ref={ref} className={`ex-preview ${className}`}>{node}</div>
      <details className="ex-code">
        <summary>Ver código</summary>
        <CodeBlock code={code} />
      </details>
    </div>
  )
}
