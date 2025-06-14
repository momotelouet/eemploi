
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
  Briefcase,
  Home,
  LogOut,
  Settings,
  User,
  Mail,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AuthenticatedHeader = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { profile } = useUserProfile();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

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
            {profile?.user_type === 'recruteur' && (
              <Link to="/recruteur/hub" className="text-gray-600 hover:text-eemploi-primary transition-colors">
                Hub Recruteur
              </Link>
            )}
          </nav>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={profile?.first_name} />
                  <AvatarFallback>{profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex items-center space-x-2">
                <User className="h-4 w-4 mr-2" />
                <span>{profile?.first_name} {profile?.last_name}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user?.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard/candidat')} className="flex items-center space-x-2">
                <Home className="h-4 w-4 mr-2" />
                <span>Tableau de bord</span>
              </DropdownMenuItem>
              {profile?.user_type === 'recruteur' && (
                <DropdownMenuItem onClick={() => navigate('/recruteur/hub')} className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>Espace Recruteur</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="flex items-center space-x-2">
                <Settings className="h-4 w-4 mr-2" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
