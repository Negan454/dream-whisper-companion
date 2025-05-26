
import React, { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AffirmationFloatProps {
  message: string | null;
  onClose: () => void;
  className?: string;
}

const AffirmationFloat = ({ message, onClose, className }: AffirmationFloatProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500);
      }, 6000);
      
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message || !isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 transition-all duration-700",
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95",
        className
      )}
    >
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/40 max-w-md">
        <div className="flex items-center justify-center mb-3">
          <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-3 rounded-full">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <Sparkles className="h-5 w-5 text-purple-400 ml-2 animate-pulse" />
        </div>
        
        <div className="text-center">
          <h3 className="font-semibold text-purple-800 mb-2">A Moment of Grace</h3>
          <p className="text-purple-700 text-sm leading-relaxed italic">
            "{message}"
          </p>
        </div>
        
        <div className="mt-4 flex justify-center">
          <div className="w-12 h-1 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default AffirmationFloat;
