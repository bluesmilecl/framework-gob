import { useEffect, useRef } from 'react'

/** Diálogo accesible basado en <dialog> nativo (estilos .dialog de la capa Bootstrap 6 con tema gob). */
export default function Dialog({ open, onClose, title, children, footer, size = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])
  return (
    <dialog
      ref={ref}
      className={`dialog ${size}`}
      aria-labelledby="dlg-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      {open && (
        <>
          <div className="dialog-header">
            <h2 className="dialog-title" id="dlg-title">{title}</h2>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
          </div>
          <div className="dialog-body chat-dialog-body">{children}</div>
          {footer && <div className="dialog-footer">{footer}</div>}
        </>
      )}
    </dialog>
  )
}
