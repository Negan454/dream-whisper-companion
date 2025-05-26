import React, { useState, useEffect } from 'react';
import { Message } from '@/components/ChatInterface';
import UnifiedInterface from '@/components/UnifiedInterface';
import Particles from '@/components/Particles';
import DreamTransition from '@/components/DreamTransition';
import DisclaimerBanner from '@/components/DisclaimerBanner';
import BadgeNotification from '@/components/BadgeNotification';
import AffirmationFloat from '@/components/AffirmationFloat';
import { GamificationProvider, useGamification } from '@/contexts/GamificationContext';
import { useMemorySystem } from '@/hooks/useMemorySystem';

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

interface EmotionCount {
  emotion: Emotion;
  count: number;
}

interface EmotionTrend {
  time: string;
  emotion: Emotion;
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

// Function to analyze text sentiment and determine emotion
const analyzeSentiment = (text: string): Emotion => {
  const text_lower = text.toLowerCase();
  
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
    return 'curiosity';
  }
};

const IndexContent = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // New state for emotion tracking
  const [emotionCounts, setEmotionCounts] = useState<EmotionCount[]>([
    { emotion: 'joy', count: 0 },
    { emotion: 'wonder', count: 1 },
    { emotion: 'reflection', count: 0 },
    { emotion: 'curiosity', count: 0 },
  ]);
  
  const [emotionTrends, setEmotionTrends] = useState<EmotionTrend[]>([
    { 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
      emotion: 'wonder' 
    }
  ]);

  // Use gamification context and memory system
  const { state, addSeeds, unlockBadge, triggerAffirmation, checkDailyReset } = useGamification();
  const { 
    addToShortTermMemory, 
    getConversationContextForAPI,
    getTherapyNotes,
    endCurrentSession
  } = useMemorySystem();
  
  // Check for daily reset on component mount
  useEffect(() => {
    checkDailyReset();
  }, []);
  
  // Function to track a new emotion
  const trackEmotion = (emotion: Emotion) => {
    setEmotionCounts(prev => 
      prev.map(item => 
        item.emotion === emotion 
          ? { ...item, count: item.count + 1 } 
          : item
      )
    );
    
    setEmotionTrends(prev => [
      ...prev, 
      { 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        emotion: emotion 
      }
    ]);
  };

  // Function to call your backend API
  const callTherapistAPI = async (userMessage: string, conversationContext: any): Promise<{ response: string; emotion: string; memory_tag: string }> => {
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: userMessage,
          history: conversationContext.recentConversations,
          patient_context: {
            profile: conversationContext.patientProfile,
            key_insights: conversationContext.keyInsights,
            emotional_patterns: conversationContext.emotionalPatterns,
            previous_sessions: conversationContext.previousSessions
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        response: data.response,
        emotion: data.emotion,
        memory_tag: data.memory_tag
      };
    } catch (error) {
      console.error('Error calling therapist API:', error);
      return {
        response: "I'm having trouble connecting right now, but I'm here to listen. Would you like to try sharing again?",
        emotion: 'neutral',
        memory_tag: 'connection_error'
      };
    }
  };

  // Function to check for badge-worthy moments
  const checkForBadges = (userMessage: string, emotion: string) => {
    const text_lower = userMessage.toLowerCase();
    
    if (text_lower.includes('difficult') || text_lower.includes('hard') || text_lower.includes('struggle')) {
      unlockBadge('brave-heart');
      addSeeds(15, 'Shared something difficult');
      triggerAffirmation("Your courage to share this shows incredible strength");
    } else if (text_lower.includes('grateful') || text_lower.includes('thankful') || text_lower.includes('appreciate')) {
      unlockBadge('inner-light');
      addSeeds(10, 'Practiced gratitude');
    } else if (text_lower.includes('anxious') || text_lower.includes('worried') || text_lower.includes('stress')) {
      unlockBadge('quiet-strength');
      addSeeds(12, 'Acknowledged anxiety without judgment');
    } else {
      addSeeds(5, 'Continued reflection');
    }
  };
  
  // Handle user message submission
  const handleSendMessage = async (messageText: string) => {
    // Create new player message
    const playerMessage: Message = {
      id: `p${Date.now()}`,
      text: messageText,
      sender: 'player',
      timestamp: new Date(),
    };
    
    // Add player message to chat
    setMessages(prev => [...prev, playerMessage]);
    setIsLoading(true);
    
    try {
      // Get comprehensive conversation context
      const conversationContext = getConversationContextForAPI();
      
      // Call your backend API with enhanced context
      const apiResponse = await callTherapistAPI(messageText, conversationContext);
      
      // Determine emotion (use API response or fallback to local analysis)
      const emotion = apiResponse.emotion !== 'neutral' ? 
        apiResponse.emotion as Emotion : 
        analyzeSentiment(messageText);
      
      // Track the emotion
      trackEmotion(emotion);
      
      // Check for badges and award seeds
      checkForBadges(messageText, emotion);
      
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
      }
      
      // Create therapist response
      const response: Message = {
        id: `c${Date.now()}`,
        text: apiResponse.response,
        sender: 'companion',
        timestamp: new Date(),
      };
      
      // Add to short-term memory
      addToShortTermMemory(
        messageText,
        apiResponse.response,
        emotion,
        apiResponse.memory_tag
      );
      
      // Add response to chat
      setMessages(prev => [...prev, response]);
      
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Fallback response
      const fallbackResponse: Message = {
        id: `c${Date.now()}`,
        text: "I'm experiencing some technical difficulties, but your thoughts are important. Would you like to try sharing again?",
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDreamTransition = (message: string) => {
    setTransitionMessage(message);
    setShowTransition(true);
    
    setTimeout(() => {
      setShowTransition(false);
      setTransitionMessage(null);
    }, 3000);
  };

  const handleEndSession = () => {
    endCurrentSession();
    setMessages(initialMessages); // Reset to welcome message
    triggerAffirmation("Thank you for this meaningful conversation. Your insights are valuable.");
  };

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
          <div className="mt-4">
            <button
              onClick={handleEndSession}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm"
            >
              End Session & Start Fresh
            </button>
          </div>
        </header>
        
        <DisclaimerBanner />
        
        <div className="max-w-6xl mx-auto">
          <UnifiedInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
            recentMemories={memories}
            emotionCounts={emotionCounts}
            emotionTrends={emotionTrends}
          />
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
      
      {/* Gamification notifications */}
      <BadgeNotification
        badge={state.recentBadge}
        onClose={() => {}}
      />
      
      <AffirmationFloat
        message={state.lastAffirmation}
        onClose={() => triggerAffirmation(null)}
      />
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-teal-200">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-teal-500 border-t-transparent rounded-full"></div>
            <span className="text-sm text-teal-700">Dr. Sage is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <GamificationProvider>
      <IndexContent />
    </GamificationProvider>
  );
};

export default Index;
