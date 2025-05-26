
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'star' | 'heart' | 'book' | 'shield' | 'sun' | 'moon' | 'flower';
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'courage' | 'milestone' | 'consistency' | 'growth';
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  theme: 'worry' | 'shadows' | 'doubt';
  milestones: QuestMilestone[];
  currentMilestone: number;
  completed: boolean;
  unlocked: boolean;
}

export interface QuestMilestone {
  id: string;
  title: string;
  description: string;
  activity: string;
  completed: boolean;
}

export interface GamificationState {
  // Points system
  totalSeeds: number;
  dailySeeds: number;
  weeklyMilestone: 'seedling' | 'sprout' | 'bloom' | 'flourish' | null;
  
  // Streaks
  reflectionStreak: number;
  lastCheckIn: Date | null;
  
  // Badges
  badges: Badge[];
  recentBadge: Badge | null;
  
  // Quests
  activeQuests: Quest[];
  completedQuests: Quest[];
  
  // Surprise elements
  lastAffirmation: string | null;
  comfortItems: string[];
}

interface GamificationContextType {
  state: GamificationState;
  addSeeds: (amount: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;
  updateQuestProgress: (questId: string, milestoneId: string) => void;
  triggerAffirmation: (message: string) => void;
  giveComfortItem: (item: string) => void;
  checkDailyReset: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const initialBadges: Badge[] = [
  { id: 'brave-heart', title: 'Brave Heart', description: 'Shared something difficult for the first time', icon: 'heart', unlocked: false, category: 'courage' },
  { id: 'gentle-soul', title: 'Gentle Soul', description: 'Practiced self-compassion during a tough moment', icon: 'flower', unlocked: false, category: 'courage' },
  { id: 'quiet-strength', title: 'Quiet Strength', description: 'Acknowledged anxiety without judgment', icon: 'shield', unlocked: false, category: 'courage' },
  { id: 'inner-light', title: 'Inner Light', description: 'Found gratitude during a challenging day', icon: 'sun', unlocked: false, category: 'courage' },
  { id: 'deep-roots', title: 'Deep Roots', description: 'Reflected on personal growth patterns', icon: 'book', unlocked: false, category: 'growth' },
  { id: 'peaceful-mind', title: 'Peaceful Mind', description: 'Used a mindfulness technique during stress', icon: 'moon', unlocked: false, category: 'courage' },
  { id: 'seven-days', title: 'Seven Days Strong', description: 'Maintained check-ins for a week', icon: 'star', unlocked: false, category: 'consistency' },
  { id: 'garden-keeper', title: 'Garden Keeper', description: 'Monthly reflection consistency', icon: 'flower', unlocked: false, category: 'milestone' },
];

const initialQuests: Quest[] = [
  {
    id: 'forest-worry',
    title: 'The Forest of Worry',
    description: 'Navigate through anxiety and overthinking to find your calm clearing',
    theme: 'worry',
    milestones: [
      { id: 'name-worry', title: 'Naming the Worry', description: 'Identify and acknowledge your specific concerns', activity: 'Share what\'s on your mind', completed: false },
      { id: 'understand-roots', title: 'Understanding Its Roots', description: 'Explore where these worries come from', activity: 'Reflect on the source of your anxiety', completed: false },
      { id: 'calm-clearing', title: 'Finding Your Calm Clearing', description: 'Discover your inner peace', activity: 'Practice a breathing exercise', completed: false },
    ],
    currentMilestone: 0,
    completed: false,
    unlocked: true,
  },
  {
    id: 'valley-shadows',
    title: 'The Valley of Shadows',
    description: 'Process difficult emotions and find pinpoints of light',
    theme: 'shadows',
    milestones: [
      { id: 'acknowledge-shadow', title: 'Acknowledging the Shadow', description: 'Honor your difficult feelings', activity: 'Share about a challenging experience', completed: false },
      { id: 'walk-feelings', title: 'Walking With Your Feelings', description: 'Sit with emotions without judgment', activity: 'Practice gentle self-compassion', completed: false },
      { id: 'find-light', title: 'Finding Pinpoints of Light', description: 'Discover small moments of hope or beauty', activity: 'Identify one thing you\'re grateful for', completed: false },
    ],
    currentMilestone: 0,
    completed: false,
    unlocked: false,
  },
  {
    id: 'mountain-doubt',
    title: 'The Mountain of Self-Doubt',
    description: 'Build self-compassion and discover your inner strength',
    theme: 'doubt',
    milestones: [
      { id: 'critical-voice', title: 'Recognizing the Critical Voice', description: 'Notice self-criticism without judgment', activity: 'Identify patterns of self-doubt', completed: false },
      { id: 'challenge-climb', title: 'Challenging the Climb', description: 'Practice speaking to yourself with kindness', activity: 'Write yourself a compassionate message', completed: false },
      { id: 'summit-view', title: 'Reaching Your Summit View', description: 'See yourself from a place of strength', activity: 'Acknowledge your personal growth', completed: false },
    ],
    currentMilestone: 0,
    completed: false,
    unlocked: false,
  },
];

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GamificationState>({
    totalSeeds: 15, // Start with some seeds
    dailySeeds: 15,
    weeklyMilestone: null,
    reflectionStreak: 1,
    lastCheckIn: new Date(),
    badges: initialBadges,
    recentBadge: null,
    activeQuests: [initialQuests[0]], // Start with first quest active
    completedQuests: [],
    lastAffirmation: null,
    comfortItems: [],
  });

  const addSeeds = (amount: number, reason: string) => {
    setState(prev => {
      const newTotal = prev.totalSeeds + amount;
      const newDaily = prev.dailySeeds + amount;
      
      // Determine weekly milestone
      let milestone: typeof prev.weeklyMilestone = prev.weeklyMilestone;
      if (newTotal >= 300) milestone = 'flourish';
      else if (newTotal >= 150) milestone = 'bloom';
      else if (newTotal >= 75) milestone = 'sprout';
      else if (newTotal >= 25) milestone = 'seedling';
      
      return {
        ...prev,
        totalSeeds: newTotal,
        dailySeeds: newDaily,
        weeklyMilestone: milestone,
      };
    });
  };

  const unlockBadge = (badgeId: string) => {
    setState(prev => {
      const updatedBadges = prev.badges.map(badge =>
        badge.id === badgeId && !badge.unlocked
          ? { ...badge, unlocked: true, unlockedAt: new Date() }
          : badge
      );
      
      const newlyUnlocked = updatedBadges.find(b => b.id === badgeId && b.unlocked);
      
      return {
        ...prev,
        badges: updatedBadges,
        recentBadge: newlyUnlocked || null,
      };
    });
  };

  const updateQuestProgress = (questId: string, milestoneId: string) => {
    setState(prev => {
      const updatedQuests = prev.activeQuests.map(quest => {
        if (quest.id === questId) {
          const updatedMilestones = quest.milestones.map(milestone =>
            milestone.id === milestoneId ? { ...milestone, completed: true } : milestone
          );
          
          const currentMilestone = updatedMilestones.findIndex(m => !m.completed);
          const isCompleted = currentMilestone === -1;
          
          return {
            ...quest,
            milestones: updatedMilestones,
            currentMilestone: isCompleted ? quest.milestones.length : currentMilestone,
            completed: isCompleted,
          };
        }
        return quest;
      });
      
      return {
        ...prev,
        activeQuests: updatedQuests,
      };
    });
  };

  const triggerAffirmation = (message: string) => {
    setState(prev => ({
      ...prev,
      lastAffirmation: message,
    }));
  };

  const giveComfortItem = (item: string) => {
    setState(prev => ({
      ...prev,
      comfortItems: [...prev.comfortItems, item],
    }));
  };

  const checkDailyReset = () => {
    const now = new Date();
    const lastCheckIn = state.lastCheckIn;
    
    if (lastCheckIn && now.toDateString() !== lastCheckIn.toDateString()) {
      setState(prev => ({
        ...prev,
        dailySeeds: 0,
        lastCheckIn: now,
        reflectionStreak: prev.reflectionStreak + 1,
      }));
    }
  };

  return (
    <GamificationContext.Provider value={{
      state,
      addSeeds,
      unlockBadge,
      updateQuestProgress,
      triggerAffirmation,
      giveComfortItem,
      checkDailyReset,
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
