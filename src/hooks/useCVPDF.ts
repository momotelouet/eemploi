
import jsPDF from 'jspdf';
import { CVTemplate } from '@/components/cv/CVTemplates';

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
  const generatePDF = (cvData: CVData, template?: CVTemplate) => {
    if (!cvData) {
      throw new Error('Données du CV non disponibles pour générer le PDF');
    }

    const doc = new jsPDF();
    let yPosition = 30;

    // Get template colors based on template ID
    const getTemplateColors = () => {
      if (!template) {
        return {
          primary: [0, 102, 204], // Default blue
          secondary: [102, 102, 102], // Gray
          accent: [240, 248, 255] // Light blue background
        };
      }

      switch (template.id) {
        case 'modern-blue':
          return {
            primary: [59, 130, 246], // Blue-500
            secondary: [75, 85, 99], // Gray-600
            accent: [239, 246, 255] // Blue-50
          };
        case 'classic-elegant':
          return {
            primary: [55, 65, 81], // Gray-700
            secondary: [107, 114, 128], // Gray-500
            accent: [249, 250, 251] // Gray-50
          };
        case 'creative-orange':
          return {
            primary: [249, 115, 22], // Orange-500
            secondary: [120, 113, 108], // Warm gray
            accent: [255, 247, 237] // Orange-50
          };
        case 'minimal-green':
          return {
            primary: [34, 197, 94], // Green-500
            secondary: [75, 85, 99], // Gray-600
            accent: [240, 253, 244] // Green-50
          };
        case 'executive-dark':
          return {
            primary: [30, 41, 59], // Slate-800
            secondary: [71, 85, 105], // Slate-600
            accent: [248, 250, 252] // Slate-50
          };
        case 'modern-purple':
          return {
            primary: [147, 51, 234], // Purple-600
            secondary: [75, 85, 99], // Gray-600
            accent: [250, 245, 255] // Purple-50
          };
        case 'clean-teal':
          return {
            primary: [20, 184, 166], // Teal-500
            secondary: [75, 85, 99], // Gray-600
            accent: [240, 253, 250] // Teal-50
          };
        case 'artistic-red':
          return {
            primary: [239, 68, 68], // Red-500
            secondary: [75, 85, 99], // Gray-600
            accent: [254, 242, 242] // Red-50
          };
        case 'corporate-navy':
          return {
            primary: [30, 58, 138], // Blue-900
            secondary: [71, 85, 105], // Slate-600
            accent: [239, 246, 255] // Blue-50
          };
        case 'modern-gradient':
          return {
            primary: [219, 39, 119], // Pink-600
            secondary: [75, 85, 99], // Gray-600
            accent: [253, 244, 255] // Pink-50
          };
        default:
          return {
            primary: [0, 102, 204],
            secondary: [102, 102, 102],
            accent: [240, 248, 255]
          };
      }
    };

    const colors = getTemplateColors();

    // Helper function to convert HTML to plain text while preserving some formatting
    const htmlToFormattedText = (html: string): string => {
      const div = document.createElement('div');
      div.innerHTML = html;
      
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
        .replace(/<[^>]*>/g, '');
      
      return text.replace(/\n\s*\n/g, '\n').trim();
    };

    const addFormattedText = (html: string, x: number, y: number, maxWidth?: number) => {
      const text = htmlToFormattedText(html);
      const lines = text.split('\n');
      let currentY = y;
      
      lines.forEach(line => {
        if (line.trim()) {
          if (maxWidth && line.length > 60) {
            const wrappedLines = doc.splitTextToSize(line, maxWidth);
            wrappedLines.forEach((wrappedLine: string) => {
              doc.text(wrappedLine, x, currentY);
              currentY += 7;
            });
          } else {
            doc.text(line, x, currentY);
            currentY += 7;
          }
        } else {
          currentY += 4;
        }
      });
      
      return currentY;
    };

    // Add template-specific header background
    if (template) {
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, 210, 60, 'F');
    }

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
          doc.addImage(dataURL, 'JPEG', 150, 15, 40, 40);
        };
        img.src = cvData.personalInfo.photoUrl;
      } catch (error) {
        console.error('Error adding photo to PDF:', error);
      }
    }

    // Header with name and title
    doc.setFontSize(24);
    doc.setTextColor(template ? 255 : colors.primary[0], template ? 255 : colors.primary[1], template ? 255 : colors.primary[2]);
    doc.text(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, 20, yPosition);
    yPosition += 10;
    
    if (cvData.personalInfo.professionalTitle) {
      doc.setFontSize(16);
      doc.setTextColor(template ? 255 : colors.secondary[0], template ? 255 : colors.secondary[1], template ? 255 : colors.secondary[2]);
      doc.text(cvData.personalInfo.professionalTitle, 20, yPosition);
      yPosition += 10;
    }

    // Reset position after header
    yPosition = template ? 70 : 50;

    // Contact information
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
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
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('PROFIL PROFESSIONNEL', 20, yPosition);
      
      // Add colored line under section title
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition + 2, 80, yPosition + 2);
      
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPosition = addFormattedText(cvData.personalInfo.summary, 20, yPosition, 170);
      yPosition += 10;
    }

    // Experience section
    if (cvData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('EXPÉRIENCE PROFESSIONNELLE', 20, yPosition);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition + 2, 110, yPosition + 2);
      
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      cvData.experience.forEach((exp) => {
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
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('FORMATION', 20, yPosition);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition + 2, 50, yPosition + 2);
      
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
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('COMPÉTENCES', 20, yPosition);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPosition + 2, 65, yPosition + 2);
      
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const skillsText = cvData.skills.map(skill => `• ${skill.name} (${skill.level})`).join('\n');
      addFormattedText(skillsText, 20, yPosition, 170);
    }

    // Save the PDF with template name if available
    const templateName = template ? `_${template.name.replace(/\s+/g, '_')}` : '';
    const fileName = `CV_${cvData.personalInfo.firstName || 'Candidat'}_${cvData.personalInfo.lastName || 'Anonyme'}${templateName}.pdf`;
    doc.save(fileName);
  };

  return { generatePDF };
};
