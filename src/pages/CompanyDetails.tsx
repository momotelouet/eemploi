
import { useParams } from "react-router-dom";
import CompanyHeader from "@/components/company-details/CompanyHeader";
import CompanyStats from "@/components/company-details/CompanyStats";
import CompanyContent from "@/components/company-details/CompanyContent";
import CompanySidebar from "@/components/company-details/CompanySidebar";

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
    <div className="bg-background">
      
      <CompanyHeader company={company} />
      <CompanyStats stats={company.stats} />

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2">
              <CompanyContent company={company} companyJobs={companyJobs} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <CompanySidebar company={company} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CompanyDetails;
