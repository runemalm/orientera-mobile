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

/**
 * Determines if server messages are significantly different from local messages
 * requiring a full reset instead of an append
 */
const shouldResetMessages = (serverMessages: Message[], localMessages: Message[]): boolean => {
  // If server has no messages but client does, server was reset
  if (serverMessages.length === 0 && localMessages.length > 0) {
    console.log('Server has no messages but client does - resetting');
    return true;
  }

  // If server has fewer messages than local, it could be a reset or truncation
  if (serverMessages.length < localMessages.length) {
    // To differentiate between truncation and reset, check if the last server message
    // exists somewhere in the local history. If it does, it's likely truncation.
    if (serverMessages.length > 0) {
      const lastServerMsg = serverMessages[serverMessages.length - 1];
      
      // Try to find this message in the local history
      const foundInLocal = localMessages.some(localMsg => 
        localMsg.content === lastServerMsg.content && 
        localMsg.isBot === lastServerMsg.isBot
      );
      
      if (!foundInLocal) {
        console.log('Server has fewer messages and last message doesn\'t match any local - resetting');
        return true;
      } else {
        console.log('Server likely truncated history - no need to reset');
        return false;
      }
    }
    
    console.log('Server has no messages but client does - resetting');
    return true;
  }
  
  // Check if the most recent server message is completely unknown to local
  // This would indicate diverged histories
  if (serverMessages.length > 0 && localMessages.length > 0) {
    const lastServerMsg = serverMessages[serverMessages.length - 1];
    const messageExists = localMessages.some(msg => 
      msg.content === lastServerMsg.content && 
      msg.isBot === lastServerMsg.isBot
    );
    
    if (!messageExists) {
      console.log('Server has new messages not found in local history - potential reset');
      // Only reset if we can't find the last few server messages in our history
      // This helps avoid false resets
      const checkCount = Math.min(3, serverMessages.length);
      let unmatchedCount = 0;
      
      for (let i = 1; i <= checkCount; i++) {
        const serverMsg = serverMessages[serverMessages.length - i];
        const exists = localMessages.some(msg => 
          msg.content === serverMsg.content && 
          msg.isBot === serverMsg.isBot
        );
        
        if (!exists) {
          unmatchedCount++;
        }
      }
      
      // If multiple recent messages don't match, reset
      return unmatchedCount >= Math.min(2, checkCount);
    }
  }
  
  return false;
}

export const useAssistantChat = () => {
  // Use localStorage to persist messages instead of regular useState
  const [messages, setMessages] = useLocalStorage<Message[]>('assistant_chat_messages', []);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
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

          const serverFormattedMessages: Message[] = chats.map(msg => ({
            content: msg.content,
            isBot: msg.role === 'assistant'
          }));

          // Apply our synchronization logic
          if (shouldResetMessages(serverFormattedMessages, messages)) {
            console.log('Resetting chat history to match server state');
            setMessages(serverFormattedMessages);
          } else if (serverFormattedMessages.length > messages.length) {
            // If server has more messages, just update with the server version
            console.log('Server has more messages, updating local state');
            setMessages(serverFormattedMessages);
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
    } else {
      setIsConnected(false);
      establishConnection();
    }

    return () => {
      wsListeners = wsListeners.filter(listener => listener !== handleWebSocketEvent);
    };
  }, [messages, setMessages]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) {
      return;
    }

    // Add user message to UI immediately for better UX
    setMessages((prev: Message[]) => [...prev, { content: message, isBot: false }]);
    
    // Set waiting state to true when sending message
    setIsWaitingForResponse(true);
    
    // Show thinking state first for a random delay, then show typing indicator
    setIsThinking(true);
    simulateTypingDelay(() => {
      setIsThinking(false);
    });

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

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    isConnected,
    infoMessage,
    isWaitingForResponse,
    isThinking,
  };
};
