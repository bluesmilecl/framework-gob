/** Ícono del paquete (máscara CSS): hereda color y tamaño del texto. */
export default function Icon({ name, className = '', ...rest }) {
  return <i className={`cl cl-${name} ${className}`} aria-hidden="true" {...rest} />
}
