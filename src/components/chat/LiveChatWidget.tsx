
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const LiveChatWidget = () => {
    const { isOpen, closeChat, messages, sendMessage, isLoading } = useChat();
    const [input, setInput] = useState('');
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTop = scrollAreaViewportRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        sendMessage(input);
        setInput('');
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Card className="fixed bottom-4 right-4 w-full max-w-sm h-[600px] shadow-2xl rounded-lg z-50 flex flex-col bg-background border">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                <CardTitle className="text-lg font-semibold">Support e-emploi</CardTitle>
                <Button variant="ghost" size="icon" onClick={closeChat} className="rounded-full">
                    <X className="w-5 h-5" />
                </Button>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                    <div className="p-4 space-y-4" ref={scrollAreaViewportRef}>
                        {messages.map((message, index) => (
                            <div key={index} className={cn('flex w-full', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                <div className={cn(
                                    'p-3 rounded-2xl max-w-[80%]',
                                    message.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-none'
                                        : 'bg-muted rounded-bl-none'
                                )}>
                                    <p className="text-sm break-words">{message.content}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="p-3 rounded-2xl max-w-xs bg-muted rounded-bl-none flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <p className="text-sm">Écrit...</p>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Posez votre question..."
                        autoComplete="off"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
};

export default LiveChatWidget;
