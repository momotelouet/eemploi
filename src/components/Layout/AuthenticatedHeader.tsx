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
    <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-[40px] z-50 shadow-md rounded-b-xl animate-fade-in-down">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group animate-fade-in ml-15">
            <img 
              src="/eemploi-logo.png" 
              alt="eemploi logo" 
              className="h-10 w-auto group-hover:scale-110 transition-transform duration-300"
            />
          </Link>

          {/* Navigation */}
          <HeaderNavigation />

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleCreateClick}
              className="bg-eemploi-primary hover:bg-eemploi-primary/90 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl animate-fade-in font-semibold text-base"
              style={{ animationDelay: '0.6s' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {userType === 'recruteur' ? 'Nouvelle offre' : 'Nouveau CV'}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <Bell className="w-6 h-6 text-eemploi-primary" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <NotificationsDropdown {...notificationsHookData} />
            </DropdownMenu>
            <UserMenu user={user} userType={userType} handleLogout={handleLogout} getUserInitials={getUserInitials} />
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
          <MobileMenu onClose={() => setIsMenuOpen(false)} />
        )}
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
