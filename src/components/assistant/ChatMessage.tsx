
import React from 'react';
import { MessageSquareCode, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  avatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, avatar }) => {
  // Dela upp meddelandet i rader och rendera dem
  const renderMessage = () => {
    return message.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      <div className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full`}>
        {isBot ? (
          <Avatar>
            <AvatarImage 
              src={avatar || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} 
              alt="Nina" 
            />
            <AvatarFallback>Nina</AvatarFallback>
          </Avatar>
        ) : (
          <User className="h-8 w-8" />
        )}
      </div>
      <div className={`flex-1 space-y-2 overflow-hidden rounded-md p-3 ${
        isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'
      }`}>
        <p className="leading-normal whitespace-pre-wrap">{renderMessage()}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
