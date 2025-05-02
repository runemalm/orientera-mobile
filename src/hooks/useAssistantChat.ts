
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
  console.log(`[ChatDebug] Getting user ID: ${userId ? userId : 'none found, will create new'}`);
  
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chat_user_id', userId);
    console.log(`[ChatDebug] Created new user ID: ${userId}`);
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
    console.log('[ChatDebug] Connection already exists or is connecting, not establishing a new one');
    return;
  }

  if (isConnecting) {
    console.log('[ChatDebug] Already attempting to connect, skipping duplicate attempt');
    return;
  }

  // Throttle connection attempts
  const now = Date.now();
  if (now - lastConnectionCheck < CONNECTION_CHECK_THROTTLE) {
    console.log('[ChatDebug] Connection check throttled');
    return;
  }
  lastConnectionCheck = now;

  isConnecting = true;
  const userId = getUserId();
  const wsUrl = `${WEBSOCKET_BASE_URL}/${userId}`;
  console.log('[ChatDebug] Attempting to connect to WebSocket:', wsUrl);

  try {
    globalWsConnection = new WebSocket(wsUrl);

    globalWsConnection.onopen = () => {
      console.log('[ChatDebug] Successfully connected to chat server');
      isConnecting = false;
      connectionAttempts = 0;
      wsListeners.forEach(listener => {
        console.log('[ChatDebug] Notifying listener about successful connection');
        listener({ type: 'connection', status: true });
      });
    };

    globalWsConnection.onmessage = (event) => {
      console.log('[ChatDebug] Received message from server:', event.data.substring(0, 100) + '...');
      wsListeners.forEach(listener => listener({ type: 'message', data: event.data }));
    };

    globalWsConnection.onerror = (error) => {
      console.error('[ChatDebug] WebSocket error:', error);
      isConnecting = false;
      wsListeners.forEach(listener => listener({ type: 'connection', status: false }));
    };

    globalWsConnection.onclose = () => {
      console.log('[ChatDebug] Disconnected from chat server');
      globalWsConnection = null;
      isConnecting = false;
      wsListeners.forEach(listener => listener({ type: 'connection', status: false }));

      // Attempt to reconnect with exponential backoff
      if (connectionAttempts < MAX_RECONNECT_ATTEMPTS) {
        connectionAttempts++;
        const delay = RECONNECT_DELAY * Math.pow(2, connectionAttempts - 1);
        console.log(`[ChatDebug] Attempting to reconnect in ${delay}ms (attempt ${connectionAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
        setTimeout(() => {
          establishConnection();
        }, delay);
      } else {
        console.log('[ChatDebug] Max reconnect attempts reached, giving up');
      }
    };
  } catch (error) {
    console.error('[ChatDebug] Failed to establish WebSocket connection:', error);
    isConnecting = false;
    wsListeners.forEach(listener => listener({ type: 'connection', status: false }));
  }
};

// Check if WebSocket is actually connected
const isWebSocketConnected = () => {
  const isConnected = globalWsConnection && globalWsConnection.readyState === WebSocket.OPEN;
  console.log(`[ChatDebug] WebSocket connection status: ${isConnected ? 'connected' : 'disconnected'}`);
  return isConnected;
};

// Simulate human-like delay for assistant responses
const simulateTypingDelay = (callback: () => void) => {
  // Generate a random delay between 500ms and 1500ms
  const randomDelay = Math.floor(Math.random() * 1000) + 500;
  console.log(`[ChatDebug] Simulating typing delay: ${randomDelay}ms`);
  setTimeout(callback, randomDelay);
};

// Initialize connection when the module loads
if (typeof window !== 'undefined') {
  console.log('[ChatDebug] Initializing chat module');
  establishConnection();

  // Setup visibility change listener to reconnect when page becomes visible
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('[ChatDebug] Page became visible, checking WebSocket connection');
      // Check if the connection is actually closed before reconnecting
      if (!isWebSocketConnected()) {
        console.log('[ChatDebug] Connection is closed, attempting to reconnect');
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
  const listenerIdRef = useRef<number>(Date.now());

  console.log('[ChatDebug] useAssistantChat hook initialized');
  console.log('[ChatDebug] Initial messages from localStorage:', messages);

  // Register this component as a listener
  useEffect(() => {
    const listenerId = listenerIdRef.current;
    console.log('[ChatDebug] Setting up WebSocket listener with ID:', listenerId);
    
    const handleWebSocketEvent = (event: any) => {
      if (event.type === 'connection') {
        console.log(`[ChatDebug] Connection status changed to: ${event.status}`);
        setIsConnected(event.status);
      } else if (event.type === 'message') {
        try {
          console.log('[ChatDebug] Processing message from server');
          const messagesFromServer: WebSocketMessage[] = JSON.parse(event.data);
          console.log('[ChatDebug] Parsed messages from server:', messagesFromServer);

          const info = messagesFromServer.find(m => m.role === 'info');
          const chats = messagesFromServer.filter(m => m.role !== 'info');

          if (info) {
            console.log('[ChatDebug] Found info message:', info.content);
            setInfoMessage(info.content);
          } else {
            console.log('[ChatDebug] No info message found');
            setInfoMessage(null);
          }

          const formattedMessages: Message[] = chats.map(msg => ({
            content: msg.content,
            isBot: msg.role === 'assistant'
          }));

          console.log('[ChatDebug] Formatted messages to update localStorage:', formattedMessages);
          
          // Compare current messages with new messages for debugging
          if (messages.length !== formattedMessages.length) {
            console.log(`[ChatDebug] Message count changed: ${messages.length} -> ${formattedMessages.length}`);
          }

          // Just show the messages directly when we receive them
          setMessages(formattedMessages);
          
          // Now that we have the response, stop showing the waiting indicators
          setIsThinking(false);
          setIsWaitingForResponse(false);
        } catch (error) {
          console.error('[ChatDebug] Error parsing message from server:', error);
          setIsWaitingForResponse(false);
          setIsThinking(false);
        }
      }
    };

    wsListeners.push(handleWebSocketEvent);
    console.log('[ChatDebug] Added WebSocket listener, total listeners:', wsListeners.length);
    
    // Check connection status immediately
    if (isWebSocketConnected()) {
      console.log('[ChatDebug] WebSocket already connected');
      setIsConnected(true);
    } else {
      console.log('[ChatDebug] WebSocket not connected, establishing connection');
      setIsConnected(false);
      establishConnection();
    }

    return () => {
      console.log('[ChatDebug] Removing WebSocket listener with ID:', listenerId);
      wsListeners = wsListeners.filter(listener => listener !== handleWebSocketEvent);
      console.log('[ChatDebug] Remaining listeners after cleanup:', wsListeners.length);
    };
  }, [setMessages]);

  const clearChatHistory = useCallback(() => {
    console.log('[ChatDebug] Clearing chat history');
    setMessages([]);
  }, [setMessages]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) {
      console.log('[ChatDebug] Empty message, not sending');
      return;
    }

    console.log('[ChatDebug] Sending message:', message);

    // Add user message to UI immediately for better UX
    setMessages((prev: Message[]) => {
      const newMessages = [...prev, { content: message, isBot: false }];
      console.log('[ChatDebug] Updated messages after adding user message:', newMessages);
      return newMessages;
    });
    
    // Set waiting state to true when sending message
    setIsWaitingForResponse(true);
    console.log('[ChatDebug] Set isWaitingForResponse to true');
    
    // Show thinking state first for a random delay, then show typing indicator
    setIsThinking(true);
    console.log('[ChatDebug] Set isThinking to true');
    simulateTypingDelay(() => {
      setIsThinking(false);
      console.log('[ChatDebug] Set isThinking to false after delay');
    });

    // Ensure connection exists
    if (!isWebSocketConnected()) {
      console.log('[ChatDebug] WebSocket not connected, establishing connection before sending');
      establishConnection();
      return;
    }
    
    // Send message to server
    if (globalWsConnection) {
      console.log('[ChatDebug] Sending message to WebSocket server');
      globalWsConnection.send(message);
    } else {
      console.error('[ChatDebug] Cannot send message, WebSocket connection is null');
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
    clearChatHistory,
  };
};
