import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import '../../src/js/gob.js' // colapsables, dropdown, tabs, modal, toolbar de accesibilidad (data-toggle)
import '../../dist/next/bootstrap6.bundle.min.js' // componentes nuevos de Bootstrap 6 (data-bs-toggle)
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
