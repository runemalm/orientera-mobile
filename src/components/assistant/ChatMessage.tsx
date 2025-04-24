
import React from 'react';
import { MessageSquareCode, User } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot }) => {
  return (
    <div className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border ${
        isBot ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        {isBot ? <MessageSquareCode className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className={`flex-1 space-y-2 overflow-hidden rounded-md p-3 ${
        isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'
      }`}>
        <p className="leading-normal">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
