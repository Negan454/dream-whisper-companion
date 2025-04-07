
import React from 'react';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';

interface Choice {
  id: string;
  text: string;
  voiceEnabled?: boolean;
}

interface PlayerChoicesProps {
  choices: Choice[];
  onSelectChoice: (choiceId: string) => void;
  className?: string;
  isTherapeutic?: boolean;
}

const PlayerChoices = ({ 
  choices, 
  onSelectChoice, 
  className,
  isTherapeutic = true
}: PlayerChoicesProps) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full max-w-md mx-auto animate-fade-in", className)}>
      {choices.map((choice) => (
        <button
          key={choice.id}
          className={isTherapeutic ? "reflection-button group flex items-center justify-between" : "choice-button group flex items-center justify-between"}
          onClick={() => onSelectChoice(choice.id)}
        >
          <span>{choice.text}</span>
          {choice.voiceEnabled && (
            <Mic className={cn(
              "ml-2 h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity",
              isTherapeutic ? "text-teal-400" : "text-whisper-400"
            )} />
          )}
        </button>
      ))}
    </div>
  );
};

export default PlayerChoices;
