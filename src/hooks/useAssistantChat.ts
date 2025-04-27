
import { useState, useEffect } from 'react';

interface Message {
  content: string;
  isBot: boolean;
}

export const useAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setMessages([
      {
        content: "Hej! 👋\n\nJag är Nina och jag hjälper dig med frågor om orienteringstävlingar. " + 
                 "Vad vill du veta mer om?",
        isBot: true
      }
    ]);
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { content: message, isBot: false }]);

    // Dynamically generate a response based on the first message
    const firstMessageResponse = () => {
      const lowercaseMessage = message.toLowerCase();
      
      if (lowercaseMessage.includes('tävling') || lowercaseMessage.includes('hitta')) {
        return "Absolut! Jag kan hjälpa dig att hitta och filtrera tävlingar som passar just dig. " + 
               "Vill du veta mer om kommande tävlingar i ditt område eller har du specifika önskemål?";
      }

      if (lowercaseMessage.includes('anmälan') || lowercaseMessage.includes('delta')) {
        return "Anmälningsprocessen kan variera, men jag hjälper dig gärna! " + 
               "Berätta mer om vilken tävling du är intresserad av, så guidar jag dig genom stegen.";
      }

      if (lowercaseMessage.includes('resultat') || lowercaseMessage.includes('placering')) {
        return "Resultatsidor kan vara krångliga, men jag kan hjälpa dig att hitta rätt. " + 
               "Har du en specifik tävling vars resultat du vill se?";
      }

      // Default fallback response
      return "Tack för ditt meddelande! Jag är redo att hjälpa dig med det mesta som rör orienteringstävlingar. " + 
             "Berätta mer om vad du funderar på så ser vi hur jag kan stödja dig.";
    };

    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: firstMessageResponse(),
        isBot: true
      }]);
    }, 1000);

    setInputValue('');
  };

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage
  };
};

