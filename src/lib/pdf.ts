import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WorldSpec } from '../models/schema';

export async function exportPdf(
  element: HTMLElement,
  title?: string,
  world?: WorldSpec
) {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF();
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const headerY = 20;
  if (title) {
    pdf.setFontSize(14);
    pdf.text(title, 10, 10);
  }
  if (world) {
    pdf.setFontSize(10);
    pdf.text(`${world.timePeriod} - ${world.geography}`, 10, 16);
  }
  const imgProps = pdf.getImageProperties(imgData);
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  pdf.addImage(imgData, 'PNG', 0, headerY, pdfWidth, pdfHeight);
  pdf.save('storyboard.pdf');
}
