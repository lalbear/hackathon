"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserCircle, Activity, Heart, Shield, Save, Check, Trash2 } from 'lucide-react';
import axios from 'axios';

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    
    try {
      const { data } = await axios.put('http://localhost:5000/api/profile', {
        age: profile.age,
        allergies: profile.allergies,
        medications: profile.medications,
        conditions: profile.conditions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(data);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete('http://localhost:5000/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      setDeleting(false);
      alert("Failed to delete account. Please try again.");
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    // For MVP, split comma separated strings
    const arr = value.split(',').map(item => item.trim());
    setProfile({ ...profile, [field]: arr });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Activity className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <UserCircle className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{profile?.user?.name || 'User Profile'}</h1>
          <p className="text-muted-foreground">{profile?.user?.email}</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8"
      >
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <UserCircle className="h-4 w-4 text-primary" /> Age
              </label>
              <input 
                type="number" 
                value={profile?.age || ''} 
                onChange={e => setProfile({...profile, age: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="E.g. 30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-rose-500" /> Allergies
              </label>
              <textarea 
                rows={3}
                value={profile?.allergies?.join(', ') || ''} 
                onChange={e => handleArrayChange('allergies', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Peanuts, Penicillin (comma separated)"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-500" /> Medications
              </label>
              <textarea 
                rows={3}
                value={profile?.medications?.join(', ') || ''} 
                onChange={e => handleArrayChange('medications', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Lisinopril 10mg, Aspirin (comma separated)"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" /> Health Conditions
              </label>
              <textarea 
                rows={2}
                value={profile?.conditions?.join(', ') || ''} 
                onChange={e => handleArrayChange('conditions', e.target.value)}
                className="w-full p-3 bg-slate-50 border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none"
                placeholder="Hypertension, Asthma (comma separated)"
              />
            </div>
            
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-border mt-6">
            <button 
              type="button" 
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="px-4 py-2 text-rose-500 hover:bg-rose-50 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>

            <div className="flex items-center gap-3">
              {saved && (
                <motion.span 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-1 text-emerald-600 font-medium text-sm mr-2"
                >
                  <Check className="h-4 w-4" /> Saved Successfully
                </motion.span>
              )}
              <button 
                type="submit" 
                disabled={saving || deleting}
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
