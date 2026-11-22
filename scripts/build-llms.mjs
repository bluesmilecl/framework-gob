// Genera, a partir de skills/gob-cl-tailwind y dist/icons.json:
//   · skills/gob-cl-tailwind/references/icons.md  (catálogo de íconos por grupo)
//   · site/public/llms.txt                         (índice para LLM, formato llmstxt.org)
//   · site/public/llms-full.txt                    (todo el conocimiento en un solo archivo)
//   · site/public/skills/gob-cl-tailwind/**        (la skill descargable desde el sitio)
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const skillDir = join(root, 'skills/gob-cl-tailwind')
const pub = join(root, 'site/public')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const REPO = 'https://github.com/bluesmilecl/framework-gob'

// 1 · Catálogo de íconos
const icons = JSON.parse(readFileSync(join(root, 'dist/icons.json'), 'utf8'))
const groups = new Map()
for (const i of icons) (groups.get(i.group) ?? groups.set(i.group, []).get(i.group)).push(i.name)
const iconsMd = [
  '# Catálogo de íconos',
  '',
  `Total: **${icons.length}**. Uso: \`<i class="cl cl-NOMBRE"></i>\` o \`<Icon name="NOMBRE" />\` (React). Heredan \`currentColor\`; el tamaño sale de \`font-size\` (\`cl-2x\` … \`cl-10x\` o \`text-2xl\`). Decorativos: \`aria-hidden="true"\` (\`<Icon>\` lo pone solo); si el ícono es el único contenido de un botón, agrega \`aria-label\`.`,
  'Si un nombre extra coincidía con uno oficial se publicó con sufijo `-alt`. **No inventes nombres: elige de esta lista.** El grupo "Oficiales gob.cl" tiene prioridad por fidelidad al diseño oficial.',
  '',
  ...[...groups].flatMap(([g, names]) => [`## ${g} (${names.length})`, '', names.map((n) => `\`${n}\``).join(' '), '']),
].join('\n')
writeFileSync(join(skillDir, 'references/icons.md'), iconsMd)

// 2 · Skill descargable desde el sitio
const dest = join(pub, 'skills/gob-cl-tailwind')
rmSync(dest, { recursive: true, force: true })
mkdirSync(join(pub, 'skills'), { recursive: true })
cpSync(skillDir, dest, { recursive: true })

// 3 · llms.txt y llms-full.txt
const files = ['SKILL.md', ...readdirSync(join(skillDir, 'references')).sort().map((f) => `references/${f}`)]
const strip = (md) => md.replace(/^---[\s\S]*?---\n/, '')
const full = [
  `# gob-cl-tailwind v${pkg.version} — documentación completa para modelos de lenguaje`,
  '',
  '> Framework CSS oficial del Gobierno de Chile (gob.cl) reconstruido sobre Tailwind CSS 4, con librería de componentes React y 427 íconos. Contenido idéntico a la skill `skills/gob-cl-tailwind`.',
  '',
  ...files.flatMap((f) => [`<!-- ${f} -->`, strip(readFileSync(join(skillDir, f), 'utf8')).trim(), '']),
].join('\n')
writeFileSync(join(pub, 'llms-full.txt'), full)

const llms = `# gob-cl-tailwind

> Framework CSS del Gobierno de Chile (gob.cl) sobre Tailwind CSS 4: mismos nombres de clase, tokens y diseño que el framework oficial (framework.digital.gob.cl), más una librería de componentes React reutilizables (auth, layout con sidebar/navbar, tablas con filtros y paginación, formularios, subida y vista previa de archivos, modales, toasts, carga) y 427 íconos. Proyecto comunitario no oficial; el diseño y la marca pertenecen al Gobierno de Chile. Versión ${pkg.version}.

Reglas clave para agentes: usa los componentes y clases existentes en vez de inventar estilos; usa tokens (\`var(--color-primary)\`), no colores literales; no importes el preflight de Tailwind; interfaz en español de Chile; respeta accesibilidad (etiquetas, foco visible, alto contraste \`html.a11y-contrast\`).

## Para agentes
- [Skill completa (SKILL.md)](skills/gob-cl-tailwind/SKILL.md): reglas, instalación, selección de componentes, trampas conocidas y checklist
- [API de componentes React](skills/gob-cl-tailwind/references/components.md): props y firmas de cada componente y hook
- [Recetas de pantallas](skills/gob-cl-tailwind/references/patterns.md): shell con router, login + 2FA, CRUD, wizard con documentos, vista previa, panel, ajustes, chat
- [Clases CSS y tokens](skills/gob-cl-tailwind/references/css-classes.md): botones, cards, alertas, navegación, formularios, grilla, paleta
- [Catálogo de íconos](skills/gob-cl-tailwind/references/icons.md): ${icons.length} nombres por grupo
- [Todo en un archivo (llms-full.txt)](llms-full.txt)

## Documentación y ejemplos
- [Documentación interactiva](./): componentes con código y vista en vivo
- [Maqueta: plataforma de trámites](tramites/): auth, panel, tabla con filtros, wizard, CRUD, ajustes
- [Maqueta: plataforma de IA tipo ChatGPT](chat/): chat, archivos, ajustes
- [Código fuente y README](${REPO}): \`src/react\` (librería), \`site/tramites\` y \`site/chat\` (uso real)

## Optional
- [Paquete npm](https://www.npmjs.com/package/gob-cl-tailwind)
- [Framework oficial](https://framework.digital.gob.cl/)
`
writeFileSync(join(pub, 'llms.txt'), llms)
console.log(`✔ llms.txt · llms-full.txt (${(full.length / 1024).toFixed(0)} KB) · references/icons.md · skills/ copiada al sitio`)
