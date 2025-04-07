
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface DreamTransitionProps {
  isActive: boolean;
  onTransitionEnd?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const DreamTransition = ({ 
  isActive, 
  onTransitionEnd, 
  className,
  children 
}: DreamTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 1000); // Matches the animation duration
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleAnimationEnd = () => {
    if (!isActive && onTransitionEnd) {
      onTransitionEnd();
    }
  };

  if (!isVisible && !isActive) return null;

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-whisper-300/90 to-dream-300/90 backdrop-blur-md",
        isActive ? "animate-dream-transition" : "animate-fade-out",
        className
      )}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="text-center p-8 max-w-lg">
        {children || (
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
            Transitioning to dreams...
          </h2>
        )}
      </div>
      
      <div className="particles-container">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DreamTransition;
