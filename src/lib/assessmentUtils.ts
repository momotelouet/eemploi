
import { supabase } from '@/integrations/supabase/client';
import type { Assessment } from '@/hooks/useAssessment';

export const generateAndStoreCertificate = async (
  assessment: Pick<Assessment, 'id' | 'user_id' | 'certificate_url'>
): Promise<{ publicUrl: string; htmlContent: string } | null> => {
  // If URL already exists, we could fetch it, but let's regenerate to ensure it's fresh.
  // This function is for creating/downloading, so fresh data is better.

  try {
    const { data: functionData, error: functionError } = await supabase.functions.invoke('generate-certificate', {
      body: { assessmentId: assessment.id },
    });

    if (functionError) throw functionError;

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

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const file = new File([blob], `certificat-${assessment.id}.html`, { type: 'text/html' });

      const filePath = `certificates/${assessment.user_id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error("Impossible de récupérer l'URL publique du certificat.");
      }

      // 1. Update the specific assessment entry
      const { error: updateError } = await supabase
        .from('candidate_assessments')
        .update({ certificate_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', assessment.id);

      if (updateError) throw updateError;
      
      // 2. Also update the main candidate profile with this new certificate URL
      const { error: profileUpdateError } = await supabase
        .from('candidate_profiles')
        .update({ certificate_url: publicUrl })
        .eq('user_id', assessment.user_id);

      if (profileUpdateError) {
        // We log this as a warning but don't stop the process
        console.warn("Le profil du candidat n'a pas pu être mis à jour avec l'URL du certificat:", profileUpdateError);
      }

      return { publicUrl, htmlContent };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la génération et sauvegarde du certificat:', error);
    return null;
  }
};
