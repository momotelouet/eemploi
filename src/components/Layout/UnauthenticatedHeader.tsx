
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
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group animate-fade-in">
            <img 
              src="/lovable-uploads/9a2bda93-4784-4fc5-ae3c-dff4144290fe.png" 
              alt="eemploi logo" 
              className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-eemploi-primary transition-all duration-300 rounded-lg hover:bg-eemploi-primary/10 hover:scale-105 flex items-center space-x-2 animate-fade-in"
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
                className="hover:bg-eemploi-primary/10 hover:text-eemploi-primary transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </Link>
            <Link to="/auth/register">
              <Button 
                className="bg-eemploi-primary hover:bg-eemploi-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in"
                style={{ animationDelay: '0.7s' }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 animate-fade-in" />
            ) : (
              <Menu className="w-6 h-6 animate-fade-in" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-in">
            <nav className="space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              <div className="pt-4 space-y-2 border-t border-border">
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: '0.6s' }}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium bg-eemploi-primary text-white rounded-lg hover:bg-eemploi-primary/90 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: '0.7s' }}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default UnauthenticatedHeader;
