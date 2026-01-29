import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { FingerprintProvider } from '@fingerprint/react'

const apiKey = import.meta.env.VITE_FPJS_PUBLIC_API_KEY

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FingerprintProvider apiKey={apiKey}>
      <App />
    </FingerprintProvider>
  </StrictMode>
)
