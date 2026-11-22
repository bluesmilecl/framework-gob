// Persistencia en localStorage. Los adjuntos pesados (imágenes en base64, texto) NO se guardan: solo sus metadatos.
const KEY = 'gob-chat:v1'
const SETTINGS_KEY = 'gob-chat:settings'

const slim = (c) => ({
  ...c,
  messages: c.messages.map((m) => ({
    ...m,
    status: m.status === 'streaming' ? 'stopped' : m.status,
    attachments: m.attachments?.map(({ dataUrl, text, ...meta }) => ({ ...meta, expired: Boolean(dataUrl || text || meta.expired) })),
  })),
})

export const loadState = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null')
    if (raw && Array.isArray(raw.conversations)) return raw
  } catch { /* datos corruptos: se ignoran */ }
  return { conversations: [], activeId: null }
}

export const saveState = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify({ conversations: state.conversations.map(slim), activeId: state.activeId }))
  } catch { /* cuota excedida o almacenamiento bloqueado */ }
}

export const DEFAULT_SETTINGS = { provider: 'demo', baseUrl: 'https://api.openai.com/v1', modelName: '', apiKey: '' }

export const loadSettings = () => {
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') } } catch { return DEFAULT_SETTINGS }
}
export const saveSettings = (s) => { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)) } catch { /* sin almacenamiento */ } }
export const clearAll = () => { try { localStorage.removeItem(KEY) } catch { /* noop */ } }
