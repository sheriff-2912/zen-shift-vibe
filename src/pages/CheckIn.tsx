import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Smile, Frown, Meh, Zap, Brain, Heart, Users, Coffee, Sun } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

const moods = [
  { name: 'happy', label: 'Happy', icon: Smile, color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  { name: 'sad', label: 'Sad', icon: Frown, color: 'bg-blue-100 hover:bg-blue-200 text-blue-800' },
  { name: 'neutral', label: 'Neutral', icon: Meh, color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' },
  { name: 'stressed', label: 'Stressed', icon: Brain, color: 'bg-red-100 hover:bg-red-200 text-red-800' },
  { name: 'focused', label: 'Focused', icon: Zap, color: 'bg-purple-100 hover:bg-purple-200 text-purple-800' },
  { name: 'calm', label: 'Calm', icon: Heart, color: 'bg-green-100 hover:bg-green-200 text-green-800' },
  { name: 'anxious', label: 'Anxious', icon: Brain, color: 'bg-orange-100 hover:bg-orange-200 text-orange-800' },
  { name: 'excited', label: 'Excited', icon: Sun, color: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' },
  { name: 'tired', label: 'Tired', icon: Coffee, color: 'bg-gray-100 hover:bg-gray-200 text-gray-800' }
];

export function CheckIn() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('moods')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          note: note.trim() || null
        });

      if (error) {
        console.error('Error saving mood:', error);
        toast({
          title: "Error saving mood",
          description: "Failed to save your mood check-in",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Mood logged successfully!",
          description: `Your ${selectedMood} mood has been recorded.`
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How are you feeling?</CardTitle>
            <CardDescription>
              Take a moment to check in with yourself and log your current mood
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Select your mood</Label>
                <div className="grid grid-cols-3 gap-3">
                  {moods.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.name}
                        type="button"
                        onClick={() => setSelectedMood(mood.name)}
                        className={`
                          p-4 rounded-lg border-2 transition-all
                          ${selectedMood === mood.name 
                            ? 'border-primary ' + mood.color + ' scale-105' 
                            : 'border-border hover:border-primary/50 ' + mood.color.replace('hover:', '')
                          }
                        `}
                      >
                        <Icon className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">{mood.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Note */}
              <div className="space-y-3">
                <Label htmlFor="note" className="text-base font-medium">
                  Add a note (optional)
                </Label>
                <Textarea
                  id="note"
                  placeholder="What's on your mind? Any specific thoughts or events affecting your mood..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedMood || loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : 'Log Mood'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </Layout>
  );
}