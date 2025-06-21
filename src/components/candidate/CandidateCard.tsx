import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export type CandidateCardProps = {
  photoUrl?: string;
  firstName: string;
  lastName: string;
  professionalTitle: string;
  city?: string;
  onViewProfile?: () => void;
};

export default function CandidateCard({ photoUrl, firstName, lastName, professionalTitle, city, onViewProfile }: CandidateCardProps) {
  return (
    <Card className="flex flex-col items-center p-6 shadow-md hover:shadow-xl transition-all duration-200 bg-white/90 rounded-2xl">
      <Avatar className="w-20 h-20 mb-4 shadow-lg">
        <AvatarImage src={photoUrl} alt={firstName + ' ' + lastName} />
        <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
      </Avatar>
      <div className="font-bold text-lg text-gray-900 mb-1">{firstName} {lastName}</div>
      <div className="text-eemploi-primary font-medium mb-1">{professionalTitle}</div>
      {city && <div className="text-gray-500 text-sm mb-3">{city}</div>}
      <Button size="sm" variant="outline" onClick={onViewProfile}>Voir profil</Button>
    </Card>
  );
}
