import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // @vitejs/plugin-react is resolved from the example workspace package
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  plugins: [react()],
})
