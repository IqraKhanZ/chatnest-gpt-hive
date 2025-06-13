
import React from 'react';
import { Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  isGPT?: boolean;
}

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwn }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex items-start space-x-3 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className={`text-white text-sm font-semibold ${
          message.isGPT 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
            : isOwn
            ? 'bg-gradient-to-r from-purple-500 to-pink-500'
            : 'bg-gradient-to-r from-blue-500 to-cyan-500'
        }`}>
          {message.isGPT ? <Bot className="h-5 w-5" /> : message.username.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex-1 max-w-xs md:max-w-md lg:max-w-lg ${isOwn ? 'text-right' : ''}`}>
        <div className={`inline-block p-4 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
          message.isGPT
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            : isOwn
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
            : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
        }`}>
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-semibold text-sm">
              {message.isGPT ? 'ChatGPT' : message.username}
            </span>
            {message.isGPT && <Bot className="h-4 w-4" />}
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>
          <div className="text-xs opacity-70 mt-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
