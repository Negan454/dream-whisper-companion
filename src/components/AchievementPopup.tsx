
import React, { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementPopupProps {
  title: string;
  description: string;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

const AchievementPopup = ({
  title,
  description,
  isVisible,
  onClose,
  className
}: AchievementPopupProps) => {
  const [isShowing, setIsShowing] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        onClose();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isShowing) return null;

  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-teal-200 p-4 achievement-popup",
        className
      )}
    >
      <button 
        onClick={() => {
          setIsShowing(false);
          onClose();
        }}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-start">
        <div className="flex-shrink-0 bg-teal-100 p-2 rounded-full mr-3">
          <Award className="h-6 w-6 text-teal-600" />
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-teal-800">Achievement Unlocked!</h4>
          <p className="font-medium text-gray-700 mt-1">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
