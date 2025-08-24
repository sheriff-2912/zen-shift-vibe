import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Droplets, User, Settings, Shield, LogOut, Home, Heart } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <Droplets className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">ZenShift</span>
              </Link>
              
              <div className="hidden md:flex space-x-4">
                <Link 
                  to="/" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Home className="inline h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link 
                  to="/checkin" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/checkin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Heart className="inline h-4 w-4 mr-1" />
                  Check In
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link 
                to="/settings" 
                className={`p-2 rounded-md ${
                  isActive('/settings') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Settings className="h-5 w-5" />
              </Link>
              
              <Link 
                to="/admin" 
                className={`p-2 rounded-md ${
                  isActive('/admin') ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Shield className="h-5 w-5" />
              </Link>
              
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}