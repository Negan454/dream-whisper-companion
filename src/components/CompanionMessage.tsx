
import React from 'react';
import { cn } from '@/lib/utils';

interface CompanionMessageProps {
  message: string;
  className?: string;
  withAnimation?: boolean;
}

const CompanionMessage = ({ message, className, withAnimation = true }: CompanionMessageProps) => {
  return (
    <div className={cn(
      "companion-message", 
      withAnimation && "animate-fade-in",
      className
    )}>
      <p>{message}</p>
    </div>
  );
};

export default CompanionMessage;
