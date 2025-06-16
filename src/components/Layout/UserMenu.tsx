import { Link } from 'react-router-dom';
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
import { User, LogOut, Settings, Briefcase, LayoutDashboard, Users, FileText } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserMenuProps {
  user: SupabaseUser | null;
  userType: string | null;
  handleLogout: () => void;
  getUserInitials: () => string;
}

const UserMenu = ({ user, userType, handleLogout, getUserInitials }: UserMenuProps) => {
  return (
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
        {userType === 'candidat' && (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/candidat?tab=profile" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/candidat?tab=cv" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <FileText className="mr-2 h-4 w-4" />
                Mes CV
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/candidat?tab=applications" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Mes candidatures
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {userType === 'recruteur' && (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/recruteur" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/recruteur/hub" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Hub Recruteur
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/recruteur/candidatures" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <Users className="mr-2 h-4 w-4" />
                Candidatures
              </Link>
            </DropdownMenuItem>
          </>
        )}
        {userType === 'admin' && (
          <>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/admin" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord admin
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/admin?tab=users" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <Users className="mr-2 h-4 w-4" />
                Gérer les utilisateurs
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/admin?tab=jobs" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Modération des emplois
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/admin?tab=companies" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <FileText className="mr-2 h-4 w-4" />
                Gestion des entreprises
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                to="/dashboard/admin?tab=reports" 
                className="flex items-center hover:bg-eemploi-primary/10 transition-colors duration-300"
              >
                <Settings className="mr-2 h-4 w-4" />
                Rapports & Statistiques
              </Link>
            </DropdownMenuItem>
          </>
        )}
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
  );
};

export default UserMenu;
