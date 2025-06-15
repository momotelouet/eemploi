
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Phone, MapPin } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CandidateProfile = Tables<'candidate_profiles'>;

interface CandidateDetailHeaderProps {
  fullName: string;
  profile: CandidateProfile | null;
}

export const CandidateDetailHeader = ({ fullName, profile }: CandidateDetailHeaderProps) => {
  return (
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
  );
};
