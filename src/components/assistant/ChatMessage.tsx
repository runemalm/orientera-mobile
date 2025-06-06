import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  avatar?: string;
  error?: { message: string };
  isLast?: boolean;
  onRetry?: () => void;
}

interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, avatar, error, isLast, onRetry }) => {
  return (
    <div className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
      <div className="flex-shrink-0 mt-0.5">
        {isBot ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar || "/nina.png"} alt="Nina" className="object-cover" />
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
        ) : (
          <div className="bg-primary/20 h-8 w-8 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-1 max-w-[75%]">
        <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
          isBot ? 'bg-muted text-gray-800' : 'bg-primary/10 text-primary'
        }`}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a 
                  {...props} 
                  className={`underline ${isBot ? 'text-blue-600 hover:text-blue-800' : 'text-blue-300 hover:text-blue-100'}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                />
              ),
              strong: ({ node, ...props }) => (
                <strong {...props} className="font-bold" />
              ),
              p: ({ node, ...props }) => (
                <p {...props} className="mb-2 last:mb-0" />
              ),
              ul: ({ node, ...props }) => (
                <ul {...props} className="list-disc pl-5 mb-2" />
              ),
              ol: ({ node, ...props }) => (
                <ol {...props} className="list-decimal pl-5 mb-2" />
              ),
              li: ({ node, ...props }) => (
                <li {...props} className="mb-1" />
              ),
              h1: ({ node, ...props }) => (
                <h1 {...props} className="text-lg font-bold mb-2" />
              ),
              h2: ({ node, ...props }) => (
                <h2 {...props} className="text-base font-bold mb-2" />
              ),
              h3: ({ node, ...props }) => (
                <h3 {...props} className="text-sm font-bold mb-1" />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote {...props} className={`pl-3 border-l-2 ${isBot ? 'border-gray-400' : 'border-blue-300'} italic`} />
              ),
              code: ({ node, inline, ...props }: CodeProps) => (
                inline ? 
                  <code {...props} className={`px-1 py-0.5 rounded ${isBot ? 'bg-gray-200' : 'bg-blue-800'}`} /> : 
                  <code {...props} className={`block p-2 rounded ${isBot ? 'bg-gray-200' : 'bg-blue-800'} whitespace-pre-wrap`} />
              )
            }}
          >
            {message}
          </ReactMarkdown>

          {!isBot && error && (
            <div className="mt-2 border-t border-gray-200 pt-2 text-sm text-red-700 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">⚠️</span> {error.message}
              </span>
              {isLast && onRetry && (
                <button
                  onClick={onRetry}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Försök igen
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
