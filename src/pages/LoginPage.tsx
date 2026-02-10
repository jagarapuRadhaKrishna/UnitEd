import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const LoginPage: React.FC = () => {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch {
      setError(authError || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center relative overflow-hidden bg-gradient-to-br from-blue-900 via-primary to-blue-400">
      {/* Dot pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(0 0% 100%) 1px, transparent 1px), radial-gradient(circle at 80% 80%, hsl(0 0% 100%) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      <div className="max-w-md mx-auto px-4 relative z-10 w-full">
        <Card className="rounded-2xl shadow-2xl">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg bg-gradient-to-br from-primary to-blue-400">
                <GraduationCap size={40} className="text-primary-foreground" strokeWidth={2.5} />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to continue to UnitEd</p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
                <button onClick={() => setError('')} className="float-right font-bold">×</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe.csd@anits.edu.in" required className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" required className="pl-10"
                  />
                </div>
              </div>

              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot Password?</Link>
              </div>

              <Button type="submit" className="w-full py-5 text-base font-semibold" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">OR</span>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-semibold hover:underline">Register here</Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;