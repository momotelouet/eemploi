import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Star, Building, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock companies data
  const companies = [
    {
      id: "1",
      name: "TechCorp Maroc",
      logo: "",
      sector: "Technologie",
      location: "Casablanca",
      employees: "200-500",
      description: "Leader des solutions technologiques innovantes au Maroc, spécialisé dans le développement logiciel et la transformation digitale.",
      openJobs: 12,
      rating: 4.5,
      featured: true
    },
    {
      id: "2", 
      name: "Digital Agency",
      logo: "",
      sector: "Marketing Digital",
      location: "Rabat",
      employees: "50-100",
      description: "Agence créative spécialisée dans le marketing digital, le branding et la communication pour les entreprises marocaines.",
      openJobs: 8,
      rating: 4.3,
      featured: false
    },
    {
      id: "3",
      name: "Innovate Solutions",
      logo: "",
      sector: "Consulting IT",
      location: "Marrakech",
      employees: "100-200",
      description: "Cabinet de conseil en transformation digitale accompagnant les entreprises dans leur évolution technologique.",
      openJobs: 15,
      rating: 4.7,
      featured: true
    },
    {
      id: "4",
      name: "FinanceMax",
      logo: "",
      sector: "Services Financiers",
      location: "Casablanca",
      employees: "500+",
      description: "Institution financière de premier plan offrant des solutions bancaires et d'investissement innovantes.",
      openJobs: 25,
      rating: 4.2,
      featured: false
    },
    {
      id: "5",
      name: "HealthTech Morocco",
      logo: "",
      sector: "Santé & Tech",
      location: "Tanger",
      employees: "50-100",
      description: "Startup révolutionnaire combinant santé et technologie pour améliorer l'accès aux soins au Maroc.",
      openJobs: 6,
      rating: 4.6,
      featured: false
    },
    {
      id: "6",
      name: "EcoGreen Industries",
      logo: "",
      sector: "Énergies Renouvelables",
      location: "Agadir",
      employees: "100-200",
      description: "Pionnier des énergies renouvelables au Maroc, développant des solutions durables pour l'avenir.",
      openJobs: 10,
      rating: 4.4,
      featured: true
    }
  ];

  const sectors = [
    { name: "Technologie", count: 45 },
    { name: "Finance", count: 32 },
    { name: "Marketing", count: 28 },
    { name: "Santé", count: 19 },
    { name: "Éducation", count: 15 },
    { name: "Commerce", count: 38 }
  ];

  const featuredCompanies = companies.filter(company => company.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Découvrez les meilleures entreprises
            </h1>
            <p className="text-xl text-white/90">
              Explorez les entreprises qui recrutent et trouvez votre futur employeur
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-xl">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Nom d'entreprise, secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Sectors */}
      <section className="py-8 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {sectors.map((sector, index) => (
              <Button key={index} variant="outline" size="sm" className="h-9">
                {sector.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {sector.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <Star className="w-6 h-6 text-eemploi-accent mr-2" />
            <h2 className="text-2xl font-bold">Entreprises à la une</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredCompanies.map((company) => (
              <Card key={company.id} className="hover-lift border-l-4 border-l-eemploi-accent">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold">
                        {company.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.sector}</p>
                      </div>
                    </div>
                    <Badge className="bg-eemploi-accent text-white">
                      À la une
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{company.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{company.employees}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{company.rating}</span>
                      </div>
                      <span className="text-sm text-eemploi-primary font-medium">
                        {company.openJobs} postes ouverts
                      </span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/entreprises/${company.id}`}>Voir plus</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Companies */}
      <section className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Building className="w-6 h-6 text-eemploi-primary mr-2" />
              <h2 className="text-2xl font-bold">Toutes les entreprises</h2>
              <span className="ml-3 text-sm text-muted-foreground">
                {companies.length} entreprises
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold">
                        {company.name[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.sector}</p>
                      </div>
                    </div>
                    {company.featured && (
                      <Badge className="bg-eemploi-accent text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {company.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{company.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{company.employees}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{company.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-eemploi-primary font-medium">
                      {company.openJobs} postes ouverts
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/entreprises/${company.id}`}>Voir profil</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus d'entreprises
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-eemploi-primary to-eemploi-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">2,500+</div>
              <div className="text-white/90 text-sm">Entreprises partenaires</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15,000+</div>
              <div className="text-white/90 text-sm">Postes disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white/90 text-sm">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">12</div>
              <div className="text-white/90 text-sm">Villes du Maroc</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Companies;
