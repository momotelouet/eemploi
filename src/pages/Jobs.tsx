
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Briefcase, Clock, Building } from "lucide-react";
import { useState } from "react";

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // Mock data for jobs
  const jobs = [
    {
      id: "1",
      title: "Développeur Full Stack React/Node.js",
      company: "TechCorp Maroc",
      location: "Casablanca",
      type: "CDI",
      salary: "25,000 - 35,000 MAD",
      description: "Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique et travailler sur des projets innovants utilisant React, Node.js et MongoDB.",
      postedAt: "Il y a 2 jours"
    },
    {
      id: "2",
      title: "Responsable Marketing Digital",
      company: "Digital Agency",
      location: "Rabat",
      type: "CDI",
      salary: "20,000 - 30,000 MAD",
      description: "Poste stratégique pour développer notre présence digitale, gérer nos campagnes SEA/SEO et optimiser notre ROI marketing.",
      postedAt: "Il y a 1 jour"
    },
    {
      id: "3",
      title: "Chef de Projet IT",
      company: "Innovate Solutions",
      location: "Marrakech",
      type: "CDI",
      salary: "30,000 - 40,000 MAD",
      description: "Leadership d'équipes techniques sur des projets complexes dans un environnement agile. Expertise en gestion de projet Scrum requise.",
      postedAt: "Il y a 3 heures"
    },
    {
      id: "4",
      title: "Designer UX/UI Senior",
      company: "Creative Studio",
      location: "Casablanca",
      type: "CDI",
      salary: "22,000 - 32,000 MAD",
      description: "Création d'expériences utilisateur exceptionnelles pour nos clients. Maîtrise de Figma, Adobe Creative Suite et design thinking.",
      postedAt: "Il y a 1 semaine"
    },
    {
      id: "5",
      title: "Ingénieur DevOps",
      company: "CloudTech",
      location: "Tanger",
      type: "CDI",
      salary: "35,000 - 45,000 MAD",
      description: "Automatisation des déploiements et gestion de l'infrastructure cloud. Expertise AWS, Docker, Kubernetes souhaitée.",
      postedAt: "Il y a 4 jours"
    },
    {
      id: "6",
      title: "Consultant Business Intelligence",
      company: "Data Analytics Pro",
      location: "Fès",
      type: "CDD",
      salary: "28,000 - 38,000 MAD",
      description: "Analyse de données complexes et création de tableaux de bord pour l'aide à la décision. Power BI, Tableau, SQL requis.",
      postedAt: "Il y a 2 jours"
    }
  ];

  const quickFilters = [
    { label: "Développement", count: 245 },
    { label: "Marketing", count: 132 },
    { label: "Commercial", count: 189 },
    { label: "Finance", count: 98 },
    { label: "RH", count: 76 },
    { label: "Design", count: 54 }
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
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    <SelectItem value="casablanca">Casablanca</SelectItem>
                    <SelectItem value="rabat">Rabat</SelectItem>
                    <SelectItem value="marrakech">Marrakech</SelectItem>
                    <SelectItem value="fes">Fès</SelectItem>
                    <SelectItem value="tanger">Tanger</SelectItem>
                    <SelectItem value="agadir">Agadir</SelectItem>
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
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="cdi">CDI</SelectItem>
                    <SelectItem value="cdd">CDD</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="temps-partiel">Temps partiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
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
              <Button key={index} variant="outline" size="sm" className="h-9">
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
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir une fourchette" />
                        </SelectTrigger>
                        <SelectContent>
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
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">Junior (0-2 ans)</SelectItem>
                          <SelectItem value="intermediate">Intermédiaire (2-5 ans)</SelectItem>
                          <SelectItem value="senior">Senior (5+ ans)</SelectItem>
                          <SelectItem value="lead">Lead/Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Secteur d'activité</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Tous les secteurs" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Technologie</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="healthcare">Santé</SelectItem>
                          <SelectItem value="education">Éducation</SelectItem>
                          <SelectItem value="retail">Commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-3 block">Date de publication</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Toutes les dates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Aujourd'hui</SelectItem>
                          <SelectItem value="week">Cette semaine</SelectItem>
                          <SelectItem value="month">Ce mois</SelectItem>
                          <SelectItem value="all">Toutes les dates</SelectItem>
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
                    {jobs.length} offres trouvées
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

              <div className="space-y-6">
                {jobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">Précédent</Button>
                  <Button size="sm" className="bg-eemploi-primary">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Suivant</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;
