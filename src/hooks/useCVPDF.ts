
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

    // Helper function to add text with automatic line wrapping
    const addText = (text: string, x: number, y: number, maxWidth?: number) => {
      if (maxWidth && text.length > 60) {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + (lines.length * 7);
      } else {
        doc.text(text, x, y);
        return y + 7;
      }
    };

    // Header with name and title
    doc.setFontSize(24);
    doc.setTextColor(0, 102, 204); // Blue color
    yPosition = addText(`${cvData.personalInfo.firstName} ${cvData.personalInfo.lastName}`, 20, yPosition);
    
    if (cvData.personalInfo.professionalTitle) {
      doc.setFontSize(16);
      doc.setTextColor(102, 102, 102); // Gray color
      yPosition = addText(cvData.personalInfo.professionalTitle, 20, yPosition + 5);
    }

    // Contact information
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); // Black
    yPosition += 10;
    
    if (cvData.personalInfo.email) {
      yPosition = addText(`Email: ${cvData.personalInfo.email}`, 20, yPosition);
    }
    if (cvData.personalInfo.phone) {
      yPosition = addText(`Téléphone: ${cvData.personalInfo.phone}`, 20, yPosition);
    }
    if (cvData.personalInfo.address) {
      yPosition = addText(`Adresse: ${cvData.personalInfo.address}`, 20, yPosition);
    }

    yPosition += 10;

    // Professional summary
    if (cvData.personalInfo.summary) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      yPosition = addText('PROFIL PROFESSIONNEL', 20, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      yPosition = addText(cvData.personalInfo.summary, 20, yPosition + 5, 170) + 10;
    }

    // Experience section
    if (cvData.experience.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      yPosition = addText('EXPÉRIENCE PROFESSIONNELLE', 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      cvData.experience.forEach((exp) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFont(undefined, 'bold');
        yPosition = addText(`${exp.position} - ${exp.company}`, 20, yPosition);
        
        doc.setFont(undefined, 'normal');
        const dateText = `${exp.startDate} - ${exp.current ? 'Présent' : exp.endDate}`;
        yPosition = addText(dateText, 20, yPosition);
        
        if (exp.description) {
          yPosition = addText(exp.description, 20, yPosition, 170) + 5;
        }
        yPosition += 5;
      });
    }

    // Education section
    if (cvData.education.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      yPosition = addText('FORMATION', 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      cvData.education.forEach((edu) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFont(undefined, 'bold');
        yPosition = addText(`${edu.degree} - ${edu.institution}`, 20, yPosition);
        
        doc.setFont(undefined, 'normal');
        const dateText = `${edu.startDate} - ${edu.endDate}`;
        yPosition = addText(dateText, 20, yPosition);
        
        if (edu.description) {
          yPosition = addText(edu.description, 20, yPosition, 170) + 5;
        }
        yPosition += 5;
      });
    }

    // Skills section
    if (cvData.skills.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(0, 102, 204);
      yPosition = addText('COMPÉTENCES', 20, yPosition);
      yPosition += 5;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      const skillsText = cvData.skills.map(skill => `• ${skill.name} (${skill.level})`).join('\n');
      addText(skillsText, 20, yPosition, 170);
    }

    // Save the PDF
    const fileName = `CV_${cvData.personalInfo.firstName || 'Candidat'}_${cvData.personalInfo.lastName || 'Anonyme'}.pdf`;
    doc.save(fileName);
  };

  return { generatePDF };
};
