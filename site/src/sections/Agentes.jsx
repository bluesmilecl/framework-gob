import Section from '../components/Section.jsx'
import CodeBlock from '../components/CodeBlock.jsx'

const FILES = [
  ['llms.txt', 'Índice breve para modelos (estándar llmstxt.org).'],
  ['llms-full.txt', 'Todo el conocimiento en un solo archivo (≈ 40 KB): para pegar en un chat o cargar como contexto.'],
  ['skills/gob-cl-tailwind/SKILL.md', 'La skill: reglas, instalación, qué componente usar, accesibilidad, trampas conocidas y checklist.'],
  ['skills/gob-cl-tailwind/references/components.md', 'API de cada componente y hook de React.'],
  ['skills/gob-cl-tailwind/references/patterns.md', 'Recetas de pantallas completas: shell con router, login + 2FA, CRUD, wizard, vista previa, ajustes.'],
  ['skills/gob-cl-tailwind/references/css-classes.md', 'Clases oficiales, tokens de color y breakpoints.'],
  ['skills/gob-cl-tailwind/references/icons.md', 'Catálogo de los 427 íconos por grupo.'],
]

export default function Agentes() {
  return (
    <Section id="agentes" title="Para agentes de IA" lead={<>Contexto listo para que Claude Code, Cursor, Copilot o cualquier agente construya interfaces <strong>fieles al diseño oficial</strong> sin inventar estilos: una <em>skill</em> instalable y archivos <code>llms.txt</code>.</>}>
      <h3>Instalar la skill (Claude Code)</h3>
      <p>La skill enseña al agente a elegir los componentes correctos, respetar la identidad gob.cl, cubrir accesibilidad y evitar las trampas conocidas. Viene dentro del paquete npm y del repositorio:</p>
      <CodeBlock code={`# Desde un proyecto que ya instaló gob-cl-tailwind
mkdir -p .claude/skills && cp -r node_modules/gob-cl-tailwind/skills/gob-cl-tailwind .claude/skills/

# Global (todos tus proyectos)
mkdir -p ~/.claude/skills && cp -r node_modules/gob-cl-tailwind/skills/gob-cl-tailwind ~/.claude/skills/`} />
      <p>Después basta pedir, por ejemplo: <em>«crea una plataforma de gestión de trámites con login, tabla con filtros y formulario de solicitud con gob.cl»</em>. El agente cargará la skill sola cuando detecte el tema.</p>
      <h3>Otros agentes: llms.txt</h3>
      <p>Para Cursor, Copilot, ChatGPT u otros, entrega la URL o el contenido de <a href="llms-full.txt"><code>llms-full.txt</code></a> (o referencia <code>llms.txt</code>, que enlaza al resto). En Cursor puedes añadirlo como documento en <em>Docs</em>; en otros, pégalo en las reglas del proyecto (<code>AGENTS.md</code>, <code>.cursorrules</code>, <code>copilot-instructions.md</code>).</p>
      <div className="table-responsive"><table className="table table-bordered"><thead><tr><th>Archivo</th><th>Contenido</th></tr></thead><tbody>{FILES.map(([f, d]) => <tr key={f}><td><a href={f}><code>{f}</code></a></td><td>{d}</td></tr>)}</tbody></table></div>
      <h3>Qué garantiza la skill</h3>
      <ul>
        <li>Prefiere componentes de <code>gob-cl-tailwind/react</code> y clases oficiales antes de escribir CSS propio; usa tokens, nunca colores literales.</li>
        <li>Cubre siempre los estados de carga, vacío y error; confirma acciones destructivas con <em>Deshacer</em>.</li>
        <li>Accesibilidad WCAG: etiquetas, foco visible, teclado, alto contraste y tamaño de texto.</li>
        <li>Evita errores típicos: preflight de Tailwind, <code>&lt;footer&gt;</code> global, <code>container</code> distinto al de Tailwind, íconos inexistentes, autenticación solo en el cliente.</li>
      </ul>
      <p className="mb-0">Estos archivos se regeneran con <code>npm run build:llms</code> a partir de <code>skills/gob-cl-tailwind</code>, así que la documentación para agentes y la skill nunca se desfasan.</p>
    </Section>
  )
}
