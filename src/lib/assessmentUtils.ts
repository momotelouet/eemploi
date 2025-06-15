
import { supabase } from '@/integrations/supabase/client';
import type { Assessment } from '@/hooks/useAssessment';

export const generateAndStoreCertificate = async (
  assessment: Pick<Assessment, 'id' | 'user_id' | 'certificate_url'>
): Promise<{ publicUrl: string; htmlContent: string } | null> => {
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
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Certificat d'Évaluation - eemploi.com</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body>
          ${functionData.html}
        </body>
        </html>
      `;

      // 2. Préparer le fichier HTML pour storage
      const file = new File([htmlContent], `certificat-${assessment.id}.html`, { type: 'text/html' });
      const filePath = `${assessment.user_id}/certificates/${file.name}`;

      // 2bis. Supprimer tout fichier existant (pour corriger les anciens bugs de type MIME)
      await supabase.storage.from('candidate-files').remove([filePath]);

      // 3. Upload du certificat (upsert pour remplacement si existe déjà)
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file, { upsert: true, contentType: 'text/html' });

      if (uploadError) {
        console.error('[Certificate] Storage upload error:', uploadError);
        throw uploadError;
      } else {
        console.log('[Certificate] Fichier uploadé avec succès dans storage:', filePath);
      }

      // 4. Récupération de l'URL publique
      const { data: urlData } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.debug('[Certificate] URL brute fournie par Supabase :', publicUrl);

      if (!publicUrl) {
        console.error('[Certificate] Impossible de récupérer l\'URL publique du certificat');
        throw new Error("Impossible de récupérer l'URL publique du certificat.");
      } else {
        console.log('[Certificate] URL publique obtenue:', publicUrl);
      }

      // 5. Mise à jour de la colonne certificate_url dans candidate_assessments
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

      // 6. Mise à jour du champ certificat de candidate_profiles aussi (non bloquant)
      const { error: profileUpdateError } = await supabase
        .from('candidate_profiles')
        .update({ certificate_url: publicUrl })
        .eq('user_id', assessment.user_id);

      if (profileUpdateError) {
        console.warn("[Certificate] Le profil du candidat n'a pas pu être mis à jour avec l'URL du certificat:", profileUpdateError);
      }

      return { publicUrl, htmlContent };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la génération et sauvegarde du certificat:', error);
    return null;
  }
};
