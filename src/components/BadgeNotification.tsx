
import React, { useEffect, useState } from 'react';
import { Award, Heart, Star, Book, Shield, Sun, Moon } from 'lucide-react';
import { Badge } from '@/contexts/GamificationContext';
import { cn } from '@/lib/utils';

interface BadgeNotificationProps {
  badge: Badge | null;
  onClose: () => void;
  className?: string;
}

const BadgeNotification = ({ badge, onClose, className }: BadgeNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [badge, onClose]);

  const getIcon = (iconName: Badge['icon']) => {
    const iconProps = { className: "h-8 w-8 text-white" };
    switch (iconName) {
      case 'award': return <Award {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      case 'book': return <Book {...iconProps} />;
      case 'shield': return <Shield {...iconProps} />;
      case 'sun': return <Sun {...iconProps} />;
      case 'moon': return <Moon {...iconProps} />;
      case 'flower': return <Heart {...iconProps} />; // Using heart as flower substitute
      default: return <Award {...iconProps} />;
    }
  };

  const getCategoryColor = (category: Badge['category']) => {
    switch (category) {
      case 'courage': return 'from-pink-400 to-red-400';
      case 'milestone': return 'from-purple-400 to-indigo-400';
      case 'consistency': return 'from-green-400 to-teal-400';
      case 'growth': return 'from-yellow-400 to-orange-400';
      default: return 'from-teal-400 to-blue-400';
    }
  };

  if (!badge || !isVisible) return null;

  return (
    <div 
      className={cn(
        "fixed top-6 right-6 max-w-sm transform transition-all duration-500 z-50",
        isVisible ? "translate-y-0 opacity-100 scale-100" : "-translate-y-4 opacity-0 scale-95",
        className
      )}
    >
      <div className={`bg-gradient-to-r ${getCategoryColor(badge.category)} rounded-2xl p-6 shadow-2xl border border-white/20`}>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 bg-white/20 p-3 rounded-full backdrop-blur-sm">
            {getIcon(badge.icon)}
          </div>
          
          <div className="flex-1 text-white">
            <h3 className="font-bold text-lg mb-1">Badge Unlocked!</h3>
            <h4 className="font-semibold text-base mb-2">{badge.title}</h4>
            <p className="text-sm text-white/90 leading-relaxed">{badge.description}</p>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-white/80 italic">Your journey of growth continues beautifully</p>
        </div>
      </div>
    </div>
  );
};

export default BadgeNotification;
