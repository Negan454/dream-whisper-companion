import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, MessageCircle, Heart, Award, Sparkles } from 'lucide-react';
import ChatInterface, { Message } from '@/components/ChatInterface';
import MemoryJournal from '@/components/MemoryJournal';
import DreamTransition from '@/components/DreamTransition';
import GameWorld from '@/components/GameWorld';
import Particles from '@/components/Particles';
import ProgressTracker from '@/components/ProgressTracker';
import AchievementPopup from '@/components/AchievementPopup';
import DisclaimerBanner from '@/components/DisclaimerBanner';

// Define emotion type to handle all possible emotions
type Emotion = 'joy' | 'wonder' | 'reflection' | 'curiosity';

// Memory interface to properly type our state
interface Memory {
  id: string;
  title: string;
  description: string;
  emotion: Emotion;
  relatedMessages: string[];
  timestamp: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'award' | 'star' | 'heart' | 'book';
  unlocked: boolean;
}

// Mock initial messages with therapeutic tone
const initialMessages: Message[] = [
  {
    id: '1',
    text: "Welcome to your reflection space. I'm here to help you explore your thoughts and feelings in a supportive environment. What would you like me to call you?",
    sender: 'companion',
    timestamp: new Date(),
  },
];

const initialChoices = [
  { id: 'name1', text: 'You can call me Wanderer', voiceEnabled: true },
  { id: 'name2', text: 'I prefer to be known as Seeker', voiceEnabled: true },
  { id: 'name3', text: 'My name is Explorer', voiceEnabled: true },
];

const initialMemories: Memory[] = [
  {
    id: 'm1',
    title: 'First Session',
    description: 'Beginning your journey of self-reflection and emotional growth.',
    emotion: 'wonder',
    relatedMessages: ['1'],
    timestamp: new Date(),
  },
];

const initialAchievements: Achievement[] = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Begin your journey of self-reflection',
    icon: 'star',
    unlocked: true
  },
  {
    id: 'a2',
    title: 'Emotional Explorer',
    description: 'Identify and acknowledge 3 different emotions',
    icon: 'heart',
    unlocked: false
  },
  {
    id: 'a3',
    title: 'Growth Mindset',
    description: 'Complete 5 reflection sessions',
    icon: 'award',
    unlocked: false
  },
  {
    id: 'a4',
    title: 'Journal Keeper',
    description: 'Create 3 personal insights',
    icon: 'book',
    unlocked: false
  }
];

const interactionPoints = [
  {
    id: 'point1',
    x: 30,
    y: 40,
    label: 'Reflection Garden',
    onClick: () => {}, // Will be handled in the component
  },
  {
    id: 'point2',
    x: 70,
    y: 60,
    label: 'Memory Stream',
    onClick: () => {},
  },
  {
    id: 'point3',
    x: 50,
    y: 20,
    label: 'Insight Sanctuary',
    onClick: () => {},
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [choices, setChoices] = useState(initialChoices);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [sessionProgress, setSessionProgress] = useState(10);
  const [reflectionStreak, setReflectionStreak] = useState(1);
  const [insightsCount, setInsightsCount] = useState(0);
  const [showAchievement, setShowAchievement] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  
  // Function to unlock achievements and show notification
  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId && !a.unlocked);
    if (achievement) {
      setAchievements(prev => 
        prev.map(a => a.id === achievementId ? {...a, unlocked: true} : a)
      );
      setCurrentAchievement(achievement);
      setShowAchievement(true);
      
      // Increment session progress when achievement is unlocked
      setSessionProgress(prev => Math.min(prev + 15, 100));
    }
  };
  
  const handleChoiceSelect = (choiceId: string) => {
    // Find the selected choice
    const selectedChoice = choices.find(choice => choice.id === choiceId);
    if (!selectedChoice) return;
    
    // Add player message
    const playerMessage: Message = {
      id: `p${Date.now()}`,
      text: selectedChoice.text,
      sender: 'player',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, playerMessage]);
    
    // Increment session progress with each interaction
    setSessionProgress(prev => Math.min(prev + 5, 100));
    
    // Process the choice
    if (choiceId.startsWith('name')) {
      const name = selectedChoice.text.split(' ').pop();
      setPlayerName(name);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: `${name}, thank you for sharing. It's wonderful to meet you. This space is designed to help you reflect on your thoughts and feelings in a supportive environment. How are you feeling today?`,
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        
        // Update choices after name is selected
        setChoices([
          { id: 'feeling_good', text: 'I\'m feeling pretty good today', voiceEnabled: true },
          { id: 'feeling_mixed', text: 'I have mixed emotions right now', voiceEnabled: true },
          { id: 'feeling_down', text: 'I\'m not feeling my best', voiceEnabled: true },
        ]);
        
        // Unlock first achievement after introducing yourself
        if (!achievements[0].unlocked) {
          unlockAchievement('a1');
        }
      }, 1000);
    } else if (choiceId.startsWith('feeling')) {
      // Simulate AI response after a short delay
      setTimeout(() => {
        let responseText = "";
        
        if (choiceId === 'feeling_good') {
          responseText = "I'm glad to hear you're feeling good today. Recognizing and acknowledging positive emotions is an important part of emotional wellness. What do you think is contributing to your positive mood?";
        } else if (choiceId === 'feeling_mixed') {
          responseText = "Having mixed emotions is completely normal. Our feelings are often complex and multifaceted. Would you like to explore these different emotions a bit more deeply?";
        } else {
          responseText = "I'm sorry to hear you're not feeling your best. Remember that all emotions, even difficult ones, provide valuable information and are an important part of our experience. Would you like to reflect on what might be influencing how you feel?";
        }
        
        const response: Message = {
          id: `c${Date.now()}`,
          text: responseText,
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        
        // Update choices based on feeling response
        if (choiceId === 'feeling_good') {
          setChoices([
            { id: 'explore_positive', text: 'I\'d like to explore what\'s going well', voiceEnabled: true },
            { id: 'build_on_good', text: 'How can I build on these positive feelings?', voiceEnabled: true },
            { id: 'remember_good', text: 'I want to remember this feeling for harder times', voiceEnabled: true },
          ]);
        } else if (choiceId === 'feeling_mixed') {
          setChoices([
            { id: 'identify_emotions', text: 'Help me identify these different emotions', voiceEnabled: true },
            { id: 'balance_feelings', text: 'How can I find balance with mixed feelings?', voiceEnabled: true },
            { id: 'visualize_emotions', text: 'Let\'s visualize my emotional landscape', voiceEnabled: true },
          ]);
        } else {
          setChoices([
            { id: 'gentle_exploration', text: 'I\'d like to gently explore what\'s happening', voiceEnabled: true },
            { id: 'comfort_strategies', text: 'What are some self-comfort strategies?', voiceEnabled: true },
            { id: 'find_perspective', text: 'Help me find perspective on my feelings', voiceEnabled: true },
          ]);
        }
        
        // Add memory for this emotional reflection
        let emotionType: Emotion = 'reflection'; // Default value
        
        if (choiceId === 'feeling_good') {
          emotionType = 'joy';
        } else if (choiceId === 'feeling_mixed') {
          emotionType = 'reflection';
        } else {
          emotionType = 'wonder';
        }
        
        const newMemory: Memory = {
          id: `m${Date.now()}`,
          title: 'Emotional Check-in',
          description: `Reflected on your emotional state and identified key feelings.`,
          emotion: emotionType,
          relatedMessages: [response.id],
          timestamp: new Date(),
        };
        
        setMemories(prev => [...prev, newMemory]);
        
        // Add insight count
        setInsightsCount(prev => prev + 1);
      }, 1000);
    } else if (choiceId.startsWith('explore') || choiceId.startsWith('build') || choiceId.startsWith('remember')) {
      handleDreamTransition("Exploring positive emotions...");
      
      // Unlock the emotional explorer achievement if not already unlocked
      if (!achievements[1].unlocked) {
        setTimeout(() => {
          unlockAchievement('a2');
        }, 2000);
      }
      
      // Simulate AI response after transition
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: "Positive emotions are like nurturing rain for your emotional garden. As we explore them, notice how they feel in your body - perhaps warmth in your chest, relaxation in your shoulders, or a lightness in your step. By building awareness of these sensations, you can better recognize and cultivate positive states in the future. What specific positive emotion feels strongest right now?",
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        setActiveTab("world");
        
        // Add this as a memory
        const newMemory: Memory = {
          id: `m${Date.now()}`,
          title: 'Positive Emotion Exploration',
          description: 'Examined and developed awareness of positive emotional states.',
          emotion: 'joy',
          relatedMessages: [response.id],
          timestamp: new Date(),
        };
        
        setMemories(prev => [...prev, newMemory]);
        
        // Increment session progress for deeper exploration
        setSessionProgress(prev => Math.min(prev + 10, 100));
      }, 3000);
    } else if (choiceId.startsWith('identify') || choiceId.startsWith('balance') || choiceId.startsWith('visualize')) {
      // Simulate AI response after a short delay
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: "Mixed emotions often contain wisdom from different parts of ourselves. Imagine each emotion as a different colored stream flowing together. There's no need to force these emotions to resolve into a single feeling. By giving gentle attention to each one, you honor your full experience. Would you like to name some of the emotions you're feeling right now?",
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        
        // Update choices
        setChoices([
          { id: 'name_emotions', text: 'I feel hopeful but also anxious', voiceEnabled: true },
          { id: 'emotion_map', text: 'Can we create a map of my emotions?', voiceEnabled: true },
          { id: 'emotion_wisdom', text: 'What wisdom might these emotions hold?', voiceEnabled: true },
        ]);
        
        // Add this as a memory
        const newMemory: Memory = {
          id: `m${Date.now()}`,
          title: 'Emotional Complexity',
          description: 'Explored the nuanced landscape of mixed emotions.',
          emotion: 'reflection',
          relatedMessages: [response.id],
          timestamp: new Date(),
        };
        
        setMemories(prev => [...prev, newMemory]);
        
        // Increment insights count
        setInsightsCount(prev => prev + 1);
      }, 1000);
    } else if (choiceId.startsWith('gentle') || choiceId.startsWith('comfort') || choiceId.startsWith('find')) {
      handleDreamTransition("Creating a safe reflection space...");
      
      // Simulate AI response after transition
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: "When we're not feeling our best, it's especially important to approach ourselves with compassion. Imagine you're sitting with a dear friend who's feeling exactly as you are now. What gentle wisdom would you offer them? Sometimes the kindest perspective comes from how we would treat someone we deeply care about.",
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        setActiveTab("chat");
        
        // Unlock the growth mindset achievement if this is the 5th interaction
        if (messages.length > 10 && !achievements[2].unlocked) {
          unlockAchievement('a3');
        }
      }, 3000);
    }
  };
  
  const handleMemorySelect = (memory: Memory) => {
    setActiveTab("chat");
    
    // Increment session progress when reviewing memories
    setSessionProgress(prev => Math.min(prev + 5, 100));
    
    setTimeout(() => {
      const emotionDescription = memory.emotion === 'joy' 
        ? 'a moment of genuine happiness and contentment' 
        : memory.emotion === 'wonder' 
        ? 'curiosity and openness to new perspectives' 
        : memory.emotion === 'reflection'
        ? 'thoughtful contemplation and emotional awareness'
        : 'a keen interest in exploring deeper understanding';
      
      const response: Message = {
        id: `c${Date.now()}`,
        text: `Returning to '${memory.title}' offers us valuable insights. This moment captured ${emotionDescription}. How does revisiting this reflection feel right now? Has your perspective shifted or deepened since then?`,
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      
      setChoices([
        { id: 'deeper_reflection', text: 'I\'d like to explore this more deeply', voiceEnabled: true },
        { id: 'emotion_shift', text: 'My feelings about this have evolved', voiceEnabled: true },
        { id: 'memory_insight', text: 'I see a pattern in my reflections', voiceEnabled: true },
      ]);
      
      // Unlock the journal keeper achievement if reviewing multiple memories
      if (memories.length >= 3 && !achievements[3].unlocked) {
        unlockAchievement('a4');
      }
    }, 500);
  };
  
  const handleInteractionPoint = (pointId: string) => {
    const point = interactionPoints.find(p => p.id === pointId);
    if (!point) return;
    
    handleDreamTransition(`Entering the ${point.label}...`);
    
    // Increment session progress for exploring the world
    setSessionProgress(prev => Math.min(prev + 10, 100));
    
    // Switch to chat tab after transition
    setTimeout(() => {
      setActiveTab("chat");
      
      // Simulate AI response based on interaction point
      const response: Message = {
        id: `c${Date.now()}`,
        text: pointId === 'point1' 
          ? "Welcome to the Reflection Garden, a space where your thoughts can bloom freely. Each plant here represents different aspects of emotional growth - patience, resilience, compassion, and joy. As you walk through this garden, notice which plants draw your attention. What qualities might you want to nurture more in your emotional life?"
          : pointId === 'point2'
          ? "The Memory Stream flows with moments from your reflection journey. Some memories appear as clear pools, while others mix and blend together. This stream reminds us that our experiences are constantly flowing and changing. Is there a particular memory that stands out to you right now that you'd like to revisit?"
          : "The Insight Sanctuary is where scattered thoughts coalesce into meaningful patterns. Here, your reflections transform into deeper understanding. What connections are you beginning to see between your different emotional experiences? Even small realizations can lead to significant growth.",
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      
      // Add new memory
      const newMemory: Memory = {
        id: `m${Date.now()}`,
        title: `Explored ${point.label}`,
        description: `Gained perspective through metaphorical exploration of your inner landscape.`,
        emotion: 'curiosity',
        relatedMessages: [response.id],
        timestamp: new Date(),
      };
      
      setMemories(prev => [...prev, newMemory]);
      
      // Update choices
      setChoices([
        { id: 'reflect_space', text: 'What does this space reveal about my journey?', voiceEnabled: true },
        { id: 'inner_wisdom', text: 'I sense something meaningful here', voiceEnabled: true },
        { id: 'growth_question', text: 'How can I apply this insight in my life?', voiceEnabled: true },
      ]);
      
      // Increment insights for exploring meaningful spaces
      setInsightsCount(prev => prev + 1);
    }, 3000);
  };
  
  const handleDreamTransition = (message: string) => {
    setTransitionMessage(message);
    setShowTransition(true);
    
    // Hide transition after animation completes
    setTimeout(() => {
      setShowTransition(false);
      setTransitionMessage(null);
    }, 3000);
  };
  
  // Update interactionPoints with handlers
  const worldInteractionPoints = interactionPoints.map(point => ({
    ...point,
    onClick: () => handleInteractionPoint(point.id)
  }));

  return (
    <div className="min-h-screen w-full bg-gradient-radial from-teal-50 via-blue-50 to-purple-50 overflow-hidden">
      <Particles quantity={10} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-800 mb-2">
            MindfulReflect
          </h1>
          <p className="text-blue-700 max-w-xl mx-auto">
            A compassionate guide for emotional growth and self-discovery
          </p>
        </header>
        
        <DisclaimerBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 max-w-6xl mx-auto">
          <div className="lg:col-span-9">
            <Card className="therapeutic-card overflow-hidden border-none shadow-xl">
              <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm border-b border-teal-100">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-teal-50">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>Reflection</span>
                  </TabsTrigger>
                  <TabsTrigger value="world" className="data-[state=active]:bg-blue-50">
                    <Heart className="w-4 h-4 mr-2" />
                    <span>Journey</span>
                  </TabsTrigger>
                  <TabsTrigger value="memories" className="data-[state=active]:bg-purple-50">
                    <Book className="w-4 h-4 mr-2" />
                    <span>Insights</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="m-0 h-[60vh]">
                  <ChatInterface 
                    messages={messages} 
                    choices={choices}
                    onSelectChoice={handleChoiceSelect}
                  />
                </TabsContent>
                
                <TabsContent value="world" className="m-0 h-[60vh]">
                  <GameWorld 
                    interactionPoints={worldInteractionPoints}
                  />
                </TabsContent>
                
                <TabsContent value="memories" className="m-0 h-[60vh] overflow-y-auto">
                  <MemoryJournal 
                    memories={memories}
                    messages={messages}
                    onMemorySelect={handleMemorySelect}
                  />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <ProgressTracker 
              sessionProgress={sessionProgress}
              reflectionStreak={reflectionStreak}
              insightsCount={insightsCount}
              achievements={achievements}
              className="h-full"
            />
          </div>
        </div>
        
        <footer className="mt-8 text-center text-teal-500 text-sm">
          <p>MindfulReflect - Your companion for emotional growth and self-discovery</p>
          <p className="text-xs mt-1">Remember: This is a self-reflection tool, not a substitute for professional therapy.</p>
        </footer>
      </div>
      
      {/* Dream transition overlay */}
      <DreamTransition 
        isActive={showTransition} 
        onTransitionEnd={() => setShowTransition(false)}
      >
        {transitionMessage && (
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg animate-float">
            {transitionMessage}
          </h2>
        )}
      </DreamTransition>
      
      {/* Achievement popup */}
      {currentAchievement && (
        <AchievementPopup
          title={currentAchievement.title}
          description={currentAchievement.description}
          isVisible={showAchievement}
          onClose={() => setShowAchievement(false)}
        />
      )}
    </div>
  );
};

export default Index;
