
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Message } from '@/components/ChatInterface';
import ChatInterface from '@/components/ChatInterface';
import { Award, Heart, Book, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import SessionInsights from './SessionInsights';

// Define emotion type to handle all possible emotions
type Emotion = 'joy' | 'wonder' | 'reflection' | 'curiosity';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'star' | 'heart' | 'book';
  unlocked: boolean;
}

interface Memory {
  id: string;
  title: string;
  description: string;
  emotion: Emotion;
  relatedMessages: string[];
  timestamp: Date;
}

interface EmotionCount {
  emotion: Emotion;
  count: number;
}

interface EmotionTrend {
  time: string;
  emotion: Emotion;
}

interface UnifiedInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  sessionProgress: number;
  reflectionStreak: number;
  insightsCount: number;
  achievements: Achievement[];
  recentMemories: Memory[];
  emotionCounts: EmotionCount[];
  emotionTrends: EmotionTrend[];
  className?: string;
}

const UnifiedInterface = ({
  messages,
  onSendMessage,
  sessionProgress,
  reflectionStreak,
  insightsCount,
  achievements,
  recentMemories,
  emotionCounts,
  emotionTrends,
  className
}: UnifiedInterfaceProps) => {
  const [showInsights, setShowInsights] = useState(true);
  
  const getIcon = (iconName: 'award' | 'star' | 'heart' | 'book') => {
    switch (iconName) {
      case 'award': return <Award className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'book': return <Book className="h-5 w-5" />;
    }
  };

  return (
    <Card className={cn("therapeutic-card overflow-hidden border-none shadow-xl h-[70vh] grid grid-cols-12", className)}>
      {/* Main chat area - 8 columns */}
      <div className="col-span-8 border-r border-teal-100 flex flex-col">
        <ChatInterface 
          messages={messages}
          onSendMessage={onSendMessage}
        />
      </div>
      
      {/* Progress sidebar - 4 columns */}
      <div className="col-span-4 bg-white/70 backdrop-blur-sm flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-teal-100">
          <h3 className="text-lg font-medium text-teal-800 mb-2">Your Progress</h3>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-teal-600">Session Progress</span>
              <span className="text-xs font-medium text-teal-600">{sessionProgress}%</span>
            </div>
            <Progress value={sessionProgress} className="h-2 bg-teal-100" />
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Streak</p>
              <p className="text-lg font-bold text-teal-600">{reflectionStreak} days</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Insights</p>
              <p className="text-lg font-bold text-blue-600">{insightsCount}</p>
            </div>
          </div>
        </div>
        
        {/* Session Insights Section */}
        <div className="p-4 border-b border-teal-100">
          <SessionInsights 
            emotionCounts={emotionCounts}
            emotionTrends={emotionTrends}
          />
        </div>
        
        <div className="p-4 border-b border-teal-100">
          <h3 className="text-sm font-medium text-teal-800 mb-2">Achievements</h3>
          <div className="space-y-2">
            {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100">
                <div className="flex-shrink-0 p-1.5 bg-white rounded-full text-teal-500">
                  {getIcon(achievement.icon)}
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-800">{achievement.title}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
            {achievements.filter(a => a.unlocked).length === 0 && (
              <p className="text-sm text-gray-500 italic">Begin your journey to unlock achievements!</p>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-teal-800 mb-2">Recent Insights</h3>
          {recentMemories.slice(0, 3).map((memory) => (
            <div key={memory.id} className="mb-2 p-2 rounded-lg bg-white/80 border border-teal-100">
              <p className="text-sm font-medium text-teal-800">{memory.title}</p>
              <p className="text-xs text-gray-500 truncate">{memory.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default UnifiedInterface;
