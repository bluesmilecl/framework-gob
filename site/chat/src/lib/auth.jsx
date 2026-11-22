import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Autenticación SIMULADA para la maqueta (sin servidor). Cuenta de demostración: demo@example.com / Demo1234!
const SESSION = 'chat:session'
const ACCOUNTS = 'chat:accounts'
export const DEMO = { identifier: 'demo@example.com', password: 'Demo1234!' }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d } catch { return d } }

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION, null))
  const login = useCallback(async ({ identifier, password }) => {
    await wait(650)
    const id = identifier.trim().toLowerCase()
    const acc = id === DEMO.identifier && password === DEMO.password ? { name: 'Camila Soto', email: DEMO.identifier } : read(ACCOUNTS, []).find((a) => (a.email === id || a.run === identifier.trim()) && a.password === password)
    if (!acc) throw new Error('Las credenciales no son correctas. Revisa tu RUN o correo y tu clave.')
    const u = { name: acc.name, email: acc.email }
    try { localStorage.setItem(SESSION, JSON.stringify(u)) } catch { /* sin almacenamiento */ }
    setUser(u)
  }, [])
  const register = useCallback(async (v) => {
    await wait(800)
    const list = read(ACCOUNTS, [])
    if (list.some((a) => a.email === v.email.toLowerCase()) || v.email.toLowerCase() === DEMO.identifier) throw new Error('Ya existe una cuenta con ese correo.')
    localStorage.setItem(ACCOUNTS, JSON.stringify([...list, { name: `${v.names} ${v.lastNames}`, email: v.email.toLowerCase(), run: v.run, password: v.password }]))
  }, [])
  const logout = useCallback(() => { try { localStorage.removeItem(SESSION) } catch { /* noop */ } setUser(null) }, [])
  const value = useMemo(() => ({ user, login, register, logout, forgot: () => wait(800), reset: () => wait(800) }), [user, login, register, logout])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
