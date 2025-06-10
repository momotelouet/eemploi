
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Search, User, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const AuthenticatedHeader = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de se déconnecter",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur eemploi!"
      });
    }
  };

  const getInitials = () => {
    if (!user?.user_metadata) return "U";
    const firstName = user.user_metadata.first_name || "";
    const lastName = user.user_metadata.last_name || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
  };

  const getUserName = () => {
    if (!user?.user_metadata) return user?.email;
    const firstName = user.user_metadata.first_name || "";
    const lastName = user.user_metadata.last_name || "";
    return `${firstName} ${lastName}`.trim() || user.email;
  };

  const getUserType = () => {
    return user?.user_metadata?.user_type || "candidat";
  };

  const getDashboardLink = () => {
    const userType = getUserType();
    switch (userType) {
      case "recruteur":
        return "/dashboard/recruteur";
      case "admin":
        return "/dashboard/admin";
      default:
        return "/dashboard/candidat";
    }
  };

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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-eemploi-primary text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{getUserName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mon tableau de bord</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Se déconnecter</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;
