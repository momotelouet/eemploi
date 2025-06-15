
import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";

export const getCandidateName = (application: ApplicationWithJobAndProfile) => {
  if (application.candidate_profiles?.profiles) {
    const profile = application.candidate_profiles.profiles;
    return `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Candidat anonyme';
  }
  return `Candidat #${application.candidate_id ? String(application.candidate_id).slice(0, 8) : ''}`;
};
