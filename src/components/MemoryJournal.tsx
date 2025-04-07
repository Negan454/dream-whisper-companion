
import React from 'react';
import { cn } from '@/lib/utils';
import { Book, Heart, Star } from 'lucide-react';
import { Message } from './ChatInterface';

interface Memory {
  id: string;
  title: string;
  description: string;
  emotion: 'joy' | 'wonder' | 'reflection' | 'curiosity';
  relatedMessages: string[]; // IDs of related messages
  timestamp: Date;
}

interface MemoryJournalProps {
  memories: Memory[];
  messages: Message[];
  onMemorySelect: (memory: Memory) => void;
  className?: string;
}

const MemoryJournal = ({ memories, messages, onMemorySelect, className }: MemoryJournalProps) => {
  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'joy':
        return <Heart className="h-5 w-5 text-pink-500" />;
      case 'wonder':
        return <Star className="h-5 w-5 text-amber-500" />;
      case 'reflection':
        return <Book className="h-5 w-5 text-blue-500" />;
      default:
        return <Book className="h-5 w-5 text-whisper-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={cn("p-4", className)}>
      <h2 className="text-2xl font-bold text-whisper-800 mb-6">Memory Journal</h2>
      
      {memories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-whisper-500 italic">Your journey has just begun. Memories will appear here as you explore.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map((memory) => (
            <div 
              key={memory.id} 
              className="memory-card cursor-pointer"
              onClick={() => onMemorySelect(memory)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-whisper-800">{memory.title}</h3>
                {getEmotionIcon(memory.emotion)}
              </div>
              <p className="text-sm text-whisper-600 mb-3">{memory.description}</p>
              <div className="text-xs text-whisper-400">{formatDate(memory.timestamp)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryJournal;
