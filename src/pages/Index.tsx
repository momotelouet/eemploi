
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
  Zap,
  Shield,
  Target,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SearchSection from '@/components/SearchSection';
import Stats from '@/components/Stats';

const Index = () => {
  const featuredJobs = [
    {
      id: 1,
      title: "Développeur Full Stack Senior",
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
      icon: <Target className="w-10 h-10 text-eemploi-primary" />,
      title: "Matching IA Avancé",
      description: "Notre intelligence artificielle analyse votre profil pour vous proposer les offres les plus pertinentes",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: <Shield className="w-10 h-10 text-eemploi-secondary" />,
      title: "Profils Vérifiés",
      description: "Tous les profils et entreprises sont vérifiés pour garantir la qualité et la sécurité",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: <Globe className="w-10 h-10 text-eemploi-accent" />,
      title: "Réseau National",
      description: "Accédez aux meilleures opportunités dans toutes les villes du Maroc",
      color: "from-amber-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eemploi-primary via-eemploi-primary to-eemploi-secondary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container mx-auto px-6 md:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Votre carrière
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                commence ici
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              La plateforme de référence pour l'emploi au Maroc. Trouvez votre opportunité parmi 
              <span className="font-bold text-yellow-300"> 15,000+ offres</span> d'emploi vérifiées.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="btn-primary text-lg px-12 py-6 shadow-2xl hover:shadow-3xl">
                <Search className="w-6 h-6 mr-3" />
                Rechercher un emploi
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-12 py-6">
                Publier une offre
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 md:px-8">
          <div className="transform -translate-y-16">
            <SearchSection />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir eemploi ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Une plateforme moderne conçue pour maximiser vos chances de réussite professionnelle
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="professional-card group text-center border-0 p-8 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className={`w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Featured Jobs */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-eemploi-primary/10 text-eemploi-primary px-6 py-2 text-lg">
              Offres Premium
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Opportunités en vedette
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Les meilleures offres sélectionnées par nos experts pour accélérer votre carrière
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="professional-card group hover:scale-105 border-0"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2">
                      ⭐ Premium
                    </Badge>
                    <Badge variant="outline" className="border-eemploi-primary text-eemploi-primary">
                      {job.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-eemploi-primary transition-colors duration-300">
                    {job.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Building className="w-5 h-5 mr-3 text-eemploi-primary" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-3 text-eemploi-primary" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-eemploi-primary font-bold text-lg">
                      <TrendingUp className="w-5 h-5 mr-3" />
                      {job.salary}
                    </div>
                  </div>
                  <Button className="w-full btn-primary group-hover:shadow-xl">
                    Voir l'offre
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/emplois">
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-12 py-4">
                Voir toutes les offres
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-6 bg-eemploi-secondary/10 text-eemploi-secondary px-6 py-2 text-lg">
              Partenaires de confiance
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Entreprises leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rejoignez les entreprises les plus innovantes et performantes du Maroc
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {topCompanies.map((company, index) => (
              <Card 
                key={index} 
                className="professional-card group text-center p-8 hover:scale-110"
              >
                <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-300">
                  {company.logo}
                </div>
                <h3 className="font-bold text-lg mb-3 group-hover:text-eemploi-primary transition-colors duration-300">
                  {company.name}
                </h3>
                <Badge variant="outline" className="group-hover:border-eemploi-primary group-hover:text-eemploi-primary transition-colors duration-300">
                  {company.jobs} offres
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-eemploi-primary via-eemploi-primary to-eemploi-secondary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="container mx-auto px-6 md:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Prêt à décrocher votre emploi de rêve ?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed">
              Rejoignez plus de 50,000 candidats qui ont trouvé leur emploi grâce à eemploi
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="bg-white text-eemploi-primary hover:bg-gray-50 text-lg px-12 py-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link to="/emplois">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-eemploi-primary text-lg px-12 py-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300">
                  Explorer les offres
                  <Search className="w-6 h-6 ml-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
