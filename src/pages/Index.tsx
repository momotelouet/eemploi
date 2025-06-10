
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import SearchSection from "@/components/SearchSection";
import Stats from "@/components/Stats";
import JobCard from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, CheckCircle, Zap, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Mock data for featured jobs
  const featuredJobs = [
    {
      id: "1",
      title: "Développeur Full Stack",
      company: "TechCorp Maroc",
      location: "Casablanca",
      type: "CDI",
      salary: "25,000 - 35,000 MAD",
      description: "Nous recherchons un développeur passionné pour rejoindre notre équipe dynamique et travailler sur des projets innovants.",
      postedAt: "Il y a 2 jours"
    },
    {
      id: "2", 
      title: "Responsable Marketing Digital",
      company: "Digital Agency",
      location: "Rabat",
      type: "CDI",
      salary: "20,000 - 30,000 MAD",
      description: "Poste stratégique pour développer notre présence digitale et gérer nos campagnes marketing.",
      postedAt: "Il y a 1 jour"
    },
    {
      id: "3",
      title: "Chef de Projet IT",
      company: "Innovate Solutions",
      location: "Marrakech",
      type: "CDI", 
      salary: "30,000 - 40,000 MAD",
      description: "Leadership d'équipes techniques sur des projets complexes dans un environnement agile.",
      postedAt: "Il y a 3 heures"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "IA & Matching intelligent",
      description: "Notre algorithme analyse votre profil et vous propose les offres les plus pertinentes"
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Système de points",
      description: "Gagnez des points en étant actif et débloquez des fonctionnalités premium"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Profils vérifiés",
      description: "Entreprises et candidats vérifiés pour une confiance maximale"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics avancées",
      description: "Suivez vos performances et optimisez votre visibilité"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <SearchSection />
      
      <Stats />

      {/* Featured Jobs Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Offres à la une
              </h2>
              <p className="text-muted-foreground text-lg">
                Découvrez les opportunités les plus attractives du moment
              </p>
            </div>
            <Button variant="outline" className="hidden md:flex" asChild>
              <Link to="/emplois">
                Voir toutes les offres
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>

          <div className="text-center md:hidden">
            <Button asChild>
              <Link to="/emplois">
                Voir toutes les offres
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Pourquoi choisir eemploi ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Une plateforme révolutionnaire qui dépasse toutes les solutions existantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-eemploi-primary to-eemploi-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à décrocher votre emploi de rêve ?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de candidats qui ont déjà trouvé leur bonheur sur eemploi
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/inscription">
                <CheckCircle className="mr-2 w-5 h-5" />
                Créer mon compte gratuit
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white hover:text-eemploi-primary" asChild>
              <Link to="/emplois">
                Parcourir les offres
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-white/80 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Inscription gratuite
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Support 24/7
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Profil vérifié
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
