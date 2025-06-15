
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, Star, Heart } from "lucide-react";

type CompanyHeaderProps = {
  company: {
    name: string;
    sector: string;
    location: string;
    employees: string;
    founded: string;
    rating: number;
    reviews: number;
    stats: {
      openJobs: number;
    };
  };
};

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
    <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-eemploi-primary">{company.name[0]}</span>
            </div>
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
  );
};

export default CompanyHeader;
