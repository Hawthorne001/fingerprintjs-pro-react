import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FpProvider } from '@fingerprint/react'

const apiKey = import.meta.env.VITE_FPJS_PUBLIC_API_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FpProvider apiKey={apiKey}>
      <App />
    </FpProvider>
  </StrictMode>
)
