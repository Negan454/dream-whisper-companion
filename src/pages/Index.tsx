
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

// Initial welcome message
const initialMessages: Message[] = [
  {
    id: '1',
    text: "Welcome to MindfulReflect, a space for emotional growth and self-discovery. How are you feeling today?",
    sender: 'companion',
    timestamp: new Date(),
  },
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

// Function to analyze text sentiment and determine emotion
const analyzeSentiment = (text: string): Emotion => {
  const text_lower = text.toLowerCase();
  
  // Simple keyword-based analysis - in a real app, you'd use a more sophisticated NLP approach
  if (text_lower.includes('happy') || text_lower.includes('glad') || text_lower.includes('joy') || 
      text_lower.includes('excited') || text_lower.includes('good')) {
    return 'joy';
  } else if (text_lower.includes('wonder') || text_lower.includes('curious') || 
             text_lower.includes('amazed') || text_lower.includes('fascinating')) {
    return 'wonder';
  } else if (text_lower.includes('think') || text_lower.includes('reflect') || 
             text_lower.includes('consider') || text_lower.includes('ponder')) {
    return 'reflection';
  } else {
    return 'curiosity'; // Default
  }
};

// Function to generate AI response - this would connect to a backend API in a real app
const generateResponse = (message: string): string => {
  // Simple response logic - in a real app, this would call an API
  if (message.toLowerCase().includes('how are you')) {
    return "I'm here to support your reflection journey. How are you feeling today?";
  } else if (message.toLowerCase().includes('feeling')) {
    return "Emotions provide valuable insight into our inner landscape. What do you think might be influencing how you feel right now?";
  } else if (message.toLowerCase().includes('stress') || message.toLowerCase().includes('anxious')) {
    return "It sounds like you're experiencing some tension. Taking a moment to breathe deeply can help create a little space around difficult emotions. Would you like to explore what might be contributing to these feelings?";
  } else if (message.toLowerCase().includes('happy') || message.toLowerCase().includes('joy')) {
    return "I'm glad to hear you're experiencing positive emotions. Savoring these moments can help strengthen your emotional resilience. What aspects of this experience would you like to carry forward?";
  } else {
    return "Thank you for sharing. Continued reflection can reveal patterns and insights about your emotional experience. Is there a specific aspect you'd like to explore further?";
  }
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
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
  
  // Handle user message submission
  const handleSendMessage = (messageText: string) => {
    // Create new player message
    const playerMessage: Message = {
      id: `p${Date.now()}`,
      text: messageText,
      sender: 'player',
      timestamp: new Date(),
    };
    
    // Add player message to chat
    setMessages(prev => [...prev, playerMessage]);
    
    // Increment session progress with each interaction
    setSessionProgress(prev => Math.min(prev + 5, 100));
    
    // Analyze sentiment and determine emotion
    const emotion = analyzeSentiment(messageText);
    
    // Add memory for significant messages
    if (messageText.length > 15) {
      const newMemory: Memory = {
        id: `m${Date.now()}`,
        title: `Reflection on ${new Date().toLocaleDateString()}`,
        description: messageText.length > 50 ? `${messageText.substring(0, 50)}...` : messageText,
        emotion: emotion,
        relatedMessages: [playerMessage.id],
        timestamp: new Date(),
      };
      
      setMemories(prev => [...prev, newMemory]);
      
      // Increment insights count
      setInsightsCount(prev => prev + 1);
      
      // Check for achievements
      if (insightsCount >= 2 && !achievements[3].unlocked) {
        unlockAchievement('a4');
      }
    }
    
    // Generate response (simulated AI response)
    setTimeout(() => {
      const responseText = generateResponse(messageText);
      
      const response: Message = {
        id: `c${Date.now()}`,
        text: responseText,
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      
      // Check for emotional explorer achievement
      if (messages.length > 6 && !achievements[1].unlocked) {
        unlockAchievement('a2');
      }
      
      // Check for growth mindset achievement
      if (messages.length > 10 && !achievements[2].unlocked) {
        unlockAchievement('a3');
      }
    }, 1000);
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
        text: `Returning to '${memory.title}' offers us valuable insights. This moment captured ${emotionDescription}. How does revisiting this reflection feel right now?`,
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
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
          ? "Welcome to the Reflection Garden, a space where your thoughts can bloom freely. Each plant here represents different aspects of emotional growth - patience, resilience, compassion, and joy. What qualities might you want to nurture more in your emotional life?"
          : pointId === 'point2'
          ? "The Memory Stream flows with moments from your reflection journey. Some memories appear as clear pools, while others mix and blend together. Is there a particular memory that stands out to you right now that you'd like to revisit?"
          : "The Insight Sanctuary is where scattered thoughts coalesce into meaningful patterns. What connections are you beginning to see between your different emotional experiences?",
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
                    onSendMessage={handleSendMessage}
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
