
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
const establishConnection = (onConnected?: () => void) => {
  // Only proceed if we don't already have a connection and we're not already connecting
  if (globalWsConnection && (globalWsConnection.readyState === WebSocket.OPEN || globalWsConnection.readyState === WebSocket.CONNECTING)) {
    // If we already have a connection and it's open, call the onConnected callback
    if (globalWsConnection.readyState === WebSocket.OPEN && onConnected) {
      onConnected();
    }
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
      
      // Execute the onConnected callback if provided
      if (onConnected) {
        onConnected();
      }
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

// We're removing the automatic connection initialization here
// It will instead be established in the hook when listeners are ready

export const useAssistantChat = () => {
  // Use localStorage to persist messages instead of regular useState
  const [messages, setMessages] = useLocalStorage<Message[]>('assistant_chat_messages', []);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const listenerIdRef = useRef<number>(Date.now());
  const listenersRegisteredRef = useRef<boolean>(false);

  // Register this component as a listener and establish connection afterward
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

          // Just show the messages directly when we receive them
          setMessages(formattedMessages);
          
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

    // Add listener to the wsListeners array
    wsListeners.push(handleWebSocketEvent);
    listenersRegisteredRef.current = true;
    
    // Now establish the connection only AFTER we've registered the listeners
    establishConnection(() => {
      console.log('Connection established after listeners were registered');
    });

    return () => {
      // Remove the listener when the component unmounts
      wsListeners = wsListeners.filter(listener => listener !== handleWebSocketEvent);
      listenersRegisteredRef.current = false;
    };
  }, [setMessages]);

  // Effect to handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only reconnect if listeners are registered and connection is closed
        if (listenersRegisteredRef.current && !isWebSocketConnected()) {
          establishConnection();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
      // Register a one-time listener that will send the message once connected
      const oneShotListener = (event: any) => {
        if (event.type === 'connection' && event.status === true) {
          // Connection is established, send the message
          if (globalWsConnection) {
            globalWsConnection.send(message);
          }
          // Remove this one-time listener
          wsListeners = wsListeners.filter(listener => listener !== oneShotListener);
        }
      };
      
      // Add the one-time listener
      wsListeners.push(oneShotListener);
      
      // Attempt to establish connection
      establishConnection();
      return;
    }
    
    // Send message to server if connection exists
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
      // Similar approach as sendMessage - register a one-time listener
      const oneShotListener = (event: any) => {
        if (event.type === 'connection' && event.status === true) {
          if (globalWsConnection) {
            globalWsConnection.send("__RESET__");
          }
          wsListeners = wsListeners.filter(listener => listener !== oneShotListener);
        }
      };
      
      wsListeners.push(oneShotListener);
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
