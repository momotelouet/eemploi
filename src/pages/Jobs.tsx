import React, { useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Building, 
  Clock, 
  Search, 
  Filter,
  Briefcase,
  TrendingUp,
  Star,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import JobCard from '@/components/JobCard';

const Jobs = () => {
  const { jobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [contractFilter, setContractFilter] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-eemploi-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || locationFilter === 'all' || job.location?.includes(locationFilter);
    const matchesContract = !contractFilter || contractFilter === 'all' || job.job_type === contractFilter;
    
    return matchesSearch && matchesLocation && matchesContract;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header Section */}
      <section className="gradient-bg text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">
              Trouvez votre emploi <span className="text-eemploi-accent">idéal</span>
            </h1>
            <p className="text-xl text-white/90">
              {jobs.length} opportunités vous attendent au Maroc
            </p>
          </div>
        </div>
        
        {/* Animated elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-10 w-20 h-20 bg-eemploi-accent/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 animate-fade-in">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par poste ou entreprise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 hover:border-eemploi-primary focus:border-eemploi-primary transition-colors duration-300"
              />
            </div>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-[200px] hover:border-eemploi-primary transition-colors duration-300">
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les villes</SelectItem>
                {[...new Set(jobs.map(j => j.location).filter(Boolean))].map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger className="w-full md:w-[200px] hover:border-eemploi-primary transition-colors duration-300">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les contrats</SelectItem>
                <SelectItem value="full-time">Temps plein</SelectItem>
                <SelectItem value="part-time">Temps partiel</SelectItem>
                <SelectItem value="contract">Contrat</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="default" className="hover:scale-105 transition-all duration-300">
              <Filter className="w-4 h-4 mr-2" />
              Filtrer
            </Button>
          </div>
        </div>
      </section>

      {/* Jobs Listing */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold">
              {filteredJobs.length} offres trouvées
            </h2>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <TrendingUp className="w-3 h-3 mr-1" />
                Nouvelles offres
              </Badge>
              <Badge variant="outline" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <Star className="w-3 h-3 mr-1" />
                Recommandées
              </Badge>
            </div>
          </div>
          
          <div>
            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <h3 className="text-xl font-semibold mb-2">Aucune offre trouvée</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button 
                  variant="default"
                  onClick={() => {
                    setSearchTerm('');
                    setLocationFilter('');
                    setContractFilter('');
                  }}
                  className="hover:scale-105 transition-all duration-300"
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
