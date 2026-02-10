import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const PublicNavbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'student' ? '/home' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-end items-center py-4">
          <div className="flex gap-3">
            <Button asChild className="bg-primary hover:bg-primary/80 text-primary-foreground font-semibold">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="bg-card text-primary hover:bg-muted font-semibold">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;