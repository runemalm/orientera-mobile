
import React, { useRef, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Send, MessageSquare, WifiOff, Info, LoaderCircle, RefreshCw } from 'lucide-react';
import ChatMessage from '../components/assistant/ChatMessage';
import { useAssistantChat } from '../hooks/useAssistantChat';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '../components/ui/popover';

const AssistantPage = () => {
  const { 
    messages, 
    inputValue, 
    setInputValue, 
    sendMessage,
    resetChat, 
    isConnected, 
    infoMessage,
    isWaitingForResponse,
    isThinking
  } = useAssistantChat();
  
  const SHOW_INFO_MESSAGE = false;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or thinking/waiting status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingForResponse, isThinking]);

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

  const handleResetChat = () => {
    if (!isConnected) {
      toast.error("Kan inte återställa chatten", {
        description: "Anslutningen till assistenten saknas",
        duration: 3000
      });
      return;
    }
    
    resetChat();
    toast.success("Chatten återställd", {
      duration: 2000
    });
  };

  // Reset button component to pass to MobileLayout as leftAction
  const ResetButton = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleResetChat}
      disabled={!isConnected || isWaitingForResponse}
    >
      <RefreshCw className="h-5 w-5" />
    </Button>
  );

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
      leftAction={<ResetButton />}
    >
      <div className="flex flex-col h-full">
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
