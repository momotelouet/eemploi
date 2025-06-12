
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJobApplication = () => {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const applyToJob = async (jobId: string, coverLetter?: string, cvUrl?: string) => {
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

      // Create new application
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          candidate_id: user.id,
          cover_letter: coverLetter,
          cv_url: cvUrl,
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
