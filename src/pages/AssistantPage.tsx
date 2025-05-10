
import React, { useRef, useEffect } from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Send, MessageSquare, WifiOff, Info, LoaderCircle, SquarePen } from 'lucide-react';
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
    retryLastMessage,
    isConnected, 
    infoMessage,
    isWaitingForResponse,
    agentActivityText
  } = useAssistantChat();
  
  const SHOW_INFO_MESSAGE = false;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change or thinking/waiting status changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaitingForResponse, agentActivityText]);

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
  };

  // Reset button component to pass to MobileLayout as leftAction
  const ResetButton = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleResetChat}
      disabled={!isConnected || isWaitingForResponse || agentActivityText !== null}
    >
      <SquarePen className="h-5 w-5" />
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
      title="Assistent"
      fullHeight
      action={<InfoButton />}
      leftAction={<ResetButton />}
    >
      <div className="flex flex-col h-full">

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => {
            const isLast = index === messages.length - 1;
            const showRetry = isLast && !message.isBot && message.error;

            return (
              <ChatMessage
                key={index}
                message={message.content}
                isBot={message.isBot}
                avatar={message.isBot ? '/agents/nina/nina_small.png' : '/user-avatar.svg'}
                isLast={isLast}
                error={message.error}
                onRetry={retryLastMessage}
              />
            );
          })}

          {agentActivityText && (
            <div className="text-sm italic text-muted-foreground px-4 py-1">
              {agentActivityText}
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
              disabled={!inputValue.trim() || !isConnected || isWaitingForResponse || agentActivityText !== null}
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
