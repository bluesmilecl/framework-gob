import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { fakePerson, pick, int, daysAgo, rng } from './seed.js'
import { ESTADOS, FUNCIONARIOS, PRIORIDADES, TIPOS, tipoOf } from './catalog.js'

const KEY = 'tramites:data:v1'
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms))

const seedTramites = () => Array.from({ length: 46 }, (_, i) => {
  const tipo = pick(TIPOS); const p = fakePerson(); const created = int(0, 120)
  const estado = pick(['ingresado', 'en-revision', 'en-revision', 'observado', 'aprobado', 'aprobado', 'rechazado'])
  const timeline = [{ at: daysAgo(created), text: 'Trámite ingresado por el solicitante', by: p.nombre }]
  if (estado !== 'ingresado') timeline.push({ at: daysAgo(Math.max(created - 1, 0)), text: 'Asignado a revisión', by: pick(FUNCIONARIOS) })
  if (['aprobado', 'rechazado', 'observado'].includes(estado)) timeline.push({ at: daysAgo(Math.max(created - 3, 0)), text: estado === 'aprobado' ? 'Trámite aprobado' : estado === 'rechazado' ? 'Trámite rechazado: no cumple requisitos' : 'Observado: falta documentación', by: pick(FUNCIONARIOS) })
  return { id: `TR-2026-${String(1000 + i * 7).padStart(5, '0')}`, tipo: tipo.id, solicitante: p, estado, prioridad: pick(PRIORIDADES).value, creado: daysAgo(created), asignado: estado === 'ingresado' ? '' : pick(FUNCIONARIOS), docs: tipo.docs.map((d) => ({ name: `${d.split(' ')[0].toLowerCase()}.pdf`, label: d, size: int(80, 2400) * 1024 })), comentarios: [], timeline }
})

const ROLES = ['Administrador', 'Revisor', 'Analista', 'Consulta']
const seedUsers = () => Array.from({ length: 24 }, (_, i) => {
  const p = fakePerson()
  return { id: `u${i + 1}`, ...p, rol: pick(ROLES), estado: pick(['activo', 'activo', 'activo', 'inactivo', 'pendiente']), cargo: pick(['Jefe de unidad', 'Analista', 'Administrativo', 'Profesional', 'Técnico']), creado: daysAgo(int(1, 400)) }
})

const load = () => { try { const r = JSON.parse(localStorage.getItem(KEY) || 'null'); if (r?.tramites && r?.users) return r } catch { /* sin datos previos */ } return { tramites: seedTramites(), users: seedUsers() } }

function reducer(s, a) {
  switch (a.type) {
    case 'tramite/add': return { ...s, tramites: [a.item, ...s.tramites] }
    case 'tramite/update': return { ...s, tramites: s.tramites.map((t) => (t.id === a.id ? { ...t, ...a.patch } : t)) }
    case 'tramite/status': return { ...s, tramites: s.tramites.map((t) => (a.ids.includes(t.id) ? { ...t, estado: a.estado, timeline: [...t.timeline, { at: new Date().toISOString(), text: `Estado cambiado a «${ESTADOS.find((e) => e.value === a.estado).label}»${a.note ? `: ${a.note}` : ''}`, by: 'María Rojas' }] } : t)) }
    case 'tramite/comment': return { ...s, tramites: s.tramites.map((t) => (t.id === a.id ? { ...t, comentarios: [...t.comentarios, a.comment], timeline: [...t.timeline, { at: a.comment.at, text: 'Nuevo comentario interno', by: a.comment.by }] } : t)) }
    case 'tramite/remove': return { ...s, tramites: s.tramites.filter((t) => !a.ids.includes(t.id)) }
    case 'tramite/restore': return { ...s, tramites: [...a.items, ...s.tramites] }
    case 'user/add': return { ...s, users: [a.item, ...s.users] }
    case 'user/addMany': return { ...s, users: [...a.items, ...s.users] }
    case 'user/update': return { ...s, users: s.users.map((u) => (u.id === a.id ? { ...u, ...a.patch } : u)) }
    case 'user/remove': return { ...s, users: s.users.filter((u) => !a.ids.includes(u.id)) }
    case 'user/restore': return { ...s, users: [...a.items, ...s.users] }
    case 'user/status': return { ...s, users: s.users.map((u) => (a.ids.includes(u.id) ? { ...u, estado: a.estado } : u)) }
    case 'reset': return { tramites: seedTramites(), users: seedUsers() }
    default: return s
  }
}

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

/** Datos del ejemplo con latencia simulada (muestra estados de carga y guardado). Se guarda en localStorage. */
export function DataProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [loading, setLoading] = useState(true)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 650); return () => clearTimeout(t) }, [])
  useEffect(() => { const t = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* sin almacenamiento */ } }, 250); return () => clearTimeout(t) }, [state])
  const nextFolio = useCallback(() => `TR-2026-${String(1000 + state.tramites.length * 7 + int(1, 6) + Math.floor(rng() * 5)).padStart(5, '0')}`, [state.tramites.length])
  const api = useMemo(() => ({ ...state, loading, dispatch, wait, nextFolio, tipoOf }), [state, loading, nextFolio])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
