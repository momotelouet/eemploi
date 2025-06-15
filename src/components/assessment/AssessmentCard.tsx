import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { Assessment } from '@/hooks/useAssessment';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { generateAndStoreCertificate } from '@/lib/assessmentUtils';
import AssessmentScore from './AssessmentScore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AssessmentCardProps {
  assessment: Assessment;
  onStartNewAssessment?: () => void;
  onDelete: (assessment: Assessment) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onStartNewAssessment, onDelete }) => {
  const queryClient = useQueryClient();
  const [certHtml, setCertHtml] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const hiddenCertRef = useRef<HTMLDivElement>(null);

  // Correction : largeur fixe et rendu PDF A4 pleine page sans réduction
  const downloadCertificatePDF = async (assessment: Assessment) => {
    setIsGenerating(true);
    const toastId = toast.loading('Préparation du certificat PDF...');
    try {
      const result = await generateAndStoreCertificate(assessment);

      if (result && result.htmlContent) {
        setCertHtml(result.htmlContent);

        setTimeout(async () => {
          if (hiddenCertRef.current) {
            // Fix A4 width in px : 794px (≈21cm à 96dpi)
            hiddenCertRef.current.style.width = "794px";
            hiddenCertRef.current.style.height = ""; // unset to auto-fit height

            const canvas = await html2canvas(hiddenCertRef.current, {
              scale: 2, // Option: meilleure résolution
              useCORS: true,
              backgroundColor: "#fff"
            });

            const imgData = canvas.toDataURL('image/png');
            // Format PDF A4 en points (pt) : 595x842pt (1pt=1/72in)
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();   // ≈595pt
            const pdfHeight = pdf.internal.pageSize.getHeight(); // ≈842pt

            // L’image du canvas est générée à (canvas.width x canvas.height)
            // On veut que le contenu HTML (794px de large) remplisse tout le PDF (a4) sans réduction
            // Conversion px -> pt : 1px = 0.75pt (à 96dpi)
            const a4PixelWidth = 794; // px
            const a4PixelHeight = Math.round(a4PixelWidth * pdfHeight / pdfWidth); // respecte le ratio

            // Adapter l’image pour remplir la page A4 : sa largeur en points doit = pdfWidth
            // Si canvas a été généré en double largeure (scale:2) : ajuster !
            const renderWidth = pdfWidth;
            const renderHeight = (canvas.height / canvas.width) * renderWidth;

            // Pour éviter de trop réduire, si la hauteur dépasse le PDF, ajuster
            let offsetY = 0;
            let finalRenderHeight = renderHeight;
            if (renderHeight > pdfHeight) {
              finalRenderHeight = pdfHeight;
            } else if (renderHeight < pdfHeight) {
              // centrer verticalement si besoin ? sinon coller en haut
              offsetY = 0;
            }

            pdf.addImage(
              imgData,
              'PNG',
              0, // x
              offsetY, // y
              renderWidth,
              finalRenderHeight
            );

            pdf.save(`certificat-evaluation-${assessment.id.slice(0, 8)}.pdf`);
            toast.success('Certificat PDF généré et téléchargé !', { id: toastId });
            setCertHtml(null);
            await queryClient.invalidateQueries({ queryKey: ['user-assessments', assessment.user_id] });
          }
          setIsGenerating(false);
        }, 350);
      } else {
        setCertHtml(null);
        toast.error('Erreur lors de la génération du certificat', { id: toastId });
        setIsGenerating(false);
      }
    } catch (error) {
      setCertHtml(null);
      setIsGenerating(false);
      console.error('Erreur lors de la génération ou du téléchargement du certificat PDF:', error);
      toast.error('Erreur lors du téléchargement du certificat PDF', { id: toastId });
    }
  };

  const personalityScore = assessment.personality_score?.score || 0;
  const skillsScore = assessment.skills_score?.score || 0;
  const qualitiesScore = assessment.qualities_score?.score || 0;
  const maxPersonalityScore = 25;
  const maxSkillsScore = 25;
  const maxQualitiesScore = 15;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span>Évaluation Complète</span>
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {assessment.completed_at ? format(new Date(assessment.completed_at), 'dd MMMM yyyy', { locale: fr }) : ''}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Complétée
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {assessment.total_score}
              </div>
              <div className="text-sm text-muted-foreground">
                Score total
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <AssessmentScore 
              title="🧠 Personnalité"
              score={personalityScore}
              maxScore={maxPersonalityScore}
              color="text-blue-600"
            />
            <AssessmentScore 
              title="🎯 Compétences"
              score={skillsScore}
              maxScore={maxSkillsScore}
              color="text-green-600"
            />
            <AssessmentScore 
              title="⭐ Qualités"
              score={qualitiesScore}
              maxScore={maxQualitiesScore}
              color="text-purple-600"
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span>Résultats détaillés dans le certificat</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={onStartNewAssessment}
                disabled={!onStartNewAssessment}
              >
                <Edit className="w-4 h-4 mr-2" />
                Reprendre
              </Button>
              <Button 
                onClick={() => downloadCertificatePDF(assessment)}
                size="sm"
                disabled={isGenerating}
              >
                <Download className="w-4 h-4 mr-2" />
                <span>{isGenerating ? "Génération..." : "Télécharger PDF"}</span>
              </Button>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(assessment)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Zone cachée pour capturer le HTML du certificat (hors du viewport) */}
      {certHtml && (
        <div 
          ref={hiddenCertRef}
          style={{
            position: 'fixed',
            left: '-200vw',
            top: 0,
            zIndex: -999,
            pointerEvents: 'none',
            background: '#fff'
          }}
          // On peut donner une classe Tailwind supplémentaire si besoin
        >
          <div dangerouslySetInnerHTML={{ __html: certHtml }} />
        </div>
      )}
    </>
  );
};

export default AssessmentCard;
