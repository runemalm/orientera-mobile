
import { useState, useEffect } from 'react';

interface Message {
  content: string;
  isBot: boolean;
}

export const useAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Lägg till välkomstmeddelande när chatten initieras
    setMessages([
      {
        content: "Hej! Jag är din tävlingsassistent. Jag kan hjälpa dig med att:\n\n" +
                 "• Söka information om tävlingar\n" +
                 "• Hantera dina tävlingsanmälningar\n" +
                 "• Svara på frågor om kommande tävlingar\n\n" +
                 "Vad kan jag hjälpa dig med idag?",
        isBot: true
      }
    ]);
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Lägg till användarens meddelande
    setMessages(prev => [...prev, { content: message, isBot: false }]);

    // Här kan vi senare implementera koppling till en AI-tjänst
    // För nu, svara med ett enkelt meddelande
    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "Jag förstår att du vill veta mer om tävlingar. Just nu håller vi på att utveckla min funktionalitet, men snart kommer jag kunna hjälpa dig med alla dina tävlingsrelaterade frågor!",
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
