import { uid } from './ids.js'

export const LIMITS = { maxFiles: 8, maxBytes: 10 * 1024 * 1024, maxTextChars: 60000, maxMessageChars: 8000 }

const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|xml|yaml|yml|html|css|js|jsx|ts|tsx|py|java|c|cpp|cs|go|rs|rb|php|sql|log|ini|toml|sh)$/i
const ACCEPT_EXT = /\.(pdf|docx?|xlsx?|pptx?|odt|ods|rtf|zip)$/i

export const ACCEPT = 'image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.rtf,.zip,.txt,.md,.csv,.tsv,.json,.xml,.yaml,.yml,.html,.css,.js,.jsx,.ts,.tsx,.py,.sql,.log'

/** Clasifica un archivo: imagen, texto legible o documento binario. null si el tipo no se admite. */
export const kindOf = (file) => {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('text/') || TEXT_EXT.test(file.name) || file.type === 'application/json') return 'text'
  if (ACCEPT_EXT.test(file.name) || file.type === 'application/pdf') return 'file'
  return null
}

export const formatSize = (b) => (b < 1024 ? `${b} B` : b < 1024 ** 2 ? `${(b / 1024).toFixed(b < 10240 ? 1 : 0)} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`)

/** Valida una lista de archivos contra los límites. */
export const validateFiles = (files, existingCount = 0) => {
  const accepted = [], rejected = []
  for (const f of files) {
    if (existingCount + accepted.length >= LIMITS.maxFiles) rejected.push({ name: f.name, reason: `máximo ${LIMITS.maxFiles} archivos por mensaje` })
    else if (!kindOf(f)) rejected.push({ name: f.name, reason: 'tipo de archivo no admitido' })
    else if (f.size > LIMITS.maxBytes) rejected.push({ name: f.name, reason: `supera ${formatSize(LIMITS.maxBytes)}` })
    else if (f.size === 0) rejected.push({ name: f.name, reason: 'el archivo está vacío' })
    else accepted.push(f)
  }
  return { accepted, rejected }
}

const readAs = (file, how) =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = () => reject(r.error)
    how === 'text' ? r.readAsText(file) : r.readAsDataURL(file)
  })

/** Lee el archivo y devuelve el adjunto listo para enviar. */
export const readAttachment = async (file) => {
  const kind = kindOf(file)
  const base = { id: uid(), name: file.name || 'imagen-pegada.png', size: file.size, type: file.type, kind }
  try {
    if (kind === 'image') return { ...base, dataUrl: await readAs(file, 'url') }
    if (kind === 'text') {
      const text = await readAs(file, 'text')
      return { ...base, text: text.slice(0, LIMITS.maxTextChars), truncated: text.length > LIMITS.maxTextChars }
    }
    return base
  } catch {
    return { ...base, error: 'No se pudo leer el archivo' }
  }
}

export const attachmentIcon = (a) => (a.kind === 'image' ? 'file-image' : /\.(csv|tsv|xlsx?|ods)$/i.test(a.name) ? 'file-spreadsheet' : /\.(js|jsx|ts|tsx|py|java|c|cpp|cs|go|rs|rb|php|sql|sh|html|css|json|xml|ya?ml)$/i.test(a.name) ? 'file-code' : /\.zip$/i.test(a.name) ? 'file-archive' : 'file-text')
