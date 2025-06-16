import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useUserType } from '@/hooks/useUserType';

interface ProtectedRouteProps {
  requiredUserType?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredUserType }) => {
  const { user, loading } = useAuth();
  const { userType, loading: userTypeLoading } = useUserType();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login");
      return;
    }

    if (user && !loading && !userTypeLoading) {
      // Si on accède à une route protégée générale (sans type requis)
      // Rediriger vers le dashboard approprié selon le type d'utilisateur
      if (!requiredUserType) {
        switch (userType) {
          case "recruteur":
            if (window.location.pathname !== "/dashboard/recruteur") {
              navigate("/dashboard/recruteur", { replace: true });
            }
            break;
          case "admin":
            if (window.location.pathname !== "/dashboard/admin") {
              navigate("/dashboard/admin", { replace: true });
            }
            break;
          default:
            if (window.location.pathname !== "/dashboard/candidat") {
              navigate("/dashboard/candidat", { replace: true });
            }
            break;
        }
        return;
      }

      // Si un type d'utilisateur spécifique est requis et ne correspond pas
      if (requiredUserType && userType !== requiredUserType) {
        switch (userType) {
          case "recruteur":
            navigate("/dashboard/recruteur", { replace: true });
            break;
          case "admin":
            navigate("/dashboard/admin", { replace: true });
            break;
          default:
            navigate("/dashboard/candidat", { replace: true });
            break;
        }
      }
    }
  }, [user, loading, requiredUserType, navigate, userType, userTypeLoading]);

  if (loading || userTypeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <Outlet />;
};

export default ProtectedRoute;
