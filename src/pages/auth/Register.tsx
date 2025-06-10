
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "candidat",
    agreeTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }
    
    if (!formData.agreeTerms) {
      alert("Veuillez accepter les conditions d'utilisation");
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      console.log("Registration attempt:", formData);
      setIsLoading(false);
    }, 1000);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-eemploi-primary/5 via-white to-eemploi-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-3xl font-bold gradient-text">eemploi</span>
          </Link>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Créer votre compte</CardTitle>
            <CardDescription>
              Rejoignez des milliers de professionnels sur eemploi
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* User Type Selection */}
              <div className="space-y-3">
                <Label>Je suis un(e)</Label>
                <RadioGroup 
                  value={formData.userType} 
                  onValueChange={(value) => updateFormData("userType", value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="candidat" id="candidat" />
                    <Label htmlFor="candidat" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Candidat
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="recruteur" id="recruteur" />
                    <Label htmlFor="recruteur" className="flex items-center cursor-pointer">
                      <Building className="w-4 h-4 mr-2" />
                      Recruteur
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Votre prénom"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Votre nom"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => updateFormData("agreeTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  J'accepte les{" "}
                  <Link to="/cgu" className="text-eemploi-primary hover:underline">
                    conditions d'utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link to="/politique-confidentialite" className="text-eemploi-primary hover:underline">
                    politique de confidentialité
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6">
              <Separator className="my-4" />
              
              <div className="text-center">
                <span className="text-sm text-muted-foreground">ou</span>
              </div>

              <Button 
                variant="outline" 
                className="w-full mt-4" 
                size="lg"
              >
                <img 
                  src="https://developers.google.com/identity/images/g-logo.png" 
                  alt="Google" 
                  className="w-5 h-5 mr-2"
                />
                S'inscrire avec Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Separator />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <Link 
                to="/connexion" 
                className="text-eemploi-primary hover:underline font-medium"
              >
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
