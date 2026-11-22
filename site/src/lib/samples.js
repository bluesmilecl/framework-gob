// Archivos de ejemplo generados en el navegador para las demos de vista previa.
const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'
const zipped = async (files, name, type) => {
  const JSZip = (await import('jszip')).default
  const z = new JSZip()
  Object.entries(files).forEach(([p, c]) => z.file(p, c))
  return new File([await z.generateAsync({ type: 'blob' })], name, { type })
}

export const sampleDocx = () => zipped({
  '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  '_rels/.rels': '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  'word/document.xml': `<?xml version="1.0"?><w:document xmlns:w="${W}"><w:body><w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Solicitud de certificado</w:t></w:r></w:p><w:p><w:r><w:t>Este documento Word se previsualiza sin salir de la página.</w:t></w:r></w:p><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Texto en negrita</w:t></w:r><w:r><w:t xml:space="preserve"> y texto normal.</w:t></w:r></w:p></w:body></w:document>`,
}, 'solicitud.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')

export const sampleXlsx = () => {
  const rows = [['Folio', 'Trámite', 'Estado', 'Monto'], ['TR-001', 'Certificado de residencia', 'Aprobado', 0], ['TR-002', 'Permiso de edificación', 'En revisión', 125000], ['TR-003', 'Patente comercial', 'Observado', 48000]]
  const strs = [...new Set(rows.flat().filter((v) => typeof v === 'string'))]
  const cell = (v, r, c) => { const ref = String.fromCharCode(65 + c) + (r + 1); return typeof v === 'number' ? `<c r="${ref}"><v>${v}</v></c>` : `<c r="${ref}" t="s"><v>${strs.indexOf(v)}</v></c>` }
  const sheet = (n) => `<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows.map((row, r) => `<row r="${r + 1}">${row.map((v, c) => cell(v, r, c)).join('')}</row>`).join('')}</sheetData></worksheet>`
  return zipped({
    '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/></Types>',
    'xl/workbook.xml': '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Trámites" sheetId="1" r:id="rId1"/><sheet name="Resumen" sheetId="2" r:id="rId2"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="x"/><Relationship Id="rId2" Target="worksheets/sheet2.xml" Type="x"/></Relationships>',
    'xl/sharedStrings.xml': `<?xml version="1.0"?><sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${strs.map((s) => `<si><t>${s}</t></si>`).join('')}</sst>`,
    'xl/worksheets/sheet1.xml': sheet(1),
    'xl/worksheets/sheet2.xml': '<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Total trámites</t></is></c><c r="B1"><v>3</v></c></row></sheetData></worksheet>',
  }, 'tramites.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
}

export const samplePptx = () => {
  const slide = (t, ls) => `<?xml version="1.0"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>${t}</a:t></a:r></a:p>${ls.map((l) => `<a:p><a:r><a:t>${l}</a:t></a:r></a:p>`).join('')}</p:txBody></p:sp></p:spTree></p:cSld></p:sld>`
  return zipped({
    '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>',
    'ppt/slides/slide1.xml': slide('Cuenta pública 2026', ['Resultados del año', 'Metas cumplidas']),
    'ppt/slides/slide2.xml': slide('Próximos pasos', ['Digitalizar trámites', 'Mejorar la atención']),
  }, 'presentacion.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
}

export const sampleDxf = () => new File([['0', 'SECTION', '2', 'ENTITIES',
  ...[[0, 0, 80, 0], [80, 0, 80, 50], [80, 50, 0, 50], [0, 50, 0, 0]].flatMap(([a, b, c, d]) => ['0', 'LINE', '10', a, '20', b, '11', c, '21', d]),
  '0', 'CIRCLE', '10', '40', '20', '25', '40', '12', '0', 'ARC', '10', '40', '20', '25', '40', '20', '50', '0', '51', '180',
  '0', 'LWPOLYLINE', '70', '1', '10', '10', '20', '10', '10', '20', '20', '10', '10', '15', '20', '20',
  '0', 'ENDSEC', '0', 'EOF'].join('\n')], 'plano.dxf', { type: 'application/dxf' })

export const sampleDwg = () => new File([new Uint8Array([0x41, 0x43, 0x31, 0x30, 0x33, 0x32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])], 'plano.dwg', { type: 'application/acad' })

export const samplePdf = () => {
  const objs = ['<</Type/Catalog/Pages 2 0 R>>', '<</Type/Pages/Kids[3 0 R]/Count 1>>', '<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 160]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>',
    '<</Length 62>>\nstream\nBT /F1 18 Tf 30 90 Td (Documento PDF de ejemplo) Tj ET\nendstream', '<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>']
  let pdf = '%PDF-1.4\n'; const off = []
  objs.forEach((o, i) => { off.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const x = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${off.map((o) => String(o).padStart(10, '0') + ' 00000 n \n').join('')}trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${x}\n%%EOF`
  return new File([pdf], 'ejemplo.pdf', { type: 'application/pdf' })
}

export const sampleImage = () => new Promise((res) => {
  const c = Object.assign(document.createElement('canvas'), { width: 640, height: 360 }), g = c.getContext('2d')
  g.fillStyle = '#0f69c4'; g.fillRect(0, 0, 640, 360); g.fillStyle = '#fe6565'; g.fillRect(0, 240, 640, 120)
  g.fillStyle = '#fff'; g.font = 'bold 40px sans-serif'; g.fillText('Imagen de ejemplo', 150, 190)
  c.toBlob((b) => res(new File([b], 'ejemplo.png', { type: 'image/png' })))
})

export const sampleCsv = () => new File(['folio;nombre;estado\nTR-001;Camila Rojas;Aprobado\nTR-002;Matías Soto;En revisión\n'], 'datos.csv', { type: 'text/csv' })
export const sampleText = () => new File(['Línea uno\nLínea dos\nLínea tres\n'], 'nota.txt', { type: 'text/plain' })
export const sampleLegacy = () => new File([new Uint8Array([0xd0, 0xcf, 0x11, 0xe0])], 'antiguo.doc', { type: 'application/msword' })
