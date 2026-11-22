import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth } from './lib/auth.jsx'
import Shell from './Shell.jsx'
import { Forgot, Login, Register, Reset, Verify } from './pages/AuthPages.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TramitesList from './pages/TramitesList.jsx'
import NuevoTramite from './pages/NuevoTramite.jsx'
import TramiteDetalle from './pages/TramiteDetalle.jsx'
import Users from './pages/Users.jsx'
import Settings from './pages/Settings.jsx'
import Layouts from './pages/Layouts.jsx'

function Private({ children }) {
  const { user } = useAuth()
  const loc = useLocation()
  return user ? children : <Navigate to="/login" replace state={{ from: loc.pathname }} />
}

export default function App() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  useEffect(() => { document.title = 'Trámites en línea · Framework Gob.cl' }, [pathname])
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<Forgot />} />
      <Route path="/restablecer" element={<Reset />} />
      <Route path="/verificar" element={<Verify />} />
      <Route element={<Private><Shell /></Private>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tramites" element={<TramitesList />} />
        <Route path="/tramites/nuevo" element={<NuevoTramite />} />
        <Route path="/tramites/:id" element={<TramiteDetalle />} />
        <Route path="/usuarios" element={<Users />} />
        <Route path="/configuracion/:section?" element={<Settings />} />
        <Route path="/layouts" element={<Layouts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
