export async function downloadInvoicePdf(element: HTMLElement, fileName: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  element.classList.add('is-capturing-pdf')
  let canvas
  try {
    canvas = await html2canvas(element, {
      scale: 1.75,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })
  } finally {
    element.classList.remove('is-capturing-pdf')
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.92)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 28
  const usableWidth = pageWidth - margin * 2
  const imgHeight = (canvas.height * usableWidth) / canvas.width

  let heightLeft = imgHeight
  let position = margin

  pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight)
  heightLeft -= pageHeight - margin * 2

  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft)
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight)
    heightLeft -= pageHeight - margin * 2
  }

  pdf.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`)
}
