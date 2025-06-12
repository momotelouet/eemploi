
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Briefcase, Star, Eye, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

const ProfileSearch = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: ''
  });
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial candidate profiles
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'candidat')
        .limit(20);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des profils:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchProfiles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('user_type', 'candidat');

      // Apply search filters
      if (searchTerm) {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Rechercher des profils
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par nom, prénom..."
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casablanca">Casablanca</SelectItem>
                <SelectItem value="rabat">Rabat</SelectItem>
                <SelectItem value="marrakech">Marrakech</SelectItem>
                <SelectItem value="tanger">Tanger</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.experience} onValueChange={(value) => setFilters({...filters, experience: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Expérience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">0-2 ans</SelectItem>
                <SelectItem value="mid">3-5 ans</SelectItem>
                <SelectItem value="senior">5+ ans</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Compétences (ex: React, Python)"
              value={filters.skills}
              onChange={(e) => setFilters({...filters, skills: e.target.value})}
            />
          </div>
        </CardContent>
      </Card>

      {profiles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-eemploi-primary text-white">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Candidat
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      Non spécifié
                      <span className="mx-2">•</span>
                      <Briefcase className="w-3 h-3 mr-1" />
                      Profil {profile.user_type}
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Voir profil
                      </Button>
                      <Button size="sm" className="flex-1 bg-eemploi-primary hover:bg-eemploi-primary/90">
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
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium mb-2">Rechercher des talents</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez les filtres ci-dessus pour trouver les profils qui correspondent à vos besoins
            </p>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="text-center py-12">
            <p>Chargement des profils...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileSearch;
