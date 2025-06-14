
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJobApplication = () => {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const uploadCV = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/applications/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading CV:', error);
      return null;
    }
  };

  const applyToJob = async (
    jobId: string, 
    coverLetter?: string, 
    cvUrl?: string, 
    cvFile?: File,
    selectedCVProfileId?: string
  ) => {
    if (!user) {
      toast.error('Vous devez être connecté pour postuler');
      return false;
    }

    setIsApplying(true);
    
    try {
      // Check if user has already applied to this job
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('candidate_id', user.id)
        .single();

      if (existingApplication) {
        toast.error('Vous avez déjà postulé à cette offre');
        return false;
      }

      let finalCvUrl = cvUrl;

      // If a CV file was uploaded, upload it first
      if (cvFile) {
        const uploadedUrl = await uploadCV(cvFile);
        if (!uploadedUrl) {
          toast.error('Erreur lors du téléchargement du CV');
          return false;
        }
        finalCvUrl = uploadedUrl;
      }

      // Create new application
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: user.id,
          cover_letter: coverLetter,
          cv_url: finalCvUrl,
          cv_profile_id: selectedCVProfileId,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Votre candidature a été envoyée avec succès !');
      return true;
    } catch (error) {
      console.error('Error applying to job:', error);
      toast.error('Une erreur est survenue lors de l\'envoi de votre candidature');
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  return { applyToJob, isApplying };
};
