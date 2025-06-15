
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

const ContactMethods = () => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      {contactMethods.map((method, index) => (
        <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm hover:bg-white">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-eemploi-primary via-eemploi-primary to-eemploi-secondary rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              {method.icon}
            </div>
            <h3 className="font-bold text-lg mb-3 text-gray-900">{method.title}</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{method.description}</p>
            <a 
              href={method.action}
              className="text-eemploi-primary hover:text-eemploi-secondary font-semibold transition-colors duration-300 hover:underline"
            >
              {method.value}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactMethods;
