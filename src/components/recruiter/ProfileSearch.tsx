
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, MapPin, Briefcase, Star, Eye, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfileSearch = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: ''
  });
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchProfiles = async () => {
    setLoading(true);
    try {
      // Simuler une recherche de profils
      const mockProfiles = [
        {
          id: '1',
          first_name: 'Ahmed',
          last_name: 'Benali',
          professional_title: 'Développeur React Senior',
          location: 'Casablanca, Maroc',
          experience: '5 ans',
          skills: ['React', 'TypeScript', 'Node.js'],
          match_score: 95,
          avatar_url: null
        },
        {
          id: '2',
          first_name: 'Fatima',
          last_name: 'El Amrani',
          professional_title: 'UX/UI Designer',
          location: 'Rabat, Maroc',
          experience: '3 ans',
          skills: ['Figma', 'Adobe XD', 'Prototyping'],
          match_score: 88,
          avatar_url: null
        },
        {
          id: '3',
          first_name: 'Youssef',
          last_name: 'Tazi',
          professional_title: 'Chef de Projet Digital',
          location: 'Marrakech, Maroc',
          experience: '7 ans',
          skills: ['Gestion de projet', 'Scrum', 'Digital Marketing'],
          match_score: 82,
          avatar_url: null
        }
      ];
      setProfiles(mockProfiles);
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
                placeholder="Rechercher par compétences, titre de poste..."
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
                    <AvatarImage src={profile.avatar_url} />
                    <AvatarFallback className="bg-eemploi-primary text-white">
                      {profile.first_name?.[0]}{profile.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {profile.first_name} {profile.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {profile.professional_title}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      {profile.location}
                      <span className="mx-2">•</span>
                      <Briefcase className="w-3 h-3 mr-1" />
                      {profile.experience}
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{profile.match_score}% compatible</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {profile.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {profile.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{profile.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
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
    </div>
  );
};

export default ProfileSearch;
