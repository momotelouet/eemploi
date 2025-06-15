
import { useChat } from '@/contexts/ChatContext';
import { Bot } from 'lucide-react';

const AnimatedAssistant = () => {
  const { openChat } = useChat();

  return (
    <div
      className="absolute bottom-8 right-4 md:right-8 z-20 group cursor-pointer animate-fade-in"
      onClick={openChat}
      aria-label="Ouvrir le chat avec l'assistant"
      style={{ animationDelay: '1s' }}
    >
      <div className="relative">
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 whitespace-nowrap">
          <div className="bg-white text-gray-800 text-xs font-semibold px-3 py-2 rounded-lg shadow-lg">
            Besoin d'aide ?
          </div>
        </div>
        <div className="w-16 h-16 bg-eemploi-primary rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Bot className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default AnimatedAssistant;
