
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

interface Message {
  content: string;
  isBot: boolean;
  error?: {
    message: string;
    retry_count?: number;
    timestamp?: string;
  };
}

interface AgentActivityMessage {
  type: 'agent_activity';
  chat_id: string;
  text: string;
  tool?: string;
  status?: 'running' | 'done';
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

const getAppSessionId = () => {
  let appSessionId = localStorage.getItem('app_session_id');
  if (!appSessionId) {
    appSessionId = 'app_session_id_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('app_session_id', appSessionId);
  }
  return appSessionId;
};

// Last time we checked the connection status
let lastConnectionCheck = 0;
const CONNECTION_CHECK_THROTTLE = 2000; // Don't check more often than every 2 seconds

// Function to check if we've already requested history in this session
const hasRequestedHistoryBefore = () => {
  return localStorage.getItem('chat_history_requested') === 'true';
};

// Function to mark history as requested
const markHistoryAsRequested = () => {
  localStorage.setItem('chat_history_requested', 'true');
};

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
  const appSessionId = getAppSessionId();
  const wsUrl = `${WEBSOCKET_BASE_URL}?user_id=${userId}&app_session_id=${appSessionId}`;
  console.log('Connecting to WebSocket:', wsUrl);

  try {
    globalWsConnection = new WebSocket(wsUrl);

    globalWsConnection.onopen = () => {
      console.log('Connected to chat server');
      isConnecting = false;
      connectionAttempts = 0;
      wsListeners.forEach(listener => listener({ type: 'connection', status: true }));
      
      // Request chat history after connection is established and a small delay
      // but only if we haven't already requested it in this session
      if (!hasRequestedHistoryBefore()) {
        setTimeout(() => {
          if (globalWsConnection && globalWsConnection.readyState === WebSocket.OPEN) {
            console.log('Requesting chat history from server');
            globalWsConnection.send(JSON.stringify({ action: "get_history" }));
            markHistoryAsRequested();
          }
        }, 1500);
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

  const MIN_ACTIVITY_DURATION = 600; // in ms
  const [agentActivityText, setAgentActivityText] = useState<string | null>(null);
  const lastActivityShownAtRef = useRef<number>(0);
  const clearActivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [messages, setMessages] = useLocalStorage<Message[]>('assistant_chat_messages', []);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const listenerIdRef = useRef<number>(Date.now());

  // Register this component as a listener
  useEffect(() => {
    const listenerId = listenerIdRef.current;
    
    const handleWebSocketEvent = (event: any) => {
      if (event.type === 'connection') {
        setIsConnected(event.status);
      } else if (event.type === 'message') {
        try {
          const parsed = JSON.parse(event.data);

          if (parsed.type === 'chat_history') {
            const formattedMessages: Message[] = parsed.messages.map(msg => ({
              content: msg.content,
              isBot: msg.role === 'ai',
              error: msg.error ?? undefined
            }));
            setMessages(formattedMessages);
            setIsWaitingForResponse(false);
          }
          else if (parsed.type === 'agent_activity') {
            const text = parsed.text || null;

            if (text && text.trim() !== '') {
              // New activity started — show immediately
              setAgentActivityText(text);
              lastActivityShownAtRef.current = Date.now();

              // Cancel any pending clear timeout
              if (clearActivityTimeoutRef.current) {
                clearTimeout(clearActivityTimeoutRef.current);
                clearActivityTimeoutRef.current = null;
              }
            } else {
              // Activity is being cleared — enforce minimum display duration
              const now = Date.now();
              const elapsed = now - lastActivityShownAtRef.current;
              const delay = Math.max(MIN_ACTIVITY_DURATION - elapsed, 0);

              clearActivityTimeoutRef.current = setTimeout(() => {
                setAgentActivityText(null);
                clearActivityTimeoutRef.current = null;
              }, delay);
            }
          }

        } catch (error) {
          console.error('Error parsing message from server:', error);
          setIsWaitingForResponse(false);
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
      if (clearActivityTimeoutRef.current) {
        clearTimeout(clearActivityTimeoutRef.current);
      }
      wsListeners = wsListeners.filter(listener => listener !== handleWebSocketEvent);
    };

  }, [setMessages]);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) {
      return;
    }

    // Add user message to UI immediately for better UX
    setMessages((prev: Message[]) => [...prev, { content: message, isBot: false }]);
    
    // Set waiting state to true when sending message
    setIsWaitingForResponse(true);
    
    // Ensure connection exists
    if (!isWebSocketConnected()) {
      establishConnection();
      return;
    }
    
    // Send message to server
    if (globalWsConnection) {
      globalWsConnection.send(JSON.stringify({ action: "question", content: message }));
    }
    setInputValue('');
    setAgentActivityText(null);

  }, [setMessages]);

  const retryLastMessage = useCallback(() => {
    setMessages(prev => {
      const updated = [...prev];
      const last = updated[updated.length - 1];
      if (last && !last.isBot && (last as any).error) {
        delete (last as any).error;
      }
      return updated;
    });

    if (!isWebSocketConnected()) {
      establishConnection();
      return;
    }

    if (globalWsConnection) {
      globalWsConnection.send(JSON.stringify({ action: "retry" }));
    }
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
      globalWsConnection.send(JSON.stringify({ action: "new_chat" }));
    }
  }, []);

  return {
    messages,
    inputValue,
    setInputValue,
    sendMessage,
    resetChat,
    retryLastMessage,
    isConnected,
    infoMessage,
    isWaitingForResponse,
    agentActivityText,
  };
};
