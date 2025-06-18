import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedHeader from "./AuthenticatedHeader";
import UnauthenticatedHeader from "./UnauthenticatedHeader";
import TopBar from "./TopBar";

const Header = () => {
  const { user, loading } = useAuth();

  // Ajout de la TopBar au-dessus du header principal
  return (
    <>
      <TopBar />
      {loading ? (
        <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <img 
                src="/lovable-uploads/79fb5607-6b8b-41b6-97e5-20f16492e405.png" 
                alt="eemploi logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </header>
      ) : user ? (
        <AuthenticatedHeader />
      ) : (
        <UnauthenticatedHeader />
      )}
    </>
  );
};

export default Header;
