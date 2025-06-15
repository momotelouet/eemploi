
import React from 'react';
import ContactMethods from "@/components/contact/ContactMethods";
import ContactForm from "@/components/contact/ContactForm";
import ContactSidebar from "@/components/contact/ContactSidebar";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-eemploi-primary via-eemploi-primary to-eemploi-secondary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Contactez notre
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                équipe d'experts
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Notre équipe dédiée est là pour vous accompagner dans votre réussite professionnelle. 
              Nous répondons à toutes vos questions dans les plus brefs délais.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Plusieurs façons de nous joindre
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez le canal qui vous convient le mieux pour une réponse rapide et personnalisée
            </p>
          </div>
          
          <ContactMethods />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-20">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            
            <div className="lg:col-span-1">
              <ContactSidebar />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
