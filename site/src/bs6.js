// Los componentes de Bootstrap 6 con inicialización propia (OTP, fuerza de clave, chips) no se auto-inicializan
// cuando React monta el DOM después de la carga: se instancian aquí.
import { OtpInput, Strength, Chips } from '../../dist/next/bootstrap6.bundle.min.js'

const PLUGINS = [
  ['[data-bs-otp]', OtpInput],
  ['[data-bs-strength]', Strength],
  ['[data-bs-chips]', Chips],
]

export const initBs6 = (root) => {
  if (!root) return
  for (const [selector, Plugin] of PLUGINS) {
    root.querySelectorAll(selector).forEach((el) => {
      try { Plugin.getOrCreateInstance(el) } catch { /* ya inicializado */ }
    })
  }
}
