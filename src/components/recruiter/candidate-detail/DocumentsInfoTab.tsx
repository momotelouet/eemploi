
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, FileText, FolderArchive } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';
import { Separator } from '@/components/ui/separator';

type CandidateProfile = Tables<'candidate_profiles'>;
type Assessment = Tables<'candidate_assessments'>;
type Application = Tables<'applications'>;

interface DocumentsInfoTabProps {
  application: Application | null;
  profile: CandidateProfile | null;
  assessments: Assessment[];
  onDownloadCV: () => void;
  onDownloadCertificate: (url: string) => void;
}

export const DocumentsInfoTab = ({ application, profile, assessments, onDownloadCV, onDownloadCertificate }: DocumentsInfoTabProps) => {
  const handleOpenUrl = (url: string) => window.open(url, '_blank');

  const hasSubmittedDocuments = application?.cv_url || application?.cover_letter || application?.certificate_url;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center"><FileText className="w-5 h-5 mr-2" />Documents joints à la candidature</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {!hasSubmittedDocuments && <p className="text-muted-foreground">Aucun document spécifique n'a été joint à cette candidature.</p>}
          
          {application?.cv_url && (
            <div className="flex items-center justify-between">
              <p className="font-medium">CV soumis</p>
              <Button onClick={() => handleOpenUrl(application.cv_url!)} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Voir le CV</Button>
            </div>
          )}
          
          {application?.cover_letter && (
             <div className="space-y-2">
                <p className="font-medium">Lettre de motivation soumise</p>
                <div className="bg-gray-50 p-3 rounded-md text-sm whitespace-pre-wrap border">{application.cover_letter}</div>
              </div>
          )}

          {application?.certificate_url && (
            <div className="flex items-center justify-between">
              <p className="font-medium">Certificat soumis</p>
              <Button onClick={() => handleOpenUrl(application.certificate_url!)} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Voir le certificat</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><FolderArchive className="w-5 h-5 mr-2" />Documents généraux du profil</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {profile?.cv_file_url ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">CV général du profil</p>
                <p className="text-sm text-muted-foreground">{profile.cv_file_name || 'Fichier CV'}</p>
              </div>
              <Button onClick={onDownloadCV} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Télécharger</Button>
            </div>
          ) : (<p className="text-muted-foreground">Aucun CV général sur le profil.</p>)}
          
          <Separator />

          <div>
            <p className="font-medium mb-2">Certificats du profil</p>
            {assessments.some(a => a.certificate_url) ? (
              <div className="space-y-2">
                {assessments.filter(a => a.certificate_url).map((assessment, index) => (
                  <div key={assessment.id} className="flex items-center justify-between">
                    <p>Certificat d'évaluation #{index + 1} (Score: {assessment.total_score})</p>
                    <Button onClick={() => onDownloadCertificate(assessment.certificate_url!)} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            ) : (<p className="text-muted-foreground">Aucun certificat disponible sur le profil.</p>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
