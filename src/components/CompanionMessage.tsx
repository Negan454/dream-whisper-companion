
import React from 'react';
import { cn } from '@/lib/utils';

interface CompanionMessageProps {
  message: string;
  className?: string;
  withAnimation?: boolean;
  isTherapist?: boolean;
}

const CompanionMessage = ({ 
  message, 
  className, 
  withAnimation = true, 
  isTherapist = true 
}: CompanionMessageProps) => {
  return (
    <div className={cn(
      isTherapist ? "therapist-message" : "companion-message", 
      withAnimation && "animate-fade-in",
      className
    )}>
      <p>{message}</p>
    </div>
  );
};

export default CompanionMessage;
