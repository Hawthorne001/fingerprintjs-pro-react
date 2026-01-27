import '../styles/globals.css'
import { FpProvider } from '@fingerprint/react'
import { PropsWithChildren } from 'react'

const fpjsPublicApiKey = process.env.NEXT_PUBLIC_FPJS_PUBLIC_API_KEY as string

function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <FpProvider apiKey={fpjsPublicApiKey}>{children}</FpProvider>
      </body>
    </html>
  )
}

export default RootLayout
