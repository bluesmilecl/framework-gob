import { modelLabel } from './models.js'

export const toMarkdown = (conv) => {
  const lines = [`# ${conv.title}`, '', `_Exportado el ${new Date().toLocaleString('es-CL')} · Modelo: ${modelLabel(conv.model)}_`, '']
  for (const m of conv.messages) {
    lines.push(`## ${m.role === 'user' ? 'Usuario' : 'Asistente'}`, '')
    if (m.attachments?.length) lines.push(...m.attachments.map((a) => `- 📎 ${a.name}`), '')
    lines.push(m.content, '')
  }
  return lines.join('\n')
}

export const download = (filename, text, mime = 'text/plain') => {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }))
  const a = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const safeName = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'conversacion'
