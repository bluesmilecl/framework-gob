// Compila src/react a dist/react/index.js (ESM, JSX ya transformado; react queda como dependencia externa).
import { build } from 'esbuild'
await build({
  entryPoints: ['src/react/index.js'], bundle: true, format: 'esm', outfile: 'dist/react/index.js', target: 'es2020', jsx: 'automatic', loader: { '.js': 'jsx' },
  external: ['react', 'react-dom', 'react/jsx-runtime', 'mammoth', 'jszip'], legalComments: 'none', banner: { js: '/*! gob-cl-tailwind/react · MIT */' },
})
console.log('✔ dist/react/index.js')
