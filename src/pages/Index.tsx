
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, Shield, Clock, Award, Building2, GraduationCap, Target, ArrowRight, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/emplois?search=${searchTerm}&location=${location}`);
  };

  const topCompanies = [
    { name: "OCP Group", logo: "🏭", jobs: 245, industry: "Mines & Chimie" },
    { name: "Attijariwafa Bank", logo: "🏦", jobs: 189, industry: "Banque" },
    { name: "Maroc Telecom", logo: "📱", jobs: 156, industry: "Télécommunications" },
    { name: "ONCF", logo: "🚄", jobs: 134, industry: "Transport" },
    { name: "Royal Air Maroc", logo: "✈️", jobs: 98, industry: "Aviation" },
    { name: "Managem", logo: "⛏️", jobs: 87, industry: "Mines" }
  ];

  const jobCategories = [
    { name: "Informatique & Tech", icon: "💻", count: "12,450", growth: "+15%" },
    { name: "Banque & Finance", icon: "💰", count: "8,230", growth: "+8%" },
    { name: "Ingénierie", icon: "⚙️", count: "6,780", growth: "+12%" },
    { name: "Commerce & Vente", icon: "🛍️", count: "9,340", growth: "+6%" },
    { name: "Santé", icon: "🏥", count: "4,560", growth: "+18%" },
    { name: "Education", icon: "🎓", count: "3,890", growth: "+10%" }
  ];

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-eemploi-primary" />,
      title: "Emplois Vérifiés",
      description: "Toutes nos offres sont vérifiées et authentiques"
    },
    {
      icon: <Clock className="w-8 h-8 text-eemploi-primary" />,
      title: "Suivi en Temps Réel",
      description: "Suivez l'état de vos candidatures en direct"
    },
    {
      icon: <Target className="w-8 h-8 text-eemploi-primary" />,
      title: "Matching Intelligent",
      description: "Notre IA vous propose les emplois qui vous correspondent"
    },
    {
      icon: <Award className="w-8 h-8 text-eemploi-primary" />,
      title: "CV Professionnel",
      description: "Créez votre CV avec nos outils avancés"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50/30 to-red-50/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-eemploi-primary/5 via-transparent to-eemploi-secondary/5"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Notre job,</span>
              <br />
              <span className="text-gray-900">vous aider à choisir le vôtre</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Parmi <span className="font-bold text-eemploi-primary">156,892</span> offres d'emploi au Maroc
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Métier, entreprise, compétence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg border-0 bg-gray-50"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Ville, région..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-12 h-14 text-lg border-0 bg-gray-50"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="h-14 px-8 gradient-bg text-white font-semibold rounded-xl hover-lift"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="hover:bg-eemploi-primary hover:text-white cursor-pointer">
                  Stage de fin d'études
                </Badge>
                <Badge variant="outline" className="hover:bg-eemploi-primary hover:text-white cursor-pointer">
                  Job d'été étudiant
                </Badge>
                <Badge variant="outline" className="hover:bg-eemploi-primary hover:text-white cursor-pointer">
                  Alternance
                </Badge>
                <Badge variant="outline" className="hover:bg-eemploi-primary hover:text-white cursor-pointer">
                  Télétravail
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-eemploi-primary mb-2">156K+</div>
              <div className="text-gray-600">Offres d'emploi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-eemploi-primary mb-2">25K+</div>
              <div className="text-gray-600">Entreprises</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-eemploi-primary mb-2">890K+</div>
              <div className="text-gray-600">Candidats inscrits</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-eemploi-primary mb-2">67K+</div>
              <div className="text-gray-600">Recrutements réussis</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-green-50/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Trouver un job ? <span className="gradient-text">Simple comme eemploi</span>
            </h2>
            <p className="text-xl text-gray-600">Découvrez pourquoi des milliers de candidats nous font confiance</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover-lift border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-8 h-8 text-eemploi-success mr-3" />
                  <CardTitle className="text-xl">Suivez votre candidature</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  Enfin de la visibilité en direct étape par étape. Postulez et dès que nous avons du nouveau sur l'avancement de votre candidature, vous êtes prévenu !
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Voir les offres <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-8 h-8 text-eemploi-primary mr-3" />
                  <CardTitle className="text-xl">Des offres transparentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  Salaire, télétravail, avantages... N'avancez plus dans l'inconnu pour choisir votre futur job. Toutes les infos importantes sont disponibles.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Trouver mon job <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Building2 className="w-8 h-8 text-eemploi-secondary mr-3" />
                  <CardTitle className="text-xl">Entreprises transparentes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">
                  Process de recrutement, délai de réponse, culture d'entreprise... Vous méritez de vraies réponses, pas de perdre du temps.
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Voir les entreprises <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Des entreprises</span> qui recrutent
            </h2>
            <p className="text-xl text-gray-600">Rejoignez les leaders du marché marocain</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {topCompanies.map((company, index) => (
              <Card key={index} className="hover-lift cursor-pointer border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{company.logo}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="bg-eemploi-primary/10 text-eemploi-primary">
                      {company.jobs} postes
                    </Badge>
                    <Button variant="ghost" size="sm">
                      Voir les offres <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" onClick={() => navigate('/entreprises')}>
              Voir toutes les entreprises
            </Button>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 bg-gradient-to-r from-green-50/30 to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="gradient-text">Explorez</span> nos secteurs qui recrutent
            </h2>
            <p className="text-xl text-gray-600">Découvrez les opportunités dans tous les domaines</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobCategories.map((category, index) => (
              <Card key={index} className="hover-lift cursor-pointer border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{category.icon}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {category.growth}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-2xl font-bold text-eemploi-primary mb-2">{category.count}</p>
                  <p className="text-sm text-gray-600">offres disponibles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Préparez-vous à décrocher votre job de rêve !
            </h2>
            <div className="grid md:grid-cols-2 gap-12 mb-12">
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">89,000</div>
                <p className="text-xl mb-6">CV consultés chaque jour, soyez le prochain à être vu !</p>
                <Button variant="secondary" size="lg" className="bg-white text-eemploi-primary hover:bg-gray-100">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Déposer mon CV
                </Button>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-4">156,892</div>
                <p className="text-xl mb-6">offres en ce moment, on vous envoie celles qui collent ?</p>
                <Button variant="secondary" size="lg" className="bg-white text-eemploi-primary hover:bg-gray-100">
                  <Target className="w-5 h-5 mr-2" />
                  Créer mon alerte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Les outils pour <span className="gradient-text">trouver votre job</span>
            </h2>
            <p className="text-xl text-gray-600">Tout ce dont vous avez besoin pour réussir votre recherche d'emploi</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle>Créateur de CV</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Créez votre CV professionnel en quelques minutes avec nos modèles
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Créer mon CV
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle>Lettre de motivation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Rédigez une lettre de motivation percutante et personnalisée
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Créer ma lettre
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Simulateur de salaire</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Calculez votre salaire brut/net et négociez en toute confiance
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Calculer mon salaire
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <CardTitle>Préparation entretien</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="mb-4">
                  Préparez-vous aux questions d'entretien avec notre simulateur
                </CardDescription>
                <Button variant="outline" className="w-full">
                  Préparer mon entretien
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
