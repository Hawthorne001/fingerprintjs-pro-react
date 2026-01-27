import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import licensePlugin from 'vite-plugin-banner'
import { dependencies, version } from './package.json'
import banner2 from 'rollup-plugin-banner2'

const licenseContents = `FingerprintJS Pro React v${version} - Copyright (c) FingerprintJS, Inc, ${new Date().getFullYear()} (https://fingerprint.com)
Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.`

export default defineConfig({
  build: {
    // Bundle source maps for easier debugging
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      fileName: 'fp-pro-react',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
      plugins: [banner2(() => `'use client';\n`)],
      external: ['react', 'react-dom', ...Object.keys(dependencies)],
    },
  },
  plugins: [
    licensePlugin({
      content: licenseContents,
    }),
    dts({
      rollupTypes: true,
    }),
  ],
})
