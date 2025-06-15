
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCompanies } from "@/hooks/useCompanies";
import { Skeleton } from "@/components/ui/skeleton";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { companies, loading } = useCompanies();

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    return companies.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (company.industry && company.industry.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, companies]);

  const sectors = useMemo(() => {
    if (loading || companies.length === 0) return [];
    const industryCounts = companies.reduce((acc, company) => {
      if (company.industry) {
        acc[company.industry] = (acc[company.industry] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(industryCounts).map(([name, count]) => ({ name, count }));
  }, [companies, loading]);


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Découvrez les meilleures entreprises
            </h1>
            <p className="text-xl text-white/90">
              Explorez les entreprises qui recrutent et trouvez votre futur employeur
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-xl">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Nom d'entreprise, secteur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Button size="lg" className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                  Rechercher
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Sectors */}
      <section className="py-8 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} className="h-9 w-24 rounded-md" />
                ))
            ) : (
                sectors.map((sector, index) => (
                  <Button key={index} variant="outline" size="sm" className="h-9">
                    {sector.name}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {sector.count}
                    </Badge>
                  </Button>
                ))
            )}
          </div>
        </div>
      </section>

      {/* All Companies */}
      <section className="py-12 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Building className="w-6 h-6 text-eemploi-primary mr-2" />
              <h2 className="text-2xl font-bold">Toutes les entreprises</h2>
              {!loading && (
                <span className="ml-3 text-sm text-muted-foreground">
                  {filteredCompanies.length} entreprises
                </span>
              )}
            </div>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div>
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-6" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCompanies.map((company) => (
                <Card key={company.id} className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-lg flex items-center justify-center text-white font-bold">
                          {company.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {company.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{company.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{company.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-eemploi-primary font-medium">
                        {company.openJobs} postes ouverts
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/entreprises/${company.id}`}>Voir profil</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}


          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus d'entreprises
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-eemploi-primary to-eemploi-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">2,500+</div>
              <div className="text-white/90 text-sm">Entreprises partenaires</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15,000+</div>
              <div className="text-white/90 text-sm">Postes disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">95%</div>
              <div className="text-white/90 text-sm">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">12</div>
              <div className="text-white/90 text-sm">Villes du Maroc</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Companies;
