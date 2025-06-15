
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface ApplicationInfoTabProps {
  application: Tables<'applications'> | null;
}

export const ApplicationInfoTab = ({ application }: ApplicationInfoTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Détails de la candidature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-medium">Date de candidature :</p>
          <p className="text-muted-foreground">
            {application?.applied_at ? new Date(application.applied_at).toLocaleDateString('fr-FR') : 'Non spécifiée'}
          </p>
        </div>
        
        {application?.cover_letter && (
          <div>
            <p className="font-medium mb-2">Lettre de motivation :</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="whitespace-pre-wrap">{application.cover_letter}</p>
            </div>
          </div>
        )}
        
        {application?.cv_url && (
          <div>
            <p className="font-medium mb-2">CV joint à la candidature :</p>
            <Button 
              variant="outline" 
              onClick={() => window.open(application.cv_url!, '_blank')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Voir le CV
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
