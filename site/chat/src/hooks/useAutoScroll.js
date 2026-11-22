import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/** Mantiene el scroll al final mientras llegan mensajes, salvo que la persona haya subido a leer. */
export default function useAutoScroll(ref, deps) {
  const stick = useRef(true)
  const [atBottom, setAtBottom] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const onScroll = () => {
      const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80
      stick.current = near
      setAtBottom(near)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [ref])

  useLayoutEffect(() => {
    const el = ref.current
    if (el && stick.current) el.scrollTop = el.scrollHeight
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  const scrollToBottom = useCallback((smooth = true) => {
    const el = ref.current
    if (!el) return
    stick.current = true
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
  }, [ref])

  return { atBottom, scrollToBottom }
}
