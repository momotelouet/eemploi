
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Briefcase, Star, Eye, Send, Filter, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type CandidateProfile = Tables<'candidate_profiles'> & {
  profiles?: Tables<'profiles'>;
};

const ProfileSearch = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: ''
  });
  const [profiles, setProfiles] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalProfiles, setTotalProfiles] = useState(0);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('candidate_profiles')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `, { count: 'exact' })
        .limit(20);

      if (error) throw error;
      
      setProfiles(data || []);
      setTotalProfiles(count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les profils candidats',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const searchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('candidate_profiles')
        .select(`
          *,
          profiles (
            first_name,
            last_name
          )
        `, { count: 'exact' });

      // Apply filters
      if (filters.location) {
        query = query.ilike('city', `%${filters.location}%`);
      }

      if (filters.experience) {
        const expMap = {
          'junior': [0, 2],
          'mid': [3, 5],
          'senior': [6, 50]
        };
        const [min, max] = expMap[filters.experience as keyof typeof expMap] || [0, 50];
        query = query.gte('experience_years', min).lte('experience_years', max);
      }

      if (filters.skills) {
        query = query.contains('skills', [filters.skills]);
      }

      const { data, error, count } = await query.limit(20);

      if (error) throw error;
      
      setProfiles(data || []);
      setTotalProfiles(count || 0);
      
      toast({
        title: 'Recherche effectuée',
        description: `${count || 0} profil(s) trouvé(s)`
      });
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la recherche de profils',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      experience: '',
      skills: ''
    });
    loadProfiles();
  };

  const contactCandidate = (profileId: string) => {
    toast({
      title: 'Fonctionnalité à venir',
      description: 'La messagerie candidat sera bientôt disponible'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rechercher des candidats</h2>
          <p className="text-muted-foreground">
            Trouvez les talents qui correspondent à vos besoins
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-eemploi-primary">{totalProfiles}</div>
          <div className="text-sm text-muted-foreground">candidats disponibles</div>
        </div>
      </div>

      {/* Formulaire de recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Critères de recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par compétences, mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={searchProfiles}
              disabled={loading}
              className="bg-eemploi-primary hover:bg-eemploi-primary/90"
            >
              {loading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les villes</SelectItem>
                <SelectItem value="Casablanca">Casablanca</SelectItem>
                <SelectItem value="Rabat">Rabat</SelectItem>
                <SelectItem value="Marrakech">Marrakech</SelectItem>
                <SelectItem value="Tanger">Tanger</SelectItem>
                <SelectItem value="Fès">Fès</SelectItem>
                <SelectItem value="Agadir">Agadir</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.experience} onValueChange={(value) => setFilters({...filters, experience: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Expérience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous niveaux</SelectItem>
                <SelectItem value="junior">0-2 ans (Junior)</SelectItem>
                <SelectItem value="mid">3-5 ans (Confirmé)</SelectItem>
                <SelectItem value="senior">6+ ans (Senior)</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Compétence spécifique"
              value={filters.skills}
              onChange={(e) => setFilters({...filters, skills: e.target.value})}
            />

            <Button variant="outline" onClick={resetFilters}>
              <Filter className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Résultats */}
      {profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile.profile_picture_url || ''} />
                    <AvatarFallback className="bg-eemploi-primary text-white">
                      {profile.profiles?.first_name?.[0]}{profile.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {profile.profiles?.first_name} {profile.profiles?.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {profile.professional_summary || 'Candidat'}
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.city || 'Non spécifié'}
                      <span className="mx-2">•</span>
                      <Briefcase className="w-3 h-3 mr-1" />
                      {profile.experience_years ? `${profile.experience_years} ans` : 'Débutant'}
                    </div>

                    {/* Compétences */}
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1">
                          {profile.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{profile.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Voir profil
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 bg-eemploi-primary hover:bg-eemploi-primary/90"
                        onClick={() => contactCandidate(profile.id)}
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Contacter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {profiles.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun candidat trouvé</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Essayez de modifier vos critères de recherche pour trouver plus de candidats
            </p>
            <Button onClick={resetFilters} variant="outline">
              Voir tous les candidats
            </Button>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-eemploi-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Recherche en cours...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSearch;
