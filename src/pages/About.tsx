
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Heart, 
  Zap,
  Shield,
  Globe,
  Star,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const stats = [
    { value: "50,000+", label: "Candidats actifs", icon: <Users className="w-6 h-6" /> },
    { value: "2,500+", label: "Entreprises partenaires", icon: <Users className="w-6 h-6" /> },
    { value: "15,000+", label: "Offres publiées", icon: <TrendingUp className="w-6 h-6" /> },
    { value: "95%", label: "Taux de satisfaction", icon: <Star className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "Nous repoussons constamment les limites de la technologie pour offrir une expérience utilisateur exceptionnelle."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Impact humain",
      description: "Chaque connexion réussie entre un candidat et un employeur transforme des vies et fait grandir les entreprises."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Confiance",
      description: "La vérification des profils et la transparence sont au cœur de notre approche pour créer un environnement sûr."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Excellence",
      description: "Nous visons l'excellence dans chaque fonctionnalité pour dépasser les attentes de nos utilisateurs."
    }
  ];

  const features = [
    "IA et matching intelligent",
    "Système de points de fidélité",
    "Profils vérifiés",
    "Analytics avancées",
    "Messagerie intégrée",
    "Support 24/7",
    "Interface mobile",
    "Notifications temps réel"
  ];

  const team = [
    {
      name: "Youssef Alami",
      role: "CEO & Co-fondateur",
      description: "Expert en transformation digitale avec 10 ans d'expérience dans la tech au Maroc."
    },
    {
      name: "Amal Benali",
      role: "CTO & Co-fondatrice", 
      description: "Ingénieure passionnée, spécialisée en IA et développement de plateformes scalables."
    },
    {
      name: "Karim Tazi",
      role: "Head of Product",
      description: "Designer UX/UI avec une vision centrée utilisateur pour créer des expériences intuitives."
    },
    {
      name: "Salma Fassi",
      role: "Head of Growth",
      description: "Experte en marketing digital et croissance, ancienne de grandes scale-ups européennes."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            À propos d'eemploi
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            La plateforme marocaine qui révolutionne la mise en relation entre candidats et recruteurs grâce à l'intelligence artificielle et une expérience utilisateur exceptionnelle.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover-lift">
                <CardContent className="p-6">
                  <div className="text-eemploi-primary mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-eemploi-primary/10 text-eemploi-primary">
                Notre mission
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Démocratiser l'accès à l'emploi au Maroc
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Nous croyons que chaque talent mérite sa chance et que chaque entreprise devrait pouvoir trouver les bonnes personnes. Notre mission est de créer des opportunités en connectant efficacement les candidats aux employeurs grâce à la technologie.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Avec eemploi, nous voulons transformer le marché de l'emploi marocain en le rendant plus accessible, plus transparent et plus équitable pour tous.
              </p>
              <Button size="lg" asChild className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                <Link to="/emplois">
                  <Target className="w-4 h-4 mr-2" />
                  Découvrir les opportunités
                </Link>
              </Button>
            </div>
            <div className="space-y-6">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-xl flex items-center justify-center text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Plateforme #1 au Maroc</h3>
                      <p className="text-sm text-muted-foreground">
                        Reconnue comme la solution la plus innovante
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-eemploi-secondary to-eemploi-accent rounded-xl flex items-center justify-center text-white">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Croissance exponentielle</h3>
                      <p className="text-sm text-muted-foreground">
                        +300% de croissance en 2024
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-eemploi-secondary/10 text-eemploi-secondary">
              Nos valeurs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ce qui nous guide au quotidien
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos valeurs ne sont pas que des mots sur un mur, elles sont intégrées dans chaque décision et chaque fonctionnalité que nous développons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="text-eemploi-primary mb-4 flex justify-center">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-eemploi-accent/10 text-eemploi-accent">
                Technologie avancée
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Une plateforme qui dépasse toutes les autres
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Nous avons développé des fonctionnalités uniques qui n'existent nulle part ailleurs au Maroc. Notre objectif : créer la meilleure expérience possible pour les candidats et les recruteurs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-eemploi-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">IA & Matching intelligent</h3>
                  <p className="text-sm text-muted-foreground">
                    Notre algorithme analyse en profondeur les profils pour proposer les meilleures correspondances.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Système de gamification</h3>
                  <p className="text-sm text-muted-foreground">
                    Points, badges et récompenses pour encourager l'engagement et la qualité.
                  </p>
                </CardContent>
              </Card>
              <Card className="glass-card hover-lift">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Analytics en temps réel</h3>
                  <p className="text-sm text-muted-foreground">
                    Tableaux de bord avancés pour suivre vos performances et optimiser vos résultats.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-eemploi-primary/10 text-eemploi-primary">
              Notre équipe
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Les visionnaires derrière eemploi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une équipe passionnée et expérimentée, unie par la volonté de transformer le marché de l'emploi au Maroc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3 text-xs">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.description}
                  </p>
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
            Rejoignez la révolution de l'emploi
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Que vous soyez candidat ou recruteur, eemploi vous offre les outils les plus avancés pour réussir.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link to="/inscription">
                Créer mon compte gratuit
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 text-white border-white hover:bg-white hover:text-eemploi-primary" asChild>
              <Link to="/contact">
                Nous contacter
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
