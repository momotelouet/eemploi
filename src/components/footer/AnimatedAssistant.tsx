
import { useChat } from '@/contexts/ChatContext';

const AnimatedAssistant = () => {
  const { openChat } = useChat();

  return (
    <div
      className="absolute bottom-0 right-4 md:right-8 z-20 group cursor-pointer animate-fade-in"
      onClick={openChat}
      aria-label="Ouvrir le chat avec l'assistant"
      style={{ animationDelay: '1s' }}
    >
      <div className="relative w-24 md:w-28">
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 whitespace-nowrap">
          <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-lg shadow-lg">
            Besoin d'aide ?
          </div>
        </div>
        <img
          src="https://i.gifer.com/origin/3b/3b4d4b1a451e04313b652a9d885a733e_w200.gif"
          alt="Chatbot assistant"
          className="w-full h-auto transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
};

export default AnimatedAssistant;
