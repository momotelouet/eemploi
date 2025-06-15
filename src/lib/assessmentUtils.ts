
import { supabase } from '@/integrations/supabase/client';
import type { Assessment } from '@/hooks/useAssessment';
import { generateCertificatePDFfromHTML } from './certificateUtils';

export const generateAndStoreCertificate = async (
  assessment: Pick<Assessment, 'id' | 'user_id' | 'certificate_url'>
): Promise<{ publicUrl: string } | null> => {
  try {
    // 1. Générer le HTML depuis la edge function
    const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-certificate', {
      body: { assessmentId: assessment.id },
    });
    if (functionError) {
      console.error('[Certificate] Edge function error:', functionError);
      throw functionError;
    }

    if (functionData?.html) {
      const htmlContent = functionData.html;

      // 2. Générer le PDF à partir du HTML
      const pdfBlob = await generateCertificatePDFfromHTML(htmlContent);
      
      // 3. Préparer le fichier PDF pour storage
      const file = new File([pdfBlob], `certificat-${assessment.id}.pdf`, { type: 'application/pdf' });
      const filePath = `${assessment.user_id}/certificates/${file.name}`;

      // 3bis. Supprimer tout fichier existant (pour corriger les anciens bugs de type MIME et de fichier .html)
      const oldHtmlFilePath = `${assessment.user_id}/certificates/certificat-${assessment.id}.html`;
      await supabase.storage.from('candidate-files').remove([filePath, oldHtmlFilePath]);

      // 4. Upload du certificat PDF
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file, { upsert: true, contentType: 'application/pdf' });

      if (uploadError) {
        console.error('[Certificate] Storage upload error:', uploadError);
        throw uploadError;
      } else {
        console.log('[Certificate] Fichier PDF uploadé avec succès dans storage:', filePath);
      }

      // 5. Récupération de l'URL publique
      const { data: urlData } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.debug('[Certificate] URL PDF brute fournie par Supabase :', publicUrl);

      if (!publicUrl) {
        console.error('[Certificate] Impossible de récupérer l\'URL publique du certificat PDF');
        throw new Error("Impossible de récupérer l'URL publique du certificat PDF.");
      } else {
        console.log('[Certificate] URL publique PDF obtenue:', publicUrl);
      }

      // 6. Mise à jour de la colonne certificate_url dans candidate_assessments
      const { error: updateError } = await supabase
        .from('candidate_assessments')
        .update({ certificate_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', assessment.id);

      if (updateError) {
        console.error('[Certificate] Erreur lors update candidate_assessments:', updateError);
        throw updateError;
      } else {
        console.log('[Certificate] Champ certificate_url mis à jour dans candidate_assessments');
      }

      // 7. Mise à jour du champ certificat de candidate_profiles aussi (non bloquant)
      const { error: profileUpdateError } = await supabase
        .from('candidate_profiles')
        .update({ certificate_url: publicUrl })
        .eq('user_id', assessment.user_id);

      if (profileUpdateError) {
        console.warn("[Certificate] Le profil du candidat n'a pas pu être mis à jour avec l'URL du certificat:", profileUpdateError);
      }

      return { publicUrl };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la génération et sauvegarde du certificat PDF:', error);
    return null;
  }
};
