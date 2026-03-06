import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Ensure the recovery session is established when arriving from the email link
  useEffect(() => {
    const ensureSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSessionReady(true);
        }
      } catch {
        // ignore; onAuthStateChange will handle
      }
    };

    ensureSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        setSessionReady(true);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!sessionReady) {
      setError('Reset link is invalid or has expired. Please request a new one.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      // Optional: sign out to force re-login with the new password
      await supabase.auth.signOut();
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to update password. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-accent/80 to-united-purple">
      <div className="max-w-md mx-auto px-4 w-full">
        <Card className="rounded-xl shadow-2xl">
          <CardContent className="p-8">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-accent/10 rounded-full">
                <Lock size={48} className="text-accent" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-foreground mb-2">Set a New Password</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter a new password for your account.
            </p>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4 text-sm">
                {error} <button onClick={() => setError('')} className="float-right font-bold" aria-label="dismiss">×</button>
              </div>
            )}

            {!success ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <Button type="submit" className="w-full py-5 font-semibold bg-accent hover:bg-accent/80" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>

                <Button type="button" variant="ghost" className="w-full text-accent" onClick={() => navigate('/login')}>
                  <ArrowLeft size={18} className="mr-1" /> Back to Login
                </Button>
              </form>
            ) : (
              <div className="text-center">
                <CheckCircle size={64} className="text-united-green mx-auto" />
                <h2 className="text-xl font-bold text-foreground mt-4 mb-2">Password Updated</h2>
                <p className="text-muted-foreground mb-4">You can now sign in with your new password.</p>
                <Button className="w-full" onClick={() => navigate('/login')}>
                  Go to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
