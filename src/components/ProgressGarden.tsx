
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sprout, Award, Heart, Calendar } from 'lucide-react';
import { useGamification } from '@/contexts/GamificationContext';
import { cn } from '@/lib/utils';

interface ProgressGardenProps {
  className?: string;
}

const ProgressGarden = ({ className }: ProgressGardenProps) => {
  const { state } = useGamification();
  
  const getMilestoneInfo = () => {
    const { weeklyMilestone, totalSeeds } = state;
    
    if (totalSeeds >= 300) return { name: 'Flourish', emoji: '🌸', color: 'text-pink-600', progress: 100 };
    if (totalSeeds >= 150) return { name: 'Bloom', emoji: '🌺', color: 'text-purple-600', progress: (totalSeeds / 300) * 100 };
    if (totalSeeds >= 75) return { name: 'Sprout', emoji: '🌱', color: 'text-green-600', progress: (totalSeeds / 150) * 100 };
    if (totalSeeds >= 25) return { name: 'Seedling', emoji: '🌿', color: 'text-emerald-600', progress: (totalSeeds / 75) * 100 };
    
    return { name: 'Seed', emoji: '🌰', color: 'text-amber-600', progress: (totalSeeds / 25) * 100 };
  };

  const milestoneInfo = getMilestoneInfo();
  const unlockedBadges = state.badges.filter(b => b.unlocked);

  return (
    <Card className={cn("p-4 bg-gradient-to-br from-green-50 to-teal-50 border-green-200", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-teal-800 flex items-center gap-2 mb-2">
          <Sprout className="h-5 w-5 text-green-600" />
          Your Growth Garden
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{milestoneInfo.emoji}</span>
            <div>
              <p className={`font-semibold ${milestoneInfo.color}`}>{milestoneInfo.name}</p>
              <p className="text-sm text-gray-600">{state.totalSeeds} seeds collected</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            +{state.dailySeeds} today
          </Badge>
        </div>
        
        <Progress 
          value={milestoneInfo.progress} 
          className="h-3 bg-green-100"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-white/60 rounded-lg border border-green-200">
          <Calendar className="h-5 w-5 text-teal-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Reflection Streak</p>
          <p className="text-xl font-bold text-teal-600">{state.reflectionStreak} days</p>
        </div>
        
        <div className="text-center p-3 bg-white/60 rounded-lg border border-green-200">
          <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
          <p className="text-sm text-gray-600">Badges Earned</p>
          <p className="text-xl font-bold text-purple-600">{unlockedBadges.length}</p>
        </div>
      </div>
      
      {unlockedBadges.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-teal-700 mb-2 flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Recent Badges
          </h4>
          <div className="flex flex-wrap gap-2">
            {unlockedBadges.slice(-3).map((badge) => (
              <Badge 
                key={badge.id} 
                variant="secondary" 
                className="bg-white/80 text-teal-800 border-teal-200 text-xs"
              >
                {badge.title}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center italic">
        "Every step in your journey matters - you're growing beautifully"
      </div>
    </Card>
  );
};

export default ProgressGarden;
