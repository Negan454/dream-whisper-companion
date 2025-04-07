
import React from 'react';
import { cn } from '@/lib/utils';

interface PlayerMessageProps {
  message: string;
  className?: string;
  withAnimation?: boolean;
}

const PlayerMessage = ({ message, className, withAnimation = true }: PlayerMessageProps) => {
  return (
    <div className={cn(
      "player-message", 
      withAnimation && "animate-fade-in",
      className
    )}>
      <p>{message}</p>
    </div>
  );
};

export default PlayerMessage;
