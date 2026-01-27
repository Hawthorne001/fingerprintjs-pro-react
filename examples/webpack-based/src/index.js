import React from 'react'
import { createRoot } from 'react-dom/client'
import { FingerprintProvider } from '@fingerprint/react'
import App from './App'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
const apiKey = process.env.REACT_APP_FPJS_PUBLIC_API_KEY

root.render(
  <React.StrictMode>
    <FingerprintProvider apiKey={apiKey}>
      <App />
    </FingerprintProvider>
  </React.StrictMode>
)
