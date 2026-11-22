import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ModalProvider, ToastProvider } from 'gob-cl-tailwind/react'
import './styles.css'
import App from './App.jsx'
import { AuthProvider } from './lib/auth.jsx'
import { DataProvider } from './lib/store.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <ModalProvider>
          <AuthProvider>
            <DataProvider>
              <App />
            </DataProvider>
          </AuthProvider>
        </ModalProvider>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
