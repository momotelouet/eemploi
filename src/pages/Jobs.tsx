
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Briefcase, Clock, Building } from "lucide-react";
import { useState, useMemo } from "react";
import { useJobs } from "@/hooks/useJobs";

const Jobs = () => {
  const { jobs, loading } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedSalary, setSelectedSalary] = useState("");
  const [selectedExperience, setSelectedExperience] = useState("");
  const [selectedSector, setSelectedSector] = useState("");

  // Filter jobs based on search criteria
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.companies?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLocation = !selectedLocation || 
        (job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase()));
      
      const matchesType = !selectedType || job.job_type === selectedType;
      
      const matchesSalary = !selectedSalary || (() => {
        if (!job.salary_min) return false;
        switch (selectedSalary) {
          case '0-10000': return job.salary_min >= 0 && job.salary_min <= 10000;
          case '10000-20000': return job.salary_min >= 10000 && job.salary_min <= 20000;
          case '20000-30000': return job.salary_min >= 20000 && job.salary_min <= 30000;
          case '30000-50000': return job.salary_min >= 30000 && job.salary_min <= 50000;
          case '50000+': return job.salary_min >= 50000;
          default: return true;
        }
      })();
      
      const matchesExperience = !selectedExperience || job.experience_level === selectedExperience;
      
      const matchesSector = !selectedSector || 
        (job.companies?.industry && job.companies.industry === selectedSector);

      return matchesSearch && matchesLocation && matchesType && 
             matchesSalary && matchesExperience && matchesSector;
    });
  }, [jobs, searchTerm, selectedLocation, selectedType, selectedSalary, selectedExperience, selectedSector]);

  // Get unique locations from jobs for filter
  const locations = useMemo(() => {
    const locationSet = new Set(jobs.map(job => job.location).filter(Boolean));
    return Array.from(locationSet);
  }, [jobs]);

  const quickFilters = [
    { label: "Développement", count: jobs.filter(job => 
      job.title.toLowerCase().includes('développeur') || 
      job.title.toLowerCase().includes('dev') ||
      job.title.toLowerCase().includes('programmeur')
    ).length },
    { label: "Marketing", count: jobs.filter(job => 
      job.title.toLowerCase().includes('marketing')
    ).length },
    { label: "Commercial", count: jobs.filter(job => 
      job.title.toLowerCase().includes('commercial') ||
      job.title.toLowerCase().includes('vente')
    ).length },
    { label: "Finance", count: jobs.filter(job => 
      job.title.toLowerCase().includes('finance') ||
      job.title.toLowerCase().includes('comptable')
    ).length },
    { label: "RH", count: jobs.filter(job => 
      job.title.toLowerCase().includes('rh') ||
      job.title.toLowerCase().includes('ressources humaines')
    ).length },
    { label: "Design", count: jobs.filter(job => 
      job.title.toLowerCase().includes('design') ||
      job.title.toLowerCase().includes('ux') ||
      job.title.toLowerCase().includes('ui')
    ).length }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Search Header */}
      <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Trouvez l'emploi parfait
          </h1>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Poste, entreprise, compétences..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
              </div>

              <div>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Toutes les villes" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Toutes les villes</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location || ''}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Type de contrat" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    <SelectItem value="full-time">Temps plein</SelectItem>
                    <SelectItem value="part-time">Temps partiel</SelectItem>
                    <SelectItem value="contract">Contrat</SelectItem>
                    <SelectItem value="internship">Stage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                <Search className="w-4 h-4 mr-2" />
                {filteredJobs.length} offres trouvées
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="py-8 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {quickFilters.map((filter, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm" 
                className="h-9"
                onClick={() => setSearchTerm(filter.label)}
              >
                {filter.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {filter.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="flex items-center mb-6">
                    <Filter className="w-5 h-5 mr-2 text-eemploi-primary" />
                    <h3 className="font-semibold">Filtres</h3>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-3 block">Salaire mensuel</label>
                      <Select value={selectedSalary} onValueChange={setSelectedSalary}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une fourchette" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous les salaires</SelectItem>
                          <SelectItem value="0-10000">0 - 10,000 MAD</SelectItem>
                          <SelectItem value="10000-20000">10,000 - 20,000 MAD</SelectItem>
                          <SelectItem value="20000-30000">20,000 - 30,000 MAD</SelectItem>
                          <SelectItem value="30000-50000">30,000 - 50,000 MAD</SelectItem>
                          <SelectItem value="50000+">50,000+ MAD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Niveau d'expérience</label>
                      <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous les niveaux</SelectItem>
                          <SelectItem value="entry">Débutant</SelectItem>
                          <SelectItem value="mid">Intermédiaire</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Secteur d'activité</label>
                      <Select value={selectedSector} onValueChange={setSelectedSector}>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les secteurs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Tous les secteurs</SelectItem>
                          <SelectItem value="tech">Technologie</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Santé</SelectItem>
                          <SelectItem value="education">Éducation</SelectItem>
                          <SelectItem value="retail">Commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Jobs List */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-eemploi-primary" />
                  <h2 className="text-xl font-semibold">
                    {loading ? 'Chargement...' : `${filteredJobs.length} offres trouvées`}
                  </h2>
                </div>
                
                <Select defaultValue="recent">
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Plus récentes</SelectItem>
                    <SelectItem value="salary-high">Salaire décroissant</SelectItem>
                    <SelectItem value="salary-low">Salaire croissant</SelectItem>
                    <SelectItem value="alphabetical">Alphabétique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p>Chargement des offres d'emploi...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>

                  {filteredJobs.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Aucune offre d'emploi ne correspond à vos critères de recherche.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {filteredJobs.length > 0 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Précédent</Button>
                    <Button size="sm" className="bg-eemploi-primary">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                    <Button variant="outline" size="sm">Suivant</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
