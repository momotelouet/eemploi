
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredUserType }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && requiredUserType) {
      const userType = user.user_metadata?.user_type || "candidat";
      if (userType !== requiredUserType) {
        // Redirect to appropriate dashboard
        switch (userType) {
          case "recruteur":
            navigate("/dashboard/recruteur");
            break;
          case "admin":
            navigate("/dashboard/admin");
            break;
          default:
            navigate("/dashboard/candidat");
            break;
        }
      }
    }
  }, [user, requiredUserType, navigate]);

  if (loading) {
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

  return <>{children}</>;
};

export default ProtectedRoute;
