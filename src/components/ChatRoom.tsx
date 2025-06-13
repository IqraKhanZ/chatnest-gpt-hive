
import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, Bot, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useMessages } from '@/hooks/useMessages';
import { toast } from '@/hooks/use-toast';

const ChatRoom = () => {
  const { user, signOut } = useAuth();
  const { messages, loading, sendMessage } = useMessages();
  const [currentMessage, setCurrentMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;

    await sendMessage(currentMessage);
    setCurrentMessage('');
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex items-center justify-center">
        <div className="text-green-100 text-xl">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-teal-900 flex flex-col">
      {/* Header */}
      <div className="bg-emerald-900/60 backdrop-blur-lg border-b border-emerald-700/30 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-green-100">ChatNest</h1>
            <Badge variant="secondary" className="bg-emerald-700/40 text-green-200 border-emerald-600/30">
              <Users className="h-4 w-4 mr-1" />
              Online
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-green-200/80 text-sm">
              Welcome, <span className="font-semibold text-green-100">{user?.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-green-200 hover:bg-emerald-800/40 hover:text-green-100"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4">
        <div className="flex-1 bg-emerald-900/20 backdrop-blur-lg rounded-t-2xl border border-emerald-700/30 overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.user_id === user?.id ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback className={`text-white text-sm font-semibold ${
                    message.is_gpt 
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600'
                      : message.user_id === user?.id
                      ? 'bg-gradient-to-r from-emerald-700 to-green-700'
                      : 'bg-gradient-to-r from-emerald-600 to-green-600'
                  }`}>
                    {message.is_gpt ? <Bot className="h-5 w-5" /> : 
                     (message.profiles?.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${
                  message.user_id === user?.id ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-lg ${
                    message.is_gpt
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-green-50'
                      : message.user_id === user?.id
                      ? 'bg-gradient-to-r from-emerald-800 to-green-800 text-green-100'
                      : 'bg-emerald-800/40 text-green-100 backdrop-blur-sm border border-emerald-700/30'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm">
                        {message.is_gpt ? 'ChatGPT' : message.profiles?.username || 'User'}
                      </span>
                      {message.is_gpt && <Bot className="h-4 w-4" />}
                    </div>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-emerald-700/30 bg-emerald-900/20 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                type="text"
                placeholder="Type a message... (use @gpt to chat with AI)"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 bg-emerald-800/30 border-emerald-700/40 text-green-100 placeholder:text-green-300/50 h-12 focus:border-emerald-600 focus:ring-emerald-600"
              />
              <Button 
                type="submit" 
                disabled={!currentMessage.trim()}
                className="h-12 px-6 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-600 hover:to-green-600 text-green-100 border-0 shadow-lg transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            
            <div className="text-xs text-green-300/60 mt-2 text-center">
              💡 Tip: Start your message with @gpt to chat with the AI assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
