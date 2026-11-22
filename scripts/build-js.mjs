import { build } from 'esbuild'
const common = { entryPoints: ['src/js/gob.js'], bundle: true, target: 'es2019', legalComments: 'none', banner: { js: '/*! gob-cl-tailwind · MIT */' } }
await build({ ...common, format: 'iife', globalName: 'Gob', outfile: 'dist/gob.js' })
await build({ ...common, format: 'iife', globalName: 'Gob', minify: true, outfile: 'dist/gob.min.js' })
await build({ ...common, format: 'esm', outfile: 'dist/gob.esm.js' })
console.log('✔ dist/gob.js · gob.min.js · gob.esm.js')
