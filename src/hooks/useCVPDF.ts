
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
  const generatePDF = async (cvData: CVData, template?: CVTemplate) => {
    if (!cvData) {
      throw new Error('Données du CV non disponibles pour générer le PDF');
    }

    const doc = new jsPDF();
    let yPosition = 30;

    // Get template colors based on template ID
    const getTemplateColors = () => {
      if (!template) {
        return {
          primary: [59, 130, 246], // Blue-500
          secondary: [75, 85, 99], // Gray-600
          accent: [239, 246, 255], // Blue-50
          text: [31, 41, 55] // Gray-800
        };
      }

      switch (template.id) {
        case 'modern-blue':
          return {
            primary: [59, 130, 246],
            secondary: [75, 85, 99],
            accent: [239, 246, 255],
            text: [31, 41, 55]
          };
        case 'classic-elegant':
          return {
            primary: [55, 65, 81],
            secondary: [107, 114, 128],
            accent: [249, 250, 251],
            text: [17, 24, 39]
          };
        case 'creative-orange':
          return {
            primary: [249, 115, 22],
            secondary: [120, 113, 108],
            accent: [255, 247, 237],
            text: [31, 41, 55]
          };
        case 'minimal-green':
          return {
            primary: [34, 197, 94],
            secondary: [75, 85, 99],
            accent: [240, 253, 244],
            text: [31, 41, 55]
          };
        case 'executive-dark':
          return {
            primary: [30, 41, 59],
            secondary: [71, 85, 105],
            accent: [248, 250, 252],
            text: [15, 23, 42]
          };
        case 'modern-purple':
          return {
            primary: [147, 51, 234],
            secondary: [75, 85, 99],
            accent: [250, 245, 255],
            text: [31, 41, 55]
          };
        case 'clean-teal':
          return {
            primary: [20, 184, 166],
            secondary: [75, 85, 99],
            accent: [240, 253, 250],
            text: [31, 41, 55]
          };
        case 'artistic-red':
          return {
            primary: [239, 68, 68],
            secondary: [75, 85, 99],
            accent: [254, 242, 242],
            text: [31, 41, 55]
          };
        case 'corporate-navy':
          return {
            primary: [30, 58, 138],
            secondary: [71, 85, 105],
            accent: [239, 246, 255],
            text: [15, 23, 42]
          };
        case 'modern-gradient':
          return {
            primary: [219, 39, 119],
            secondary: [75, 85, 99],
            accent: [253, 244, 255],
            text: [31, 41, 55]
          };
        default:
          return {
            primary: [59, 130, 246],
            secondary: [75, 85, 99],
            accent: [239, 246, 255],
            text: [31, 41, 55]
          };
      }
    };

    const colors = getTemplateColors();

    // Helper function to convert HTML to plain text while preserving some formatting
    const htmlToFormattedText = (html: string): string => {
      const text = html
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
              currentY += 6;
            });
          } else {
            doc.text(line, x, currentY);
            currentY += 6;
          }
        } else {
          currentY += 3;
        }
      });
      
      return currentY;
    };

    // Function to load image properly for PDF
    const loadImageForPDF = (imageUrl: string): Promise<string | null> => {
      return new Promise((resolve) => {
        if (!imageUrl) {
          resolve(null);
          return;
        }

        try {
          // If it's already a data URL, use it directly
          if (imageUrl.startsWith('data:')) {
            resolve(imageUrl);
            return;
          }

          // Create image element
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              if (!ctx) {
                resolve(null);
                return;
              }
              
              canvas.width = 80;
              canvas.height = 80;
              ctx.drawImage(img, 0, 0, 80, 80);
              const dataURL = canvas.toDataURL('image/jpeg', 0.8);
              resolve(dataURL);
            } catch (error) {
              console.error('Error processing image:', error);
              resolve(null);
            }
          };

          img.onerror = () => {
            console.error('Error loading image');
            resolve(null);
          };

          img.src = imageUrl;
        } catch (error) {
          console.error('Error in loadImageForPDF:', error);
          resolve(null);
        }
      });
    };

    // Add template-specific header background with improved styling
    if (template) {
      // Header background with gradient effect
      doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.rect(0, 0, 210, 70, 'F');
      
      // Add subtle accent
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.rect(0, 65, 210, 5, 'F');
    }

    // Load and add photo if available
    let photoAdded = false;
    if (cvData.personalInfo.photoUrl) {
      try {
        const imageData = await loadImageForPDF(cvData.personalInfo.photoUrl);
        if (imageData) {
          doc.addImage(imageData, 'JPEG', 150, 15, 40, 40);
          photoAdded = true;
        }
      } catch (error) {
        console.error('Error adding photo to PDF:', error);
      }
    }

    // Header with name and title - improved typography
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(template ? 255 : colors.primary[0], template ? 255 : colors.primary[1], template ? 255 : colors.primary[2]);
    doc.text(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, 20, yPosition + 5);
    yPosition += 15;
    
    if (cvData.personalInfo.professionalTitle) {
      doc.setFontSize(16);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(template ? 240 : colors.secondary[0], template ? 240 : colors.secondary[1], template ? 240 : colors.secondary[2]);
      doc.text(cvData.personalInfo.professionalTitle, 20, yPosition);
      yPosition += 10;
    }

    // Reset position after header
    yPosition = template ? 80 : 60;

    // Contact information with better formatting
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    
    const contactInfo = [];
    if (cvData.personalInfo.email) contactInfo.push(`📧 ${cvData.personalInfo.email}`);
    if (cvData.personalInfo.phone) contactInfo.push(`📞 ${cvData.personalInfo.phone}`);
    if (cvData.personalInfo.address) contactInfo.push(`📍 ${cvData.personalInfo.address}`);
    
    contactInfo.forEach((info, index) => {
      doc.text(info, 20 + (index * 60), yPosition);
    });
    yPosition += 15;

    // Professional summary with template styling
    if (cvData.personalInfo.summary) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('PROFIL PROFESSIONNEL', 20, yPosition);
      
      // Add styled line under section title
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(1);
      doc.line(20, yPosition + 2, 90, yPosition + 2);
      
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      yPosition = addFormattedText(cvData.personalInfo.summary, 20, yPosition, 170) + 10;
    }

    // Experience section with enhanced styling
    if (cvData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('EXPÉRIENCE PROFESSIONNELLE', 20, yPosition);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(1);
      doc.line(20, yPosition + 2, 120, yPosition + 2);
      
      yPosition += 10;
      
      cvData.experience.forEach((exp) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        // Position title
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(`${exp.position}`, 20, yPosition);
        yPosition += 7;
        
        // Company name
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(exp.company, 20, yPosition);
        yPosition += 7;
        
        // Date range
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        const dateText = `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}`;
        doc.text(dateText, 20, yPosition);
        yPosition += 7;
        
        // Description
        if (exp.description) {
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          yPosition = addFormattedText(exp.description, 25, yPosition, 165) + 5;
        }
        yPosition += 8;
      });
    }

    // Education section
    if (cvData.education.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('FORMATION', 20, yPosition);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(1);
      doc.line(20, yPosition + 2, 55, yPosition + 2);
      
      yPosition += 10;
      
      cvData.education.forEach((edu) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.text(`${edu.degree}`, 20, yPosition);
        yPosition += 7;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.text(edu.institution, 20, yPosition);
        yPosition += 7;
        
        doc.setFont(undefined, 'normal');
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        const dateText = `${edu.startDate} - ${edu.endDate}`;
        doc.text(dateText, 20, yPosition);
        yPosition += 7;
        
        if (edu.description) {
          doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
          yPosition = addFormattedText(edu.description, 25, yPosition, 165) + 5;
        }
        yPosition += 8;
      });
    }

    // Skills section with visual improvements
    if (cvData.skills.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('COMPÉTENCES', 20, yPosition);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(1);
      doc.line(20, yPosition + 2, 70, yPosition + 2);
      
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      
      // Display skills in a more organized way
      let currentX = 20;
      let currentY = yPosition;
      const skillsPerRow = 2;
      let skillCount = 0;
      
      cvData.skills.forEach((skill) => {
        if (skillCount > 0 && skillCount % skillsPerRow === 0) {
          currentY += 12;
          currentX = 20;
        }
        
        if (currentY > 250) {
          doc.addPage();
          currentY = 30;
          currentX = 20;
        }
        
        // Skill name
        doc.setFont(undefined, 'bold');
        doc.text(`${skill.name}`, currentX, currentY);
        
        // Skill level with color coding
        doc.setFont(undefined, 'normal');
        const levelColors = {
          'Expert': [34, 197, 94],     // Green
          'Avancé': [59, 130, 246],    // Blue
          'Intermédiaire': [245, 158, 11], // Orange
          'Débutant': [156, 163, 175]   // Gray
        };
        const levelColor = levelColors[skill.level as keyof typeof levelColors] || colors.secondary;
        doc.setTextColor(levelColor[0], levelColor[1], levelColor[2]);
        doc.text(`(${skill.level})`, currentX + 45, currentY);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        
        currentX += 90;
        skillCount++;
      });
    }

    // Save the PDF with template name if available
    const templateName = template ? `_${template.name.replace(/\s+/g, '_')}` : '';
    const fileName = `CV_${cvData.personalInfo.firstName || 'Candidat'}_${cvData.personalInfo.lastName || 'Anonyme'}${templateName}.pdf`;
    doc.save(fileName);
  };

  return { generatePDF };
};
