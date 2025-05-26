
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, TrendingUp, Clock, Target, Heart } from 'lucide-react';
import { useMemorySystem } from '@/hooks/useMemorySystem';
import { cn } from '@/lib/utils';

interface TherapyNotesProps {
  className?: string;
}

const TherapyNotes = ({ className }: TherapyNotesProps) => {
  const { getTherapyNotes, shortTermMemory, sessions } = useMemorySystem();
  const notes = getTherapyNotes();

  return (
    <Card className={cn("p-4 bg-white/80 backdrop-blur-sm", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-medium text-teal-800 flex items-center gap-2">
          <Brain className="h-5 w-5 text-teal-600" />
          Therapy Notes
        </h3>
        <p className="text-sm text-gray-600">Building understanding through conversation</p>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-teal-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-800">Messages</span>
              </div>
              <p className="text-xl font-bold text-teal-600">
                {notes.currentSession.messagesCount}
              </p>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Tone</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 capitalize">
                {notes.currentSession.dominantEmotion}
              </Badge>
            </div>
          </div>

          {notes.currentSession.keyInsights.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Target className="h-4 w-4" />
                Key Insights This Session
              </h4>
              <div className="space-y-2">
                {notes.currentSession.keyInsights.map((insight, index) => (
                  <div key={index} className="p-2 bg-amber-50 rounded border border-amber-200">
                    <p className="text-sm text-amber-800">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {notes.longTermPatterns && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-xl font-bold text-green-600">
                    {notes.longTermPatterns.sessionCount}
                  </p>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600">Insights</p>
                  <p className="text-xl font-bold text-blue-600">
                    {notes.longTermPatterns.patientInsights.length}
                  </p>
                </div>
              </div>

              {notes.longTermPatterns.recurringThemes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recurring Themes</h4>
                  <div className="space-y-1">
                    {notes.longTermPatterns.recurringThemes.slice(-5).map((theme, index) => (
                      <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                        {theme}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {notes.longTermPatterns.copingStrategies.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Coping Strategies</h4>
                  <div className="space-y-1">
                    {notes.longTermPatterns.copingStrategies.slice(-3).map((strategy, index) => (
                      <div key={index} className="text-xs p-2 bg-green-50 rounded border border-green-200">
                        {strategy}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.slice(-5).reverse().map((session) => (
                <div key={session.id} className="p-3 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {session.date.toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        ~{session.duration} minutes
                      </p>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {session.emotionalTone}
                    </Badge>
                  </div>
                  
                  {session.keyTopics.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-gray-600 mb-1">Topics:</p>
                      <div className="flex flex-wrap gap-1">
                        {session.keyTopics.slice(0, 3).map((topic, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {topic.substring(0, 20)}...
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center italic">
              Session history will appear here as you continue your journey
            </p>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default TherapyNotes;
