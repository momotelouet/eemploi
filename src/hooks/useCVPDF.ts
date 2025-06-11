
import jsPDF from 'jspdf';

interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    professionalTitle: string;
    summary: string;
    photoUrl?: string;
  };
  experience: Array<{
    id: string;
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

export const useCVPDF = () => {
  const generatePDF = (cvData: CVData) => {
    if (!cvData) {
      throw new Error('Données du CV non disponibles pour générer le PDF');
    }

    const doc = new jsPDF();
    let yPosition = 30;

    // Helper function to convert HTML to plain text while preserving some formatting
    const htmlToFormattedText = (html: string): string => {
      const div = document.createElement('div');
      div.innerHTML = html;
      
      // Replace HTML tags with appropriate text formatting
      let text = html
        .replace(/<b>|<strong>/gi, '')
        .replace(/<\/b>|<\/strong>/gi, '')
        .replace(/<i>|<em>/gi, '')
        .replace(/<\/i>|<\/em>/gi, '')
        .replace(/<u>/gi, '')
        .replace(/<\/u>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<p>/gi, '')
        .replace(/<li>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<ul>|<\/ul>|<ol>|<\/ol>/gi, '')
        .replace(/<[^>]*>/g, ''); // Remove remaining HTML tags
      
      // Clean up extra whitespace
      return text.replace(/\n\s*\n/g, '\n').trim();
    };

    // Helper function to add text with automatic line wrapping and basic formatting
    const addFormattedText = (html: string, x: number, y: number, maxWidth?: number) => {
      const text = htmlToFormattedText(html);
      const lines = text.split('\n');
      let currentY = y;
      
      lines.forEach(line => {
        if (line.trim()) {
          if (maxWidth && line.length > 60) {
            const wrappedLines = doc.splitTextToSize(line, maxWidth);
            wrappedLines.forEach((wrappedLine: string) => {
              // Check for bullet points
              if (wrappedLine.startsWith('• ')) {
                doc.setFont(undefined, 'normal');
                doc.text(wrappedLine, x, currentY);
              } else {
                doc.text(wrappedLine, x, currentY);
              }
              currentY += 7;
            });
          } else {
            if (line.startsWith('• ')) {
              doc.setFont(undefined, 'normal');
            }
            doc.text(line, x, currentY);
            currentY += 7;
          }
        } else {
          currentY += 4; // Small space for empty lines
        }
      });
      
      return currentY;
    };

    // Add photo if available
    if (cvData.personalInfo.photoUrl) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 40;
          canvas.height = 40;
          ctx?.drawImage(img, 0, 0, 40, 40);
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          doc.addImage(dataURL, 'JPEG', 150, 10, 40, 40);
        };
        img.src = cvData.personalInfo.photoUrl;
      } catch (error) {
        console.error('Error adding photo to PDF:', error);
      }
    }

    // Header with name and title
    doc.setFontSize(24);
    doc.setTextColor(0, 102, 204); // Blue color
    doc.text(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, 20, yPosition);
    yPosition += 10;
    
    if (cvData.personalInfo.professionalTitle) {
      doc.setFontSize(16);
      doc.setTextColor(102, 102, 102); // Gray color
      doc.text(cvData.personalInfo.professionalTitle, 20, yPosition);
      yPosition += 10;
    }

    // Contact information
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black
    yPosition += 5;
    
    if (cvData.personalInfo.email) {
      doc.text(`Email: ${cvData.personalInfo.email}`, 20, yPosition);
      yPosition += 7;
    }
    if (cvData.personalInfo.phone) {
      doc.text(`Téléphone: ${cvData.personalInfo.phone}`, 20, yPosition);
      yPosition += 7;
    }
    if (cvData.personalInfo.address) {
      doc.text(`Adresse: ${cvData.personalInfo.address}`, 20, yPosition);
      yPosition += 7;
    }

    yPosition += 10;

    // Professional summary
    if (cvData.personalInfo.summary) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('PROFIL PROFESSIONNEL', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPosition = addFormattedText(cvData.personalInfo.summary, 20, yPosition, 170);
      yPosition += 10;
    }

    // Experience section
    if (cvData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('EXPÉRIENCE PROFESSIONNELLE', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      cvData.experience.forEach((exp) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`${exp.position} - ${exp.company}`, 20, yPosition);
        yPosition += 7;
        
        doc.setFont(undefined, 'normal');
        const dateText = `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}`;
        doc.text(dateText, 20, yPosition);
        yPosition += 7;
        
        if (exp.description) {
          yPosition = addFormattedText(exp.description, 20, yPosition, 170);
          yPosition += 5;
        }
        yPosition += 5;
      });
    }

    // Education section
    if (cvData.education.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('FORMATION', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      cvData.education.forEach((edu) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFont(undefined, 'bold');
        doc.text(`${edu.degree} - ${edu.institution}`, 20, yPosition);
        yPosition += 7;
        
        doc.setFont(undefined, 'normal');
        const dateText = `${edu.startDate} - ${edu.endDate}`;
        doc.text(dateText, 20, yPosition);
        yPosition += 7;
        
        if (edu.description) {
          yPosition = addFormattedText(edu.description, 20, yPosition, 170);
          yPosition += 5;
        }
        yPosition += 5;
      });
    }

    // Skills section
    if (cvData.skills.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      doc.text('COMPÉTENCES', 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const skillsText = cvData.skills.map(skill => `• ${skill.name} (${skill.level})`).join('\n');
      addFormattedText(skillsText, 20, yPosition, 170);
    }

    // Save the PDF
    const fileName = `CV_${cvData.personalInfo.firstName || 'Candidat'}_${cvData.personalInfo.lastName || 'Anonyme'}.pdf`;
    doc.save(fileName);
  };

  return { generatePDF };
};
