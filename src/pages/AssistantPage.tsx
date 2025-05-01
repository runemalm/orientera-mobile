
import React, { useRef, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Send, MessageSquare, WifiOff } from 'lucide-react';
import ChatMessage from '../components/assistant/ChatMessage';
import { useAssistantChat } from '../hooks/useAssistantChat';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';

const AssistantPage = () => {
  const { messages, inputValue, setInputValue, sendMessage, isConnected, infoMessage } = useAssistantChat();
  const SHOW_INFO_MESSAGE = false;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show toast when connection status changes
  useEffect(() => {
    if (!isConnected) {
      toast.error("Anslutningen till assistenten bröts", {
        description: "Försöker återansluta...",
        duration: 3000
      });
    }
  }, [isConnected]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error("Kan inte skicka meddelande", { 
        description: "Anslutningen till assistenten saknas",
        duration: 3000
      });
      return;
    }
    sendMessage(inputValue);
  };

  return (
    <MobileLayout 
      title="Tävlingsassistenten"
      fullHeight
    >
      <div className="flex flex-col h-full">
        {messages.length === 0 && (
          <Card className="mx-4 mt-4 bg-primary/5 border-primary/20">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary font-medium">
                <MessageSquare className="h-5 w-5" />
                <h2>Om assistenten</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nina är din personliga tävlingsassistent som hjälper dig hitta och förstå 
                information om orienteringstävlingar. Hon kan svara på frågor om tävlingar, 
                anmälningar, resultat och mycket annat. Nina är under utveckling och blir 
                hela tiden bättre på att hjälpa dig.
              </p>
            </CardContent>
          </Card>
        )}

        {SHOW_INFO_MESSAGE && infoMessage && (
          <div className="mx-4 mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 text-sm rounded">
            {infoMessage}
          </div>
        )}


        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isBot={message.isBot}
              avatar="/agents/nina/nina_small.png"
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {!isConnected && (
          <div className="px-4 py-2 bg-destructive/10 text-destructive text-sm flex items-center justify-center gap-2">
            <WifiOff size={16} />
            <span>Anslutning saknas. Försöker återansluta...</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-4 border-t bg-background shadow-sm">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Ställ en fråga..."
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isConnected}
            />
            <Button 
              type="submit"
              size="icon"
              className="rounded-full shadow-sm"
              disabled={!inputValue.trim() || !isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AssistantPage;
