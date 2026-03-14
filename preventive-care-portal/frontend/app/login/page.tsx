"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password State
  const [forgotMode, setForgotMode] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);
  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (forgotMode) {
      if (!email) {
        setError("Please enter your email address to recover your account.");
        return;
      }
      setLoading(true);
      // Mock API call for password recovery
      setTimeout(() => {
        setLoading(false);
        setRecoverySent(true);
      }, 1500);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'Provider') {
        router.push('/provider');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/20 blur-3xl z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md auth-card relative z-10"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {forgotMode ? 'Account Recovery' : 'Welcome Back'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {forgotMode ? "We'll send you a link to reset your password" : "Log in to track your wellness goals"}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden">
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center">
                  {error}
                </div>
              </motion.div>
            )}
            {recoverySent && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-4 overflow-hidden">
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm text-center flex flex-col items-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  <span>Recovery simulated! In a real deployment, an email would be sent to <b>{email}</b>.</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full mt-1">⚠️ Demo Mode — No email was actually sent</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!recoverySent && (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input 
                    type="email" 
                    required={forgotMode}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <AnimatePresence>
                {!forgotMode && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="flex items-center justify-between mb-1 mt-1">
                      <label className="block text-sm font-medium text-foreground">Password</label>
                      <button type="button" onClick={() => { setForgotMode(true); setError(''); }} className="text-xs text-primary font-medium hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required={!forgotMode}
                        className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (forgotMode ? 'Send Recovery Link' : 'Log In')}
                {!loading && !forgotMode && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
              </button>

              {forgotMode && (
                <button type="button" onClick={() => { setForgotMode(false); setRecoverySent(false); setError(''); }} className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 font-medium">
                  ← Back to Login
                </button>
              )}
            </form>
          )}

          {recoverySent && (
            <button type="button" onClick={() => { setForgotMode(false); setRecoverySent(false); }} className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all mt-4">
              Return to Login
            </button>
          )}
        </div>
        
        <div className="px-8 py-5 bg-slate-50 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
