
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generateCertificatePDFfromHTML = async (htmlContent: string): Promise<Blob> => {
  const container = document.createElement('div');
  // Style pour le rendu hors écran avec une largeur définie
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.width = '900px';
  container.style.top = '0';
  document.body.appendChild(container);

  container.innerHTML = htmlContent;
  
  const certificateElement = container.querySelector('.certificate') as HTMLElement;
  
  if (!certificateElement) {
    document.body.removeChild(container);
    throw new Error("L'élément avec la classe .certificate n'a pas été trouvé dans le HTML.");
  }

  // Cacher temporairement le bouton d'impression
  const printButton = certificateElement.querySelector('.print-button') as HTMLElement;
  if (printButton) {
    printButton.style.display = 'none';
  }

  const canvas = await html2canvas(certificateElement, {
    scale: 2, // Échelle supérieure pour une meilleure qualité
    useCORS: true,
    backgroundColor: null,
    scrollY: -window.scrollY
  });

  // Rétablir la visibilité du bouton
  if (printButton) {
    printButton.style.display = 'block';
  }
  
  document.body.removeChild(container);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'px',
    // Le format est défini par la taille du canevas pour éviter les déformations
    format: [canvas.width, canvas.height]
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  return pdf.output('blob');
};
