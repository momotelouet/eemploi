
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Search, MapPin, Briefcase, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    // Navigate to jobs page with search parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (location && location !== 'all') params.append('location', location);
    if (category && category !== 'all') params.append('category', category);
    
    navigate(`/emplois?${params.toString()}`);
  };

  const popularSearches = [
    'Développeur Web',
    'Marketing Digital',
    'Comptable',
    'Ingénieur',
    'Chef de projet',
    'Commercial'
  ];

  const topCities = [
    'Casablanca',
    'Rabat',
    'Marrakech',
    'Fès',
    'Tanger',
    'Agadir'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Card */}
      <Card className="glass-card hover-lift animate-fade-in shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2 gradient-text">
              Recherchez votre emploi idéal
            </h3>
            <p className="text-muted-foreground">
              Plus de 15,000 offres d'emploi vous attendent
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-eemploi-primary transition-colors duration-300" />
              <Input
                placeholder="Poste, entreprise, mots-clés..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 hover:border-eemploi-primary focus:border-eemploi-primary transition-all duration-300 hover:scale-105"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            <div className="relative group">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-eemploi-primary transition-colors duration-300" />
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="pl-10 h-12 hover:border-eemploi-primary transition-all duration-300 hover:scale-105">
                  <SelectValue placeholder="Localisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {topCities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative group">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-eemploi-primary transition-colors duration-300" />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="pl-10 h-12 hover:border-eemploi-primary transition-all duration-300 hover:scale-105">
                  <SelectValue placeholder="Secteur d'activité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les secteurs</SelectItem>
                  <SelectItem value="informatique">Informatique & Tech</SelectItem>
                  <SelectItem value="finance">Finance & Banque</SelectItem>
                  <SelectItem value="marketing">Marketing & Communication</SelectItem>
                  <SelectItem value="ingenierie">Ingénierie</SelectItem>
                  <SelectItem value="sante">Santé</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="commerce">Commerce & Vente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={handleSearch}
            className="w-full h-12 text-lg bg-eemploi-primary hover:bg-eemploi-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Search className="w-5 h-5 mr-2" />
            Rechercher {searchTerm && `"${searchTerm}"`}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Suggestions */}
      <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Popular Searches */}
          <div className="text-center">
            <h4 className="font-semibold mb-3 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2 text-eemploi-primary" />
              Recherches populaires
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchTerm(search);
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1 text-sm bg-eemploi-primary/10 text-eemploi-primary rounded-full hover:bg-eemploi-primary hover:text-white transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Top Cities */}
          <div className="text-center">
            <h4 className="font-semibold mb-3 flex items-center justify-center">
              <MapPin className="w-4 h-4 mr-2 text-eemploi-secondary" />
              Villes principales
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {topCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLocation(city);
                    setTimeout(handleSearch, 100);
                  }}
                  className="px-3 py-1 text-sm bg-eemploi-secondary/10 text-eemploi-secondary rounded-full hover:bg-eemploi-secondary hover:text-white transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
