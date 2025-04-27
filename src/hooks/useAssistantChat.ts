
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
        content: "Hej! 👋\n\n" + 
                "Tack för din fråga! Jag är faktiskt ganska ny här och håller fortfarande på att lära mig alla detaljer om tävlingarna. " +
                "Just den här frågan känner jag mig tyvärr inte helt säker på än.\n\n" +
                "Skulle du kunna testa att komma tillbaka om några dagar? Då hoppas jag att jag har hunnit sätta mig in i det bättre " +
                "och kan ge dig ett mer hjälpsamt svar! 💪\n\n" +
                "Under tiden, finns det något annat jag kan hjälpa till med? 😊",
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
