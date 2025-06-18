import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus, Briefcase, Building, Info, Phone, Wrench } from 'lucide-react';

const UnauthenticatedHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Emplois', href: '/emplois', icon: <Briefcase className="w-4 h-4" /> },
    { label: 'Entreprises', href: '/entreprises', icon: <Building className="w-4 h-4" /> },
    { label: 'Outils', href: '/outils', icon: <Wrench className="w-4 h-4" /> },
    { label: 'À propos', href: '/about', icon: <Info className="w-4 h-4" /> },
    { label: 'Contact', href: '/contact', icon: <Phone className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-[40px] z-50 shadow-md rounded-b-xl animate-fade-in-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group animate-fade-in">
            <img 
              src="/lovable-uploads/79fb5607-6b8b-41b6-97e5-20f16492e405.png" 
              alt="eemploi logo" 
              className="h-10 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 bg-gray-50/60 rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-base font-semibold text-foreground hover:text-eemploi-primary transition-all duration-300 rounded-lg hover:bg-eemploi-primary/10 hover:scale-110 flex items-center space-x-2 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/auth/login">
              <Button 
                variant="ghost" 
                className="hover:bg-eemploi-primary/10 hover:text-eemploi-primary transition-all duration-300 hover:scale-110 animate-fade-in font-semibold text-base"
                style={{ animationDelay: '0.6s' }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button 
                className="bg-eemploi-primary hover:bg-eemploi-primary/90 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in font-semibold text-base"
                style={{ animationDelay: '0.7s' }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Ouvrir le menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden flex flex-col space-y-2 mt-4 bg-white rounded-xl shadow-lg p-4 animate-fade-in">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-eemploi-primary/10 text-base font-semibold text-foreground hover:text-eemploi-primary transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="flex space-x-2 mt-4">
              <Link to="/auth/login" className="flex-1">
                <Button variant="outline" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth/register" className="flex-1">
                <Button className="w-full bg-eemploi-primary text-white">
                  S'inscrire
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default UnauthenticatedHeader;
