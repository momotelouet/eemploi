import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Linkedin, 
  Download, 
  Printer,
  Calendar,
  GraduationCap,
  Briefcase,
  Languages
} from 'lucide-react';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

// Define custom interface for candidate profile
interface CandidateProfile {
  id: string;
  user_id: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  skills?: string[];
  experience_years?: number;
  education?: string;
  languages?: string[];
  cv_file_url?: string;
  cv_file_name?: string;
  profile_picture_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId: string;
  candidateEmail?: string;
}

const CandidateProfileModal = ({ isOpen, onClose, candidateId, candidateEmail }: CandidateProfileModalProps) => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [userProfile, setUserProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchCandidateProfile();
    }
  }, [isOpen, candidateId]);

  const fetchCandidateProfile = async () => {
    setLoading(true);
    try {
      // Fetch candidate profile using direct query
      const { data: candidateProfile, error: profileError } = await supabase
        .from('candidate_profiles' as any)
        .select('*')
        .eq('user_id', candidateId)
        .maybeSingle();

      // Fetch basic user profile
      const { data: basicProfile, error: basicError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', candidateId)
        .single();

      if (basicError) {
        console.error('Error fetching basic profile:', basicError);
      } else {
        setUserProfile(basicProfile);
      }

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching candidate profile:', profileError);
        toast.error('Erreur lors du chargement du profil');
        setProfile(null);
      } else {
        setProfile(candidateProfile as CandidateProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!profile?.cv_file_url) {
      toast.error('Aucun CV disponible');
      return;
    }

    try {
      const response = await fetch(profile.cv_file_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = profile.cv_file_name || 'CV_candidat.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('CV téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Erreur lors du téléchargement du CV');
    }
  };

  const handlePrintProfile = () => {
    window.print();
  };

  const handleContactCandidate = () => {
    if (candidateEmail) {
      window.open(`mailto:${candidateEmail}`, '_blank');
    } else if (profile?.phone) {
      window.open(`tel:${profile.phone}`, '_blank');
    } else {
      toast.error('Aucune information de contact disponible');
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <p>Chargement du profil...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const fullName = userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : 'Candidat';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Profil du candidat</span>
            <div className="flex space-x-2">
              <Button onClick={handleContactCandidate} size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Contacter
              </Button>
              {profile?.cv_file_url && (
                <Button onClick={handleDownloadCV} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger CV
                </Button>
              )}
              <Button onClick={handlePrintProfile} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête du profil */}
          <div className="flex items-start space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile?.profile_picture_url || undefined} />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{fullName}</h2>
              {profile?.bio && (
                <p className="text-muted-foreground mt-2">{profile.bio}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                {candidateEmail && (
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-1" />
                    {candidateEmail}
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {profile.phone}
                  </div>
                )}
                {(profile?.city || profile?.country) && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {[profile.city, profile.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations professionnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expérience */}
            {profile?.experience_years && (
              <div>
                <h3 className="flex items-center text-lg font-semibold mb-3">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Expérience
                </h3>
                <p>{profile.experience_years} ans d'expérience</p>
              </div>
            )}

            {/* Formation */}
            {profile?.education && (
              <div>
                <h3 className="flex items-center text-lg font-semibold mb-3">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Formation
                </h3>
                <p>{profile.education}</p>
              </div>
            )}
          </div>

          {/* Compétences */}
          {profile?.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Compétences</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {profile?.languages && profile.languages.length > 0 && (
            <div>
              <h3 className="flex items-center text-lg font-semibold mb-3">
                <Languages className="w-5 h-5 mr-2" />
                Langues
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((language, index) => (
                  <Badge key={index} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Liens */}
          <div className="flex flex-wrap gap-4">
            {profile?.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
            {profile?.portfolio_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-2" />
                  Portfolio
                </a>
              </Button>
            )}
          </div>

          {/* Message si profil incomplet */}
          {!profile && (
            <div className="text-center py-8 text-muted-foreground">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Ce candidat n'a pas encore complété son profil détaillé.</p>
              <p className="text-sm mt-2">Seules les informations de base sont disponibles.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfileModal;
