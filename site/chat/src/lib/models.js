/** Modelos disponibles en el selector. En el modo demo solo cambian la extensión de la respuesta simulada. */
export const MODELS = [
  { id: 'asistente', label: 'Asistente Gob', hint: 'Equilibrado para consultas generales' },
  { id: 'rapido', label: 'Respuesta rápida', hint: 'Respuestas breves y directas' },
  { id: 'detallado', label: 'Análisis detallado', hint: 'Respuestas extensas con ejemplos' },
]
export const DEFAULT_MODEL = MODELS[0].id
export const modelLabel = (id) => MODELS.find((m) => m.id === id)?.label ?? id
