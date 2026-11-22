import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, CheckboxField, DateField, FileUpload, Icon, PageHeader, Panel, RadioGroup, RunField, SelectField, Stepper, Switch, TextField, TextareaField, downloadFile, formatSize, useForm, useModal, useToast, validEmail, validPhone, validRun } from 'gob-cl-tailwind/react'
import { useAuth } from '../lib/auth.jsx'
import { useData } from '../lib/store.jsx'
import { REGIONES, TIPOS, fmtDate, tipoOf } from '../lib/catalog.js'

const STEPS = ['Trámite', 'Solicitante', 'Documentos', 'Revisión']
const DRAFT = 'tramites:draft'
const INITIAL = { tipo: '', nombre: '', run: '', email: '', telefono: '', region: '', comuna: '', direccion: '', representa: false, runRep: '', nombreRep: '', declaro: false }
const STEP_FIELDS = [['tipo'], ['nombre', 'run', 'email', 'telefono', 'region', 'comuna', 'direccion', 'runRep', 'nombreRep'], [], ['declaro']]

const validate = (v) => ({
  ...(!v.tipo && { tipo: 'Elige el trámite que quieres realizar' }),
  ...(!v.nombre.trim() && { nombre: 'Ingresa tu nombre completo' }), ...(!validRun(v.run) && { run: 'El RUN no es válido' }),
  ...(!validEmail(v.email) && { email: 'Ingresa un correo válido' }), ...(!validPhone(v.telefono) && { telefono: 'Teléfono no válido' }),
  ...(!v.region && { region: 'Selecciona una región' }), ...(!v.comuna && { comuna: 'Selecciona una comuna' }), ...(!v.direccion.trim() && { direccion: 'Ingresa tu dirección' }),
  ...(v.representa && !validRun(v.runRep) && { runRep: 'El RUN del representado no es válido' }), ...(v.representa && !v.nombreRep.trim() && { nombreRep: 'Ingresa el nombre del representado' }),
  ...(!v.declaro && { declaro: 'Debes declarar que la información es verídica' }),
})

const comprobante = (t) => `COMPROBANTE DE INGRESO\n======================\nFolio:      ${t.id}\nTrámite:    ${tipoOf(t.tipo).label}\nSolicitante: ${t.solicitante.nombre} (${t.solicitante.run})\nCorreo:     ${t.solicitante.email}\nIngreso:    ${fmtDate(t.creado)}\nDocumentos: ${t.docs.map((d) => d.label || d.name).join('; ')}\nPlazo estimado: ${tipoOf(t.tipo).plazo}\n\n(Documento de demostración)\n`

export default function NuevoTramite() {
  const { user } = useAuth()
  const { dispatch, nextFolio, wait } = useData()
  const nav = useNavigate()
  const modal = useModal()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [docs, setDocs] = useState({}) // { [índice]: items } — los archivos no se guardan en el borrador
  const [extra, setExtra] = useState([])
  const [sending, setSending] = useState(false)
  const top = useRef(null)
  const asked = useRef(false)

  const f = useForm({ initial: { ...INITIAL, nombre: user.name, email: user.email }, validate })
  const tipo = tipoOf(f.values.tipo)
  const comunas = REGIONES[f.values.region] ?? []

  // Borrador: se ofrece retomarlo y se guarda automáticamente
  useEffect(() => {
    let d = null
    try { d = JSON.parse(localStorage.getItem(DRAFT) || 'null') } catch { /* sin borrador */ }
    if (!d?.values?.tipo || asked.current) return
    asked.current = true
    modal.confirm({ title: 'Tienes un borrador', text: `Dejaste un trámite sin enviar («${tipoOf(d.values.tipo)?.label}»). ¿Quieres continuar donde quedaste?`, icon: 'history', confirmLabel: 'Continuar borrador', cancelLabel: 'Empezar de nuevo' })
      .then((ok) => { if (ok) { f.setValues({ ...INITIAL, ...d.values, declaro: false }); setStep(d.step ?? 0) } else localStorage.removeItem(DRAFT) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const t = setTimeout(() => { if (f.values.tipo) try { localStorage.setItem(DRAFT, JSON.stringify({ values: f.values, step })) } catch { /* sin almacenamiento */ } }, 400); return () => clearTimeout(t) }, [f.values, step])

  const required = tipo?.docs ?? []
  const docsOk = required.every((_, i) => docs[i]?.[0]?.status === 'done')
  const uploading = Object.values(docs).flat().concat(extra).some((x) => x.status === 'uploading')
  const stepErrors = useMemo(() => STEP_FIELDS[step].filter((k) => f.errors[k]), [step, f.errors])

  const next = () => {
    f.touch(STEP_FIELDS[step])
    if (stepErrors.length) { requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.focus()); return }
    if (step === 2 && (!docsOk || uploading)) { toast(uploading ? 'Espera a que terminen de subir los archivos' : 'Adjunta todos los documentos requeridos', 'error'); return }
    setStep((s) => s + 1); top.current?.scrollIntoView({ block: 'start' })
  }
  const back = () => { setStep((s) => Math.max(0, s - 1)); top.current?.scrollIntoView({ block: 'start' }) }

  const submit = async () => {
    f.touch(['declaro'])
    if (f.errors.declaro) return
    setSending(true)
    await wait(900)
    const v = f.values
    const item = {
      id: nextFolio(), tipo: v.tipo, solicitante: { nombre: v.nombre, run: v.run, email: v.email }, estado: 'ingresado', prioridad: 'media', creado: new Date().toISOString(), asignado: '',
      docs: [...required.map((label, i) => ({ label, name: docs[i][0].name, size: docs[i][0].size })), ...extra.map((x) => ({ label: 'Documento adicional', name: x.name, size: x.size }))], comentarios: [],
      timeline: [{ at: new Date().toISOString(), text: 'Trámite ingresado por el solicitante', by: v.nombre }],
    }
    dispatch({ type: 'tramite/add', item })
    localStorage.removeItem(DRAFT); setSending(false)
    const goDetail = await modal.confirm({
      title: '¡Trámite ingresado!', tone: 'success', icon: 'circle-check', confirmLabel: 'Ver el trámite', cancelLabel: 'Ir al listado', static: true,
      text: <><p>Tu solicitud quedó registrada con el folio:</p><p style={{ fontFamily: 'var(--font-slab)', fontSize: '1.6rem', margin: '0.2rem 0 1rem', color: 'var(--app-heading)' }}>{item.id}</p><p>Plazo estimado de respuesta: <strong>{tipoOf(item.tipo).plazo}</strong>.</p><button type="button" className="btn btn-outline-primary btn-compact btn-sm" onClick={() => downloadFile(`comprobante-${item.id}.txt`, comprobante(item), 'text/plain')}><Icon name="download" />Descargar comprobante</button></>,
    })
    nav(goDetail ? `/tramites/${item.id}` : '/tramites')
  }

  const leave = async () => { if (!f.dirty || await modal.confirm({ title: '¿Salir sin enviar?', text: 'Tu avance quedó guardado como borrador y podrás retomarlo.', confirmLabel: 'Salir' })) nav('/tramites') }

  return (
    <div className="app-container is-narrow" ref={top}>
      <PageHeader title="Nuevo trámite" description="Completa los pasos para ingresar tu solicitud." breadcrumbs={[{ label: 'Trámites', to: '/tramites' }, { label: 'Nuevo' }]} breadcrumbAs={Link} />
      <Stepper steps={STEPS} current={step} onStepClick={setStep} />

      <Panel title={`${step + 1}. ${STEPS[step]}`} footer={
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <button type="button" className="btn btn-link btn-compact" onClick={leave}>Cancelar</button>
          <span className="grow" style={{ flex: '1 1 auto' }} />
          {step > 0 && <button type="button" className="btn btn-outline-primary btn-compact" onClick={back} disabled={sending}>Atrás</button>}
          {step < 3 ? <button type="button" className="btn btn-primary btn-compact" onClick={next}>Continuar</button>
            : <button type="button" className="btn btn-primary btn-compact" onClick={submit} disabled={sending}>{sending && <span className="spinner-border spinner-border-sm mr-2" aria-hidden="true" />}Enviar solicitud</button>}
        </div>}>
        {step === 0 && (
          <RadioGroup label="¿Qué trámite quieres realizar?" name="tipo" cards error={f.errors.tipo && (f.bind('tipo').error)} value={f.values.tipo} onChange={f.bind('tipo').onChange}
            options={TIPOS.map((t) => ({ value: t.id, label: t.label, icon: t.icon, description: `${t.description} Plazo: ${t.plazo}.` }))} />
        )}
        {step === 1 && (
          <>
            <TextField label="Nombre completo" required autoComplete="name" {...f.bind('nombre')} />
            <div className="app-field-row">
              <RunField required {...f.bind('run')} />
              <TextField label="Teléfono" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" {...f.bind('telefono')} />
            </div>
            <TextField label="Correo electrónico" type="email" required autoComplete="email" hint="Aquí enviaremos las notificaciones del trámite." {...f.bind('email')} />
            <div className="app-field-row">
              <SelectField label="Región" required placeholder="Selecciona…" options={Object.keys(REGIONES)} {...f.bind('region')} onChange={(e) => { f.setValue('region', e.target.value); f.setValue('comuna', '') }} />
              <SelectField label="Comuna" required placeholder={f.values.region ? 'Selecciona…' : 'Primero elige la región'} options={comunas} disabled={!f.values.region} {...f.bind('comuna')} />
            </div>
            <TextareaField label="Dirección" required rows={2} maxLength={160} {...f.bind('direccion')} />
            <Switch label="Actúo en representación de otra persona" description="Se pedirá el RUN y el nombre de quien representas." checked={f.values.representa} onChange={(e) => f.setValue('representa', e.target.checked)} />
            {f.values.representa && <div className="app-field-row mt-3"><RunField label="RUN del representado" required {...f.bind('runRep')} /><TextField label="Nombre del representado" required {...f.bind('nombreRep')} /></div>}
          </>
        )}
        {step === 2 && (
          <>
            <p className="app-section-desc">Adjunta los documentos requeridos para <strong>{tipo.label}</strong>. Formatos admitidos: PDF e imágenes, hasta 10&nbsp;MB.</p>
            {required.map((label, i) => <FileUpload key={`${tipo.id}-${i}`} label={label} required multiple={false} maxFiles={1} compact accept="application/pdf,image/*" onChange={(items) => setDocs((d) => ({ ...d, [i]: items }))} />)}
            <FileUpload label="Documentos adicionales (opcional)" maxFiles={3} accept="application/pdf,image/*" hint="Por ejemplo, un poder simple o antecedentes complementarios." onChange={setExtra} />
            {!docsOk && <Alert tone="info">Faltan documentos obligatorios: {required.filter((_, i) => docs[i]?.[0]?.status !== 'done').length} de {required.length}.</Alert>}
          </>
        )}
        {step === 3 && (
          <>
            <dl className="app-summary">
              <div><dt>Trámite</dt><dd>{tipo?.label}<small>Plazo estimado: {tipo?.plazo}</small></dd><button type="button" className="btn btn-link btn-compact btn-sm" onClick={() => setStep(0)}>Editar</button></div>
              <div><dt>Solicitante</dt><dd>{f.values.nombre}<small>{f.values.run} · {f.values.email}{f.values.telefono && ` · ${f.values.telefono}`}</small></dd><button type="button" className="btn btn-link btn-compact btn-sm" onClick={() => setStep(1)}>Editar</button></div>
              <div><dt>Domicilio</dt><dd>{f.values.direccion}<small>{f.values.comuna}, {f.values.region}</small></dd><button type="button" className="btn btn-link btn-compact btn-sm" onClick={() => setStep(1)}>Editar</button></div>
              {f.values.representa && <div><dt>Representado</dt><dd>{f.values.nombreRep}<small>{f.values.runRep}</small></dd><button type="button" className="btn btn-link btn-compact btn-sm" onClick={() => setStep(1)}>Editar</button></div>}
              <div><dt>Documentos</dt><dd>{required.map((l, i) => <small key={l} style={{ display: 'block' }}><Icon name="paperclip" /> {l}: {docs[i]?.[0]?.name} ({formatSize(docs[i]?.[0]?.size ?? 0)})</small>)}{extra.map((x) => <small key={x.id} style={{ display: 'block' }}><Icon name="paperclip" /> Adicional: {x.name}</small>)}</dd><button type="button" className="btn btn-link btn-compact btn-sm" onClick={() => setStep(2)}>Editar</button></div>
            </dl>
            <CheckboxField label="Declaro que la información entregada es verídica y que los documentos adjuntos son copia fiel de los originales." {...f.bindCheck('declaro')} />
          </>
        )}
      </Panel>
    </div>
  )
}
