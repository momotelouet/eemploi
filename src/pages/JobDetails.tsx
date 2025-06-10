
import { useParams } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Clock, 
  Building, 
  User, 
  Star, 
  Share, 
  Bookmark,
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();

  // Mock job data - in real app this would come from API
  const job = {
    id: "1",
    title: "Développeur Full Stack React/Node.js",
    company: "TechCorp Maroc",
    location: "Casablanca, Maroc",
    type: "CDI",
    salary: "25,000 - 35,000 MAD",
    experience: "3-5 ans",
    education: "Bac+3 minimum",
    postedAt: "Il y a 2 jours",
    deadline: "31 Décembre 2024",
    description: `
Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe dynamique et travailler sur des projets innovants.

## À propos du poste

Vous intégrerez une équipe de 8 développeurs dans un environnement startup en pleine croissance. Nous développons des solutions SaaS pour des clients internationaux.

## Responsabilités

• Développer et maintenir des applications web avec React.js et Node.js
• Concevoir et implémenter des APIs RESTful
• Collaborer avec l'équipe UX/UI pour créer des interfaces utilisateur intuitives
• Participer aux code reviews et respecter les bonnes pratiques
• Optimiser les performances des applications
• Participer aux réunions agiles (Scrum)

## Compétences requises

• **Frontend**: React.js, TypeScript, HTML5/CSS3, TailwindCSS
• **Backend**: Node.js, Express.js, MongoDB/PostgreSQL
• **Outils**: Git, Docker, CI/CD
• **Méthodologies**: Agile/Scrum
• Excellente communication en français et anglais
• Esprit d'équipe et autonomie

## Ce que nous offrons

• Salaire compétitif selon profil
• Télétravail hybride (2-3 jours en remote)
• Formation continue et certifications
• Assurance santé complète
• Tickets restaurant
• Environnement de travail moderne
• Équipe jeune et dynamique
    `,
    company_description: "TechCorp Maroc est une entreprise technologique leader au Maroc, spécialisée dans le développement de solutions digitales innovantes pour les entreprises.",
    skills: ["React.js", "Node.js", "TypeScript", "MongoDB", "Docker", "Git", "Agile"],
    benefits: [
      "Assurance santé",
      "Télétravail hybride", 
      "Formation continue",
      "Tickets restaurant",
      "13ème mois"
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {job.company[0]}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{job.title}</h1>
                      <p className="text-lg text-muted-foreground">{job.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{job.postedAt}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {job.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description du poste</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {job.description.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('##')) {
                      return <h3 key={index} className="text-lg font-semibold mt-6 mb-3">{paragraph.replace('## ', '')}</h3>;
                    }
                    if (paragraph.startsWith('•')) {
                      return <li key={index} className="ml-4">{paragraph.replace('• ', '')}</li>;
                    }
                    if (paragraph.trim()) {
                      return <p key={index} className="mb-4">{paragraph}</p>;
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>À propos de l'entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{job.company_description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Apply Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button size="lg" className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90">
                    Postuler maintenant
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full">
                    Postuler avec mon CV
                  </Button>

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date limite:</span>
                      <span className="font-medium">{job.deadline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Candidatures:</span>
                      <span className="font-medium">23 postulants</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vues:</span>
                      <span className="font-medium">156 vues</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Détails du poste</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type de contrat:</span>
                  <Badge>{job.type}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Expérience:</span>
                  <span className="font-medium">{job.experience}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Éducation:</span>
                  <span className="font-medium">{job.education}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Salaire:</span>
                  <span className="font-medium text-eemploi-primary">{job.salary}</span>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avantages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-eemploi-success" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Similar Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Offres similaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    <h4 className="font-medium text-sm">Développeur Frontend React</h4>
                    <p className="text-xs text-muted-foreground">WebAgency • Rabat</p>
                    <div className="flex items-center mt-2">
                      <Star className="w-3 h-3 text-yellow-500 mr-1" />
                      <span className="text-xs">4.8</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetails;
