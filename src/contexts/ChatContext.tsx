const sendMessage = useCallback(async (content: string) => {
  if (!content.trim()) return;

  const userMessage: Message = { role: 'user', content };

  setMessages((prevMessages) => [...prevMessages, userMessage]);
  setIsLoading(true);

  try {
    const { data, error } = await supabase.functions.invoke('live-chat', {
      body: { messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })) },
    });

    if (error) throw error;

    const assistantMessage: Message = { role: 'assistant', content: data.response };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
  } catch (error: any) {
    console.error('Error sending message:', error);
    toast({
      title: 'Erreur',
      description: "Une erreur s'est produite lors de l'envoi du message.",
      variant: 'destructive',
    });
    // Ne pas revert, ou gérer un rollback plus sophistiqué si besoin
  } finally {
    setIsLoading(false);
  }
}, [toast, messages]);
