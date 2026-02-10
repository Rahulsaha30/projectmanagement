import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { AuroraBackground } from './ui/aurora-background';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AuroraBackground className="!h-auto min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-primary/80 backdrop-blur-md text-primary-foreground transition-all-smooth">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 transition-all-smooth hover:opacity-80">
              <span className="text-lg font-bold">Project Management System</span>
            </Link>
          </div>
          <div className="flex items-center">
             {isAuthenticated && (
                <nav className="flex items-center gap-2">
                    {role === 'admin' && (
                        <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/90 hover:text-white transition-all-smooth">
                            <Link to="/admin">Projects</Link>
                        </Button>
                    )}
                    {role === 'manager' && (
                        <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/90 hover:text-white transition-all-smooth">
                            <Link to="/manager">Employees</Link>
                        </Button>
                    )}
                    <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/90 hover:text-white transition-all-smooth">
                        <Link to="/my-tasks">My Tasks</Link>
                    </Button>
                    <Button variant="secondary" onClick={handleLogout} className="ml-2 transition-all-smooth hover-lift">
                        Logout
                    </Button>
                </nav>
             )}
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8 relative z-10">
        {children}
      </main>
    </AuroraBackground>
  );
};

export default Layout;
