
const Newsletter = () => {
    return (
        <div className="border-t border-gray-700 pt-8 mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Restez informé des dernières opportunités
            </h3>
            <p className="text-gray-300 mb-6">
              Recevez chaque semaine les meilleures offres d'emploi directement dans votre boîte mail
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:border-eemploi-primary focus:ring-1 focus:ring-eemploi-primary transition-all duration-300 hover:border-gray-500"
              />
              <button className="px-6 py-3 bg-eemploi-primary text-white rounded-lg hover:bg-eemploi-primary/90 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                S'abonner
              </button>
            </div>
          </div>
        </div>
    );
};

export default Newsletter;
