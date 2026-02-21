import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { FrappeProvider } from 'frappe-react-sdk'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FrappeProvider>
      <BrowserRouter basename="/frontend">
        <App />
      </BrowserRouter>
    </FrappeProvider>
  </StrictMode>,
)
