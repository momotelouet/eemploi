
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Users, 
  Building, 
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchSection from '@/components/SearchSection';
import Stats from '@/components/Stats';

const Index = () => {
  const featuredJobs = [
    {
      id: 1,
      title: "Développeur Full Stack",
      company: "TechCorp Morocco",
      location: "Casablanca",
      salary: "15,000 - 25,000 MAD",
      type: "CDI",
      featured: true
    },
    {
      id: 2,
      title: "Chef de Projet Digital",
      company: "Digital Solutions",
      location: "Rabat",
      salary: "20,000 - 30,000 MAD",
      type: "CDI",
      featured: true
    },
    {
      id: 3,
      title: "Ingénieur DevOps",
      company: "CloudTech",
      location: "Marrakech",
      salary: "18,000 - 28,000 MAD",
      type: "CDI",
      featured: true
    }
  ];

  const topCompanies = [
    { name: "OCP Group", logo: "🏭", jobs: 45 },
    { name: "Attijariwafa Bank", logo: "🏦", jobs: 32 },
    { name: "ONCF", logo: "🚄", jobs: 28 },
    { name: "Royal Air Maroc", logo: "✈️", jobs: 23 },
    { name: "Managem", logo: "⛏️", jobs: 19 },
    { name: "CDG", logo: "🏛️", jobs: 16 }
  ];

  const benefits = [
    {
      icon: <Search className="w-8 h-8 text-eemploi-primary" />,
      title: "Recherche Intelligente",
      description: "Trouvez l'emploi parfait grâce à notre IA avancée"
    },
    {
      icon: <Users className="w-8 h-8 text-eemploi-secondary" />,
      title: "Réseau Professionnel",
      description: "Connectez-vous avec les meilleurs recruteurs du Maroc"
    },
    {
      icon: <Zap className="w-8 h-8 text-eemploi-accent" />,
      title: "Candidature Express",
      description: "Postulez en un clic avec votre profil optimisé"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with enhanced animations */}
      <section className="gradient-bg text-white py-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Votre <span className="text-eemploi-accent animate-bounce-gentle">carrière</span> commence ici
            </h1>
            <p className="text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              La plateforme de référence pour l'emploi au Maroc. Trouvez votre opportunité parmi 
              <span className="font-bold text-eemploi-accent"> 15,000+ offres</span> d'emploi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-white text-eemploi-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 hover-lift">
                <Search className="w-5 h-5 mr-2" />
                Rechercher un emploi
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-eemploi-primary hover:scale-105 transition-all duration-300">
                Publier une offre
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-eemploi-accent/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-eemploi-secondary/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Search Section with enhanced styling */}
      <section className="py-16 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="transform -translate-y-8">
            <SearchSection />
          </div>
        </div>
      </section>

      {/* Benefits Section with staggered animations */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir eemploi ?</h2>
            <p className="text-muted-foreground text-lg">Des outils innovants pour votre réussite professionnelle</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="text-center hover-lift glass-card animate-fade-in hover:shadow-xl transition-all duration-300 group"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-8">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with enhanced animations */}
      <Stats />

      {/* Featured Jobs with enhanced animations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Offres en vedette</h2>
            <p className="text-muted-foreground text-lg">Les meilleures opportunités sélectionnées pour vous</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="hover-lift group animate-fade-in hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge className="bg-eemploi-primary/10 text-eemploi-primary group-hover:bg-eemploi-primary group-hover:text-white transition-all duration-300">
                      ⭐ En vedette
                    </Badge>
                    <Badge variant="outline" className="group-hover:border-eemploi-primary transition-colors duration-300">
                      {job.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-eemploi-primary transition-colors duration-300">
                    {job.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Building className="w-4 h-4 mr-2" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-eemploi-primary font-medium">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                  </div>
                  <Button className="w-full group-hover:bg-eemploi-primary group-hover:scale-105 transition-all duration-300">
                    Voir l'offre
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <Link to="/emplois">
              <Button size="lg" variant="outline" className="hover:bg-eemploi-primary hover:text-white hover:scale-105 transition-all duration-300">
                Voir toutes les offres
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies with enhanced animations */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Entreprises partenaires</h2>
            <p className="text-muted-foreground text-lg">Rejoignez les leaders du marché marocain</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {topCompanies.map((company, index) => (
              <Card 
                key={index} 
                className="text-center hover-lift p-6 group animate-fade-in hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {company.logo}
                </div>
                <h3 className="font-semibold text-sm mb-2 group-hover:text-eemploi-primary transition-colors duration-300">
                  {company.name}
                </h3>
                <Badge variant="outline" className="text-xs group-hover:border-eemploi-primary transition-colors duration-300">
                  {company.jobs} offres
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with enhanced animations */}
      <section className="py-16 gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold mb-4">Prêt à décrocher votre emploi de rêve ?</h2>
            <p className="text-xl mb-8 text-white/90">
              Rejoignez plus de 50,000 candidats qui ont trouvé leur emploi grâce à eemploi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="bg-white text-eemploi-primary hover:bg-white/90 hover:scale-105 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link to="/emplois">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-eemploi-primary hover:scale-105 transition-all duration-300">
                  Explorer les offres
                  <Search className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-10 left-10 w-20 h-20 bg-eemploi-accent/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
      </section>
    </div>
  );
};

export default Index;
