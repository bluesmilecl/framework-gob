/** Limpia un RUN: solo dígitos y dígito verificador. */
export const cleanRun = (run) => String(run).replace(/[^0-9kK]/g, '').toUpperCase()

/** Dígito verificador de un RUN chileno (módulo 11). */
export const runDv = (body) => {
  let sum = 0, factor = 2
  for (let i = body.length - 1; i >= 0; i--) { sum += Number(body[i]) * factor; factor = factor === 7 ? 2 : factor + 1 }
  const r = 11 - (sum % 11)
  return r === 11 ? '0' : r === 10 ? 'K' : String(r)
}

export const validRun = (run) => {
  const c = cleanRun(run)
  return c.length >= 8 && c.length <= 9 && runDv(c.slice(0, -1)) === c.slice(-1)
}

/** 12.345.678-5 */
export const formatRun = (run) => {
  const c = cleanRun(run)
  if (c.length < 2) return c
  return `${c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${c.slice(-1)}`
}

export const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)
export const validPhone = (p) => !p || /^\+?[0-9\s]{8,15}$/.test(p)

/** Requisitos de una clave segura y su puntaje (0–4). */
export const passwordChecks = (p = '') => [
  { id: 'len', label: 'Al menos 8 caracteres', ok: p.length >= 8 },
  { id: 'case', label: 'Mayúsculas y minúsculas', ok: /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { id: 'num', label: 'Al menos un número', ok: /\d/.test(p) },
  { id: 'sym', label: 'Al menos un símbolo', ok: /[^A-Za-z0-9]/.test(p) },
]
export const passwordScore = (p = '') => (p ? passwordChecks(p).filter((c) => c.ok).length : 0)
export const STRENGTH_LABELS = ['', 'Muy débil', 'Débil', 'Aceptable', 'Fuerte']
