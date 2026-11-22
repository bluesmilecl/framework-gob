import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Alert, Avatar, DataTable, EmptyState, FileUpload, FilterBar, Icon, Modal, PageHeader, Panel, RunField, SelectField, StatusBadge, TextField, downloadFile, formatRun, parseCsv, toCsv, useForm, useModal, useToast, validEmail, validRun } from 'gob-cl-tailwind/react'
import { useData } from '../lib/store.jsx'
import { fmtDate } from '../lib/catalog.js'

const ROLES = ['Administrador', 'Revisor', 'Analista', 'Consulta']
const ESTADOS = [{ value: 'activo', label: 'Activo', tone: 'ok' }, { value: 'inactivo', label: 'Inactivo', tone: 'off' }, { value: 'pendiente', label: 'Pendiente', tone: 'warn' }]
const tone = (v) => ESTADOS.find((e) => e.value === v)?.tone ?? 'info'
const label = (v) => ESTADOS.find((e) => e.value === v)?.label ?? v

/** Formulario de usuario (crear / editar) dentro de un Modal: validación, guardado asíncrono y bloqueo de cierre mientras guarda. */
function UserFormModal({ open, user, existing, onClose, onSave }) {
  const [saving, setSaving] = useState(false)
  const f = useForm({
    initial: { nombre: '', run: '', email: '', rol: 'Analista', estado: 'activo', cargo: '' },
    validate: (v) => ({
      ...(v.nombre.trim().length < 3 && { nombre: 'Ingresa el nombre completo' }),
      ...(!validRun(v.run) && { run: 'El RUN no es válido' }),
      ...(existing.some((u) => u.run === v.run && u.id !== user?.id) && { run: 'Ya existe un usuario con ese RUN' }),
      ...(!validEmail(v.email) && { email: 'Ingresa un correo válido' }),
      ...(existing.some((u) => u.email.toLowerCase() === v.email.toLowerCase() && u.id !== user?.id) && { email: 'Ese correo ya está registrado' }),
    }),
  })
  useEffect(() => { if (open) f.reset(user ? { nombre: user.nombre, run: user.run, email: user.email, rol: user.rol, estado: user.estado, cargo: user.cargo } : { nombre: '', run: '', email: '', rol: 'Analista', estado: 'activo', cargo: '' }) }, [open, user]) // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault()
    f.touch(Object.keys(f.values))
    if (!f.valid) { requestAnimationFrame(() => document.querySelector('.gob-modal [aria-invalid="true"]')?.focus()); return }
    setSaving(true); await onSave(f.values); setSaving(false)
  }
  return (
    <Modal open={open} onClose={onClose} busy={saving} staticBackdrop={f.dirty} icon={user ? 'pencil' : 'user-plus'} title={user ? 'Editar usuario' : 'Nuevo usuario'} subtitle={user ? user.email : 'Completa los datos para crear la cuenta.'}
      footer={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={onClose} disabled={saving}>Cancelar</button><button type="submit" form="user-form" className="btn btn-primary btn-compact" disabled={saving}>{saving && <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true" />}{user ? 'Guardar cambios' : 'Crear usuario'}</button></>}>
      <form id="user-form" onSubmit={submit} noValidate>
        <TextField label="Nombre completo" required autoComplete="off" {...f.bind('nombre')} />
        <div className="app-field-row">
          <RunField required {...f.bind('run')} />
          <TextField label="Cargo" {...f.bind('cargo')} />
        </div>
        <TextField label="Correo electrónico" type="email" required {...f.bind('email')} />
        <div className="app-field-row">
          <SelectField label="Rol" options={ROLES} {...f.bind('rol')} />
          <SelectField label="Estado" options={ESTADOS} {...f.bind('estado')} />
        </div>
      </form>
    </Modal>
  )
}

/** Detalle en un drawer lateral. */
function UserDrawer({ user, onClose, onEdit }) {
  return (
    <Modal open={Boolean(user)} onClose={onClose} variant="drawer" title={user?.nombre ?? ''} subtitle={user?.cargo}
      footer={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={onClose}>Cerrar</button><button type="button" className="btn btn-primary btn-compact" onClick={() => onEdit(user)}><Icon name="pencil" />Editar</button></>}>
      {user && (
        <>
          <div className="app-person mb-3"><Avatar name={user.nombre} size="lg" /><span><StatusBadge tone={tone(user.estado)}>{label(user.estado)}</StatusBadge></span></div>
          <dl className="app-summary">
            <div><dt>RUN</dt><dd>{user.run}</dd></div><div><dt>Correo</dt><dd>{user.email}</dd></div><div><dt>Rol</dt><dd>{user.rol}</dd></div><div><dt>Creado</dt><dd>{fmtDate(user.creado)}</dd></div>
          </dl>
          <h3 className="h5 mt-4">Actividad reciente</h3>
          <ul className="app-timeline"><li>Inició sesión<small>hoy, 09:12</small></li><li>Revisó el trámite TR-2026-01049<small>ayer, 16:40</small></li><li>Actualizó su perfil<small>hace 3 días</small></li></ul>
        </>
      )}
    </Modal>
  )
}

/** Asistente de importación CSV: 1) cargar archivo 2) revisar filas válidas / con error 3) confirmar. */
function ImportModal({ open, onClose, existing, onImport }) {
  const [rows, setRows] = useState(null)
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (open) setRows(null) }, [open])
  const onFiles = async (items) => {
    const it = items.find((x) => x.status === 'done' && x.text != null)
    if (!it) { if (!items.length) setRows(null); return }
    const parsed = parseCsv(it.text).map((r, i) => {
      const run = formatRun(r.run || ''); const errors = []
      if (!r.nombre) errors.push('falta nombre'); if (!validRun(run)) errors.push('RUN inválido'); if (!validEmail(r.email || '')) errors.push('correo inválido')
      if (existing.some((u) => u.run === run)) errors.push('RUN ya existe')
      return { line: i + 2, nombre: r.nombre, run, email: r.email, rol: ROLES.includes(r.rol) ? r.rol : 'Consulta', cargo: r.cargo || '', errors }
    })
    setRows(parsed)
  }
  const valid = rows?.filter((r) => !r.errors.length) ?? []
  const sample = () => downloadFile('usuarios-ejemplo.csv', toCsv([{ nombre: 'Ana Pérez Soto', run: '12.345.678-5', email: 'ana@example.com', rol: 'Analista', cargo: 'Profesional' }], ['nombre', 'run', 'email', 'rol', 'cargo'].map((k) => ({ key: k, label: k }))))
  return (
    <Modal open={open} onClose={onClose} busy={busy} size="lg" icon="file-up" title="Importar usuarios" subtitle="Sube un archivo CSV con las columnas: nombre, run, email, rol, cargo"
      footer={<><button type="button" className="btn btn-link btn-compact mr-auto" onClick={sample}><Icon name="download" />Descargar archivo de ejemplo</button><button type="button" className="btn btn-outline-primary btn-compact" onClick={onClose} disabled={busy}>Cancelar</button>
        <button type="button" className="btn btn-primary btn-compact" disabled={!valid.length || busy} onClick={async () => { setBusy(true); await onImport(valid); setBusy(false) }}>Importar {valid.length || ''} usuario{valid.length === 1 ? '' : 's'}</button></>}>
      <FileUpload multiple={false} maxFiles={1} accept=".csv,text/csv" maxBytes={1024 * 1024} onChange={onFiles} hint="Primera fila: encabezados. Separador coma o punto y coma." />
      {rows && (
        <>
          <Alert tone={valid.length === rows.length ? 'success' : 'warning'} title={`${valid.length} de ${rows.length} filas listas para importar`}>{rows.length - valid.length > 0 ? 'Las filas con error se omitirán.' : 'No se encontraron errores.'}</Alert>
          <div className="app-table-wrap" style={{ maxHeight: '15rem', overflow: 'auto', border: '1px solid var(--app-border-soft)' }}>
            <table className="app-table"><thead><tr><th>Línea</th><th>Nombre</th><th>RUN</th><th>Correo</th><th>Resultado</th></tr></thead>
              <tbody>{rows.map((r) => <tr key={r.line}><td>{r.line}</td><td>{r.nombre}</td><td>{r.run}</td><td>{r.email}</td><td>{r.errors.length ? <StatusBadge tone="danger">{r.errors.join(', ')}</StatusBadge> : <StatusBadge tone="ok">Válida</StatusBadge>}</td></tr>)}</tbody></table>
          </div>
        </>
      )}
    </Modal>
  )
}

export default function Users() {
  const { users, loading, dispatch, wait } = useData()
  const modal = useModal()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState('')
  const [rol, setRol] = useState('')
  const [estado, setEstado] = useState('')
  const [form, setForm] = useState({ open: false, user: null })
  const [detail, setDetail] = useState(null)
  const [importing, setImporting] = useState(false)

  useEffect(() => { if (params.get('nuevo')) { setForm({ open: true, user: null }); setParams({}, { replace: true }) } }, [params, setParams])

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return users.filter((u) => (!rol || u.rol === rol) && (!estado || u.estado === estado) && (!s || u.nombre.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.run.includes(s)))
  }, [users, q, rol, estado])

  const save = async (v) => {
    await wait(700)
    if (form.user) { dispatch({ type: 'user/update', id: form.user.id, patch: v }); toast('Usuario actualizado', 'ok') }
    else { dispatch({ type: 'user/add', item: { id: `u${Date.now()}`, ...v, creado: new Date().toISOString() } }); toast('Usuario creado', 'ok') }
    setForm({ open: false, user: null })
  }
  const remove = async (list, done) => {
    const ok = await modal.confirm({ tone: 'danger', title: list.length > 1 ? `Eliminar ${list.length} usuarios` : 'Eliminar usuario', text: list.length > 1 ? 'Se eliminarán los usuarios seleccionados.' : `Se eliminará a ${list[0].nombre}.`, confirmLabel: 'Eliminar' })
    if (!ok) return
    dispatch({ type: 'user/remove', ids: list.map((u) => u.id) }); done?.()
    toast(`${list.length} usuario(s) eliminados`, { action: { label: 'Deshacer', onClick: () => dispatch({ type: 'user/restore', items: list }) } })
  }
  const setStatus = (list, value, done) => { dispatch({ type: 'user/status', ids: list.map((u) => u.id), estado: value }); done?.(); toast(`${list.length} usuario(s) marcados como ${label(value).toLowerCase()}`, 'ok') }
  const exportCsv = () => { downloadFile('usuarios.csv', toCsv(rows, [{ key: 'nombre', label: 'Nombre' }, { key: 'run', label: 'RUN' }, { key: 'email', label: 'Correo' }, { key: 'rol', label: 'Rol' }, { label: 'Estado', get: (r) => label(r.estado) }, { key: 'cargo', label: 'Cargo' }])); toast(`${rows.length} usuario(s) exportados`, 'ok') }
  const clear = () => { setQ(''); setRol(''); setEstado('') }

  return (
    <div className="app-container is-wide">
      <PageHeader title="Usuarios" description="Administra las cuentas de quienes operan la plataforma."
        actions={<><button type="button" className="btn btn-outline-primary btn-compact" onClick={() => setImporting(true)}><Icon name="file-up" />Importar CSV</button><button type="button" className="btn btn-outline-primary btn-compact" onClick={exportCsv} disabled={!rows.length}><Icon name="download" />Exportar</button><button type="button" className="btn btn-primary btn-compact" onClick={() => setForm({ open: true, user: null })}><Icon name="user-plus" />Nuevo usuario</button></>} />
      <Panel flush>
        <DataTable loading={loading} rows={rows} selectable caption="Listado de usuarios" noun={['usuario', 'usuarios']} defaultSort={{ key: 'nombre', dir: 'asc' }} pageSizes={[5, 10, 20]} defaultPageSize={10} onRowClick={setDetail}
          toolbar={<FilterBar search={q} onSearch={setQ} searchPlaceholder="Buscar por nombre, correo o RUN…" onClear={clear}
            filters={[{ name: 'rol', label: 'Rol', value: rol, onChange: setRol, options: ROLES.map((r) => ({ value: r, label: r })) }, { name: 'estado', label: 'Estado', value: estado, onChange: setEstado, options: ESTADOS }]} />}
          columns={[
            { key: 'nombre', header: 'Usuario', sortable: true, render: (u) => <span className="app-person"><Avatar name={u.nombre} size="sm" /><span><strong>{u.nombre}</strong><small>{u.email}</small></span></span> },
            { key: 'run', header: 'RUN', sortable: true, hideBelow: 'md' },
            { key: 'rol', header: 'Rol', sortable: true, hideBelow: 'sm' },
            { key: 'estado', header: 'Estado', sortable: true, render: (u) => <StatusBadge tone={tone(u.estado)}>{label(u.estado)}</StatusBadge> },
            { key: 'creado', header: 'Creado', sortable: true, render: (u) => fmtDate(u.creado), hideBelow: 'md' },
          ]}
          bulkActions={(sel, done) => (<>
            <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => setStatus(sel, 'activo', done)}><Icon name="user-check" />Activar</button>
            <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => setStatus(sel, 'inactivo', done)}><Icon name="user-x" />Desactivar</button>
            <button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => remove(sel, done)}><Icon name="trash-2" />Eliminar</button></>)}
          rowActions={(u) => [{ label: 'Ver detalle', icon: 'eye', onSelect: () => setDetail(u) }, { label: 'Editar', icon: 'pencil', onSelect: () => setForm({ open: true, user: u }) },
            { label: u.estado === 'activo' ? 'Desactivar' : 'Activar', icon: u.estado === 'activo' ? 'user-x' : 'user-check', onSelect: () => setStatus([u], u.estado === 'activo' ? 'inactivo' : 'activo') }, { separator: true }, { label: 'Eliminar', icon: 'trash-2', danger: true, onSelect: () => remove([u]) }]}
          empty={<EmptyState icon="users" title="No hay usuarios que coincidan" action={<button type="button" className="btn btn-outline-primary btn-compact" onClick={clear}>Limpiar filtros</button>}>Ajusta la búsqueda o crea un usuario nuevo.</EmptyState>} />
      </Panel>
      <UserFormModal open={form.open} user={form.user} existing={users} onClose={() => setForm({ open: false, user: null })} onSave={save} />
      <UserDrawer user={detail} onClose={() => setDetail(null)} onEdit={(u) => { setDetail(null); setTimeout(() => setForm({ open: true, user: u }), 220) }} />
      <ImportModal open={importing} onClose={() => setImporting(false)} existing={users} onImport={async (list) => { await wait(800); dispatch({ type: 'user/addMany', items: list.map((r, i) => ({ id: `u${Date.now()}${i}`, nombre: r.nombre, run: r.run, email: r.email, rol: r.rol, cargo: r.cargo, estado: 'pendiente', creado: new Date().toISOString() })) }); setImporting(false); toast(`${list.length} usuario(s) importados`, 'ok') }} />
    </div>
  )
}
