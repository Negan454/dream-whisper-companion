
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, CheckCircle, Circle } from 'lucide-react';
import { Quest } from '@/contexts/GamificationContext';
import { cn } from '@/lib/utils';

interface QuestProgressProps {
  quest: Quest;
  onMilestoneClick?: (milestoneId: string) => void;
  className?: string;
}

const QuestProgress = ({ quest, onMilestoneClick, className }: QuestProgressProps) => {
  const progressPercentage = (quest.milestones.filter(m => m.completed).length / quest.milestones.length) * 100;
  
  const getThemeGradient = (theme: Quest['theme']) => {
    switch (theme) {
      case 'worry': return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'shadows': return 'from-purple-50 to-violet-50 border-purple-200';
      case 'doubt': return 'from-green-50 to-emerald-50 border-green-200';
      default: return 'from-teal-50 to-blue-50 border-teal-200';
    }
  };

  const getThemeAccent = (theme: Quest['theme']) => {
    switch (theme) {
      case 'worry': return 'text-blue-700';
      case 'shadows': return 'text-purple-700';
      case 'doubt': return 'text-green-700';
      default: return 'text-teal-700';
    }
  };

  return (
    <Card className={cn(`p-4 bg-gradient-to-br ${getThemeGradient(quest.theme)}`, className)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={`font-semibold ${getThemeAccent(quest.theme)} flex items-center gap-2`}>
            <MapPin className="h-5 w-5" />
            {quest.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
        </div>
        {quest.completed && (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            Complete
          </Badge>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-600">{Math.round(progressPercentage)}%</span>
        </div>
        <Progress 
          value={progressPercentage} 
          className="h-2"
        />
      </div>
      
      <div className="space-y-3">
        {quest.milestones.map((milestone, index) => (
          <div 
            key={milestone.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg transition-colors",
              milestone.completed 
                ? "bg-white/60 border border-green-200" 
                : index === quest.currentMilestone 
                  ? "bg-white/80 border border-amber-200 shadow-sm" 
                  : "bg-white/40 border border-gray-200",
              onMilestoneClick && !milestone.completed && index === quest.currentMilestone 
                ? "cursor-pointer hover:bg-white/90" 
                : ""
            )}
            onClick={() => onMilestoneClick && !milestone.completed && index === quest.currentMilestone 
              ? onMilestoneClick(milestone.id) 
              : undefined
            }
          >
            <div className="flex-shrink-0 mt-0.5">
              {milestone.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : index === quest.currentMilestone ? (
                <Circle className="h-5 w-5 text-amber-600 animate-pulse" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={cn(
                "font-medium text-sm",
                milestone.completed ? "text-green-800" : "text-gray-800"
              )}>
                {milestone.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1">{milestone.description}</p>
              {index === quest.currentMilestone && !milestone.completed && (
                <p className="text-xs text-amber-700 mt-2 italic">
                  Suggested: {milestone.activity}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default QuestProgress;
