import { Modal } from 'gob-cl-tailwind/react'

const SHORTCUTS = [
  [['Enter'], 'Enviar mensaje'], [['Shift', 'Enter'], 'Nueva línea'], [['Esc'], 'Detener la generación'],
  [['Alt', 'N'], 'Nueva conversación'], [['Ctrl', 'K'], 'Buscar conversaciones'], [['Ctrl', 'B'], 'Mostrar u ocultar historial'], [['?'], 'Ver atajos'],
]

export function ShortcutsDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} icon="keyboard" title="Atajos de teclado" subtitle="Trabaja más rápido con el teclado"
      footer={<button type="button" className="btn btn-primary btn-compact" onClick={onClose}>Entendido</button>}>
      <table className="chat-shortcuts"><tbody>
        {SHORTCUTS.map(([keys, label]) => <tr key={label}><td>{label}</td><td>{keys.map((k, i) => <span key={k}>{i > 0 && ' + '}<kbd>{k}</kbd></span>)}</td></tr>)}
      </tbody></table>
      <p className="mt-3 mb-0"><small>En Mac usa ⌘ en lugar de Ctrl.</small></p>
    </Modal>
  )
}
