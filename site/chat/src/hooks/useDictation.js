import { useCallback, useEffect, useRef, useState } from 'react'

const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null

/** Dictado por voz con la Web Speech API (si el navegador la soporta). */
export default function useDictation(onText, onError) {
  const [listening, setListening] = useState(false)
  const rec = useRef(null)

  useEffect(() => () => rec.current?.abort(), [])

  const toggle = useCallback(() => {
    if (!SR) return
    if (listening) { rec.current?.stop(); return }
    const r = new SR()
    r.lang = 'es-CL'
    r.interimResults = false
    r.continuous = false
    r.onresult = (e) => onText(Array.from(e.results).map((x) => x[0].transcript).join(' '))
    r.onerror = (e) => onError?.(e.error === 'not-allowed' ? 'Permiso de micrófono denegado.' : 'No se pudo usar el dictado por voz.')
    r.onend = () => setListening(false)
    rec.current = r
    setListening(true)
    r.start()
  }, [listening, onText, onError])

  return { supported: Boolean(SR), listening, toggle }
}
