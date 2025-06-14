import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const UnauthenticatedHeader = () => {
  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-eemploi-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="font-bold text-xl">eEmploi</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/emplois" className="text-gray-600 hover:text-eemploi-primary transition-colors">
              Emplois
            </Link>
            <Link to="/entreprises" className="text-gray-600 hover:text-eemploi-primary transition-colors">
              Entreprises
            </Link>
            <Link to="/outils" className="text-gray-600 hover:text-eemploi-primary transition-colors">
              Outils Carrière
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-eemploi-primary transition-colors">
              À propos
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-eemploi-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link to="/auth/register">
              <Button className="bg-eemploi-primary hover:bg-eemploi-primary/90">
                Inscription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UnauthenticatedHeader;
