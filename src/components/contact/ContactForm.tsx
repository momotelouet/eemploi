
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send } from "lucide-react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      console.log("Contact form submitted:", formData);
      setIsLoading(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: ""
      });
    }, 1000);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-eemploi-primary to-eemploi-secondary bg-clip-text text-transparent">
          Envoyez-nous un message
        </CardTitle>
        <p className="text-gray-600 mt-2">Nous sommes là pour vous accompagner dans votre parcours professionnel</p>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Nom complet</Label>
              <Input
                id="name"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="h-12 border-gray-200 focus:border-eemploi-primary focus:ring-eemploi-primary/20"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => updateFormData("email", e.target.value)}
                className="h-12 border-gray-200 focus:border-eemploi-primary focus:ring-eemploi-primary/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-semibold text-gray-700">Type de demande</Label>
            <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
              <SelectTrigger className="h-12 border-gray-200 focus:border-eemploi-primary">
                <SelectValue placeholder="Sélectionnez le type de votre demande" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="candidat">Question candidat</SelectItem>
                <SelectItem value="recruteur">Question recruteur</SelectItem>
                <SelectItem value="technique">Support technique</SelectItem>
                <SelectItem value="partenariat">Partenariat</SelectItem>
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">Sujet</Label>
            <Input
              id="subject"
              placeholder="Objet de votre message"
              value={formData.subject}
              onChange={(e) => updateFormData("subject", e.target.value)}
              className="h-12 border-gray-200 focus:border-eemploi-primary focus:ring-eemploi-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</Label>
            <Textarea
              id="message"
              placeholder="Décrivez votre demande en détail..."
              value={formData.message}
              onChange={(e) => updateFormData("message", e.target.value)}
              rows={6}
              className="border-gray-200 focus:border-eemploi-primary focus:ring-eemploi-primary/20 resize-none"
              required
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full h-14 bg-gradient-to-r from-eemploi-primary to-eemploi-secondary hover:from-eemploi-primary/90 hover:to-eemploi-secondary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? (
              "Envoi en cours..."
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
