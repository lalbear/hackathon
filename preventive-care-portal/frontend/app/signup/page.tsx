"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Patient');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setError('You must consent to data processing for security purposes.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/signup', { 
        name, email, password, role 
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      if (data.role === 'Provider') {
        router.push('/provider');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign up');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-3xl z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-3xl z-0" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md auth-card relative z-10 my-8"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground mt-2">Join NovaCare to transform your health</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <User className="h-5 w-5" />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="h-5 w-5" />
                </div>
                <input 
                  type="email" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="h-5 w-5" />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className={`p-3 text-center rounded-xl cursor-pointer border transition-colors ${role === 'Patient' ? 'bg-primary/10 border-primary text-primary font-semibold' : 'bg-slate-50 border-border text-muted-foreground hover:bg-slate-100'}`}
                  onClick={() => setRole('Patient')}
                >
                  Patient
                </div>
                <div 
                  className={`p-3 text-center rounded-xl cursor-pointer border transition-colors ${role === 'Provider' ? 'bg-primary/10 border-primary text-primary font-semibold' : 'bg-slate-50 border-border text-muted-foreground hover:bg-slate-100'}`}
                  onClick={() => setRole('Provider')}
                >
                  Provider
                </div>
              </div>
            </div>

            <div className="flex items-start mt-4">
              <div className="flex items-center h-5">
                <input
                  id="consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="ml-3 text-xs text-muted-foreground">
                <label htmlFor="consent" className="font-medium flex gap-1 items-center">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  I consent to the secure processing of my health data in compliance with privacy guidelines.
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> }
            </button>
          </form>
        </div>
        
        <div className="px-8 py-5 bg-slate-50 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
