import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import '../../../src/js/gob.js' // toolbar de accesibilidad (alto contraste y tamaño de texto)
import App from './App.jsx'
import { ToastProvider } from './components/Toasts.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
