
import { TrendingUp, Users, Building, MapPin } from "lucide-react";

const Stats = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "50,000+",
      label: "Candidats actifs",
      color: "text-eemploi-primary"
    },
    {
      icon: <Building className="w-8 h-8" />,
      value: "2,500+",
      label: "Entreprises partenaires",
      color: "text-eemploi-secondary"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "15,000+",
      label: "Offres d'emploi",
      color: "text-eemploi-accent"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      value: "12",
      label: "Villes du Maroc",
      color: "text-eemploi-success"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            eemploi en chiffres
          </h2>
          <p className="text-muted-foreground text-lg">
            La confiance de milliers d'utilisateurs au Maroc
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`${stat.color} mb-4 flex justify-center group-hover:animate-bounce-gentle`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
