
import { useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  isGPT?: boolean;
}

interface User {
  id: string;
  username: string;
}

export const useSocket = (apiKey?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // In a real implementation, you would connect to your backend server
    // const newSocket = io('http://localhost:3001');
    
    // For demo purposes, we'll create a mock socket
    const mockSocket = {
      connected: true,
      emit: (event: string, data: any) => {
        console.log('Socket emit:', event, data);
        
        if (event === 'join_room') {
          setIsConnected(true);
          // Simulate welcome message
          setTimeout(() => {
            const welcomeMessage: Message = {
              id: Date.now().toString(),
              username: 'System',
              message: `Welcome to ChatNest! Type @gpt to chat with AI assistant.`,
              timestamp: Date.now(),
            };
            setMessages(prev => [...prev, welcomeMessage]);
          }, 500);
        }
        
        if (event === 'send_message') {
          // Add user message
          const userMessage: Message = {
            id: Date.now().toString(),
            username: data.username,
            message: data.message,
            timestamp: Date.now(),
          };
          setMessages(prev => [...prev, userMessage]);
          
          // Check if message starts with @gpt
          if (data.message.toLowerCase().startsWith('@gpt')) {
            setTimeout(() => {
              const gptMessage: Message = {
                id: (Date.now() + 1).toString(),
                username: 'ChatGPT',
                message: apiKey 
                  ? `I would respond to your message using the OpenAI API: "${data.message.substring(4).trim()}"`
                  : `Hello! I'm ChatGPT in demo mode. Your message was: "${data.message.substring(4).trim()}". Add a real API key for actual GPT responses!`,
                timestamp: Date.now(),
                isGPT: true,
              };
              setMessages(prev => [...prev, gptMessage]);
            }, 1000);
          }
        }
      },
      on: (event: string, callback: Function) => {
        console.log('Socket listener added for:', event);
      },
      disconnect: () => {
        console.log('Socket disconnected');
      }
    } as any;

    setSocket(mockSocket);
    
    return () => {
      if (mockSocket) {
        mockSocket.disconnect();
      }
    };
  }, [apiKey]);

  const sendMessage = useCallback((username: string, message: string) => {
    if (socket) {
      socket.emit('send_message', { username, message });
    }
  }, [socket]);

  const joinRoom = useCallback((username: string) => {
    if (socket) {
      socket.emit('join_room', { username });
    }
  }, [socket]);

  return {
    socket,
    messages,
    onlineUsers,
    isConnected,
    sendMessage,
    joinRoom,
  };
};
