
import { useState, useEffect } from 'react';

export interface ShortTermMemory {
  id: string;
  timestamp: Date;
  userMessage: string;
  therapistResponse: string;
  emotion: string;
  memoryTag: string;
  sessionId: string;
}

export interface LongTermMemory {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  patientInsights: string[];
  recurringThemes: string[];
  progressNotes: string[];
  importantMilestones: string[];
  triggerPatterns: string[];
  copingStrategies: string[];
  sessionCount: number;
  patientProfile: {
    name?: string;
    commonConcerns: string[];
    preferredCopingMethods: string[];
    emotionalPatterns: string[];
    personalDetails: string[];
  };
}

export interface TherapySession {
  id: string;
  date: Date;
  duration: number;
  keyTopics: string[];
  emotionalTone: string;
  breakthroughs: string[];
  actionItems: string[];
  sessionSummary: string;
  messageCount: number;
}

export interface ConversationContext {
  recentConversations: string[];
  patientProfile: string;
  keyInsights: string[];
  emotionalPatterns: string;
  previousSessions: string[];
}

export const useMemorySystem = () => {
  const [shortTermMemory, setShortTermMemory] = useState<ShortTermMemory[]>([]);
  const [longTermMemory, setLongTermMemory] = useState<LongTermMemory | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<TherapySession[]>([]);

  // Initialize memory system
  useEffect(() => {
    const saved = localStorage.getItem('mindful-reflect-memory');
    if (saved) {
      const data = JSON.parse(saved);
      setShortTermMemory(data.shortTerm || []);
      setLongTermMemory(data.longTerm || createInitialLongTermMemory());
      setSessions(data.sessions || []);
    } else {
      setLongTermMemory(createInitialLongTermMemory());
    }
    
    // Create new session ID
    setCurrentSessionId(`session-${Date.now()}`);
  }, []);

  // Save to localStorage whenever memory changes
  useEffect(() => {
    if (longTermMemory) {
      localStorage.setItem('mindful-reflect-memory', JSON.stringify({
        shortTerm: shortTermMemory,
        longTerm: longTermMemory,
        sessions: sessions
      }));
    }
  }, [shortTermMemory, longTermMemory, sessions]);

  const createInitialLongTermMemory = (): LongTermMemory => ({
    id: 'ltm-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    patientInsights: [],
    recurringThemes: [],
    progressNotes: [],
    importantMilestones: [],
    triggerPatterns: [],
    copingStrategies: [],
    sessionCount: 0,
    patientProfile: {
      commonConcerns: [],
      preferredCopingMethods: [],
      emotionalPatterns: [],
      personalDetails: []
    }
  });

  const addToShortTermMemory = (
    userMessage: string,
    therapistResponse: string,
    emotion: string,
    memoryTag: string
  ) => {
    const newMemory: ShortTermMemory = {
      id: `stm-${Date.now()}`,
      timestamp: new Date(),
      userMessage,
      therapistResponse,
      emotion,
      memoryTag,
      sessionId: currentSessionId
    };

    setShortTermMemory(prev => [...prev, newMemory]);
    
    // Analyze for long-term patterns
    analyzePatternsAndUpdateLongTerm(newMemory);
    
    return newMemory;
  };

  const analyzePatternsAndUpdateLongTerm = (memory: ShortTermMemory) => {
    if (!longTermMemory) return;

    const updatedLTM = { ...longTermMemory };
    updatedLTM.updatedAt = new Date();

    // Extract insights from user messages
    if (memory.userMessage.length > 50) {
      const insight = memory.memoryTag;
      if (!updatedLTM.patientInsights.includes(insight)) {
        updatedLTM.patientInsights.push(insight);
      }
    }

    // Track emotional patterns
    const emotionPattern = `${memory.emotion} - ${memory.memoryTag.substring(0, 30)}`;
    if (memory.emotion !== 'neutral' && !updatedLTM.recurringThemes.some(theme => 
      theme.includes(memory.emotion))) {
      updatedLTM.recurringThemes.push(emotionPattern);
    }

    // Identify coping strategies mentioned
    const copingKeywords = ['breathe', 'meditate', 'journal', 'walk', 'talk', 'exercise', 'sleep', 'music'];
    const hasCopingStrategy = copingKeywords.some(keyword => 
      memory.userMessage.toLowerCase().includes(keyword) || 
      memory.therapistResponse.toLowerCase().includes(keyword)
    );
    
    if (hasCopingStrategy) {
      const strategy = `${memory.memoryTag.substring(0, 40)} (${new Date().toLocaleDateString()})`;
      if (!updatedLTM.copingStrategies.includes(strategy)) {
        updatedLTM.copingStrategies.push(strategy);
      }
    }

    // Extract personal details
    const personalKeywords = ['family', 'work', 'school', 'relationship', 'friend', 'parent', 'child'];
    const hasPersonalDetail = personalKeywords.some(keyword => 
      memory.userMessage.toLowerCase().includes(keyword)
    );
    
    if (hasPersonalDetail && memory.userMessage.length > 30) {
      const detail = memory.userMessage.substring(0, 80);
      if (!updatedLTM.patientProfile.personalDetails.some(d => d.includes(detail.substring(0, 20)))) {
        updatedLTM.patientProfile.personalDetails.push(detail);
      }
    }

    // Track common concerns
    const concernKeywords = ['anxiety', 'stress', 'worried', 'sad', 'angry', 'lonely', 'overwhelmed'];
    const hasConcern = concernKeywords.some(keyword => 
      memory.userMessage.toLowerCase().includes(keyword)
    );
    
    if (hasConcern) {
      const concern = concernKeywords.find(keyword => 
        memory.userMessage.toLowerCase().includes(keyword)
      );
      if (concern && !updatedLTM.patientProfile.commonConcerns.includes(concern)) {
        updatedLTM.patientProfile.commonConcerns.push(concern);
      }
    }

    setLongTermMemory(updatedLTM);
  };

  const getConversationHistory = (): string[] => {
    return shortTermMemory
      .filter(m => m.sessionId === currentSessionId)
      .slice(-6) // Last 6 exchanges
      .flatMap(m => [
        `User: ${m.userMessage}`,
        `Dr. Sage: ${m.therapistResponse}`
      ]);
  };

  const getConversationContextForAPI = (): ConversationContext => {
    // Get recent conversations from current session
    const currentSessionMemories = shortTermMemory.filter(m => m.sessionId === currentSessionId);
    const recentConversations = currentSessionMemories.slice(-4).map(m => 
      `User: ${m.userMessage}\nDr. Sage: ${m.therapistResponse}`
    );

    // Get patient profile summary
    const patientProfile = longTermMemory ? [
      longTermMemory.patientProfile.commonConcerns.length > 0 ? 
        `Common concerns: ${longTermMemory.patientProfile.commonConcerns.join(', ')}` : '',
      longTermMemory.patientProfile.personalDetails.length > 0 ? 
        `Personal context: ${longTermMemory.patientProfile.personalDetails.slice(-2).join('; ')}` : '',
      longTermMemory.copingStrategies.length > 0 ? 
        `Previously discussed coping strategies: ${longTermMemory.copingStrategies.slice(-3).join('; ')}` : ''
    ].filter(Boolean).join('\n') : '';

    // Get key insights
    const keyInsights = longTermMemory?.patientInsights.slice(-5) || [];

    // Get emotional patterns
    const emotionalPatterns = longTermMemory?.recurringThemes.slice(-3).join('; ') || '';

    // Get previous session summaries
    const previousSessions = sessions.slice(-2).map(s => 
      `${s.date.toLocaleDateString()}: ${s.sessionSummary || s.keyTopics.join(', ')} (${s.emotionalTone})`
    );

    return {
      recentConversations,
      patientProfile,
      keyInsights,
      emotionalPatterns,
      previousSessions
    };
  };

  const endCurrentSession = () => {
    const sessionMemories = shortTermMemory.filter(m => m.sessionId === currentSessionId);
    
    if (sessionMemories.length > 0) {
      // Create session summary
      const keyTopics = [...new Set(sessionMemories.map(m => m.memoryTag))].slice(0, 5);
      const emotionalTone = getMostCommonEmotion(sessionMemories);
      const sessionSummary = `Discussed ${keyTopics.join(', ').toLowerCase()}. Emotional tone: ${emotionalTone}`;

      const session: TherapySession = {
        id: currentSessionId,
        date: new Date(),
        duration: sessionMemories.length * 2, // Approximate minutes
        keyTopics,
        emotionalTone,
        breakthroughs: sessionMemories
          .filter(m => m.userMessage.length > 100)
          .map(m => m.memoryTag)
          .slice(0, 3),
        actionItems: [],
        sessionSummary,
        messageCount: sessionMemories.length
      };

      setSessions(prev => [...prev, session]);
      
      if (longTermMemory) {
        setLongTermMemory(prev => prev ? {
          ...prev,
          sessionCount: prev.sessionCount + 1,
          updatedAt: new Date()
        } : null);
      }
    }

    // Start new session
    setCurrentSessionId(`session-${Date.now()}`);
  };

  const getMostCommonEmotion = (memories: ShortTermMemory[]): string => {
    const emotionCounts: Record<string, number> = {};
    memories.forEach(m => {
      emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
    });
    
    return Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'neutral';
  };

  const getTherapyNotes = () => {
    const recentSession = sessions.slice(-1)[0];
    const recentMemories = shortTermMemory.slice(-10);
    
    return {
      currentSession: {
        messagesCount: shortTermMemory.filter(m => m.sessionId === currentSessionId).length,
        dominantEmotion: getMostCommonEmotion(shortTermMemory.filter(m => m.sessionId === currentSessionId)),
        keyInsights: shortTermMemory
          .filter(m => m.sessionId === currentSessionId && m.userMessage.length > 50)
          .map(m => m.memoryTag)
          .slice(-3)
      },
      longTermPatterns: longTermMemory,
      recentSession,
      totalSessions: sessions.length
    };
  };

  return {
    shortTermMemory,
    longTermMemory,
    sessions,
    currentSessionId,
    addToShortTermMemory,
    getConversationHistory,
    getConversationContextForAPI,
    endCurrentSession,
    getTherapyNotes,
    analyzePatternsAndUpdateLongTerm
  };
};
