
import React, { useState, useRef, useEffect } from 'react';
import CompanionMessage from './CompanionMessage';
import PlayerMessage from './PlayerMessage';
import { Input } from './ui/input';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'player' | 'companion';
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage?: (message: string) => void;
  className?: string;
}

const ChatInterface = ({
  messages,
  onSendMessage = () => {},
  className,
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          message.sender === 'companion' ? (
            <CompanionMessage 
              key={message.id} 
              message={message.text} 
            />
          ) : (
            <PlayerMessage 
              key={message.id} 
              message={message.text} 
            />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-whisper-100 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <button 
            onClick={handleSendMessage}
            className="p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
