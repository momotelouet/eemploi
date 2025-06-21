import type { ApplicationWithJobAndProfile } from "@/hooks/useJobApplications";

export const getCandidateName = (application: ApplicationWithJobAndProfile): string => {
  const profile = application.candidate_profile;
  if (profile) {
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    return fullName || 'Candidat anonyme';
  }
  return 'Candidat anonyme';
};
