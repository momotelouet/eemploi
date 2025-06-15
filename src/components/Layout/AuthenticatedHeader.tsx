
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Briefcase, 
  Building, 
  FileText,
  Bell,
  Plus,
  Search,
  Info,
  Phone,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsDropdown } from './Notifications';

const AuthenticatedHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

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
              src="/lovable-uploads/79fb5607-6b8b-41b6-97e5-20f16492e405.png" 
              alt="eemploi logo" 
              className="h-8 w-auto group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
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

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Quick Search */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="hover:bg-eemploi-primary/10 hover:text-eemploi-primary transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              <Search className="w-4 h-4" />
            </Button>

            {/* Create Job/CV Button */}
            <Button 
              size="sm" 
              className="bg-eemploi-primary hover:bg-eemploi-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in"
              style={{ animationDelay: '0.6s' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative hover:bg-eemploi-primary/10 hover:text-eemploi-primary transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: '0.7s' }}
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-1 bg-eemploi-secondary text-white text-xs rounded-full animate-bounce-gentle">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                   <span className="sr-only">Ouvrir les notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <NotificationsDropdown />
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: '0.8s' }}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-eemploi-primary/20 hover:ring-eemploi-primary/40 transition-all duration-300">
                    <AvatarImage src="" alt="Avatar" />
                    <AvatarFallback className="bg-eemploi-primary text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Mon compte</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to="/dashboard/candidat" 
                    className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/dashboard/candidat" 
                    className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Mes CV
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/dashboard/candidat" 
                    className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
                  >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Mes candidatures
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-eemploi-primary/10 transition-colors duration-300">
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110"
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
          <div className="lg:hidden py-4 border-t border-border animate-slide-in">
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
                  to="/dashboard/candidat"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: '0.6s' }}
                >
                  <User className="w-4 h-4" />
                  <span>Mon profil</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: '0.7s' }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
