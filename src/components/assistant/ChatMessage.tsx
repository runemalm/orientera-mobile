
import React from 'react';
import { MessageSquareCode, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  avatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, avatar }) => {
  // Parse message to render links properly
  const renderMessage = () => {
    // Split the message into lines first
    return message.split('\n').map((line, lineIndex) => {
      // Regular expression to match markdown links: [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      
      // If no links in this line, just return the text with line break
      if (!linkRegex.test(line)) {
        return (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < message.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      }
      
      // If we have links, we need to split the text and render links properly
      let lastIndex = 0;
      const parts = [];
      let match;
      let partIndex = 0;
      
      // Reset regex to start from beginning
      linkRegex.lastIndex = 0;
      
      while ((match = linkRegex.exec(line)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(
            <span key={`${lineIndex}-${partIndex++}`}>
              {line.substring(lastIndex, match.index)}
            </span>
          );
        }
        
        // Add the link
        parts.push(
          <a 
            key={`${lineIndex}-${partIndex++}`}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline ${isBot ? 'text-blue-600 hover:text-blue-800' : 'text-blue-300 hover:text-blue-100'}`}
          >
            {match[1]}
          </a>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Add any remaining text after the last link
      if (lastIndex < line.length) {
        parts.push(
          <span key={`${lineIndex}-${partIndex++}`}>
            {line.substring(lastIndex)}
          </span>
        );
      }
      
      return (
        <React.Fragment key={lineIndex}>
          {parts}
          {lineIndex < message.split('\n').length - 1 && <br />}
        </React.Fragment>
      );
    });
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
