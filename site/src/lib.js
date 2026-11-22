/** Quita la sangría común de un bloque de código. */
export const dedent = (s) => {
  const lines = s.replace(/^\n/, '').replace(/\s+$/, '').split('\n')
  const min = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length))
  return lines.map((l) => l.slice(min)).join('\n')
}

/** Imagen de marcador de posición (SVG embebido, sin red). */
export const img = (w, h, label = '') =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#a8b7c7'/><stop offset='1' stop-color='#006fb3'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><text x='50%' y='50%' fill='white' font-family='Roboto,sans-serif' font-size='${Math.round(h / 6)}' text-anchor='middle' dominant-baseline='middle' opacity='.8'>${label}</text></svg>`,
  ).replace(/'/g, '%27')}`

export const VARIANTS = ['primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'danger', 'light', 'dark', 'accent', 'neutral']
export const cap = (s) => s[0].toUpperCase() + s.slice(1)
