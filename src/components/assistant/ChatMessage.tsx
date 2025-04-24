
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
        {index < message.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      <div className="flex-shrink-0 mt-0.5">
        {isBot ? (
          <Avatar className="h-8 w-8">
            <AvatarImage 
              src={avatar || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"} 
              alt="Nina" 
              className="object-cover"
            />
            <AvatarFallback>Nina</AvatarFallback>
          </Avatar>
        ) : (
          <div className="bg-primary h-8 w-8 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
        )}
      </div>
      <div className={`flex-1 space-y-2 overflow-hidden rounded-lg p-3 ${
        isBot ? 'bg-muted' : 'bg-primary text-primary-foreground'
      }`}>
        <p className="leading-relaxed whitespace-pre-wrap">{renderMessage()}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
