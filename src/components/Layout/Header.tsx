
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, User, Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold gradient-text">eemploi</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/emplois" className="text-foreground hover:text-eemploi-primary transition-colors">
              Emplois
            </Link>
            <Link to="/entreprises" className="text-foreground hover:text-eemploi-primary transition-colors">
              Entreprises
            </Link>
            <Link to="/a-propos" className="text-foreground hover:text-eemploi-primary transition-colors">
              À propos
            </Link>
            <Link to="/contact" className="text-foreground hover:text-eemploi-primary transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="w-4 h-4 mr-2" />
              Rechercher
            </Button>
            
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/connexion">Connexion</Link>
              </Button>
              <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90" asChild>
                <Link to="/inscription">S'inscrire</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
