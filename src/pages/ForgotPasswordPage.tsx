import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) throw resetError;
      setSubmitSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset link. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-white via-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-4 w-full">
        <Card className="rounded-xl shadow-lg border border-slate-200 bg-white">
          <CardContent className="p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-accent/10 rounded-full">
                <Lock size={48} className="text-accent" />
              </div>
            </div>

            {!submitSuccess ? (
              <>
                <h1 className="text-2xl font-bold text-center text-black mb-2">Forgot Password?</h1>
                <p className="text-sm text-black/70 text-center mb-6">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                    {error} <button onClick={() => setError('')} className="float-right font-bold" aria-label="dismiss">×</button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="your.email@university.edu" className="pl-10 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400" />
                  </div>

                  <Button type="submit" className="w-full py-5 font-semibold bg-accent hover:bg-accent/80 text-white" disabled={isSubmitting || !email}>
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <Button
                    type="button"
                    className="w-full bg-accent hover:bg-accent/80 text-white"
                    onClick={() => navigate('/login')}
                  >
                    <ArrowLeft size={18} className="mr-1" /> Back to Login
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center text-black">
                <CheckCircle size={64} className="text-united-green mx-auto" />
                <h2 className="text-xl font-bold text-black mt-4 mb-2">Check Your Email!</h2>
                <p className="text-black/70 mb-2">We've sent password reset instructions to:</p>
                <p className="text-accent font-semibold mb-4">{email}</p>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left text-sm mb-4">
                  <p className="font-semibold mb-1">📧 Didn't receive the email?</p>
                  <p className="text-xs text-slate-600">• Check your spam/junk folder</p>
                  <p className="text-xs text-slate-600">• Make sure you entered the correct email</p>
                  <p className="text-xs text-slate-600">• The link expires in 1 hour</p>
                </div>

                <button className="text-sm text-accent hover:underline mb-3 block mx-auto"
                  onClick={() => { setSubmitSuccess(false); setEmail(''); }}>
                  Try a different email
                </button>

                <Button
                  className="w-full bg-accent hover:bg-accent/80 text-white"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft size={18} className="mr-1" /> Back to Login
                </Button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-xs text-black/70">
                Need help? Contact <a href="mailto:Jagarapuradhakrishna.work@gmai.com" className="text-accent">support</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
