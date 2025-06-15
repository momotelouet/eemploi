
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, GraduationCap, Languages, Linkedin, Globe, User } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CandidateProfile = Tables<'candidate_profiles'>;

interface ProfileInfoTabProps {
  profile: CandidateProfile | null;
}

export const ProfileInfoTab = ({ profile }: ProfileInfoTabProps) => {
  if (!profile) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Le profil détaillé de ce candidat n'est pas disponible.</p>
        </CardContent>
      </Card>
    );
  }

  const isProfileEffectivelyEmpty = 
    profile.experience_years == null &&
    !profile.education &&
    (!profile.skills || profile.skills.length === 0) &&
    (!profile.languages || profile.languages.length === 0) &&
    !profile.linkedin_url &&
    !profile.portfolio_url;

  if (isProfileEffectivelyEmpty) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">Ce candidat n'a pas encore complété son profil détaillé.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profile.experience_years != null && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Briefcase className="w-5 h-5 mr-2" />
                Expérience
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{profile.experience_years} ans d'expérience</p>
            </CardContent>
          </Card>
        )}

        {profile.education && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <GraduationCap className="w-5 h-5 mr-2" />
                Formation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{profile.education}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Compétences</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => <Badge key={index} variant="secondary">{skill}</Badge>)}
          </CardContent>
        </Card>
      )}

      {profile.languages && profile.languages.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center"><Languages className="w-5 h-5 mr-2" />Langues</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profile.languages.map((lang, index) => <Badge key={index} variant="outline">{lang}</Badge>)}
          </CardContent>
        </Card>
      )}

      {(profile.linkedin_url || profile.portfolio_url) && (
        <Card>
          <CardHeader><CardTitle>Liens professionnels</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {profile.linkedin_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"><Linkedin className="w-4 h-4 mr-2" />LinkedIn</a>
              </Button>
            )}
            {profile.portfolio_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer"><Globe className="w-4 h-4 mr-2" />Portfolio</a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
