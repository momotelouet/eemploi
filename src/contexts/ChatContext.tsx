
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  messages: Message[];
  sendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour! Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = { role: 'user', content };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('live-chat', {
        body: { messages: currentMessages.map(({role, content}) => ({role, content})) },
      });

      if (error) throw error;
      
      const assistantMessage: Message = { role: 'assistant', content: data.response };
      setMessages([...currentMessages, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erreur',
        description: "Une erreur s'est produite lors de l'envoi du message.",
        variant: 'destructive',
      });
      setMessages(messages); // Revert messages on error
    } finally {
      setIsLoading(false);
    }
  }, [messages, toast]);
  

  const value = {
    isOpen,
    openChat,
    closeChat,
    messages,
    sendMessage,
    isLoading,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
