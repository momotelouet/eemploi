import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  Bell,
  Plus,
  Search,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationsDropdown } from './Notifications';
import UserMenu from './UserMenu';
import HeaderNavigation from './HeaderNavigation';
import MobileMenu from './MobileMenu';
import { useRecruiterProfile } from '@/hooks/useRecruiterProfile';

const UNPAID_THRESHOLD = 1000;

const AuthenticatedHeader = () => {
  const { user, userType, logout } = useAuth();
  const { profile: recruiterProfile, isLoading: recruiterLoading } = useRecruiterProfile(userType === 'recruteur' ? user?.id ?? null : null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const notificationsHookData = useNotifications();
  const { unreadCount } = notificationsHookData;

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

  const handleCreateClick = () => {
    if (userType === 'recruteur') {
      navigate('/recruteur/hub', { state: { openCreateJobModal: true } });
    } else {
      navigate('/dashboard/candidat?tab=cv', { state: { openCreateCVModal: true } });
    }
  };

  const isRecruiterBlocked = userType === 'recruteur' && ((recruiterProfile?.status === 'suspended') || ((recruiterProfile?.unpaid_balance ?? 0) >= UNPAID_THRESHOLD));

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
          <HeaderNavigation />

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
              onClick={handleCreateClick}
              disabled={isRecruiterBlocked || recruiterLoading}
              title={isRecruiterBlocked ? (recruiterProfile?.status === 'suspended' ? 'Votre compte est suspendu. Veuillez contacter le support.' : `Votre solde impayé de ${recruiterProfile?.unpaid_balance} DH a atteint le seuil de ${UNPAID_THRESHOLD} DH. Veuillez le régler pour continuer.`) : 'Créer une offre ou un CV'}
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
              <NotificationsDropdown {...notificationsHookData} />
            </DropdownMenu>

            {/* User Menu */}
            <UserMenu 
              user={user} 
              userType={userType} 
              handleLogout={handleLogout} 
              getUserInitials={getUserInitials}
            />
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
          <MobileMenu 
            userType={userType} 
            handleLogout={handleLogout}
            closeMenu={() => setIsMenuOpen(false)} 
          />
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
