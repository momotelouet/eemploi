
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from './useUserProfile';
import jsPDF from 'jspdf';

export const useCVPDF = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const generatePDF = () => {
    if (!user || !profile) {
      console.error('User or profile not available');
      throw new Error('Données utilisateur non disponibles pour générer le CV');
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(24);
    doc.text(`${profile.first_name || ''} ${profile.last_name || ''}`, 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Email: ${user.email}`, 20, 50);
    
    // Experience section
    doc.setFontSize(16);
    doc.text('Expérience Professionnelle', 20, 80);
    
    doc.setFontSize(12);
    doc.text('• Développeur Full Stack - Entreprise ABC (2022-2024)', 20, 100);
    doc.text('• Développeur Frontend - Startup XYZ (2020-2022)', 20, 110);
    
    // Education section
    doc.setFontSize(16);
    doc.text('Formation', 20, 140);
    
    doc.setFontSize(12);
    doc.text('• Master en Informatique - Université Mohammed V (2018-2020)', 20, 160);
    doc.text('• Licence en Informatique - Université Hassan II (2015-2018)', 20, 170);
    
    // Skills section
    doc.setFontSize(16);
    doc.text('Compétences', 20, 200);
    
    doc.setFontSize(12);
    doc.text('• React, TypeScript, Node.js', 20, 220);
    doc.text('• Python, PostgreSQL, MongoDB', 20, 230);
    doc.text('• Docker, AWS, Git', 20, 240);
    
    // Save the PDF
    doc.save(`CV_${profile.first_name || 'Candidat'}_${profile.last_name || 'Anonyme'}.pdf`);
  };

  return { generatePDF };
};
