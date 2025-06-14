import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";

const Contact = () => {
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
    
    // Simulate form submission
    setTimeout(() => {
      console.log("Contact form submitted:", formData);
      setIsLoading(false);
      // Reset form
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

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email",
      description: "Notre équipe vous répond sous 24h",
      value: "contact@eemploi.com",
      action: "mailto:contact@eemploi.com"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Téléphone",
      description: "Du lundi au vendredi, 9h-18h",
      value: "+212 522 123 456",
      action: "tel:+212522123456"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Adresse",
      description: "Rendez-nous visite à nos bureaux",
      value: "Casablanca, Maroc",
      action: "#"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Chat en direct",
      description: "Support instantané pour vos questions",
      value: "Démarrer une conversation",
      action: "#"
    }
  ];

  const faqItems = [
    {
      question: "Comment créer mon profil candidat ?",
      answer: "Cliquez sur 'S'inscrire' et sélectionnez 'Candidat'. Remplissez vos informations et téléchargez votre CV."
    },
    {
      question: "Comment publier une offre d'emploi ?",
      answer: "Inscrivez-vous en tant que recruteur, puis accédez à votre dashboard pour créer une nouvelle offre."
    },
    {
      question: "Les services eemploi sont-ils gratuits ?",
      answer: "Oui, l'inscription et la recherche d'emploi sont entièrement gratuites pour les candidats."
    },
    {
      question: "Comment optimiser ma visibilité ?",
      answer: "Complétez votre profil à 100%, utilisez des mots-clés pertinents et restez actif sur la plateforme."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-eemploi-primary to-eemploi-secondary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans votre recherche d'emploi ou vos recrutements
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="hover-lift text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-eemploi-primary to-eemploi-secondary rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                    {method.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                  <a 
                    href={method.action}
                    className="text-eemploi-primary hover:underline font-medium"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Name and Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          placeholder="Votre nom"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Type of Inquiry */}
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de demande</Label>
                      <Select value={formData.type} onValueChange={(value) => updateFormData("type", value)}>
                        <SelectTrigger>
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

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        placeholder="Objet de votre message"
                        value={formData.subject}
                        onChange={(e) => updateFormData("subject", e.target.value)}
                        required
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Décrivez votre demande en détail..."
                        value={formData.message}
                        onChange={(e) => updateFormData("message", e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-eemploi-primary hover:bg-eemploi-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Envoi en cours..." : "Envoyer le message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* FAQ and Additional Info */}
            <div className="space-y-8">
              
              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-eemploi-primary" />
                    Horaires d'ouverture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Lundi - Vendredi:</span>
                    <span className="text-sm font-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Samedi:</span>
                    <span className="text-sm font-medium">9h00 - 13h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Dimanche:</span>
                    <span className="text-sm text-muted-foreground">Fermé</span>
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-eemploi-primary" />
                    Questions fréquentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-0">
                      <h4 className="font-medium text-sm mb-2">{item.question}</h4>
                      <p className="text-xs text-muted-foreground">{item.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-eemploi-secondary/20 bg-eemploi-secondary/5">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3 text-eemploi-secondary">
                    Support urgent ?
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pour les questions urgentes, contactez-nous directement par téléphone ou chat.
                  </p>
                  <div className="flex space-x-3">
                    <Button size="sm" className="bg-eemploi-secondary hover:bg-eemploi-secondary/90">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
