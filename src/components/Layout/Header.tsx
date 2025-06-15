
import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedHeader from "./AuthenticatedHeader";
import UnauthenticatedHeader from "./UnauthenticatedHeader";

const Header = () => {
  try {
    const { user, loading } = useAuth();

    if (loading) {
      // Show a simple header while loading
      return (
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
      );
    }

    return user ? <AuthenticatedHeader /> : <UnauthenticatedHeader />;
  } catch (error) {
    console.error('Header error:', error);
    // Fallback header in case of error
    return (
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
    );
  }
};

export default Header;
