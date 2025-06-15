
import { Link } from 'react-router-dom';
import { navigationItems } from './navigation';
import { User, LogOut, FileText, Briefcase, LayoutDashboard, Users } from 'lucide-react';

interface MobileMenuProps {
  userType: string | null;
  handleLogout: () => void;
  closeMenu: () => void;
}

const MobileMenu = ({ userType, handleLogout, closeMenu }: MobileMenuProps) => {
  const onLogoutClick = () => {
    closeMenu();
    handleLogout();
  };
  
  const onLinkClick = () => {
    closeMenu();
  };

  return (
    <div className="lg:hidden py-4 border-t border-border animate-slide-in">
      <nav className="space-y-2">
        {navigationItems.map((item, index) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onLinkClick}
            className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        
        <div className="pt-4 space-y-2 border-t border-border">
          {userType === 'candidat' && (
            <>
              <Link
                to="/dashboard/candidat?tab=profile"
                onClick={onLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                <User className="w-4 h-4" />
                <span>Mon profil</span>
              </Link>
              <Link
                to="/dashboard/candidat?tab=cv"
                onClick={onLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.7s' }}
              >
                <FileText className="w-4 h-4" />
                <span>Mes CV</span>
              </Link>
              <Link
                to="/dashboard/candidat?tab=applications"
                onClick={onLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.8s' }}
              >
                <Briefcase className="w-4 h-4" />
                <span>Mes candidatures</span>
              </Link>
            </>
          )}
          {userType === 'recruteur' && (
            <>
              <Link
                to="/dashboard/recruteur"
                onClick={onLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.6s' }}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tableau de bord</span>
              </Link>
              <Link
                to="/recruteur/hub"
                onClick={onLinkClick}
                className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: '0.7s' }}
              >
                <Briefcase className="w-4 h-4" />
                <span>Hub Recruteur</span>
              </Link>
                 <Link
                  to="/recruteur/candidatures"
                  onClick={onLinkClick}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-foreground hover:text-eemploi-primary hover:bg-eemploi-primary/10 rounded-lg transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: '0.8s' }}
                >
                  <Users className="w-4 h-4" />
                  <span>Candidatures</span>
                </Link>
            </>
          )}
          <button
            onClick={onLogoutClick}
            className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: '0.9s' }}
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
