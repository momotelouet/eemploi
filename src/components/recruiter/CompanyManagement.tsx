import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building, Save, Upload, MapPin, Globe, Users, Star, Award, TrendingUp, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const CompanyManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState({
    id: '',
    name: '',
    description: '',
    website: '',
    location: '',
    industry: '',
    size: '',
    logo_url: ''
  });
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    viewsThisMonth: 0
  });

  useEffect(() => {
    fetchCompanyData();
    fetchCompanyStats();
  }, [user]);

  const fetchCompanyData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setCompany(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'entreprise:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les informations de l\'entreprise',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyStats = async () => {
    if (!user) return;

    try {
      // Récupérer les statistiques des offres
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, status, views, created_at')
        .eq('posted_by', user.id);

      if (jobsError) throw jobsError;

      const totalJobs = jobsData?.length || 0;
      const activeJobs = jobsData?.filter(job => job.status === 'active').length || 0;
      const viewsThisMonth = jobsData?.reduce((sum, job) => sum + (job.views || 0), 0) || 0;

      // Récupérer les statistiques des candidatures
      const jobIds = jobsData?.map(job => job.id) || [];
      let totalApplications = 0;

      if (jobIds.length > 0) {
        const { data: applicationsData, error: appsError } = await supabase
          .from('applications')
          .select('id')
          .in('job_id', jobIds);

        if (appsError) throw appsError;
        totalApplications = applicationsData?.length || 0;
      }

      setStats({
        totalJobs,
        activeJobs,
        totalApplications,
        viewsThisMonth
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    if (!company.name.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le nom de l\'entreprise est obligatoire',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const companyData = {
        name: company.name.trim(),
        description: company.description?.trim() || '',
        website: company.website?.trim() || '',
        location: company.location?.trim() || '',
        industry: company.industry || '',
        size: company.size || '',
        logo_url: company.logo_url?.trim() || ''
      };

      let result;
      if (company.id) {
        result = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', company.id)
          .select()
          .single();
      } else {
        result = await supabase
          .from('companies')
          .insert(companyData)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (result.data) {
        setCompany(result.data);
        toast({
          title: 'Entreprise sauvegardée',
          description: 'Les informations de votre entreprise ont été mises à jour avec succès',
        });
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  // Nouvelle fonction pour upload le logo
  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setSaving(true);
    try {
      // Correction du chemin d'upload : pas de sous-dossier redondant
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError, data: uploadData } = await supabase.storage.from('company-logos').upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (uploadError) {
        toast({ title: 'Erreur', description: `Erreur lors de l'upload du logo : ${uploadError.message}`, variant: 'destructive' });
        return;
      }
      // Vérification d'accessibilité du logo après upload
      const publicUrl = `${supabase.storageUrl}/object/public/company-logos/${fileName}`;
      // Teste l'accessibilité du logo
      try {
        const res = await fetch(publicUrl, { method: 'HEAD' });
        if (!res.ok) {
          toast({ title: 'Erreur', description: `Le logo a été uploadé mais n'est pas accessible publiquement (code ${res.status}). Vérifiez les règles du bucket Supabase.`, variant: 'destructive' });
          return;
        }
      } catch (err) {
        toast({ title: 'Erreur', description: `Le logo a été uploadé mais n'est pas accessible (erreur réseau).`, variant: 'destructive' });
        return;
      }
      setCompany({ ...company, logo_url: publicUrl });
      toast({ title: 'Logo importé', description: 'Votre logo a été importé avec succès.' });
    } catch (error) {
      toast({ title: 'Erreur', description: 'Erreur lors de l\'upload du logo', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = () => {
    toast({
      title: 'Fonctionnalité à venir',
      description: 'L\'upload de logo sera bientôt disponible',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-eemploi-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Chargement des informations de l'entreprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Gérer mon entreprise</h2>
        <p className="text-muted-foreground">
          Configurez le profil de votre entreprise et suivez vos performances
        </p>
      </div>

      {/* Statistiques de l'entreprise */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-eemploi-primary mb-1">{stats.totalJobs}</div>
            <div className="text-sm text-muted-foreground">Offres publiées</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-eemploi-primary mb-1">{stats.totalApplications}</div>
            <div className="text-sm text-muted-foreground">Candidatures reçues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-eemploi-primary mb-1">{stats.viewsThisMonth}</div>
            <div className="text-sm text-muted-foreground">Vues ce mois</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mx-auto mb-3">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-eemploi-primary mb-1">{stats.activeJobs}</div>
            <div className="text-sm text-muted-foreground">Offres actives</div>
          </CardContent>
        </Card>
      </div>

      {/* Informations de l'entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Informations de l'entreprise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo et nom */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Building className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <Button asChild variant="outline">
                  <label htmlFor="logo-upload" className="flex items-center cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Changer le logo
                    <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoFileChange} />
                  </label>
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom de l'entreprise *
                </label>
                <Input
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  placeholder="Ex: TechCorp Solutions"
                  required
                />
              </div>
            </div>

            {/* Informations de contact */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Site web
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={company.website}
                    onChange={(e) => setCompany({ ...company, website: e.target.value })}
                    placeholder="https://www.example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Localisation
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={company.location}
                    onChange={(e) => setCompany({ ...company, location: e.target.value })}
                    placeholder="Ex: Casablanca, Maroc"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description de l'entreprise
            </label>
            <Textarea
              value={company.description}
              onChange={(e) => setCompany({ ...company, description: e.target.value })}
              placeholder="Décrivez votre entreprise, sa mission, ses valeurs, son secteur d'activité..."
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Secteur et taille */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Secteur d'activité
              </label>
              <Select
                value={company.industry}
                onValueChange={(value) => setCompany({ ...company, industry: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un secteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technologie & IT</SelectItem>
                  <SelectItem value="finance">Finance & Banque</SelectItem>
                  <SelectItem value="healthcare">Santé & Médical</SelectItem>
                  <SelectItem value="education">Éducation & Formation</SelectItem>
                  <SelectItem value="retail">Commerce & Retail</SelectItem>
                  <SelectItem value="manufacturing">Industrie & Manufacturing</SelectItem>
                  <SelectItem value="consulting">Conseil & Services</SelectItem>
                  <SelectItem value="telecom">Télécommunications</SelectItem>
                  <SelectItem value="automotive">Automobile</SelectItem>
                  <SelectItem value="construction">BTP & Construction</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Taille de l'entreprise
              </label>
              <Select
                value={company.size}
                onValueChange={(value) => setCompany({ ...company, size: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la taille" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employés (Startup/PME)</SelectItem>
                  <SelectItem value="11-50">11-50 employés (Petite entreprise)</SelectItem>
                  <SelectItem value="51-200">51-200 employés (Moyenne entreprise)</SelectItem>
                  <SelectItem value="201-500">201-500 employés (Grande entreprise)</SelectItem>
                  <SelectItem value="500+">500+ employés (Très grande entreprise)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={() => fetchCompanyData()}>
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || !company.name.trim()}
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conseils et recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Conseils pour optimiser votre profil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">✅ Profil complet</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ajoutez une description détaillée</li>
                <li>• Incluez votre site web</li>
                <li>• Précisez votre secteur d'activité</li>
                <li>• Uploadez votre logo d'entreprise</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">🎯 Attirer les candidats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Publiez régulièrement des offres</li>
                <li>• Répondez rapidement aux candidatures</li>
                <li>• Mettez en avant votre culture d'entreprise</li>
                <li>• Soyez transparent sur les avantages</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyManagement;
