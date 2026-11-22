// Proveedor de DEMOSTRACIÓN: no usa ningún modelo de IA. Genera respuestas de ejemplo en Markdown según palabras clave
// y las entrega por "streaming" para probar la interfaz (cursor, detener, regenerar, adjuntos, errores).

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Abortado', 'AbortError')) }, { once: true })
  })

const attachmentReport = (atts) => {
  const parts = ['### Archivos recibidos', '']
  for (const a of atts) {
    if (a.kind === 'text' && a.text) {
      const lines = a.text.trimEnd().split('\n')
      const words = a.text.trim().split(/\s+/).filter(Boolean).length
      const excerpt = lines.filter((l) => l.trim()).slice(0, 3).map((l) => `> ${l.slice(0, 120)}`).join('\n')
      parts.push(`- **${a.name}** · texto, ${lines.length} líneas, ${words} palabras${a.truncated ? ' (se leyó solo el inicio)' : ''}`, '', excerpt, '')
    } else if (a.kind === 'image') parts.push(`- **${a.name}** · imagen recibida. En este modo de demostración no se analiza su contenido.`)
    else parts.push(`- **${a.name}** · documento recibido. Un modelo real necesitaría extraer su texto para analizarlo.`)
  }
  return parts.join('\n')
}

const build = (text, atts, model) => {
  const t = text.toLowerCase()
  const short = model === 'rapido'
  const long = model === 'detallado'
  const out = []

  if (atts.length) out.push(attachmentReport(atts), '')

  if (/c[oó]digo|funci[oó]n|javascript|python|script|react/.test(t)) {
    out.push('Aquí tienes un ejemplo que valida un RUN chileno:', '', '```js', 'export function validarRun(run) {', "  const limpio = run.replace(/[.\\-\\s]/g, '').toUpperCase()", '  const cuerpo = limpio.slice(0, -1)', '  const dv = limpio.slice(-1)', '  let suma = 0, factor = 2', '  for (let i = cuerpo.length - 1; i >= 0; i--) {', '    suma += Number(cuerpo[i]) * factor', '    factor = factor === 7 ? 2 : factor + 1', '  }', '  const esperado = 11 - (suma % 11)', "  const digito = esperado === 11 ? '0' : esperado === 10 ? 'K' : String(esperado)", '  return dv === digito', '}', '```', '')
    if (!short) out.push('**Cómo funciona:** recorre el cuerpo de derecha a izquierda multiplicando por la serie `2…7` y compara el dígito verificador calculado.', '')
    if (long) out.push('> Recuerda validar también en el servidor: la validación del navegador es solo una ayuda para la persona usuaria.', '')
  } else if (/tabla|comparar|comparaci[oó]n|cuadro/.test(t)) {
    out.push('Esta es una comparación de ejemplo:', '', '| Canal | Tiempo estimado | Requiere ClaveÚnica |', '|---|---|---|', '| Sitio web | Inmediato | Sí |', '| Oficina presencial | 1 a 3 días | No |', '| Teléfono | 2 a 5 días | No |', '')
    if (!short) out.push('Los datos son ilustrativos; confirma plazos y requisitos en la fuente oficial.', '')
  } else if (/paso|c[oó]mo|tr[aá]mite|certificado|solicitud|gu[ií]a/.test(t)) {
    out.push('Estos son los pasos generales (ejemplo):', '', '1. **Reúne tus datos**: RUN y un correo de contacto.', '2. **Ingresa con ClaveÚnica** en el sitio del servicio.', '3. **Completa el formulario** y adjunta los documentos pedidos.', '4. **Revisa y envía** tu solicitud.', '5. **Guarda el comprobante** con el número de seguimiento.', '')
    if (long) out.push('### Consejos', '', '- Revisa el tamaño y formato de los archivos antes de adjuntarlos.', '- Si el trámite es para otra persona, necesitarás un poder simple.', '- Conserva una copia de todo lo enviado.', '')
  } else if (/resum|resumen|sintetiza/.test(t) && !atts.length) {
    out.push('Para resumir necesito el texto. Puedes **pegarlo aquí** o **adjuntar el archivo** con el botón del clip o arrastrándolo a la ventana.', '')
  } else if (/hola|buenas|buenos d[ií]as|qu[eé] puedes/.test(t)) {
    out.push('¡Hola! Soy un asistente de **demostración**. Puedo mostrarte cómo se ve una conversación: respuestas con listas, tablas y código, adjuntos y más.', '', 'Prueba pedirme *un ejemplo de código*, *una tabla comparativa* o *los pasos de un trámite*.', '')
  } else {
    out.push(`Recibí tu mensaje: «${text.trim().slice(0, 140)}${text.length > 140 ? '…' : ''}»`, '')
    if (!short) out.push('En un despliegue real, aquí respondería un modelo de IA conectado desde **Ajustes → Proveedor**. Mientras tanto puedes probar:', '', '- Pedir *un ejemplo de código*', '- Pedir *una tabla comparativa*', '- Preguntar *cómo hacer un trámite*', '- Adjuntar un archivo de texto para ver un análisis básico', '')
  }
  out.push('---', '*Respuesta simulada por el modo demostración.*')
  return out.join('\n')
}

export const mockProvider = {
  id: 'demo',
  async stream({ messages, model, signal, onToken }) {
    const last = [...messages].reverse().find((m) => m.role === 'user')
    if (/\/error/.test(last?.content ?? '')) { await sleep(500, signal); throw new Error('Error simulado: el servicio no respondió. Intenta nuevamente.') }
    const full = build(last?.content ?? '', last?.attachments ?? [], model)
    await sleep(450, signal)
    const tokens = full.match(/\S+\s*|\n+/g) ?? [full]
    let i = 0
    while (i < tokens.length) {
      const n = 1 + Math.floor(Math.random() * 3)
      onToken(tokens.slice(i, i + n).join(''))
      i += n
      await sleep(model === 'rapido' ? 8 : 16 + Math.random() * 26, signal)
    }
  },
}
