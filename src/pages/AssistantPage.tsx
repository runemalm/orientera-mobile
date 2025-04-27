
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Send, MessageSquare } from 'lucide-react';
import ChatMessage from '../components/assistant/ChatMessage';
import { useAssistantChat } from '../hooks/useAssistantChat';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const AssistantPage = () => {
  const { messages, inputValue, setInputValue, sendMessage } = useAssistantChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <MobileLayout 
      title="Tävlingsassistent Nina"
      fullHeight
    >
      <div className="flex flex-col h-full">
        {messages.length === 1 && (
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

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isBot={message.isBot}
              avatar="/agents/nina/nina_small.png"
            />
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t bg-background shadow-sm">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Ställ en fråga..."
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
              type="submit"
              size="icon"
              className="rounded-full shadow-sm"
              disabled={!inputValue.trim()}
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
