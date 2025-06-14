
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useJobApplication = () => {
  const { user } = useAuth();
  const [isApplying, setIsApplying] = useState(false);

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('candidate-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('candidate-files')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${folder}:`, error);
      return null;
    }
  };

  const uploadCV = async (file: File): Promise<string | null> => {
    return await uploadFile(file, 'applications');
  };

  const uploadCoverLetter = async (content: string): Promise<string | null> => {
    if (!user) return null;

    try {
      // Create a text file from the cover letter content
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], 'lettre_motivation.txt', { type: 'text/plain' });
      
      return await uploadFile(file, 'cover-letters');
    } catch (error) {
      console.error('Error uploading cover letter:', error);
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
        .maybeSingle();

      if (existingApplication) {
        toast.error('Vous avez déjà postulé à cette offre');
        return false;
      }

      let finalCvUrl = cvUrl;
      let coverLetterUrl = null;
      let certificateUrl = null;

      // If a CV file was uploaded, upload it first
      if (cvFile) {
        const uploadedUrl = await uploadCV(cvFile);
        if (!uploadedUrl) {
          toast.error('Erreur lors du téléchargement du CV');
          return false;
        }
        finalCvUrl = uploadedUrl;
      }

      // Upload cover letter if provided
      if (coverLetter && coverLetter.trim()) {
        coverLetterUrl = await uploadCoverLetter(coverLetter);
        if (!coverLetterUrl) {
          toast.error('Erreur lors du téléchargement de la lettre de motivation');
          return false;
        }
      }

      // Get the latest assessment certificate for the user
      const { data: latestAssessment } = await supabase
        .from('candidate_assessments')
        .select('certificate_url')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .not('certificate_url', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestAssessment?.certificate_url) {
        certificateUrl = latestAssessment.certificate_url;
      }

      // Create new application
      const applicationData: any = {
        job_id: jobId,
        candidate_id: user.id,
        status: 'pending'
      };

      // Add optional fields only if they exist
      if (coverLetter) {
        applicationData.cover_letter = coverLetter;
      }
      
      if (finalCvUrl) {
        applicationData.cv_url = finalCvUrl;
      }
      
      if (selectedCVProfileId) {
        applicationData.cv_profile_id = selectedCVProfileId;
      }

      if (coverLetterUrl) {
        applicationData.cover_letter_url = coverLetterUrl;
      }

      if (certificateUrl) {
        applicationData.certificate_url = certificateUrl;
      }

      const { error } = await supabase
        .from('applications')
        .insert(applicationData);

      if (error) {
        console.error('Application error:', error);
        throw error;
      }

      // Success message with details of what was attached
      let attachments = [];
      if (finalCvUrl || selectedCVProfileId) attachments.push('CV');
      if (coverLetterUrl) attachments.push('lettre de motivation');
      if (certificateUrl) attachments.push('certificat d\'évaluation');

      const attachmentText = attachments.length > 0 
        ? ` avec ${attachments.join(', ')}` 
        : '';

      toast.success(`Votre candidature a été envoyée avec succès${attachmentText} !`);
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
