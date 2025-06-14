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
    
    // Template colors that match TemplatePreview exactly
    const getTemplateColors = () => {
      if (!template) {
        return {
          primary: [33, 150, 243], // Blue
          secondary: [75, 85, 99], // Gray
          headerBg: [33, 150, 243],
          headerText: [255, 255, 255],
          accentBg: [239, 246, 255],
          bodyText: [31, 41, 55]
        };
      }

      switch (template.id) {
        case 'modern-blue':
          return {
            primary: [37, 99, 235], // blue-600
            secondary: [75, 85, 99],
            headerBg: [37, 99, 235],
            headerText: [255, 255, 255],
            accentBg: [239, 246, 255],
            bodyText: [31, 41, 55]
          };
        case 'classic-elegant':
          return {
            primary: [55, 65, 81], // gray-700
            secondary: [107, 114, 128],
            headerBg: [55, 65, 81],
            headerText: [255, 255, 255],
            accentBg: [249, 250, 251],
            bodyText: [17, 24, 39]
          };
        case 'creative-orange':
          return {
            primary: [234, 88, 12], // orange-600
            secondary: [120, 113, 108],
            headerBg: [249, 115, 22],
            headerText: [255, 255, 255],
            accentBg: [255, 247, 237],
            bodyText: [31, 41, 55]
          };
        case 'minimal-green':
          return {
            primary: [22, 163, 74], // green-600
            secondary: [75, 85, 99],
            headerBg: [34, 197, 94],
            headerText: [255, 255, 255],
            accentBg: [240, 253, 244],
            bodyText: [31, 41, 55]
          };
        case 'executive-dark':
          return {
            primary: [30, 41, 59], // slate-800
            secondary: [71, 85, 105],
            headerBg: [30, 41, 59],
            headerText: [255, 255, 255],
            accentBg: [248, 250, 252],
            bodyText: [15, 23, 42]
          };
        case 'modern-purple':
          return {
            primary: [147, 51, 234], // purple-600
            secondary: [75, 85, 99],
            headerBg: [168, 85, 247],
            headerText: [255, 255, 255],
            accentBg: [250, 245, 255],
            bodyText: [31, 41, 55]
          };
        case 'clean-teal':
          return {
            primary: [13, 148, 136], // teal-600
            secondary: [75, 85, 99],
            headerBg: [20, 184, 166],
            headerText: [255, 255, 255],
            accentBg: [240, 253, 250],
            bodyText: [31, 41, 55]
          };
        case 'artistic-red':
          return {
            primary: [220, 38, 38], // red-600
            secondary: [75, 85, 99],
            headerBg: [239, 68, 68],
            headerText: [255, 255, 255],
            accentBg: [254, 242, 242],
            bodyText: [31, 41, 55]
          };
        case 'corporate-navy':
          return {
            primary: [30, 58, 138], // blue-900
            secondary: [71, 85, 105],
            headerBg: [30, 58, 138],
            headerText: [255, 255, 255],
            accentBg: [239, 246, 255],
            bodyText: [15, 23, 42]
          };
        case 'modern-gradient':
          return {
            primary: [219, 39, 119], // pink-600
            secondary: [75, 85, 99],
            headerBg: [219, 39, 119],
            headerText: [255, 255, 255],
            accentBg: [253, 244, 255],
            bodyText: [31, 41, 55]
          };
        default:
          return {
            primary: [33, 150, 243],
            secondary: [75, 85, 99],
            headerBg: [33, 150, 243],
            headerText: [255, 255, 255],
            accentBg: [239, 246, 255],
            bodyText: [31, 41, 55]
          };
      }
    };

    const colors = getTemplateColors();

    // Load and convert image to base64
    const loadImageAsDataUrl = async (imageUrl: string): Promise<string | null> => {
      try {
        if (!imageUrl) return null;
        
        if (imageUrl.startsWith('data:')) {
          return imageUrl;
        }

        return new Promise((resolve) => {
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
              
              // Set canvas size to match template preview (96x96 pixels like w-24 h-24)
              canvas.width = 96;
              canvas.height = 96;
              
              // Draw image with circular crop
              ctx.beginPath();
              ctx.arc(48, 48, 48, 0, 2 * Math.PI);
              ctx.clip();
              ctx.drawImage(img, 0, 0, 96, 96);
              
              const dataURL = canvas.toDataURL('image/jpeg', 0.9);
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
        });
      } catch (error) {
        console.error('Error in loadImageAsDataUrl:', error);
        return null;
      }
    };

    // Helper function to format dates exactly like in TemplatePreview
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' });
    };

    // Enhanced HTML to text conversion that properly handles lists
    const htmlToText = (html: string): string => {
      return html
        // Handle unordered lists first
        .replace(/<ul[^>]*>/gi, '\n')
        .replace(/<\/ul>/gi, '\n')
        // Handle ordered lists
        .replace(/<ol[^>]*>/gi, '\n')
        .replace(/<\/ol>/gi, '\n')
        // Convert list items to bullet points
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        // Handle paragraphs
        .replace(/<\/p>/gi, '\n')
        .replace(/<p[^>]*>/gi, '')
        // Handle line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // Handle bold, italic, underline (keep the text, remove tags)
        .replace(/<\/?strong>/gi, '')
        .replace(/<\/?b>/gi, '')
        .replace(/<\/?em>/gi, '')
        .replace(/<\/?i>/gi, '')
        .replace(/<\/?u>/gi, '')
        // Remove any remaining HTML tags
        .replace(/<[^>]*>/g, '')
        // Clean up multiple newlines but keep intentional spacing
        .replace(/\n\s*\n\s*\n/g, '\n\n')
        // Clean up extra spaces but preserve bullet formatting
        .replace(/[ \t]+/g, ' ')
        // Trim the result
        .trim();
    };

    // Enhanced text wrapping function that handles bullet points properly with proper alignment
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 6): number => {
      const lines = text.split('\n');
      let currentY = y;
      
      lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine) {
          // Check if this is a bullet point
          if (trimmedLine.startsWith('• ')) {
            // Handle bullet points with proper same-line alignment
            const bulletText = trimmedLine.substring(2).trim(); // Remove the bullet and trim
            
            // Draw the bullet
            doc.text('•', x, currentY);
            
            // Wrap the text after the bullet, starting on the same line
            const availableWidth = maxWidth - 8; // Account for bullet space
            const wrappedBulletLines = doc.splitTextToSize(bulletText, availableWidth);
            
            wrappedBulletLines.forEach((wrappedLine: string, index: number) => {
              if (index === 0) {
                // First line: same line as bullet
                doc.text(wrappedLine, x + 8, currentY);
              } else {
                // Subsequent lines: move to next line and align with text
                currentY += lineHeight;
                doc.text(wrappedLine, x + 8, currentY);
              }
            });
            
            // Only move to next line if we have wrapped text
            if (wrappedBulletLines.length > 0) {
              currentY += lineHeight;
            }
          } else {
            // Handle regular text
            const wrappedLines = doc.splitTextToSize(trimmedLine, maxWidth);
            wrappedLines.forEach((wrappedLine: string) => {
              doc.text(wrappedLine, x, currentY);
              currentY += lineHeight;
            });
          }
        } else {
          // Empty line - add some spacing
          currentY += lineHeight * 0.5;
        }
      });
      
      return currentY;
    };

    // HEADER SECTION - matching TemplatePreview layout exactly
    // Header background with template color
    doc.setFillColor(colors.headerBg[0], colors.headerBg[1], colors.headerBg[2]);
    doc.rect(0, 0, 210, 60, 'F');

    let yPos = 25;

    // Profile photo (top right of header, like in TemplatePreview)
    if (cvData.personalInfo.photoUrl) {
      try {
        const imageData = await loadImageAsDataUrl(cvData.personalInfo.photoUrl);
        if (imageData) {
          // Position matches TemplatePreview: top right with some margin
          doc.addImage(imageData, 'JPEG', 155, 15, 30, 30, undefined, 'FAST');
        }
      } catch (error) {
        console.error('Error adding photo:', error);
      }
    }

    // Name and title (left side of header)
    doc.setTextColor(colors.headerText[0], colors.headerText[1], colors.headerText[2]);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, 20, yPos);
    
    if (cvData.personalInfo.professionalTitle) {
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text(cvData.personalInfo.professionalTitle, 20, yPos);
    }

    // Contact info (bottom of header, like in TemplatePreview) - Using text instead of emojis
    yPos = 50;
    doc.setFontSize(9);
    let contactX = 20;
    
    if (cvData.personalInfo.email) {
      doc.text(`Email: ${cvData.personalInfo.email}`, contactX, yPos);
      contactX += 65;
    }
    if (cvData.personalInfo.phone) {
      doc.text(`Tel: ${cvData.personalInfo.phone}`, contactX, yPos);
      contactX += 65;
    }
    if (cvData.personalInfo.address && contactX < 150) {
      doc.text(`Adresse: ${cvData.personalInfo.address}`, contactX, yPos);
    }

    // Reset position after header
    yPos = 75;

    // CONTENT SECTIONS - matching TemplatePreview structure

    // Professional Summary
    if (cvData.personalInfo.summary) {
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Profil Professionnel', 20, yPos);
      
      // Section underline
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPos + 2, 80, yPos + 2);
      
      yPos += 8;
      doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      const summaryText = htmlToText(cvData.personalInfo.summary);
      yPos = addWrappedText(summaryText, 20, yPos, 170) + 8;
    }

    // Experience Section
    if (cvData.experience.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Expérience Professionnelle', 20, yPos);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPos + 2, 110, yPos + 2);
      
      yPos += 10;
      
      cvData.experience.forEach((exp) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        
        // Experience background (accent color like in TemplatePreview)
        doc.setFillColor(colors.accentBg[0], colors.accentBg[1], colors.accentBg[2]);
        const boxHeight = exp.description ? 25 : 15;
        doc.rect(18, yPos - 5, 174, boxHeight, 'F');
        
        // Position title
        doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(exp.position, 22, yPos);
        
        // Company and date on same line
        doc.setFontSize(10);
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setFont(undefined, 'bold');
        doc.text(exp.company, 22, yPos + 6);
        
        const dateText = `${formatDate(exp.startDate)} - ${exp.current ? 'Présent' : formatDate(exp.endDate)}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.setFont(undefined, 'normal');
        doc.text(dateText, 190 - dateWidth, yPos + 6);
        
        yPos += 12;
        
        if (exp.description) {
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          doc.setFontSize(9);
          const descText = htmlToText(exp.description);
          yPos = addWrappedText(descText, 22, yPos, 165, 4) + 2;
        }
        
        yPos += 8;
      });
    }

    // Education Section
    if (cvData.education.length > 0) {
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Formation', 20, yPos);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPos + 2, 50, yPos + 2);
      
      yPos += 10;
      
      cvData.education.forEach((edu) => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        
        doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(edu.degree, 20, yPos);
        
        doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.setFontSize(10);
        doc.text(edu.institution, 20, yPos + 6);
        
        const eduDateText = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`;
        const eduDateWidth = doc.getTextWidth(eduDateText);
        doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
        doc.setFont(undefined, 'normal');
        doc.text(eduDateText, 190 - eduDateWidth, yPos + 6);
        
        yPos += 12;
        
        if (edu.description) {
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          doc.setFontSize(9);
          const eduDescText = htmlToText(edu.description);
          yPos = addWrappedText(eduDescText, 25, yPos, 160, 4) + 2;
        }
        
        yPos += 6;
      });
    }

    // Skills Section
    if (cvData.skills.length > 0) {
      if (yPos > 200) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Compétences', 20, yPos);
      
      doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.setLineWidth(0.5);
      doc.line(20, yPos + 2, 60, yPos + 2);
      
      yPos += 10;
      
      // Skills in grid layout like TemplatePreview
      const skillsPerRow = 2;
      let skillIndex = 0;
      
      while (skillIndex < cvData.skills.length) {
        if (yPos > 260) {
          doc.addPage();
          yPos = 30;
        }
        
        for (let i = 0; i < skillsPerRow && skillIndex < cvData.skills.length; i++) {
          const skill = cvData.skills[skillIndex];
          const xPos = 20 + (i * 85);
          
          // Skill background (accent color)
          doc.setFillColor(colors.accentBg[0], colors.accentBg[1], colors.accentBg[2]);
          doc.rect(xPos, yPos - 3, 80, 12, 'F');
          
          // Skill name (centered)
          doc.setTextColor(colors.bodyText[0], colors.bodyText[1], colors.bodyText[2]);
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          const skillNameWidth = doc.getTextWidth(skill.name);
          doc.text(skill.name, xPos + (80 - skillNameWidth) / 2, yPos + 2);
          
          // Skill level (centered below)
          doc.setFontSize(8);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
          const skillLevelWidth = doc.getTextWidth(skill.level);
          doc.text(skill.level, xPos + (80 - skillLevelWidth) / 2, yPos + 7);
          
          skillIndex++;
        }
        
        yPos += 18;
      }
    }

    // Save PDF with template name
    const templateName = template ? `_${template.name.replace(/\s+/g, '_')}` : '';
    const fileName = `CV_${cvData.personalInfo.firstName || 'Candidat'}_${cvData.personalInfo.lastName || 'Anonyme'}${templateName}.pdf`;
    doc.save(fileName);
  };

  return { generatePDF };
};
