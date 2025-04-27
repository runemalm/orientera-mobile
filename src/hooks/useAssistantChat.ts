
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

    setTimeout(() => {
      setMessages(prev => [...prev, {
        content: "Tack för ditt meddelande! 🌟\n\n" + 
                "Jag är jättehappy över att hjälpa dig hitta rätt tävling. " + 
                "Ju mer specifik du kan vara, desto bättre kan jag skräddarsy informationen för dig.\n\n" +
                "Berätta gärna mer! Letar du efter en viss typ av tävling? " +
                "Är du intresserad av något specifikt distrikt eller några särskilda datum? " +
                "Ju mer detaljer du kan ge, desto bättre kan jag guida dig! 🏃‍♀️🗺️",
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
