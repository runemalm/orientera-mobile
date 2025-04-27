
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
        content: "Hej! 👋\n\n" +
                 "Jag är Nina, din personliga tävlingsassistent. Hur kan jag hjälpa dig idag?\n\n" +
                 "Jag kan hjälpa dig med:\n" +
                 "• Hitta och filtrera tävlingar som passar dig\n" +
                 "• Svara på frågor om specifika tävlingar\n" +
                 "• Förklara anmälningsprocessen\n" +
                 "• Ge information om starttider och resultat\n" +
                 "• Hjälpa till med andra tävlingsrelaterade frågor\n\n" +
                 "Ställ gärna din fråga så ska jag göra mitt bästa för att hjälpa dig! 😊",
        isBot: true
      }
    ]);
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { content: message, isBot: false }]);

    // Simulera en mer support-orienterad respons
    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "Tack för din fråga! Jag förstår att du vill veta mer om " + 
                "tävlingar. Just nu håller vi på att utveckla mina funktioner, " +
                "men jag ska göra mitt bästa för att hjälpa dig.\n\n" +
                "Kan du berätta lite mer specifikt vad du skulle vilja veta? " +
                "Till exempel om du letar efter en specifik typ av tävling eller " +
                "har frågor om en särskild tävling?",
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
