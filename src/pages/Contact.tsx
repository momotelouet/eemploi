import React from 'react';
import ContactForm from "@/components/contact/ContactForm";
import { Mail, Phone, Clock, Linkedin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header pro */}
      <section className="py-16 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">Contactez-nous</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Notre équipe vous répond rapidement pour toute question sur nos services, votre compte ou un accompagnement personnalisé.
          </p>
        </div>
      </section>

      {/* Section principale */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Formulaire de contact */}
            <div className="bg-white rounded-xl shadow-lg p-8 border">
              <h2 className="text-2xl font-semibold text-blue-900 mb-6">Envoyer un message</h2>
              <ContactForm />
            </div>
            {/* Infos de contact */}
            <div className="bg-blue-50 rounded-xl shadow p-8 border border-blue-100 flex flex-col gap-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Nos coordonnées</h3>
              <div className="flex items-center gap-3 text-blue-900">
                <Phone className="w-5 h-5" />
                <span className="font-medium">+212 658844222</span>
              </div>
              <div className="flex items-center gap-3 text-blue-900">
                <Mail className="w-5 h-5" />
                <span className="font-medium">contact@eemploi.com</span>
              </div>
              <div className="flex items-center gap-3 text-blue-900">
                <Clock className="w-5 h-5" />
                <span>Lun - Ven : 9h00 - 18h00</span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                <a href="https://www.linkedin.com/company/eemploi" target="_blank" rel="noopener" className="inline-flex items-center px-3 py-2 rounded-md bg-blue-700 text-white hover:bg-blue-800 transition">
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </a>
              </div>
              <div className="text-sm text-gray-500 mt-8">
                Nous ne partageons jamais vos données. Réponse sous 24h ouvrées.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
