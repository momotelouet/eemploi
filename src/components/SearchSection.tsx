
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin, Briefcase } from "lucide-react";

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const handleSearch = () => {
    console.log("Recherche:", { searchTerm, location, jobType });
  };

  return (
    <div className="bg-gradient-to-r from-eemploi-primary via-eemploi-primary/90 to-eemploi-secondary py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trouvez votre emploi idéal au Maroc
          </h1>
          <p className="text-xl text-white/90">
            Découvrez des milliers d'opportunités avec la plateforme emploi la plus avancée
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Poste, entreprise, mots-clés..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>

              <div>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Ville" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casablanca">Casablanca</SelectItem>
                    <SelectItem value="rabat">Rabat</SelectItem>
                    <SelectItem value="marrakech">Marrakech</SelectItem>
                    <SelectItem value="fes">Fès</SelectItem>
                    <SelectItem value="tanger">Tanger</SelectItem>
                    <SelectItem value="agadir">Agadir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={jobType} onValueChange={setJobType}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdi">CDI</SelectItem>
                    <SelectItem value="cdd">CDD</SelectItem>
                    <SelectItem value="stage">Stage</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="temps-partiel">Temps partiel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleSearch}
                size="lg"
                className="bg-eemploi-primary hover:bg-eemploi-primary/90 text-lg px-8 py-3 rounded-xl"
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/80 text-sm">
              Mots-clés populaires : 
              <span className="ml-2">
                {["Développeur", "Commercial", "Comptable", "Manager", "Ingénieur"].map((keyword, index) => (
                  <button 
                    key={keyword}
                    className="text-white hover:text-eemploi-accent transition-colors ml-2 underline"
                  >
                    {keyword}{index < 4 && ","}
                  </button>
                ))}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
