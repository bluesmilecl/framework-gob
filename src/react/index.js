// gob-cl-tailwind/react — componentes React reutilizables con la identidad gob.cl
// Requiere:  import 'gob-cl-tailwind/app.css'  (además del tema base)
export { default as Icon } from './Icon.jsx'

// Layout
export { AppShell, useShell, markActive } from './layout/AppShell.jsx'
export { Container, PageHeader, Panel, StatCard } from './layout/layout.jsx'
export { Footer, AppFooter } from './layout/Footer.jsx'
export { SiteNavbar } from './layout/SiteNavbar.jsx'

// Navegación
export { default as DropdownMenu } from './nav/DropdownMenu.jsx'
export { Tabs, Stepper, Breadcrumbs } from './nav/nav.jsx'

// Formularios
export { Field, fieldProps, useFieldId } from './forms/Field.jsx'
export { TextField, TextareaField, SelectField, DateField, RunField, PasswordField, CheckboxField, Switch, RadioGroup, SearchInput } from './forms/inputs.jsx'
export { default as FileUpload } from './forms/FileUpload.jsx'
export { default as OtpInput } from './forms/OtpInput.jsx'
export { default as useForm } from './hooks/useForm.js'
export * from './forms/validators.js'
export { ACCEPT, LIMITS, formatSize, kindOf, readAttachment, validateFiles, attachmentIcon } from './forms/files.js'

// Datos
export { default as DataTable, FilterBar } from './data/DataTable.jsx'
export { default as Pagination, pageList } from './data/Pagination.jsx'
export { StatusBadge, Avatar, EmptyState, Skeleton } from './data/bits.jsx'
export { toCsv, parseCsv, downloadFile } from './data/csv.js'

// Feedback
export { Modal, ModalProvider, useModal } from './feedback/Modal.jsx'
export { ToastProvider, useToast } from './feedback/Toasts.jsx'
export { default as Alert } from './feedback/Alert.jsx'

// Autenticación
export { AuthLayout, LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm, TwoFactorForm } from './auth/auth.jsx'

// Accesibilidad
export { default as useAccessibility } from './hooks/useAccessibility.js'
export { default as useDismiss } from './hooks/useDismiss.js'
