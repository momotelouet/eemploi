import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, Phone, MessageSquare } from "lucide-react";

const ContactSidebar = () => {
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
    <div className="space-y-8">
      {/* Business Hours */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl">
            <Clock className="w-6 h-6 mr-3 text-eemploi-primary" />
            Horaires d'ouverture
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Lundi - Vendredi:</span>
            <span className="text-gray-900 font-bold">9h00 - 18h00</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-700 font-medium">Samedi:</span>
            <span className="text-gray-900 font-bold">9h00 - 13h00</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-700 font-medium">Dimanche:</span>
            <span className="text-gray-500">Fermé</span>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl">
            <HelpCircle className="w-6 h-6 mr-3 text-eemploi-primary" />
            Questions fréquentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {faqItems.map((item, index) => (
            <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
              <h4 className="font-semibold text-gray-900 mb-3 leading-tight">{item.question}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactSidebar;
