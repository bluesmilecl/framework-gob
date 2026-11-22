const DAY = 86400000
const startOfDay = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() }

/** Agrupa conversaciones: Fijadas, Hoy, Ayer, Últimos 7 días, Últimos 30 días, Anteriores. Filtra por texto. */
export const groupConversations = (list, query = '') => {
  const q = query.trim().toLowerCase()
  const items = (q
    ? list.filter((c) => c.title.toLowerCase().includes(q) || c.messages.some((m) => m.content.toLowerCase().includes(q)))
    : list
  ).slice().sort((a, b) => b.updatedAt - a.updatedAt)
  const today = startOfDay(Date.now())
  const buckets = [['Fijadas', []], ['Hoy', []], ['Ayer', []], ['Últimos 7 días', []], ['Últimos 30 días', []], ['Anteriores', []]]
  for (const c of items) {
    if (c.pinned) { buckets[0][1].push(c); continue }
    const t = startOfDay(c.updatedAt)
    const i = t >= today ? 1 : t >= today - DAY ? 2 : t >= today - 7 * DAY ? 3 : t >= today - 30 * DAY ? 4 : 5
    buckets[i][1].push(c)
  }
  return buckets.filter(([, l]) => l.length)
}
