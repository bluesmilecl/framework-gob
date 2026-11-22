import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAccessibility } from 'gob-cl-tailwind/react'
import { useAuth } from './lib/auth.jsx'
import { Forgot, Login, Register, Reset } from './pages/AuthPages.jsx'
import ChatPage from './pages/ChatPage.jsx'
import PlatformLayout from './pages/PlatformLayout.jsx'
import Settings from './pages/Settings.jsx'
import Files from './pages/Files.jsx'

function Private({ children }) {
  const { user } = useAuth()
  const loc = useLocation()
  return user ? children : <Navigate to="/login" replace state={{ from: loc.pathname }} />
}

export default function App() {
  const { user } = useAuth()
  useAccessibility()
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<Forgot />} />
      <Route path="/restablecer" element={<Reset />} />
      <Route path="/" element={<Private><ChatPage /></Private>} />
      <Route element={<Private><PlatformLayout /></Private>}>
        <Route path="/archivos" element={<Files />} />
        <Route path="/ajustes/:section?" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
