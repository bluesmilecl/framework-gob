// Adaptador para cualquier endpoint compatible con la API de OpenAI (/chat/completions con stream:true).
// IMPORTANTE: una clave API escrita en el navegador es visible para quien use la página. En producción apunta
// `baseUrl` a TU propio backend (que guarda la clave y aplica autenticación y límites de uso).

const toContent = (m) => {
  const atts = m.attachments ?? []
  const texts = atts.filter((a) => a.text).map((a) => `\n\n[Archivo: ${a.name}]\n\`\`\`\n${a.text}\n\`\`\``).join('')
  const images = atts.filter((a) => a.dataUrl)
  if (m.role !== 'user' || !images.length) return `${m.content}${texts}`
  return [{ type: 'text', text: `${m.content}${texts}` }, ...images.map((a) => ({ type: 'image_url', image_url: { url: a.dataUrl } }))]
}

export const openaiProvider = (cfg) => ({
  id: 'openai',
  async stream({ messages, model, signal, onToken }) {
    if (!cfg.baseUrl) throw new Error('Configura la URL del servicio en Ajustes.')
    const res = await fetch(`${cfg.baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      signal,
      headers: { 'Content-Type': 'application/json', ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}) },
      body: JSON.stringify({ model: cfg.modelName || model, stream: true, messages: messages.map((m) => ({ role: m.role, content: toContent(m) })) }),
    })
    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => '')
      throw new Error(`El servicio respondió ${res.status}${detail ? `: ${detail.slice(0, 160)}` : ''}`)
    }
    const reader = res.body.getReader()
    const dec = new TextDecoder()
    let buf = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      buf += dec.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
      for (const line of lines) {
        const s = line.trim()
        if (!s.startsWith('data:')) continue
        const data = s.slice(5).trim()
        if (data === '[DONE]') return
        try { const tok = JSON.parse(data).choices?.[0]?.delta?.content; if (tok) onToken(tok) } catch { /* línea parcial */ }
      }
    }
  },
})
