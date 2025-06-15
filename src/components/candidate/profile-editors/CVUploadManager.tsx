
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Upload,
  FileText,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { CandidateProfile } from "@/hooks/useCandidateProfile";
import type { User } from '@supabase/supabase-js';

interface CVUploadManagerProps {
    profile: CandidateProfile;
    onUpdate: (updates: Partial<CandidateProfile>) => Promise<any>;
    user: User | null;
}

const CVUploadManager = ({ profile, onUpdate, user }: CVUploadManagerProps) => {
    const { toast } = useToast();
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleCVUpload = async () => {
        if (!cvFile || !user) return;
    
        setUploading(true);
        try {
          const fileExt = cvFile.name.split('.').pop();
          const fileName = `${user.id}/cv.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('candidate-files')
            .upload(fileName, cvFile, { upsert: true });
    
          if (uploadError) throw uploadError;
    
          const { data: { publicUrl } } = supabase.storage
            .from('candidate-files')
            .getPublicUrl(fileName);
    
          await onUpdate({
            cv_file_url: publicUrl,
            cv_file_name: cvFile.name
          });

          // We need to refresh the profile to show the new CV
          // This will be handled by the parent component's state update
    
          toast({
            title: 'CV uploadé',
            description: 'Votre CV a été uploadé avec succès.',
          });
    
          setCvFile(null);
        } catch (error) {
          toast({
            title: 'Erreur',
            description: 'Impossible d\'uploader le CV.',
            variant: 'destructive'
          });
        } finally {
          setUploading(false);
        }
      };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-eemploi-primary" />
                    Mon CV
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {profile?.cv_file_url ? (
                <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-green-900">CV actuel</p>
                        <p className="text-sm text-green-700">{profile.cv_file_name}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(profile.cv_file_url!, '_blank')}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                    </Button>
                    </div>
                </div>
                ) : (
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <p className="text-blue-900 font-medium">Aucun CV uploadé</p>
                    <p className="text-sm text-blue-700">Uploadez votre CV pour améliorer votre profil</p>
                </div>
                )}

                <div className="space-y-3">
                    <div>
                        <Label htmlFor="cv-file">Nouveau CV (PDF, DOC, DOCX)</Label>
                        <Input
                        id="cv-file"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files?.[0] || null)}
                        />
                    </div>
                    {cvFile && (
                        <Button
                        onClick={handleCVUpload}
                        disabled={uploading}
                        className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
                        >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploading ? 'Upload en cours...' : 'Uploader CV'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default CVUploadManager;
