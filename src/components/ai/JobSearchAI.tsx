
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Bot, Loader2, MapPin, Briefcase } from 'lucide-react';
import { useAI } from '@/hooks/useAI';

interface JobRecommendation {
  title: string;
  company: string;
  location: string;
  skills: string[];
  reason: string;
}

const JobSearchAI = () => {
  const [userProfile, setUserProfile] = useState('');
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const { askAI, loading } = useAI();

  const getJobRecommendations = async () => {
    if (!userProfile.trim()) return;

    try {
      const prompt = `Basé sur ce profil candidat, suggère 3-4 types d'emplois pertinents avec des entreprises fictives mais réalistes :

Profil : ${userProfile}

Format ta réponse comme ceci pour chaque recommandation :
TITRE: [titre du poste]
ENTREPRISE: [nom d'entreprise]
LIEU: [ville, pays]
COMPÉTENCES: [compétences requises séparées par des virgules]
RAISON: [pourquoi ce poste correspond au profil]
---`;

      const response = await askAI(prompt, userProfile, 'job-matching');
      
      // Parse the AI response into job recommendations
      const jobBlocks = response.split('---').filter(block => block.trim());
      const parsedJobs: JobRecommendation[] = jobBlocks.map(block => {
        const lines = block.trim().split('\n');
        const job: any = {};
        
        lines.forEach(line => {
          if (line.startsWith('TITRE:')) job.title = line.replace('TITRE:', '').trim();
          if (line.startsWith('ENTREPRISE:')) job.company = line.replace('ENTREPRISE:', '').trim();
          if (line.startsWith('LIEU:')) job.location = line.replace('LIEU:', '').trim();
          if (line.startsWith('COMPÉTENCES:')) job.skills = line.replace('COMPÉTENCES:', '').split(',').map(s => s.trim());
          if (line.startsWith('RAISON:')) job.reason = line.replace('RAISON:', '').trim();
        });
        
        return job as JobRecommendation;
      }).filter(job => job.title && job.company);

      setRecommendations(parsedJobs);
    } catch (error) {
      console.error('Erreur recommandations emplois:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5 text-eemploi-primary" />
          Recommandations d'emplois IA
          <Badge variant="secondary">AI</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Décrivez votre profil professionnel
          </label>
          <Input
            placeholder="Ex: Développeur JavaScript avec 3 ans d'expérience en React..."
            value={userProfile}
            onChange={(e) => setUserProfile(e.target.value)}
          />
        </div>

        <Button
          onClick={getJobRecommendations}
          disabled={!userProfile.trim() || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Recherche en cours...
            </>
          ) : (
            <>
              <Bot className="w-4 h-4 mr-2" />
              Obtenir des recommandations IA
            </>
          )}
        </Button>

        {recommendations.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-lg">Emplois recommandés pour vous</h4>
            {recommendations.map((job, index) => (
              <Card key={index} className="border-green-200 bg-green-50/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-semibold text-green-900">{job.title}</h5>
                        <div className="flex items-center gap-4 text-sm text-green-700">
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {job.skills && (
                      <div className="flex flex-wrap gap-1">
                        {job.skills.slice(0, 4).map((skill, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-green-800 bg-green-100 p-2 rounded">
                      <strong>Pourquoi ce poste :</strong> {job.reason}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobSearchAI;
