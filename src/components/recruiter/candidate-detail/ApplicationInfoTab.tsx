
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Info } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface ApplicationInfoTabProps {
  application: Tables<'applications'> | null;
}

const getStatusBadge = (status: string | undefined | null) => {
  if (!status) return <Badge variant="secondary">Inconnu</Badge>;
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    case 'accepted':
      return <Badge className="bg-green-100 text-green-800">Acceptée</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800">Refusée</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export const ApplicationInfoTab = ({ application }: ApplicationInfoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Informations sur la candidature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <p>
            <span className="font-medium">Date de candidature : </span>
            <span className="text-muted-foreground">
              {application?.applied_at ? new Date(application.applied_at).toLocaleDateString('fr-FR') : 'Non spécifiée'}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-2">
           <p className="font-medium">Statut :</p>
           {getStatusBadge(application?.status)}
        </div>
        <div className="text-sm text-muted-foreground pt-4 border-t mt-4">
          La lettre de motivation, le CV et les certificats soumis avec cette candidature sont disponibles dans l'onglet "Documents".
        </div>
      </CardContent>
    </Card>
  );
};
