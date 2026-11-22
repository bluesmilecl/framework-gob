/** Tipos de trámite del ejemplo, con sus documentos requeridos. Datos ficticios. */
export const TIPOS = [
  { id: 'residencia', label: 'Certificado de residencia', icon: 'building-2', plazo: '3 días hábiles', description: 'Acredita tu domicilio actual para trámites ante instituciones.', docs: ['Cédula de identidad (ambos lados)', 'Comprobante de domicilio'] },
  { id: 'subsidio', label: 'Solicitud de subsidio habitacional', icon: 'landmark', plazo: '20 días hábiles', description: 'Postulación a subsidios para compra o arriendo de vivienda.', docs: ['Cédula de identidad (ambos lados)', 'Registro Social de Hogares', 'Cartola de ahorro'] },
  { id: 'patente', label: 'Patente comercial', icon: 'store', plazo: '10 días hábiles', description: 'Autorización municipal para ejercer una actividad comercial.', docs: ['Cédula de identidad (ambos lados)', 'Iniciación de actividades (SII)', 'Plano del local'] },
  { id: 'circulacion', label: 'Permiso de circulación', icon: 'car', plazo: '2 días hábiles', description: 'Renovación anual del permiso de circulación de tu vehículo.', docs: ['Padrón del vehículo', 'Certificado de revisión técnica', 'Seguro obligatorio (SOAP)'] },
  { id: 'antecedentes', label: 'Certificado de antecedentes', icon: 'id-card', plazo: 'Inmediato', description: 'Certificado para fines especiales o generales.', docs: ['Cédula de identidad (ambos lados)'] },
]
export const tipoOf = (id) => TIPOS.find((t) => t.id === id)

export const ESTADOS = [
  { value: 'ingresado', label: 'Ingresado', tone: 'info' },
  { value: 'en-revision', label: 'En revisión', tone: 'warn' },
  { value: 'observado', label: 'Observado', tone: 'danger' },
  { value: 'aprobado', label: 'Aprobado', tone: 'ok' },
  { value: 'rechazado', label: 'Rechazado', tone: 'off' },
]
export const estadoOf = (v) => ESTADOS.find((e) => e.value === v) ?? ESTADOS[0]
export const PRIORIDADES = [{ value: 'alta', label: 'Alta' }, { value: 'media', label: 'Media' }, { value: 'baja', label: 'Baja' }]

export const REGIONES = {
  'Arica y Parinacota': ['Arica', 'Putre'], Valparaíso: ['Valparaíso', 'Viña del Mar', 'Quilpué', 'San Antonio'],
  Metropolitana: ['Santiago', 'Maipú', 'Puente Alto', 'Providencia', 'La Florida'], Biobío: ['Concepción', 'Talcahuano', 'Los Ángeles'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'], 'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
}
export const FUNCIONARIOS = ['Pablo Herrera', 'Daniela Castro', 'Rodrigo Vera', 'Paula Núñez']
export const fmtDate = (iso) => new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })
export const fmtDateTime = (iso) => new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
