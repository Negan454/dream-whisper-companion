
import React, { useState, useRef, useEffect } from 'react';
import CompanionMessage from './CompanionMessage';
import PlayerMessage from './PlayerMessage';
import PlayerChoices from './PlayerChoices';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  text: string;
  sender: 'player' | 'companion';
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  choices?: {
    id: string;
    text: string;
    voiceEnabled?: boolean;
  }[];
  onSelectChoice?: (choiceId: string) => void;
  className?: string;
  showChoices?: boolean;
}

const ChatInterface = ({
  messages,
  choices = [],
  onSelectChoice = () => {},
  className,
  showChoices = true,
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      
      {showChoices && choices.length > 0 && (
        <div className="p-4 border-t border-whisper-100 bg-white/50 backdrop-blur-sm">
          <PlayerChoices 
            choices={choices} 
            onSelectChoice={onSelectChoice} 
          />
        </div>
      )}
    </div>
  );
};

export default ChatInterface;
