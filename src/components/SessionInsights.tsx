
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { Activity, Lightbulb, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the emotion type to match the rest of the application
type Emotion = 'joy' | 'wonder' | 'reflection' | 'curiosity';

interface EmotionCount {
  emotion: Emotion;
  count: number;
}

interface EmotionTrend {
  time: string;
  emotion: Emotion;
}

interface SessionInsightsProps {
  emotionCounts: EmotionCount[];
  emotionTrends: EmotionTrend[];
  className?: string;
}

const emotionColors = {
  joy: '#60A5FA', // blue
  wonder: '#A78BFA', // purple
  reflection: '#34D399', // green
  curiosity: '#FBBF24', // yellow
};

const emotionLabels = {
  joy: 'Joy',
  wonder: 'Wonder',
  reflection: 'Reflection',
  curiosity: 'Curiosity',
};

const emotionActivitySuggestions = {
  joy: [
    'Practice gratitude by listing 3 things you appreciate today',
    'Share your positive energy with someone through a kind message',
    'Document this feeling in a journal to revisit later',
  ],
  wonder: [
    'Explore a topic that fascinates you for 10 minutes',
    'Try a brief mindfulness meditation focusing on openness',
    'Ask yourself a question you\'ve never considered before',
  ],
  reflection: [
    'Take a brief walk and consider what you\'ve learned today',
    'Write down one insight you\'ve gained from recent experiences',
    'Practice deep breathing while reflecting on your growth',
  ],
  curiosity: [
    'Research something new that caught your interest',
    'Try a creative activity like drawing or writing',
    'Engage with a different perspective on a familiar topic',
  ]
};

const SessionInsights = ({ emotionCounts, emotionTrends, className }: SessionInsightsProps) => {
  // Calculate the dominant emotion
  const dominantEmotion = emotionCounts.length > 0 
    ? emotionCounts.reduce((prev, current) => (prev.count > current.count) ? prev : current).emotion
    : 'reflection';
  
  // Get activities based on dominant emotion
  const suggestedActivities = emotionActivitySuggestions[dominantEmotion];
  
  // Create a personalized insight based on emotional data
  const createPersonalizedInsight = () => {
    if (emotionCounts.length === 0) {
      return "Welcome to your session. As you chat, I'll provide personalized insights based on our conversation.";
    }
    
    const emotions = emotionCounts.map(e => emotionLabels[e.emotion].toLowerCase());
    
    if (dominantEmotion === 'joy') {
      return `You've expressed a strong sense of ${emotions.join(' and ')}. Consider taking time to savor these positive emotions and reflect on what brought them about.`;
    } else if (dominantEmotion === 'wonder') {
      return `Your conversation shows curiosity and ${emotions.join(' and ')}. This openness can lead to new insights and perspectives.`;
    } else if (dominantEmotion === 'reflection') {
      return `I notice thoughtful ${emotions.join(' and ')} in our conversation. This reflective state is ideal for processing experiences and gaining clarity.`;
    } else {
      return `Your natural ${emotions.join(' and ')} is evident in our conversation. This inquisitive approach helps foster growth and understanding.`;
    }
  };

  return (
    <Card className={cn("p-4 bg-white/80 backdrop-blur-sm rounded-xl", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-teal-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-600" />
          Session Insights
        </h3>
        <p className="text-sm text-gray-600 mt-1">{createPersonalizedInsight()}</p>
      </div>
      
      {emotionCounts.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-teal-700 mb-2">Emotional Journey</h4>
          <div className="h-40 w-full">
            <ChartContainer
              config={{
                joy: { theme: { light: emotionColors.joy, dark: emotionColors.joy } },
                wonder: { theme: { light: emotionColors.wonder, dark: emotionColors.wonder } },
                reflection: { theme: { light: emotionColors.reflection, dark: emotionColors.reflection } },
                curiosity: { theme: { light: emotionColors.curiosity, dark: emotionColors.curiosity } },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emotionCounts}>
                  <XAxis 
                    dataKey="emotion" 
                    tickFormatter={(value) => emotionLabels[value as Emotion]} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis hide />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload as EmotionCount;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="text-sm font-medium">{emotionLabels[data.emotion]}</div>
                            <div className="text-xs text-muted-foreground">Expressed {data.count} times</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {emotionCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={emotionColors[entry.emotion]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <h4 className="text-sm font-medium text-teal-700 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          Suggested Activities
        </h4>
        <ul className="mt-2 space-y-2">
          {suggestedActivities.map((activity, index) => (
            <li key={index} className="text-sm bg-teal-50 p-2 rounded-lg border border-teal-100 flex items-start gap-2">
              <Heart className="h-4 w-4 text-teal-500 mt-0.5 flex-shrink-0" />
              <span>{activity}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-xs text-gray-500 mt-4 border-t border-gray-100 pt-2">
        <p>Disclaimer: These insights are based on our conversation and are meant for reflection only. 
        They are not a substitute for professional mental health advice.</p>
      </div>
    </Card>
  );
};

export default SessionInsights;
