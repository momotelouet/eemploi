
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, FileText } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type CandidateProfile = Tables<'candidate_profiles'>;
type Assessment = Tables<'candidate_assessments'>;

interface DocumentsInfoTabProps {
  profile: CandidateProfile | null;
  assessments: Assessment[];
  onDownloadCV: () => void;
  onDownloadCertificate: (url: string) => void;
}

export const DocumentsInfoTab = ({ profile, assessments, onDownloadCV, onDownloadCertificate }: DocumentsInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2" />CV</CardTitle></CardHeader>
        <CardContent>
          {profile?.cv_file_url ? (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{profile.cv_file_name || 'CV disponible'}</p>
              <Button onClick={onDownloadCV} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Télécharger</Button>
            </div>
          ) : (<p className="text-muted-foreground">Aucun CV disponible</p>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center"><Award className="w-5 h-5 mr-2" />Certificats</CardTitle></CardHeader>
        <CardContent>
          {assessments.some(a => a.certificate_url) ? (
            <div className="space-y-2">
              {assessments.filter(a => a.certificate_url).map((assessment, index) => (
                <Button key={assessment.id} onClick={() => onDownloadCertificate(assessment.certificate_url!)} variant="outline" size="sm" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />Certificat #{index + 1}
                </Button>
              ))}
            </div>
          ) : (<p className="text-muted-foreground">Aucun certificat disponible</p>)}
        </CardContent>
      </Card>
    </div>
  );
};
