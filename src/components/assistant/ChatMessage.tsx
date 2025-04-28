
import React from 'react';
import { MessageSquareCode, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  avatar?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, avatar }) => {
  // Parse message to render links and formatting properly
  const renderMessage = () => {
    // Split the message into lines first
    return message.split('\n').map((line, lineIndex) => {
      // Regular expression to match markdown links: [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      // Regular expression to match bold text: **text**
      const boldRegex = /\*\*([^*]+)\*\*/g;
      
      // If no links or bold text in this line, just return the text with line break
      if (!linkRegex.test(line) && !boldRegex.test(line)) {
        return (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < message.split('\n').length - 1 && <br />}
          </React.Fragment>
        );
      }
      
      // Process the line to handle both links and bold text
      let lastIndex = 0;
      const parts = [];
      let partIndex = 0;
      
      // First process the line to extract and format links
      let processedLine = line;
      const linkMatches = [];
      const placeholders = [];
      
      // Extract links and replace with placeholders
      let linkMatch;
      linkRegex.lastIndex = 0;
      while ((linkMatch = linkRegex.exec(line)) !== null) {
        linkMatches.push({
          placeholder: `__LINK_${linkMatches.length}__`,
          text: linkMatch[1],
          url: linkMatch[2],
          startIndex: linkMatch.index,
          endIndex: linkMatch.index + linkMatch[0].length
        });
        
        processedLine = processedLine.replace(
          linkMatch[0], 
          `__LINK_${linkMatches.length - 1}__`
        );
      }
      
      // Process the line for bold text
      let processedWithBold = '';
      lastIndex = 0;
      let boldMatch;
      boldRegex.lastIndex = 0;
      
      while ((boldMatch = boldRegex.exec(processedLine)) !== null) {
        // Add text before the bold
        processedWithBold += processedLine.substring(lastIndex, boldMatch.index);
        
        // Add placeholder for bold text
        const boldPlaceholder = `__BOLD_${placeholders.length}__`;
        placeholders.push({
          type: 'bold',
          content: boldMatch[1]
        });
        processedWithBold += boldPlaceholder;
        
        lastIndex = boldMatch.index + boldMatch[0].length;
      }
      
      // Add any remaining text
      processedWithBold += processedLine.substring(lastIndex);
      
      // Now build the final output with both links and bold text
      const finalParts = [];
      let currentText = processedWithBold;
      
      // Replace bold placeholders with actual JSX
      placeholders.forEach((placeholder, idx) => {
        const parts = currentText.split(`__BOLD_${idx}__`);
        if (parts.length > 1) {
          finalParts.push(parts[0]);
          finalParts.push(
            <strong key={`bold-${lineIndex}-${idx}`} className="font-bold">
              {placeholder.content}
            </strong>
          );
          currentText = parts.slice(1).join(`__BOLD_${idx}__`);
        }
      });
      finalParts.push(currentText);
      
      // Restore links
      const result = finalParts.map((part, idx) => {
        if (typeof part !== 'string') {
          return part; // Already a React element (bold)
        }
        
        const linkParts = [];
        let lastLinkIndex = 0;
        
        // Replace link placeholders with actual links
        linkMatches.forEach((link, linkIdx) => {
          const placeholder = `__LINK_${linkIdx}__`;
          const placeholderIndex = part.indexOf(placeholder, lastLinkIndex);
          
          if (placeholderIndex !== -1) {
            // Add text before the link
            if (placeholderIndex > lastLinkIndex) {
              linkParts.push(part.substring(lastLinkIndex, placeholderIndex));
            }
            
            // Add the link
            linkParts.push(
              <a 
                key={`link-${lineIndex}-${linkIdx}`}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`underline ${isBot ? 'text-blue-600 hover:text-blue-800' : 'text-blue-300 hover:text-blue-100'}`}
              >
                {link.text}
              </a>
            );
            
            lastLinkIndex = placeholderIndex + placeholder.length;
          }
        });
        
        // Add remaining text
        if (lastLinkIndex < part.length) {
          linkParts.push(part.substring(lastLinkIndex));
        }
        
        return linkParts;
      });
      
      // Create properly keyed elements for the flattened array
      const elements = [];
      const flatResult = result.flat();
      
      flatResult.forEach((item, itemIdx) => {
        if (React.isValidElement(item)) {
          elements.push(item);
        } else if (typeof item === 'string') {
          elements.push(item);
        }
      });
      
      return (
        <React.Fragment key={lineIndex}>
          {elements}
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
