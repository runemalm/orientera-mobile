
import { useState, useEffect, useCallback, useRef } from 'react';

interface Message {
  content: string;
  isBot: boolean;
}

interface WebSocketMessage {
  role: string;      // "user", "assistant", "info"
  content: string;
  date: string;
}

// Simplified WebSocket configuration
const WEBSOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET_BASE_URL || 'https://orientera-mas.delightfulisland-78f87004.northeurope.azurecontainerapps.io/ws';

export const useAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Generate a simple unique user ID if not already in localStorage
  const getUserId = useCallback(() => {
    let userId = localStorage.getItem('chat_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('chat_user_id', userId);
    }
    return userId;
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const userId = getUserId();
    
    // Create WebSocket URL with user ID
    const wsUrl = `${WEBSOCKET_BASE_URL}/${userId}`;
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to chat server');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const messagesFromServer: WebSocketMessage[] = JSON.parse(event.data);

        const info = messagesFromServer.find(m => m.role === 'info');
        const chats = messagesFromServer.filter(m => m.role !== 'info');

        if (info) {
          setInfoMessage(info.content);
        } else {
          setInfoMessage(null);
        }

        const formattedMessages: Message[] = chats.map(msg => ({
          content: msg.content,
          isBot: msg.role === 'assistant'
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error parsing message from server:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('Disconnected from chat server');
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [getUserId]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // Add user message to UI immediately for better UX
    setMessages(prev => [...prev, { content: message, isBot: false }]);
    
    // Send message to server
    wsRef.current.send(message);
    setInputValue('');
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isConnected,
    infoMessage,
  };
};
