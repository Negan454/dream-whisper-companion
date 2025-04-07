
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Heart, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'star' | 'heart' | 'book';
  unlocked: boolean;
}

interface ProgressTrackerProps {
  sessionProgress: number;
  reflectionStreak: number;
  insightsCount: number;
  achievements: Achievement[];
  className?: string;
}

const ProgressTracker = ({
  sessionProgress,
  reflectionStreak,
  insightsCount,
  achievements,
  className
}: ProgressTrackerProps) => {
  const getIcon = (iconName: 'award' | 'star' | 'heart' | 'book') => {
    switch (iconName) {
      case 'award': return <Award className="h-5 w-5" />;
      case 'star': return <Star className="h-5 w-5" />;
      case 'heart': return <Heart className="h-5 w-5" />;
      case 'book': return <Book className="h-5 w-5" />;
    }
  };

  return (
    <div className={cn("bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm", className)}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium text-teal-800">Today's Session</h3>
          <span className="text-xs font-medium text-teal-600">{sessionProgress}%</span>
        </div>
        <Progress value={sessionProgress} className="h-2 bg-teal-100" />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <p className="text-xs text-gray-500">Reflection Streak</p>
          <p className="text-xl font-bold text-teal-600">{reflectionStreak} days</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Insights Gained</p>
          <p className="text-xl font-bold text-blue-600">{insightsCount}</p>
        </div>
      </div>

      <h3 className="text-sm font-medium text-teal-800 mb-2">Recent Achievements</h3>
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
          <p className="text-sm text-gray-500 italic">Begin your reflection journey to unlock achievements!</p>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
