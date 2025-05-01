
import React, { useRef, useEffect, useState } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Send, MessageSquare, WifiOff, Info, LoaderCircle } from 'lucide-react';
import ChatMessage from '../components/assistant/ChatMessage';
import { useAssistantChat } from '../hooks/useAssistantChat';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../components/ui/popover';
import { ScrollArea } from '../components/ui/scroll-area';

const AssistantPage = () => {
  const { 
    messages, 
    inputValue, 
    setInputValue, 
    sendMessage, 
    isConnected, 
    infoMessage,
    isWaitingForResponse,
    isThinking
  } = useAssistantChat();
  
  const SHOW_INFO_MESSAGE = false;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Track previous messages length to determine if we should scroll
  const prevMessagesLengthRef = useRef<number>(0);
  
  // Only scroll when new messages are added or waiting/thinking status changes
  useEffect(() => {
    const hasNewMessages = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    // Only scroll if we have new messages or waiting/thinking status changes
    if ((hasNewMessages || isWaitingForResponse || isThinking) && shouldScrollToBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isWaitingForResponse, isThinking, shouldScrollToBottom]);

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
    // Ensure we scroll to bottom when user sends a new message
    setShouldScrollToBottom(true);
    sendMessage(inputValue);
  };

  // Info button component to pass to MobileLayout as action
  const InfoButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-3">
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
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <MobileLayout 
      title="Tävlingsassistenten"
      fullHeight
      action={<InfoButton />}
    >
      <div className="flex flex-col h-full">
        {SHOW_INFO_MESSAGE && infoMessage && (
          <div className="mx-4 mt-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 text-sm rounded">
            {infoMessage}
          </div>
        )}

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.content}
                isBot={message.isBot}
                avatar="/agents/nina/nina_small.png"
              />
            ))}
            
            {(isWaitingForResponse && !isThinking) && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img 
                      src="/agents/nina/nina_small.png" 
                      alt="Nina" 
                      className="object-cover h-full w-full"
                    />
                  </div>
                </div>
                <div className="flex-1 bg-muted rounded-lg p-3 min-w-[100px]">
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

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
              disabled={!inputValue.trim() || !isConnected || isWaitingForResponse}
            >
              {isWaitingForResponse ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AssistantPage;
