
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Building, Save, Upload, MapPin, Globe, Users } from 'lucide-react';
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

  useEffect(() => {
    fetchCompanyData();
  }, [user]);

  const fetchCompanyData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Récupérer les entreprises de l'utilisateur
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .limit(1)
        .single();

      if (data) {
        setCompany(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'entreprise:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const companyData = {
        name: company.name,
        description: company.description,
        website: company.website,
        location: company.location,
        industry: company.industry,
        size: company.size,
        logo_url: company.logo_url
      };

      let result;
      if (company.id) {
        // Mettre à jour l'entreprise existante
        result = await supabase
          .from('companies')
          .update(companyData)
          .eq('id', company.id);
      } else {
        // Créer une nouvelle entreprise
        result = await supabase
          .from('companies')
          .insert(companyData)
          .select()
          .single();
        
        if (result.data) {
          setCompany({...company, id: result.data.id});
        }
      }

      if (result.error) throw result.error;

      toast({
        title: 'Entreprise sauvegardée',
        description: 'Les informations de votre entreprise ont été mises à jour avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = () => {
    toast({
      title: 'Fonctionnalité à venir',
      description: 'L\'upload de logo sera bientôt disponible.',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p>Chargement des informations de l'entreprise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Building className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <Button variant="outline" onClick={handleLogoUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Changer le logo
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
                />
              </div>
            </div>

            {/* Informations de base */}
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
              placeholder="Décrivez votre entreprise, sa mission, ses valeurs..."
              rows={4}
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
                  <SelectItem value="tech">Technologie</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="retail">Commerce</SelectItem>
                  <SelectItem value="manufacturing">Industrie</SelectItem>
                  <SelectItem value="consulting">Conseil</SelectItem>
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
                  <SelectItem value="1-10">1-10 employés</SelectItem>
                  <SelectItem value="11-50">11-50 employés</SelectItem>
                  <SelectItem value="51-200">51-200 employés</SelectItem>
                  <SelectItem value="201-500">201-500 employés</SelectItem>
                  <SelectItem value="500+">500+ employés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button variant="outline">
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saving || !company.name}
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques de l'entreprise */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-eemploi-primary mb-2">12</div>
            <div className="text-sm text-muted-foreground">Offres publiées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-eemploi-primary mb-2">89</div>
            <div className="text-sm text-muted-foreground">Candidatures reçues</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-eemploi-primary mb-2">4.8</div>
            <div className="text-sm text-muted-foreground">Note employeur</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyManagement;
