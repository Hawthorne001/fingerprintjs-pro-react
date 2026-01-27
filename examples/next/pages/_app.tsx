import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { FingerprintProvider } from '@fingerprint/react'

const fpjsPublicApiKey = process.env.NEXT_PUBLIC_FPJS_PUBLIC_API_KEY as string

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FingerprintProvider apiKey={fpjsPublicApiKey}>
      <Component {...pageProps} />
    </FingerprintProvider>
  )
}

export default MyApp
