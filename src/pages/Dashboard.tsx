import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Smile, Frown, Meh, Zap, Brain, Heart, Plus, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

interface Mood {
  id: string;
  mood: string;
  note: string | null;
  created_at: string;
}

interface Profile {
  username: string | null;
  full_name: string | null;
}

const moodIcons = {
  happy: Smile,
  sad: Frown,
  neutral: Meh,
  stressed: Brain,
  focused: Zap,
  calm: Heart,
  anxious: Brain,
  excited: Zap,
  tired: Meh
};

const moodColors = {
  happy: 'bg-green-100 text-green-800',
  sad: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
  stressed: 'bg-red-100 text-red-800',
  focused: 'bg-purple-100 text-purple-800',
  calm: 'bg-green-100 text-green-800',
  anxious: 'bg-orange-100 text-orange-800',
  excited: 'bg-yellow-100 text-yellow-800',
  tired: 'bg-gray-100 text-gray-800'
};

const getSuggestions = (mood: string) => {
  const suggestions = {
    stressed: ['Take 5 deep breaths', 'Go for a short walk', 'Listen to calming music'],
    tired: ['Take a 10-minute break', 'Drink some water', 'Do light stretching'],
    focused: ['Tackle your most important task', 'Set a timer for focused work', 'Eliminate distractions'],
    happy: ['Share your positive energy', 'Express gratitude', 'Help someone else'],
    sad: ['Talk to a friend', 'Practice self-care', 'Do something you enjoy'],
    anxious: ['Practice mindfulness', 'Focus on what you can control', 'Use grounding techniques'],
    calm: ['Maintain this peaceful state', 'Practice meditation', 'Enjoy the moment'],
    excited: ['Channel energy productively', 'Share your excitement', 'Plan something fun'],
    neutral: ['Check in with yourself', 'Set small goals', 'Practice gratitude']
  };
  
  return suggestions[mood as keyof typeof suggestions] || ['Take a moment for yourself', 'Stay mindful', 'Practice self-care'];
};

export function Dashboard() {
  const { user } = useAuth();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('username, full_name')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch recent moods
      const { data: moodsData, error: moodsError } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (moodsError) {
        console.error('Error fetching moods:', moodsError);
        toast({
          title: "Error loading moods",
          description: "Failed to load your mood history",
          variant: "destructive"
        });
      } else {
        setMoods(moodsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const latestMood = moods[0];
  const suggestions = latestMood ? getSuggestions(latestMood.mood) : [];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            How are you feeling today? Track your mood and get personalized suggestions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Quick Check-in
              </CardTitle>
              <CardDescription>
                Log how you're feeling right now
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/checkin">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Check In Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {latestMood && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Suggestions for You
                </CardTitle>
                <CardDescription>
                  Based on your {latestMood.mood} mood
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Moods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Mood History
            </CardTitle>
            <CardDescription>
              Your last 10 mood check-ins
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moods.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No mood check-ins yet</p>
                <Link to="/checkin">
                  <Button>Log Your First Mood</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {moods.map((mood) => {
                  const MoodIcon = moodIcons[mood.mood as keyof typeof moodIcons] || Heart;
                  return (
                    <div
                      key={mood.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <MoodIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant="secondary" 
                            className={moodColors[mood.mood as keyof typeof moodColors]}
                          >
                            {mood.mood}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(mood.created_at).toLocaleDateString()} at{' '}
                            {new Date(mood.created_at).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        {mood.note && (
                          <p className="text-sm text-muted-foreground">{mood.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}