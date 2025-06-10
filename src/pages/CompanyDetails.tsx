
import { useParams } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Users, 
  Calendar,
  Star,
  Globe,
  Phone,
  Mail,
  Building,
  TrendingUp,
  Award,
  Heart
} from "lucide-react";

const CompanyDetails = () => {
  const { id } = useParams();

  // Mock company data
  const company = {
    id: "1",
    name: "TechCorp Maroc",
    logo: "",
    sector: "Technologie",
    location: "Casablanca, Maroc",
    employees: "200-500 employés",
    founded: "2015",
    website: "techcorp.ma",
    phone: "+212 522 123 456",
    email: "contact@techcorp.ma",
    rating: 4.5,
    reviews: 128,
    description: `TechCorp Maroc est une entreprise technologique leader au Maroc, spécialisée dans le développement de solutions digitales innovantes pour les entreprises.

Depuis notre création en 2015, nous avons accompagné plus de 300 entreprises dans leur transformation digitale, en proposant des solutions sur mesure allant du développement web et mobile à l'intelligence artificielle.

Notre équipe de 300 experts passionnés travaille dans un environnement collaboratif et stimulant, où l'innovation et l'excellence technique sont au cœur de nos préoccupations.`,
    
    values: [
      "Innovation constante",
      "Excellence technique", 
      "Travail d'équipe",
      "Développement personnel",
      "Impact social"
    ],
    
    benefits: [
      "Assurance santé complète",
      "Télétravail hybride",
      "Formation continue",
      "Tickets restaurant",
      "Primes de performance",
      "Congés flexibles",
      "Environnement moderne",
      "Événements team building"
    ],
    
    stats: {
      openJobs: 12,
      avgSalary: "28,000 MAD",
      responseTime: "3 jours",
      hiringRate: "85%"
    }
  };

  // Mock jobs for this company
  const companyJobs = [
    {
      id: "1",
      title: "Développeur Full Stack React/Node.js",
      company: company.name,
      location: "Casablanca",
      type: "CDI",
      salary: "25,000 - 35,000 MAD",
      description: "Rejoignez notre équipe pour développer des applications web innovantes.",
      postedAt: "Il y a 2 jours"
    },
    {
      id: "2",
      title: "UX/UI Designer Senior",
      company: company.name,
      location: "Casablanca",
      type: "CDI", 
      salary: "22,000 - 32,000 MAD",
      description: "Créez des expériences utilisateur exceptionnelles pour nos clients.",
      postedAt: "Il y a 1 semaine"
    },
    {
      id: "3",
      title: "Chef de Projet Digital",
      company: company.name,
      location: "Casablanca",
      type: "CDI",
      salary: "30,000 - 40,000 MAD", 
      description: "Pilotez des projets innovants dans un environnement agile.",
      postedAt: "Il y a 3 jours"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Company Header */}
      <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              
              {/* Company Logo */}
              <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-eemploi-primary">{company.name[0]}</span>
              </div>

              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                  <Badge className="bg-white/20 text-white border-white/30">
                    Certifiée
                  </Badge>
                </div>
                
                <p className="text-xl text-white/90 mb-4">{company.sector}</p>
                
                <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{company.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{company.employees}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Fondée en {company.founded}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>{company.rating} ({company.reviews} avis)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3">
                <Button size="lg" className="bg-white text-eemploi-primary hover:bg-white/90">
                  <Heart className="w-4 h-4 mr-2" />
                  Suivre l'entreprise
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  Voir les {company.stats.openJobs} postes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-8 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-eemploi-primary mb-1">
                  {company.stats.openJobs}
                </div>
                <div className="text-sm text-muted-foreground">Postes ouverts</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-eemploi-primary mb-1">
                  {company.stats.avgSalary}
                </div>
                <div className="text-sm text-muted-foreground">Salaire moyen</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-eemploi-primary mb-1">
                  {company.stats.responseTime}
                </div>
                <div className="text-sm text-muted-foreground">Temps de réponse</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-eemploi-primary mb-1">
                  {company.stats.hiringRate}
                </div>
                <div className="text-sm text-muted-foreground">Taux d'embauche</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="about">À propos</TabsTrigger>
                  <TabsTrigger value="jobs">Postes ({companyJobs.length})</TabsTrigger>
                  <TabsTrigger value="reviews">Avis ({company.reviews})</TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-6">
                  {/* Description */}
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos de {company.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {company.description.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="mb-4 text-muted-foreground">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Values */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="w-5 h-5 mr-2 text-eemploi-primary" />
                        Nos valeurs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {company.values.map((value, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-eemploi-primary rounded-full"></div>
                            <span className="text-sm">{value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Benefits */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Heart className="w-5 h-5 mr-2 text-eemploi-secondary" />
                        Avantages employés
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {company.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-eemploi-secondary rounded-full"></div>
                            <span className="text-sm">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="jobs" className="space-y-6">
                  <div className="space-y-6">
                    {companyJobs.map((job) => (
                      <JobCard key={job.id} {...job} />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Avis des employés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 text-muted-foreground">
                        <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Les avis employés seront bientôt disponibles</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-4 h-4 text-eemploi-primary" />
                    <a href={`https://${company.website}`} className="text-sm text-eemploi-primary hover:underline">
                      {company.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-eemploi-primary" />
                    <span className="text-sm">{company.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-eemploi-primary" />
                    <span className="text-sm">{company.email}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Apply */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidature spontanée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Envoyez votre candidature même si aucun poste ne vous correspond actuellement.
                  </p>
                  <Button className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90">
                    Envoyer ma candidature
                  </Button>
                </CardContent>
              </Card>

              {/* Similar Companies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Entreprises similaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        T
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">TechStart Innovation</h4>
                        <p className="text-xs text-muted-foreground">Technologie • Rabat</p>
                        <div className="flex items-center mt-1">
                          <Star className="w-3 h-3 text-yellow-500 mr-1" />
                          <span className="text-xs">4.6</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyDetails;
