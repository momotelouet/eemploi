import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const JobForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    company_id: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // For now, we'll create a default company if none exists
      let companyId = formData.company_id;
      
      if (!companyId) {
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: 'Mon Entreprise',
            description: 'Description de mon entreprise'
          })
          .select()
          .single();

        if (companyError) throw companyError;
        companyId = company.id;
      }

      const { error } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          location: formData.location,
          job_type: formData.job_type,
          experience_level: formData.experience_level,
          salary_min: formData.salary_min ? parseInt(formData.salary_min) : null,
          salary_max: formData.salary_max ? parseInt(formData.salary_max) : null,
          company_id: companyId,
          posted_by: user.id,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: 'Offre d\'emploi créée',
        description: 'Votre offre d\'emploi a été publiée avec succès.',
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        requirements: '',
        location: '',
        job_type: 'full-time',
        experience_level: 'mid',
        salary_min: '',
        salary_max: '',
        company_id: ''
      });

    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création de l\'offre.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle offre d'emploi</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Titre du poste *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Développeur React Senior"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description du poste *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez le poste, les responsabilités..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Exigences et compétences
            </label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Compétences requises, diplômes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Localisation
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Ex: Casablanca, Maroc"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Type de contrat
              </label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => setFormData({ ...formData, job_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Temps plein</SelectItem>
                  <SelectItem value="part-time">Temps partiel</SelectItem>
                  <SelectItem value="contract">Contrat</SelectItem>
                  <SelectItem value="internship">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Niveau d'expérience
              </label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) => setFormData({ ...formData, experience_level: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Débutant</SelectItem>
                  <SelectItem value="mid">Intermédiaire</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Salaire minimum (MAD)
              </label>
              <Input
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                placeholder="Ex: 8000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salaire maximum (MAD)
              </label>
              <Input
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                placeholder="Ex: 12000"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
            disabled={loading}
          >
            {loading ? 'Création en cours...' : 'Publier l\'offre'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobForm;
