
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Particles from './Particles';

interface GamePosition {
  x: number;
  y: number;
}

interface GameWorldProps {
  className?: string;
  onPlayerPositionChange?: (position: GamePosition) => void;
  interactionPoints?: {
    id: string;
    x: number;
    y: number;
    label: string;
    onClick: () => void;
  }[];
}

const GameWorld = ({ 
  className, 
  onPlayerPositionChange,
  interactionPoints = []
}: GameWorldProps) => {
  const [playerPosition, setPlayerPosition] = useState<GamePosition>({ x: 50, y: 50 });
  
  const handleWorldClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const worldElement = e.currentTarget;
    const rect = worldElement.getBoundingClientRect();
    
    // Calculate relative position as percentage
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPlayerPosition({ x, y });
    if (onPlayerPositionChange) {
      onPlayerPositionChange({ x, y });
    }
  };
  
  return (
    <div 
      className={cn(
        "relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-whisper-100 to-dream-100 cursor-pointer", 
        className
      )}
      onClick={handleWorldClick}
    >
      <Particles quantity={15} />
      
      {/* Player character */}
      <div 
        className="absolute w-8 h-8 bg-whisper-500 rounded-full shadow-md transform -translate-x-1/2 -translate-y-1/2 animate-pulse-soft border-2 border-white"
        style={{ 
          left: `${playerPosition.x}%`, 
          top: `${playerPosition.y}%`,
          transition: 'left 0.5s ease-out, top 0.5s ease-out'
        }}
      />
      
      {/* Interaction points */}
      {interactionPoints.map((point) => (
        <div
          key={point.id}
          className="absolute w-10 h-10 rounded-full bg-dream-300/50 shadow-inner transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer animate-float"
          style={{ 
            left: `${point.x}%`, 
            top: `${point.y}%` 
          }}
          onClick={(e) => {
            e.stopPropagation();
            point.onClick();
          }}
        >
          <div className="w-6 h-6 rounded-full bg-dream-400 shadow-sm flex items-center justify-center">
            <span className="text-xs font-bold text-white">{point.label[0]}</span>
          </div>
          <span className="absolute -bottom-6 text-xs text-dream-700 whitespace-nowrap font-medium">
            {point.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default GameWorld;
