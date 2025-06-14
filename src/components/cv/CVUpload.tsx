
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Trash2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CVUploadProps {
  onFileSelect?: (file: File) => void;
  showAsDialog?: boolean;
}

const CVUpload = ({ onFileSelect, showAsDialog = true }: CVUploadProps) => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Veuillez utiliser un fichier PDF ou Word.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 5 MB.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUploadedFile(file);
      
      if (onFileSelect) {
        onFileSelect(file);
      }
      
      toast({
        title: "CV sélectionné avec succès",
        description: "Votre CV est prêt pour la candidature.",
      });
    } catch (error) {
      toast({
        title: "Erreur lors de la sélection",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (onFileSelect) {
      onFileSelect(null as any);
    }
    toast({
      title: "CV retiré",
      description: "Le fichier a été retiré de la sélection.",
    });
  };

  const handleDownload = () => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      const a = document.createElement('a');
      a.href = url;
      a.download = uploadedFile.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const content = (
    <div className="space-y-4">
      {!uploadedFile ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium mb-2">Télécharger votre CV</h3>
              <p className="text-sm text-gray-600 mb-4">
                Formats acceptés: PDF, DOC, DOCX (max 5 MB)
              </p>
              <Label htmlFor="cv-upload" className="cursor-pointer">
                <Input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button 
                  className="bg-eemploi-primary hover:bg-eemploi-primary/90"
                  disabled={isUploading}
                  asChild
                >
                  <span>
                    {isUploading ? 'Sélection...' : 'Choisir un fichier'}
                  </span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-eemploi-primary" />
                <div>
                  <p className="font-medium truncate max-w-32">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="cv-replace" className="cursor-pointer">
                <Input
                  id="cv-replace"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isUploading}
                  asChild
                >
                  <span>Remplacer le fichier</span>
                </Button>
              </Label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (!showAsDialog) {
    return content;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Mettre à jour mon CV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Mettre à jour votre CV</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default CVUpload;
