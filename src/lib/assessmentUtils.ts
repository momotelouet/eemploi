
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

      const { error: updateError } = await supabase
        .from('candidate_assessments')
        .update({ certificate_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', assessment.id);

      if (updateError) throw updateError;

      return { publicUrl, htmlContent };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la génération et sauvegarde du certificat:', error);
    return null;
  }
};
