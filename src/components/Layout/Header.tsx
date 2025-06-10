
import { useAuth } from "@/contexts/AuthContext";
import AuthenticatedHeader from "./AuthenticatedHeader";
import UnauthenticatedHeader from "./UnauthenticatedHeader";

const Header = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a simple header while loading
    return (
      <header className="bg-white/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-2xl font-bold gradient-text">eemploi</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return user ? <AuthenticatedHeader /> : <UnauthenticatedHeader />;
};

export default Header;
