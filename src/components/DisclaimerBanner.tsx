
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisclaimerBannerProps {
  className?: string;
}

const DisclaimerBanner = ({ className }: DisclaimerBannerProps) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={cn(
      "bg-blue-50 border-l-4 border-blue-400 p-3 mb-4 relative",
      className
    )}>
      <button 
        className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-blue-500" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Important Notice:</span> This is a self-reflection tool, not a substitute for professional therapy. If you're experiencing severe distress, please seek help from a licensed mental health professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
