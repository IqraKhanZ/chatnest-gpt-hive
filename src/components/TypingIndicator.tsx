
import React from 'react';

interface TypingIndicatorProps {
  users: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center space-x-2 px-4 py-2 text-white/60 text-sm">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>
        {users.length === 1 
          ? `${users[0]} is typing...`
          : `${users.join(', ')} are typing...`
        }
      </span>
    </div>
  );
};

export default TypingIndicator;
