
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

// Singleton WebSocket instance - shared across the entire app
let globalWsConnection: WebSocket | null = null;
let wsListeners: Array<(data: any) => void> = [];
let isConnecting = false;
let connectionAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

// Simplified WebSocket configuration
const WEBSOCKET_BASE_URL = import.meta.env.VITE_WEBSOCKET_BASE_URL || 'https://orientera-mas.delightfulisland-78f87004.northeurope.azurecontainerapps.io/ws';

// Function to get user ID from localStorage
const getUserId = () => {
  let userId = localStorage.getItem('chat_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chat_user_id', userId);
  }
  return userId;
};

// Function to establish WebSocket connection
const establishConnection = () => {
  if (globalWsConnection && (globalWsConnection.readyState === WebSocket.OPEN || globalWsConnection.readyState === WebSocket.CONNECTING)) {
    return;
  }

  if (isConnecting) {
    return;
  }

  isConnecting = true;
  const userId = getUserId();
  const wsUrl = `${WEBSOCKET_BASE_URL}/${userId}`;
  console.log('Connecting to WebSocket:', wsUrl);

  try {
    globalWsConnection = new WebSocket(wsUrl);

    globalWsConnection.onopen = () => {
      console.log('Connected to chat server');
      isConnecting = false;
      connectionAttempts = 0;
      wsListeners.forEach(listener => listener({ type: 'connection', status: true }));
    };

    globalWsConnection.onmessage = (event) => {
      wsListeners.forEach(listener => listener({ type: 'message', data: event.data }));
    };

    globalWsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
      isConnecting = false;
      wsListeners.forEach(listener => listener({ type: 'connection', status: false }));
    };

    globalWsConnection.onclose = () => {
      console.log('Disconnected from chat server');
      globalWsConnection = null;
      isConnecting = false;
      wsListeners.forEach(listener => listener({ type: 'connection', status: false }));

      // Attempt to reconnect with exponential backoff
      if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
        connectionAttempts++;
        const delay = RECONNECT_DELAY * Math.pow(2, connectionAttempts - 1);
        setTimeout(() => {
          establishConnection();
        }, delay);
      }
    };
  } catch (error) {
    console.error('Failed to establish WebSocket connection:', error);
    isConnecting = false;
    wsListeners.forEach(listener => listener({ type: 'connection', status: false }));
  }
};

// Initialize connection when the module loads
if (typeof window !== 'undefined') {
  establishConnection();

  // Setup visibility change listener to reconnect when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && (!globalWsConnection || globalWsConnection.readyState !== WebSocket.OPEN)) {
      establishConnection();
    }
  });
}

export const useAssistantChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const listenerIdRef = useRef<number>(Date.now());

  // Register this component as a listener
  useEffect(() => {
    const listenerId = listenerIdRef.current;
    
    const handleWebSocketEvent = (event: any) => {
      if (event.type === 'connection') {
        setIsConnected(event.status);
      } else if (event.type === 'message') {
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
      }
    };

    wsListeners.push(handleWebSocketEvent);
    
    // Check connection status immediately
    if (globalWsConnection && globalWsConnection.readyState === WebSocket.OPEN) {
      setIsConnected(true);
    } else {
      setIsConnected(false);
      establishConnection();
    }

    return () => {
      wsListeners = wsListeners.filter(listener => listener !== handleWebSocketEvent);
    };
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) {
      return;
    }

    // Ensure connection exists
    if (!globalWsConnection || globalWsConnection.readyState !== WebSocket.OPEN) {
      establishConnection();
      // Add message to UI but inform user that it will be sent once connected
      setMessages(prev => [...prev, { content: message, isBot: false }]);
      toast.info("Ansluter till assistenten...", {
        description: "Ditt meddelande skickas så snart anslutningen är återupprättad.",
        duration: 3000
      });
      return;
    }

    // Add user message to UI immediately for better UX
    setMessages(prev => [...prev, { content: message, isBot: false }]);
    
    // Send message to server
    globalWsConnection.send(message);
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
