import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Message } from '@/components/ChatInterface';
import ChatInterface from '@/components/ChatInterface';
import { cn } from '@/lib/utils';
import SessionInsights from './SessionInsights';
import ProgressGarden from './ProgressGarden';
import QuestProgress from './QuestProgress';
import { useGamification } from '@/contexts/GamificationContext';

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
  recentMemories: Memory[];
  emotionCounts: EmotionCount[];
  emotionTrends: EmotionTrend[];
  className?: string;
}

const UnifiedInterface = ({
  messages,
  onSendMessage,
  recentMemories,
  emotionCounts,
  emotionTrends,
  className
}: UnifiedInterfaceProps) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'quests' | 'insights'>('progress');
  const { state, updateQuestProgress } = useGamification();
  
  const handleMilestoneClick = (questId: string, milestoneId: string) => {
    updateQuestProgress(questId, milestoneId);
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
      
      {/* Enhanced sidebar - 4 columns */}
      <div className="col-span-4 bg-white/70 backdrop-blur-sm flex flex-col overflow-y-auto">
        {/* Tab navigation */}
        <div className="p-4 border-b border-teal-100">
          <div className="flex space-x-1 bg-teal-50 rounded-lg p-1">
            {[
              { id: 'progress', label: 'Garden' },
              { id: 'quests', label: 'Quests' },
              { id: 'insights', label: 'Insights' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 py-2 px-3 text-xs font-medium rounded-md transition-colors",
                  activeTab === tab.id
                    ? "bg-white text-teal-700 shadow-sm"
                    : "text-teal-600 hover:text-teal-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab content */}
        <div className="flex-1 p-4 space-y-4">
          {activeTab === 'progress' && (
            <ProgressGarden />
          )}
          
          {activeTab === 'quests' && (
            <div className="space-y-4">
              {state.activeQuests.map((quest) => (
                <QuestProgress
                  key={quest.id}
                  quest={quest}
                  onMilestoneClick={(milestoneId) => handleMilestoneClick(quest.id, milestoneId)}
                />
              ))}
              {state.activeQuests.length === 0 && (
                <p className="text-sm text-gray-500 text-center italic">
                  Your emotional journey quests will appear here as you progress
                </p>
              )}
            </div>
          )}
          
          {activeTab === 'insights' && (
            <div className="space-y-4">
              <SessionInsights 
                emotionCounts={emotionCounts}
                emotionTrends={emotionTrends}
              />
              
              <div>
                <h3 className="text-sm font-medium text-teal-800 mb-2">Recent Insights</h3>
                {recentMemories.slice(0, 3).map((memory) => (
                  <div key={memory.id} className="mb-2 p-2 rounded-lg bg-white/80 border border-teal-100">
                    <p className="text-sm font-medium text-teal-800">{memory.title}</p>
                    <p className="text-xs text-gray-500 truncate">{memory.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default UnifiedInterface;
