import { runDv, formatRun } from 'gob-cl-tailwind/react'

// PRNG determinista: los datos de ejemplo son siempre los mismos
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
export const rng = mulberry(20260622)
export const pick = (arr) => arr[Math.floor(rng() * arr.length)]
export const int = (a, b) => a + Math.floor(rng() * (b - a + 1))

const NAMES = ['Camila', 'Matías', 'Valentina', 'Benjamín', 'Antonia', 'Sebastián', 'Javiera', 'Diego', 'Catalina', 'Felipe', 'Constanza', 'Nicolás', 'Francisca', 'Tomás', 'Fernanda', 'Vicente', 'Isidora', 'Joaquín', 'Martina', 'Cristóbal']
const LAST = ['González', 'Muñoz', 'Rojas', 'Díaz', 'Pérez', 'Soto', 'Contreras', 'Silva', 'Martínez', 'Sepúlveda', 'Morales', 'Rodríguez', 'López', 'Fuentes', 'Hernández', 'Torres', 'Araya', 'Flores', 'Espinoza', 'Valenzuela']

export const fakeRun = () => { const body = String(int(7_500_000, 24_900_000)); return formatRun(body + runDv(body)) }
export const fakePerson = () => { const n = pick(NAMES), a = pick(LAST), b = pick(LAST); return { nombre: `${n} ${a} ${b}`, email: `${n}.${a}`.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '') + '@example.com', run: fakeRun() } }
export const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString()
