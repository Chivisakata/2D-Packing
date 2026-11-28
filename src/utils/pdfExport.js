import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const removeAccents = (str = '') =>
  String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

export async function exportLayoutToPdf({ element, sheetW, sheetH, sheetName, gridStep }) {
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 1.5,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    onclone: (clonedDoc) => {
      const svg = clonedDoc.querySelector('#canvasSheet');
      if (!svg) return;

      svg.style.backgroundColor = '#ffffff';

      const gridPath = svg.querySelector('pattern#grid path');
      if (gridPath) gridPath.setAttribute('stroke', '#cbd5e1');

      svg.querySelectorAll('polygon, ellipse, circle, rect').forEach((shape) => {
        const currentFill = shape.getAttribute('fill');
        if (currentFill === 'url(#grid)') return;

        if (currentFill !== 'none') {
          shape.setAttribute('fill', '#ffffff');
          shape.setAttribute('fill-opacity', '1');
        }
        shape.setAttribute('stroke', '#000000');
        shape.setAttribute('stroke-width', '1.5');
        shape.setAttribute('vector-effect', 'non-scaling-stroke');
      });
    }
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.7);
  const pdf = new jsPDF({
    orientation: sheetW >= sheetH ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min((pdfWidth - 30) / canvas.width, (pdfHeight - 44) / canvas.height);

  const finalWidth = canvas.width * ratio;
  const finalHeight = canvas.height * ratio;
  const xOffset = (pdfWidth - finalWidth) / 2;
  const safeSheetName = removeAccents(sheetName).toUpperCase();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.text(`SO DO CAT PHOI 2D: ${safeSheetName}`, pdfWidth / 2, 12, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    `Kich thuoc phoi: Ngang ${sheetW.toLocaleString('vi-VN')} cm  x  Cao ${sheetH.toLocaleString('vi-VN')} cm`,
    pdfWidth / 2,
    18,
    { align: 'center' }
  );

  if (gridStep) {
    pdf.text(
      `Ty le luoi: 1 o = ${Number(gridStep).toLocaleString('vi-VN')} cm`,
      pdfWidth / 2,
      23,
      { align: 'center' }
    );
  }

  pdf.addImage(imgData, 'JPEG', xOffset, 28, finalWidth, finalHeight);
  pdf.save(`So_Do_Cat_${safeSheetName.replace(/\s+/g, '_')}.pdf`);
}