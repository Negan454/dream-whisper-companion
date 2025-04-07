
import React from 'react';
import { cn } from '@/lib/utils';
import { Book, Heart, Star, Sparkles } from 'lucide-react';
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
      case 'curiosity':
        return <Sparkles className="h-5 w-5 text-teal-500" />;
      default:
        return <Book className="h-5 w-5 text-purple-500" />;
    }
  };

  const getEmotionBadge = (emotion: string) => {
    switch (emotion) {
      case 'joy':
        return <span className="badge badge-growth">Joy</span>;
      case 'wonder':
        return <span className="badge badge-insight">Wonder</span>;
      case 'reflection':
        return <span className="badge badge-reflection">Reflection</span>;
      case 'curiosity':
        return <span className="badge badge-courage">Curiosity</span>;
      default:
        return <span className="badge badge-insight">Insight</span>;
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-teal-800">Insight Journal</h2>
        <div className="text-sm text-teal-600">
          {memories.length} {memories.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>
      
      {memories.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-teal-500 italic">Your journey has just begun. Insights will appear here as you explore.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map((memory) => (
            <div 
              key={memory.id} 
              className="insight-card cursor-pointer"
              onClick={() => onMemorySelect(memory)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-bold text-teal-800">{memory.title}</h3>
                {getEmotionIcon(memory.emotion)}
              </div>
              <p className="text-sm text-teal-600 mb-3">{memory.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-teal-400">{formatDate(memory.timestamp)}</div>
                {getEmotionBadge(memory.emotion)}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-teal-100">
        <h3 className="text-lg font-semibold text-teal-800 mb-2">Reflection Tip</h3>
        <p className="text-sm text-teal-600">
          Reviewing past insights can reveal patterns in your emotional journey and highlight your growth. 
          Notice how your perspective shifts over time, and celebrate the wisdom you've gained.
        </p>
      </div>
    </div>
  );
};

export default MemoryJournal;
