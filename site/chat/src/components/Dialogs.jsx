import { useState } from 'react'
import Dialog from './Dialog.jsx'
import { toolbar } from '../../../../src/js/gob.js'

export function ConfirmDialog({ open, title, text, confirmLabel = 'Eliminar', onConfirm, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title={title} size="dialog-sm"
      footer={<>
        <button type="button" className="btn btn-outline-primary btn-sm" style={{ minHeight: 0 }} onClick={onClose}>Cancelar</button>
        <button type="button" className="btn btn-danger btn-sm" style={{ minHeight: 0 }} onClick={() => { onConfirm(); onClose() }}>{confirmLabel}</button>
      </>}>
      <p className="mb-0">{text}</p>
    </Dialog>
  )
}

const SHORTCUTS = [
  [['Enter'], 'Enviar mensaje'], [['Shift', 'Enter'], 'Nueva línea'], [['Esc'], 'Detener la generación'],
  [['Alt', 'N'], 'Nueva conversación'], [['Ctrl', 'K'], 'Buscar conversaciones'], [['Ctrl', 'B'], 'Mostrar u ocultar historial'], [['?'], 'Ver atajos'],
]

export function ShortcutsDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="Atajos de teclado">
      <table className="chat-shortcuts"><tbody>
        {SHORTCUTS.map(([keys, label]) => (
          <tr key={label}><td>{label}</td><td>{keys.map((k, i) => <span key={k}>{i > 0 && ' + '}<kbd>{k}</kbd></span>)}</td></tr>
        ))}
      </tbody></table>
      <p className="mt-3 mb-0"><small>En Mac usa ⌘ en lugar de Ctrl.</small></p>
    </Dialog>
  )
}

export function SettingsDialog({ open, onClose, settings, onSave, onClearAll }) {
  const [draft, setDraft] = useState(settings)
  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }))
  const isOpenAI = draft.provider === 'openai'
  return (
    <Dialog open={open} onClose={onClose} title="Ajustes"
      footer={<>
        <button type="button" className="btn btn-outline-primary btn-sm" style={{ minHeight: 0 }} onClick={onClose}>Cancelar</button>
        <button type="button" className="btn btn-primary btn-sm" style={{ minHeight: 0 }} onClick={() => { onSave(draft); onClose() }}>Guardar</button>
      </>}>
      <div className="field">
        <label htmlFor="set-provider">Proveedor de respuestas</label>
        <select id="set-provider" className="form-control" value={draft.provider} onChange={set('provider')}>
          <option value="demo">Demostración (respuestas simuladas, sin conexión)</option>
          <option value="openai">Servicio compatible con la API de OpenAI</option>
        </select>
      </div>
      {isOpenAI && (
        <>
          <div className="field"><label htmlFor="set-url">URL del servicio</label><input id="set-url" className="form-control" value={draft.baseUrl} onChange={set('baseUrl')} placeholder="https://tu-servidor/v1" /></div>
          <div className="field"><label htmlFor="set-model">Nombre del modelo</label><input id="set-model" className="form-control" value={draft.modelName} onChange={set('modelName')} placeholder="p. ej. el modelo que expone tu servicio" /></div>
          <div className="field">
            <label htmlFor="set-key">Clave de acceso (opcional)</label>
            <input id="set-key" type="password" autoComplete="off" className="form-control" value={draft.apiKey} onChange={set('apiKey')} />
            <div className="alert alert-warning mt-2 mb-0" role="note"><small style={{ color: 'inherit' }}>Una clave escrita aquí queda guardada en este navegador y es visible para quien lo use. En producción apunta la URL a tu propio backend, que guarda la clave y controla el uso.</small></div>
          </div>
        </>
      )}
      <div className="field">
        <label>Accesibilidad</label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn btn-outline-primary btn-sm" style={{ minHeight: 0 }} onClick={() => toolbar.toggleContrast()}>Alternar alto contraste</button>
          {[['Texto normal', 0], ['Texto grande', 1], ['Texto muy grande', 2]].map(([l, i]) => (
            <button key={l} type="button" className="btn btn-outline-primary btn-sm" style={{ minHeight: 0 }} onClick={() => toolbar.setFont(i)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="field mb-0">
        <label>Datos</label>
        <p><small>Las conversaciones se guardan solo en este navegador (los archivos adjuntos no se conservan, solo sus nombres).</small></p>
        <button type="button" className="btn btn-outline-danger btn-sm" style={{ minHeight: 0 }} onClick={() => { onClearAll(); onClose() }}>Borrar todas las conversaciones</button>
      </div>
    </Dialog>
  )
}
