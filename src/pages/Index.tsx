import React, { useState, useMemo } from 'react';
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
import { useJobs } from '@/hooks/useJobs';
import { useCompanies } from '@/hooks/useCompanies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JobMatchingAIWidget from '@/components/ai/JobMatchingAIWidget';
import JobCard from '@/components/JobCard';

const Index = () => {
  // Suppression des données fictives, utilisation des hooks pour les vraies données
  const { jobs, loading: jobsLoading } = useJobs();
  const { companies, loading: companiesLoading } = useCompanies();

  // On ne garde que les 6 jobs les plus récents pour la section "en vedette"
  const featuredJobs = jobs.slice(0, 6);
  // On ne garde que les 6 entreprises avec le plus d'offres
  const topCompanies = companies
    .sort((a, b) => b.openJobs - a.openJobs)
    .slice(0, 6);

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

  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  // Recherche réelle sur les offres publiées (titre, description, entreprise)
  // Recherche avancée : mots-clés, entreprise, localisation, type de contrat
  const filteredJobs = useMemo(() => {
    const lower = search.toLowerCase();
    return featuredJobs.filter(job => {
      const matchesKeyword = job.title.toLowerCase().includes(lower) ||
        (job.description && job.description.toLowerCase().includes(lower)) ||
        (job.companies?.name && job.companies.name.toLowerCase().includes(lower));
      const matchesLocation = !locationFilter || (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));
      const matchesType = !typeFilter || (job.job_type && job.job_type === typeFilter);
      return matchesKeyword && matchesLocation && matchesType;
    });
  }, [search, featuredJobs, locationFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section modernisée */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center scale-110 blur-sm opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&q=80')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-br from-eemploi-primary/90 via-eemploi-primary/80 to-eemploi-secondary/90"></div>
        <div className="container mx-auto px-6 md:px-8 relative z-10 flex flex-col items-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 leading-tight drop-shadow-xl text-center animate-fade-in-up">
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-gradient-x">Votre carrière</span>
            commence ici
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto animate-fade-in-up">
            La plateforme de référence pour l'emploi au Maroc. <span className="font-bold text-yellow-300">15,000+ offres</span> d'emploi vérifiées.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
            <Link to="/emplois">
              <Button size="lg" className="bg-white text-eemploi-primary hover:bg-gray-100 text-lg px-12 py-6 shadow-2xl hover:shadow-3xl rounded-full font-bold">
                <Search className="w-6 h-6 mr-3" />
                Rechercher un emploi
              </Button>
            </Link>
            <Link to="/recruteur/hub">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-eemploi-primary text-lg px-12 py-6 rounded-full font-bold">
                Publier une offre
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
          {/* Search intégrée */}
          <div className="w-full max-w-2xl mt-12 animate-fade-in-up">
            <SearchSection />
          </div>
        </div>
      </section>

      {/* Benefits Section modernisée */}
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
              <Card key={index} className="group text-center border-0 p-8 hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-8">
                  <div className={`w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300`}>{benefit.icon}</div>
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

      {/* Featured Jobs modernisées */}
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
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un poste, une entreprise ou un mot-clé..."
              className="w-full max-w-md px-5 py-3 rounded-full border border-gray-200 shadow focus:outline-none focus:border-eemploi-primary text-lg transition-all duration-200 bg-white/80 placeholder-gray-400"
            />
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full border border-gray-200 bg-white/80 focus:border-eemploi-primary">
                <SelectValue placeholder="Localisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes localisations</SelectItem>
                {[...new Set(featuredJobs.map(j => j.location).filter(Boolean))].map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-full border border-gray-200 bg-white/80 focus:border-eemploi-primary">
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous types</SelectItem>
                {[...new Set(featuredJobs.map(j => j.job_type).filter(Boolean))].map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {jobsLoading ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 border-4 border-eemploi-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des offres...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune offre trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Revenez plus tard pour découvrir de nouvelles opportunités !
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          )}
          <div className="text-center">
            <Link to="/emplois">
              <Button size="lg" variant="outline" className="btn-secondary text-lg px-12 py-4 rounded-full font-bold">
                Voir toutes les offres
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Companies modernisées */}
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
          {companiesLoading ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-16 h-16 border-4 border-eemploi-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des entreprises...</p>
            </div>
          ) : topCompanies.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Aucune entreprise trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Revenez plus tard pour découvrir de nouveaux partenaires !
              </p>
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {topCompanies.map((company, index) => (
              <Card key={company.id} className="group text-center p-8 hover:scale-110 transition-transform duration-300 bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-2xl">
                <div className="flex justify-center mb-6">
                  {company.logo_url ? (
                    <img src={company.logo_url} alt={company.name} className="h-16 w-16 object-contain rounded-xl shadow-md group-hover:scale-125 transition-transform duration-300 bg-white" />
                  ) : (
                    <Building className="w-12 h-12 text-eemploi-secondary" />
                  )}
                </div>
                <h3 className="font-bold text-lg mb-3 group-hover:text-eemploi-primary transition-colors duration-300">
                  {company.name}
                </h3>
                <Badge variant="outline" className="group-hover:border-eemploi-primary group-hover:text-eemploi-primary transition-colors duration-300">
                  {company.openJobs} offres
                </Badge>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section modernisée */}
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
                <Button size="lg" className="bg-white text-eemploi-primary hover:bg-gray-50 text-lg px-12 py-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-full font-bold">
                  <CheckCircle className="w-6 h-6 mr-3" />
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link to="/emplois">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-eemploi-primary text-lg px-12 py-6 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 rounded-full font-bold">
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
