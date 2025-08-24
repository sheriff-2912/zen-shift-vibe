import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Users, Heart, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Layout } from '@/components/Layout';

interface User {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: string;
}

interface Mood {
  id: string;
  mood: string;
  note: string | null;
  created_at: string;
  user_id: string;
}

export function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking admin status:', error);
      } else if (data?.is_admin) {
        setIsAdmin(true);
        fetchUsers();
        fetchAllMoods();
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error loading users",
          description: "Failed to load user list",
          variant: "destructive"
        });
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchAllMoods = async () => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching moods:', error);
        toast({
          title: "Error loading moods",
          description: "Failed to load mood data",
          variant: "destructive"
        });
      } else {
        setMoods(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserMoods = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('moods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching user moods:', error);
        toast({
          title: "Error loading user moods",
          description: "Failed to load user's mood data",
          variant: "destructive"
        });
      } else {
        setMoods(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUser(userId);
    if (userId === 'all') {
      fetchAllMoods();
    } else {
      fetchUserMoods(userId);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have admin privileges to access this page.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users and view mood analytics
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Moods</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moods.length}</div>
              <p className="text-xs text-muted-foreground">
                Mood check-ins
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {moods.filter(mood => 
                  new Date(mood.created_at).toDateString() === new Date().toDateString()
                ).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Moods logged today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>
              All registered users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((userData) => (
                <div
                  key={userData.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">
                      {userData.full_name || 'Unnamed User'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userData.email}
                    </div>
                    {userData.username && (
                      <div className="text-sm text-muted-foreground">
                        @{userData.username}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {userData.is_admin && (
                      <Badge variant="secondary">Admin</Badge>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(userData.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mood Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Mood Data
            </CardTitle>
            <CardDescription>
              View mood check-ins by user
            </CardDescription>
            <div className="pt-4">
              <Select value={selectedUser} onValueChange={handleUserSelect}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Select user to filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map((userData) => (
                    <SelectItem key={userData.id} value={userData.id}>
                      {userData.full_name || userData.email || 'Unnamed User'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {moods.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No mood data found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moods.map((mood) => (
                  <div
                    key={mood.id}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary">{mood.mood}</Badge>
                        <span className="text-sm font-medium">
                          {users.find(u => u.id === mood.user_id)?.full_name || 
                           users.find(u => u.id === mood.user_id)?.email || 
                           'Unknown User'}
                        </span>
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
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}