import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Autenticación SIMULADA para la maqueta: no hay servidor. Cuenta de demostración: demo@example.com / Demo1234!
const SESSION = 'tramites:session'
const ACCOUNTS = 'tramites:accounts'
export const DEMO = { identifier: 'demo@example.com', password: 'Demo1234!', code: '123456' }
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d } catch { return d } }

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(SESSION, null))
  const [pending, setPending] = useState(null) // credenciales válidas a la espera del segundo factor

  const login = useCallback(async ({ identifier, password }) => {
    await wait(700)
    const accounts = read(ACCOUNTS, [])
    const id = identifier.trim().toLowerCase()
    const acc = id === DEMO.identifier && password === DEMO.password ? { name: 'María Rojas', email: DEMO.identifier, role: 'Administradora' } : accounts.find((a) => (a.email === id || a.run === identifier.trim()) && a.password === password)
    if (!acc) throw new Error('Las credenciales no son correctas. Revisa tu RUN o correo y tu clave.')
    setPending({ name: acc.name, email: acc.email, role: acc.role || 'Funcionario/a' })
  }, [])

  const verify = useCallback(async (code) => {
    await wait(600)
    if (code !== DEMO.code) throw new Error('El código no es correcto. Intenta nuevamente.')
    const u = pending
    try { localStorage.setItem(SESSION, JSON.stringify(u)) } catch { /* sin almacenamiento */ }
    setUser(u); setPending(null)
  }, [pending])

  const register = useCallback(async (v) => {
    await wait(800)
    const accounts = read(ACCOUNTS, [])
    if (accounts.some((a) => a.email === v.email.toLowerCase()) || v.email.toLowerCase() === DEMO.identifier) throw new Error('Ya existe una cuenta con ese correo.')
    localStorage.setItem(ACCOUNTS, JSON.stringify([...accounts, { name: `${v.names} ${v.lastNames}`, email: v.email.toLowerCase(), run: v.run, password: v.password }]))
  }, [])

  const logout = useCallback(() => { try { localStorage.removeItem(SESSION) } catch { /* noop */ } setUser(null) }, [])
  const value = useMemo(() => ({ user, pending, login, verify, register, logout, forgot: () => wait(800), reset: () => wait(800) }), [user, pending, login, verify, register, logout])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
