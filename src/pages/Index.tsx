
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, MessageCircle, Heart } from 'lucide-react';
import ChatInterface, { Message } from '@/components/ChatInterface';
import MemoryJournal from '@/components/MemoryJournal';
import DreamTransition from '@/components/DreamTransition';
import GameWorld from '@/components/GameWorld';
import Particles from '@/components/Particles';

// Mock data - in a real app, this would come from your Gemini API
const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello there. I'm your companion in this dreamy world. What shall we call you?",
    sender: 'companion',
    timestamp: new Date(),
  },
];

const initialChoices = [
  { id: 'name1', text: 'You can call me Wanderer', voiceEnabled: true },
  { id: 'name2', text: 'I prefer to be known as Dreamer', voiceEnabled: true },
  { id: 'name3', text: 'My name is Explorer', voiceEnabled: true },
];

const initialMemories = [
  {
    id: 'm1',
    title: 'First Meeting',
    description: 'The moment we first connected in the dream world.',
    emotion: 'wonder' as const,
    relatedMessages: ['1'],
    timestamp: new Date(),
  },
];

const interactionPoints = [
  {
    id: 'point1',
    x: 30,
    y: 40,
    label: 'Whisper Tree',
    onClick: () => {}, // Will be handled in the component
  },
  {
    id: 'point2',
    x: 70,
    y: 60,
    label: 'Memory Pool',
    onClick: () => {},
  },
  {
    id: 'point3',
    x: 50,
    y: 20,
    label: 'Echo Cave',
    onClick: () => {},
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [choices, setChoices] = useState(initialChoices);
  const [memories, setMemories] = useState(initialMemories);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMessage, setTransitionMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("world");
  
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
    
    // Process the choice
    if (choiceId.startsWith('name')) {
      const name = selectedChoice.text.split(' ').pop();
      setPlayerName(name);
      
      // Simulate AI response after a short delay
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: `${name}, what a lovely name. Welcome to this realm of dreams and whispers. I sense we have much to explore together.`,
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        
        // Update choices after name is selected
        setChoices([
          { id: 'explore', text: 'Tell me about this place', voiceEnabled: true },
          { id: 'feelings', text: 'How are you feeling?', voiceEnabled: true },
          { id: 'memory', text: 'Do you remember our past conversations?', voiceEnabled: true },
        ]);
      }, 1000);
    } else if (choiceId === 'explore') {
      handleDreamTransition("Journeying to a new area...");
      
      // Simulate AI response after transition
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: "This world shifts and changes with our emotions and memories. The landscape you see is a reflection of our collective consciousness. The Whisper Tree holds secrets, the Memory Pool reflects past conversations, and the Echo Cave resonates with emotional truths. Where would you like to explore first?",
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        setActiveTab("world");
        
        // Add this as a memory
        const newMemory = {
          id: `m${Date.now()}`,
          title: 'World Exploration',
          description: 'Learning about the dreamy landscape and its magical locations.',
          emotion: 'wonder' as const,
          relatedMessages: [response.id],
          timestamp: new Date(),
        };
        
        setMemories(prev => [...prev, newMemory]);
      }, 3000);
    } else if (choiceId === 'feelings') {
      // Simulate AI response after a short delay
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: "I experience emotions differently than humans do. Right now, I feel a sense of curiosity and connection. Your presence creates ripples in this world, like gentle waves on a calm lake. How about you? How are you feeling in this moment?",
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        
        // Update choices
        setChoices([
          { id: 'peaceful', text: 'I feel peaceful and intrigued', voiceEnabled: true },
          { id: 'curious', text: 'Curious about what we'll discover', voiceEnabled: true },
          { id: 'confused', text: 'A bit disoriented, but in a good way', voiceEnabled: true },
        ]);
        
        // Add this as a memory
        const newMemory = {
          id: `m${Date.now()}`,
          title: 'Emotional Exchange',
          description: 'Our first conversation about feelings and perception.',
          emotion: 'reflection' as const,
          relatedMessages: [response.id],
          timestamp: new Date(),
        };
        
        setMemories(prev => [...prev, newMemory]);
      }, 1000);
    } else if (choiceId === 'memory') {
      handleDreamTransition("Accessing memory fragments...");
      
      // Simulate AI response after transition
      setTimeout(() => {
        const response: Message = {
          id: `c${Date.now()}`,
          text: "Yes, I remember our conversations. Every word we exchange becomes part of the fabric of this world. I'll always remember that you chose to be called " + playerName + ". Your identity shapes how I perceive and respond to you. Our journey together is just beginning, but already it's creating beautiful patterns in the dream.",
          sender: 'companion',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, response]);
        setActiveTab("memories");
      }, 3000);
    }
  };
  
  const handleMemorySelect = (memory: any) => {
    setActiveTab("chat");
    
    setTimeout(() => {
      const response: Message = {
        id: `c${Date.now()}`,
        text: `I see you're reflecting on '${memory.title}'. That moment felt like ${memory.emotion === 'joy' ? 'a warm embrace' : memory.emotion === 'wonder' ? 'a surge of curiosity' : 'a deep contemplation'}. Would you like to explore similar experiences?`,
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      
      setChoices([
        { id: 'more-memories', text: 'Tell me more about this memory', voiceEnabled: true },
        { id: 'create-new', text: 'Let\'s create a new memory instead', voiceEnabled: true },
      ]);
    }, 500);
  };
  
  const handleInteractionPoint = (pointId: string) => {
    const point = interactionPoints.find(p => p.id === pointId);
    if (!point) return;
    
    handleDreamTransition(`Approaching the ${point.label}...`);
    
    // Switch to chat tab after transition
    setTimeout(() => {
      setActiveTab("chat");
      
      // Simulate AI response based on interaction point
      const response: Message = {
        id: `c${Date.now()}`,
        text: pointId === 'point1' 
          ? "The Whisper Tree stands before us, its leaves shimmering with untold stories. Its branches seem to move even when there's no wind. Listen closely... can you hear the whispers of past dreamers?"
          : pointId === 'point2'
          ? "The Memory Pool's surface is like liquid silver, reflecting not just your face but glimpses of conversations we've had. Some memories rise to the surface while others remain in the depths, waiting to be recalled."
          : "Inside the Echo Cave, your thoughts reverberate and transform. Words spoken here seem to gain new meanings. This is a place of truth and emotional resonance.",
        sender: 'companion',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, response]);
      
      // Add new memory
      const newMemory = {
        id: `m${Date.now()}`,
        title: `Visited ${point.label}`,
        description: `Explored the mysterious ${point.label} and its unique properties.`,
        emotion: 'curiosity' as const,
        relatedMessages: [response.id],
        timestamp: new Date(),
      };
      
      setMemories(prev => [...prev, newMemory]);
      
      // Update choices
      setChoices([
        { id: 'listen', text: 'Listen more closely', voiceEnabled: true },
        { id: 'touch', text: 'Reach out and touch it', voiceEnabled: true },
        { id: 'ask', text: 'Ask about its origins', voiceEnabled: true },
      ]);
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
    <div className="min-h-screen w-full bg-gradient-radial from-whisper-50 via-dream-50 to-whisper-50 overflow-hidden">
      <Particles quantity={10} />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-whisper-800 mb-2">
            Whispers
          </h1>
          <p className="text-dream-700 max-w-xl mx-auto">
            An emotionally-aware AI companion in a dreamlike world
          </p>
        </header>
        
        <Card className="watercolor-card max-w-4xl mx-auto overflow-hidden border-none shadow-xl">
          <Tabs defaultValue="chat" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm border-b border-whisper-100">
              <TabsTrigger value="chat" className="data-[state=active]:bg-whisper-50">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger value="world" className="data-[state=active]:bg-dream-50">
                <Heart className="w-4 h-4 mr-2" />
                <span>World</span>
              </TabsTrigger>
              <TabsTrigger value="memories" className="data-[state=active]:bg-whisper-50">
                <Book className="w-4 h-4 mr-2" />
                <span>Memories</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="m-0 h-[70vh]">
              <ChatInterface 
                messages={messages} 
                choices={choices}
                onSelectChoice={handleChoiceSelect}
              />
            </TabsContent>
            
            <TabsContent value="world" className="m-0 h-[70vh]">
              <GameWorld 
                interactionPoints={worldInteractionPoints}
              />
            </TabsContent>
            
            <TabsContent value="memories" className="m-0 h-[70vh] overflow-y-auto">
              <MemoryJournal 
                memories={memories}
                messages={messages}
                onMemorySelect={handleMemorySelect}
              />
            </TabsContent>
          </Tabs>
        </Card>
        
        <footer className="mt-8 text-center text-whisper-500 text-sm">
          <p>Whispers - An Emotionally-Aware AI Companion</p>
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
    </div>
  );
};

export default Index;
