
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import { Send } from 'lucide-react';
import ChatMessage from '../components/assistant/ChatMessage';
import { useAssistantChat } from '../hooks/useAssistantChat';
import { Button } from '../components/ui/button';

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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isBot={message.isBot}
              avatar="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            />
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Skriv ett meddelande..."
              className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Button 
              type="submit"
              size="icon"
              className="rounded-full"
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
