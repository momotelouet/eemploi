import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';
import { useQueryClient } from '@tanstack/react-query';
import { MOROCCO_CITIES } from '@/components/ui/cities';

interface CreateJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobCreated?: () => void;
}

const PUBLICATION_PRICE = 249;
const UNPAID_THRESHOLD = 1000;

const CreateJobModal = ({ open, onOpenChange, onJobCreated }: CreateJobModalProps) => {
  const { user } = useAuth();
  const { profile } = useRecruiterProfile(user?.id ?? null);
  const queryClient = useQueryClient();
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
    expires_at: '', // Correction ici
  });

  const isPublicationBlocked =
    profile?.status === 'suspended' || (profile?.unpaid_balance ?? 0) >= UNPAID_THRESHOLD;

  const blockReason =
    profile?.status === 'suspended'
      ? 'Votre compte est suspendu. Veuillez contacter le support.'
      : `Votre solde impayé de ${profile?.unpaid_balance} DH a atteint le seuil de ${UNPAID_THRESHOLD} DH. Veuillez le régler pour continuer.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !user || isPublicationBlocked) return;

    const isConfirmed = window.confirm(
      `Cette offre sera facturée ${PUBLICATION_PRICE} DH. Elle sera visible immédiatement, et vous pourrez payer plus tard.`
    );
    if (!isConfirmed) {
      return;
    }

    setLoading(true);
    try {
      // Chercher une entreprise existante liée au recruteur
      // @ts-ignore Supabase typing workaround
      const { data: existingCompany, error: findError } = await supabase
        .from('companies')
        .select('id')
        .eq('posted_by', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findError) throw findError;

      let companyId = existingCompany?.id;

      if (!companyId) {
        // Créer une nouvelle entreprise liée au recruteur
        const { data: company, error: companyError } = await supabase
          .from('companies')
          .insert({
            name: 'Mon Entreprise',
            description: 'Description de mon entreprise',
            posted_by: user.id,
          })
          .select()
          .single();

        if (companyError) throw companyError;
        companyId = company.id;

        toast({
          title: 'Entreprise créée',
          description: 'Une entreprise par défaut a été créée pour vous. Vous pouvez la modifier plus tard.',
        });
      }

      // Insertion de l'offre d'emploi
      const { data: job, error } = await supabase
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
          expires_at: formData.expires_at || null,
          company_id: companyId,
          posted_by: user.id,
          status: 'active', // conforme au schéma SQL
          price: PUBLICATION_PRICE,
          paid: false,
        })
        .select()
        .single();

      if (error) throw error;
      if (!job) throw new Error('La création de l\'offre a échoué.');

      // Notification candidats correspondant à l'offre
      try {
        const { data: candidates, error: candidatesError } = await supabase
          .from('candidate_profiles')
          .select('user_id, skills, location, experience_years');

        if (candidatesError) throw candidatesError;

        const validCandidates = Array.isArray(candidates)
          ? candidates.filter(
              (c: any) =>
                c &&
                typeof c === 'object' &&
                'user_id' in c &&
                Array.isArray(c.skills) &&
                typeof c.location === 'string'
            )
          : [];

        const jobSkills = (formData.requirements || '')
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase()
          .split(/[ ,;]+/)
          .filter(Boolean);

        const jobLocation = (formData.location || '')
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .toLowerCase();

        const matchedCandidates = validCandidates.filter((c: any) => {
          const candidateSkills = c.skills
            .map((s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase());

          const hasSkill = jobSkills.length > 0 && candidateSkills.some((s: string) => jobSkills.includes(s));
          const hasLocation =
            jobLocation &&
            c.location &&
            c.location.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase() === jobLocation;

          return hasSkill || hasLocation;
        });

        if (matchedCandidates.length > 0) {
          for (const c of matchedCandidates) {
            const candidateSkills = (c.skills || []).map((s: string) =>
              s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
            );
            const commonSkills = jobSkills.filter((s) => candidateSkills.includes(s));
            const msgParts = [];
            if (commonSkills.length > 0) msgParts.push(`compétences : ${commonSkills.join(', ')}`);
            if (
              jobLocation &&
              c.location &&
              c.location.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase() === jobLocation
            )
              msgParts.push(`localisation : ${formData.location}`);

            const message = `L’offre « ${formData.title} » correspond à votre profil (${msgParts.join(
              ' et '
            )}). Découvrez-la et postulez si elle vous intéresse !`;

            await supabase.from('notifications').insert({
              user_id: c.user_id,
              title: 'Nouvelle offre qui correspond à votre profil !',
              message,
              type: 'job_match',
              read: false,
            });
          }
        }
      } catch (notifError) {
        console.error('Erreur lors de la notification des candidats :', notifError);
      }

      // Mise à jour solde impayé via RPC
      const { error: rpcError } = await supabase.rpc('handle_new_job_posting', {
        recruiter_user_id: user.id,
        job_price: PUBLICATION_PRICE,
      });

      if (rpcError) {
        console.error('Failed to update unpaid balance:', rpcError);
        toast({
          title: 'Offre créée mais avec un souci',
          description:
            "L'offre a été publiée, mais la mise à jour de votre solde a échoué. Veuillez contacter le support.",
          variant: 'destructive',
        });
      } else {
        toast({
          title: "Offre d'emploi créée",
          description: `${PUBLICATION_PRICE} DH ont été ajoutés à votre solde.`,
        });
      }

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
        expires_at: '', // Correction ici
      });

      if (onJobCreated) onJobCreated();

      // Refresh profile cache
      await queryClient.invalidateQueries({ queryKey: ['recruiter-profile', user.id] });

      toast({ description: 'Offre publiée avec succès !', variant: 'success' });

      onOpenChange(false);
    } catch (err: any) {
      toast({ description: err.message || 'Erreur lors de la création de l\'offre', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle offre d'emploi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre du poste *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Développeur React Senior"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description du poste *</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez le poste, les responsabilités..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Exigences et compétences</label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="Compétences requises, diplômes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Localisation</label>
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ex: Casablanca, Maroc" />
                </SelectTrigger>
                <SelectContent>
                  {MOROCCO_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type de contrat</label>
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

          <div>
            <label className="block text-sm font-medium mb-2">Niveau d'expérience</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Salaire minimum (MAD)</label>
              <Input
                type="number"
                value={formData.salary_min}
                onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                placeholder="Ex: 8000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salaire maximum (MAD)</label>
              <Input
                type="number"
                value={formData.salary_max}
                onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                placeholder="Ex: 12000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date d'expiration (optionnelle)</label>
            <Input
              type="date"
              value={formData.expires_at}
              onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
              disabled={loading || isPublicationBlocked}
            >
              {loading ? 'Création en cours...' : "Publier l'offre"}
            </Button>
          </div>
          {isPublicationBlocked && (
            <p className="text-sm text-destructive mt-2 text-center">{blockReason}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
