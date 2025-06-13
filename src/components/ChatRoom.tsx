
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
      <div className="h-screen bg-forest-dark flex items-center justify-center">
        <div className="text-mint-cream text-xl font-inter">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-forest-dark flex flex-col">
      {/* Header */}
      <div className="bg-jungle-dark/60 backdrop-blur-lg border-b border-muted/30 p-4 shadow-soft">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-mint-cream font-inter">ChatNest</h1>
            <Badge variant="secondary" className="bg-emerald-deep/40 text-mint-cream border-muted/30">
              <Users className="h-4 w-4 mr-1" />
              Online
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-cool-gray text-sm font-inter">
              Welcome, <span className="font-semibold text-mint-cream">{user?.email}</span>
            </div>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="text-cool-gray hover:bg-emerald-deep/40 hover:text-mint-cream"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full p-4">
        <div className="flex-1 bg-jungle-dark/20 backdrop-blur-lg rounded-t-2xl border border-muted/30 overflow-hidden flex flex-col shadow-deep">
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
                      ? 'bg-gradient-to-r from-emerald-deep to-primary'
                      : message.user_id === user?.id
                      ? 'bg-gradient-to-r from-jungle-dark to-emerald-deep'
                      : 'bg-gradient-to-r from-emerald-deep to-accent'
                  }`}>
                    {message.is_gpt ? <Bot className="h-5 w-5" /> : 
                     (message.profiles?.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${
                  message.user_id === user?.id ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-soft ${
                    message.is_gpt
                      ? 'bg-emerald-deep text-mint-cream'
                      : message.user_id === user?.id
                      ? 'bg-jungle-dark text-mint-cream'
                      : 'bg-emerald-deep/40 text-mint-cream backdrop-blur-sm border border-muted/30'
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-sm font-inter">
                        {message.is_gpt ? 'ChatGPT' : message.profiles?.username || 'User'}
                      </span>
                      {message.is_gpt && <Bot className="h-4 w-4" />}
                    </div>
                    <p className="text-sm leading-relaxed font-inter">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1 font-inter">
                      {formatTime(message.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <div className="border-t border-muted/30 bg-jungle-dark/20 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                type="text"
                placeholder="Type a message... (use @gpt to chat with AI)"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                className="flex-1 bg-emerald-deep/30 border-muted/40 text-mint-cream placeholder:text-cool-gray h-12 focus:border-primary focus:ring-primary font-inter"
              />
              <Button 
                type="submit" 
                disabled={!currentMessage.trim()}
                className="h-12 px-6 bg-gradient-to-r from-emerald-deep to-primary hover:from-accent hover:to-emerald-deep text-mint-cream border-0 shadow-soft transition-all duration-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
            
            <div className="text-xs text-cool-gray mt-2 text-center font-inter">
              💡 Tip: Start your message with @gpt to chat with the AI assistant
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
