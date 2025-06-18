import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function exportToPDF(data: any[], filename: string) {
  if (!data || data.length === 0) return;
  const doc = new jsPDF();
  const header = Object.keys(data[0]);
  const rows = data.map(row => header.map(field => row[field]));
  // @ts-ignore
  doc.autoTable({ head: [header], body: rows });
  doc.save(filename);
}
