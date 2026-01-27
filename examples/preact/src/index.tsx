import { FunctionalComponent } from 'preact'
import './style/index.css'
import App from './components/app'
import { FpProvider } from '@fingerprint/react'

const WrappedApp: FunctionalComponent = () => {
  const apiKey = process.env.PREACT_APP_FPJS_PUBLIC_API_KEY as string
  return (
    <FpProvider apiKey={apiKey}>
      <App />
    </FpProvider>
  )
}

export default WrappedApp
