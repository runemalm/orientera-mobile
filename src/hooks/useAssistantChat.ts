
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

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

// Last time we checked the connection status
let lastConnectionCheck = 0;
const CONNECTION_CHECK_THROTTLE = 2000; // Don't check more often than every 2 seconds

// Function to establish WebSocket connection
const establishConnection = () => {
  // Only proceed if we don't already have a connection and we're not already connecting
  if (globalWsConnection && (globalWsConnection.readyState === WebSocket.OPEN || globalWsConnection.readyState === WebSocket.CONNECTING)) {
    return;
  }

  if (isConnecting) {
    return;
  }

  // Throttle connection attempts
  const now = Date.now();
  if (now - lastConnectionCheck < CONNECTION_CHECK_THROTTLE) {
    return;
  }
  lastConnectionCheck = now;

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

// Check if WebSocket is actually connected
const isWebSocketConnected = () => {
  return globalWsConnection && globalWsConnection.readyState === WebSocket.OPEN;
};

// Simulate human-like delay for assistant responses
const simulateTypingDelay = (callback: () => void) => {
  // Generate a random delay between 500ms and 1500ms
  const randomDelay = Math.floor(Math.random() * 1000) + 500;
  setTimeout(callback, randomDelay);
};

// Default welcome message to show when chat is empty
const DEFAULT_WELCOME_MESSAGE: Message = {
  content: "Hej! Jag är Nina, din tävlingsassistent. Hur kan jag hjälpa dig med orienteringstävlingar idag?",
  isBot: true
};

// Initialize connection when the module loads
if (typeof window !== 'undefined') {
  establishConnection();

  // Setup visibility change listener to reconnect when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Check if the connection is actually closed before reconnecting
      if (!isWebSocketConnected()) {
        establishConnection();
      }
    }
  });
}

export const useAssistantChat = () => {
  // Use localStorage to persist messages instead of regular useState
  const [messages, setMessages] = useLocalStorage<Message[]>('assistant_chat_messages', []);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const initializedRef = useRef(false);
  const listenerIdRef = useRef<number>(Date.now());

  // Check if we need to show the welcome message
  useEffect(() => {
    // Only do this once per component mount and only if there are no messages
    if (!initializedRef.current && messages.length === 0) {
      initializedRef.current = true;
      setMessages([DEFAULT_WELCOME_MESSAGE]);
    }
  }, [messages, setMessages]);

  // Register this component as a listener
  useEffect(() => {
    const listenerId = listenerIdRef.current;
    
    const handleWebSocketEvent = (event: any) => {
      if (event.type === 'connection') {
        setIsConnected(event.status);
        
        // When connection is first established and there are no messages,
        // the server might not send anything initially
        if (event.status && messages.length === 0) {
          initializedRef.current = true;
          setMessages([DEFAULT_WELCOME_MESSAGE]);
        }
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

          // Only update messages if we have some from server
          if (chats.length > 0) {
            const formattedMessages: Message[] = chats.map(msg => ({
              content: msg.content,
              isBot: msg.role === 'assistant'
            }));

            // Just show the messages directly when we receive them
            setMessages(formattedMessages);
            initializedRef.current = true;
          } else if (!initializedRef.current) {
            // If server sent an empty message array, show default welcome
            initializedRef.current = true;
            setMessages([DEFAULT_WELCOME_MESSAGE]);
          }
          
          // Now that we have the response, stop showing the waiting indicators
          setIsThinking(false);
          setIsWaitingForResponse(false);
        } catch (error) {
          console.error('Error parsing message from server:', error);
          setIsWaitingForResponse(false);
          setIsThinking(false);
        }
      }
    };

    wsListeners.push(handleWebSocketEvent);
    
    // Check connection status immediately
    if (isWebSocketConnected()) {
      setIsConnected(true);
      
      // If connected but no messages, show default welcome
      if (messages.length === 0 && !initializedRef.current) {
        initializedRef.current = true;
        setMessages([DEFAULT_WELCOME_MESSAGE]);
      }
    } else {
      setIsConnected(false);
      establishConnection();
    }

    return () => {
      wsListeners = wsListeners.filter(listener => listener !== handleWebSocketEvent);
    };
  }, [setMessages, messages]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) {
      return;
    }

    // For normal messages, add to UI
    if (message !== "__RESET__") {
      // Add user message to UI immediately for better UX
      setMessages((prev: Message[]) => [...prev, { content: message, isBot: false }]);
      
      // Set waiting state to true when sending message
      setIsWaitingForResponse(true);
      
      // Show thinking state first for a random delay, then show typing indicator
      setIsThinking(true);
      simulateTypingDelay(() => {
        setIsThinking(false);
      });
    }

    // Ensure connection exists
    if (!isWebSocketConnected()) {
      establishConnection();
      return;
    }
    
    // Send message to server
    if (globalWsConnection) {
      globalWsConnection.send(message);
    }
    setInputValue('');
  }, [setMessages]);

  // Add a dedicated reset function that sends __RESET__ without showing it in the chat
  const resetChat = useCallback(() => {
    // Set waiting state, but don't show thinking animation
    setIsWaitingForResponse(true);
    
    // Ensure connection exists
    if (!isWebSocketConnected()) {
      establishConnection();
      return;
    }
    
    // Send reset command to server
    if (globalWsConnection) {
      globalWsConnection.send("__RESET__");
    }
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    resetChat,
    isConnected,
    infoMessage,
    isWaitingForResponse,
    isThinking,
  };
};
