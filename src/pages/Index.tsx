
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Users, Bot, User, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

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

const Index = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    // For demo purposes, we'll simulate the backend functionality
    const mockSocket = {
      connected: true,
      emit: (event: string, data: any) => {
        console.log('Socket emit:', event, data);
        
        if (event === 'join_room') {
          setIsConnected(true);
          setIsJoined(true);
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
                message: `Hello! I'm ChatGPT. ${apiKey ? 'I would respond to your message with the OpenAI API.' : 'Please add your OpenAI API key to enable real GPT responses.'} Your message was: "${data.message.substring(4).trim()}"`,
                timestamp: Date.now(),
                isGPT: true,
              };
              setMessages(prev => [...prev, gptMessage]);
            }, 1000);
          }
        }
        
        if (event === 'typing') {
          setIsTyping(prev => [...prev.filter(u => u !== data.username), data.username]);
          setTimeout(() => {
            setIsTyping(prev => prev.filter(u => u !== data.username));
          }, 3000);
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
      if (socket) {
        socket.disconnect();
      }
    };
  }, [apiKey]);

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && socket) {
      socket.emit('join_room', { username: username.trim() });
      toast({
        title: "Joined ChatNest!",
        description: "You're now connected to the chat room.",
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && socket && username) {
      socket.emit('send_message', {
        username,
        message: currentMessage.trim(),
      });
      setCurrentMessage('');
    }
  };

  const handleTyping = () => {
    if (socket && username) {
      socket.emit('typing', { username });
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { username });
      }, 1000);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <MessageCircle className="h-12 w-12 text-white mr-2" />
              <h1 className="text-4xl font-bold text-white">ChatNest</h1>
            </div>
            <p className="text-white/80">Join the conversation with AI</p>
          </div>
          
          <form onSubmit={handleJoinRoom} className="space-y-6">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your display name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                required
              />
              
              <Input
                type="password"
                placeholder="OpenAI API Key (optional for demo)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
              />
              
              <p className="text-sm text-white/60">
                Add your OpenAI API key for real GPT responses, or leave empty for demo mode
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-200"
              disabled={!username.trim()}
            >
              Join ChatNest
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 flex flex-col">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-white" />
            <h1 className="text-2xl font-bold text-white">ChatNest</h1>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Users className="h-4 w-4 mr-1" />
              {onlineUsers.length || 1} online
            </Badge>
          </div>
          
          <div className="text-white/80 text-sm">
            Welcome, <span className="font-semibold">{username}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4">
        <div className="flex-1 bg-white/5 backdrop-blur-lg rounded-t-2xl border border-white/20 overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${
                  msg.username === username ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className={`text-white text-sm font-semibold ${
                    msg.isGPT 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                      : msg.username === username
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  }`}>
                    {msg.isGPT ? <Bot className="h-5 w-5" /> : msg.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${
                  msg.username === username ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-lg ${
                    msg.isGPT
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      : msg.username === username
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">
                        {msg.isGPT ? 'ChatGPT' : msg.username}
                      </span>
                      {msg.isGPT && <Bot className="h-4 w-4" />}
                    </div>
                    <p className="text-sm leading-relaxed">{msg.message}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicators */}
            {isTyping.length > 0 && (
              <div className="flex items-center space-x-2 text-white/60 text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span>{isTyping.join(', ')} typing...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-white/20 bg-white/5 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                type="text"
                placeholder="Type a message... (use @gpt to chat with AI)"
                value={currentMessage}
                onChange={(e) => {
                  setCurrentMessage(e.target.value);
                  handleTyping();
                }}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
              />
              <Button 
                type="submit" 
                disabled={!currentMessage.trim()}
                className="h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            
            <div className="text-xs text-white/50 mt-2 text-center">
              💡 Tip: Start your message with @gpt to chat with the AI assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
