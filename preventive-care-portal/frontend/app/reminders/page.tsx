"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Plus, X, Clock, CalendarDays, Trash2, CheckCircle2, Activity
} from 'lucide-react';
import axios from 'axios';

const CATEGORIES = [
  { label: 'Medicine',     emoji: '💊' },
  { label: 'Water Intake', emoji: '💧' },
  { label: 'Exercise',     emoji: '🏃' },
  { label: 'Checkup',      emoji: '🩺' },
  { label: 'Vaccination',  emoji: '💉' },
  { label: 'Sleep',        emoji: '😴' },
  { label: 'Nutrition',    emoji: '🥗' },
  { label: 'General',      emoji: '🔔' },
];

const getCategoryEmoji = (cat: string) =>
  CATEGORIES.find(c => c.label === cat)?.emoji ?? '🔔';

const getStatus = (reminder: any) => {
  if (reminder.status === 'Completed') return 'Done';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(reminder.date);
  due.setHours(0, 0, 0, 0);
  if (due < today) return 'Overdue';
  if (due.getTime() === today.getTime()) return 'Due Today';
  return 'Upcoming';
};

const STATUS_STYLES: Record<string, string> = {
  'Overdue':   'bg-rose-100 text-rose-700 border-rose-200',
  'Due Today': 'bg-amber-100 text-amber-700 border-amber-200',
  'Upcoming':  'bg-sky-100 text-sky-700 border-sky-200',
  'Done':      'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [category, setCategory] = useState('General');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getToken = () => localStorage.getItem('token');

  const fetchReminders = useCallback(async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/reminders', {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setReminders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/login'); return; }
    const userData = JSON.parse(userStr);
    if (userData.role !== 'Patient') { router.push('/provider'); return; }
    fetchReminders();

    // Request notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, [fetchReminders, router]);

  // 60-second notification check
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const todayStr = now.toISOString().slice(0, 10);
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      reminders.forEach(r => {
        if (r.status !== 'Pending') return;
        const rDate = new Date(r.date).toISOString().slice(0, 10);
        if (rDate === todayStr && r.reminderTime === currentHHMM) {
          if (Notification.permission === 'granted') {
            new Notification(`⏰ Reminder: ${r.title}`, {
              body: r.description || r.category,
              icon: '/favicon.ico',
            });
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [reminders]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/reminders', {
        title, description, category, date: dueDate, reminderTime
      }, { headers: { Authorization: `Bearer ${getToken()}` } });
      setShowForm(false);
      setTitle(''); setDescription(''); setCategory('General'); setDueDate(''); setReminderTime('');
      fetchReminders();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (id: string) => {
    await axios.put(`http://localhost:5000/api/reminders/${id}/complete`, {}, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    fetchReminders();
  };

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:5000/api/reminders/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    fetchReminders();
  };

  const active = reminders.filter(r => r.status !== 'Completed');
  const completed = reminders.filter(r => r.status === 'Completed');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Activity className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-7 h-7 text-primary" /> Reminders
          </h1>
          <p className="text-muted-foreground mt-1">Manage your health reminders with time-based notifications.</p>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm ${showForm ? 'bg-slate-100 text-foreground border border-border' : 'bg-primary text-white shadow-primary/20 hover:bg-primary/90'}`}
        >
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add Reminder</>}
        </button>
      </div>

      {/* Create Reminder Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form onSubmit={handleCreate} className="glass-panel p-6 border border-primary/20 bg-primary/5">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-primary" /> New Reminder</h2>

              {/* Category Picker */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c.label} type="button" onClick={() => setCategory(c.label)}
                      className={`px-3 py-1.5 rounded-full border text-sm font-medium flex items-center gap-1.5 transition-all ${category === c.label ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white border-border text-foreground hover:border-primary/50'}`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Title <span className="text-rose-500">*</span></label>
                  <input required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white"
                    placeholder="e.g. Take blood pressure medication" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Description <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white"
                    placeholder="Any extra notes" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Due Date <span className="text-rose-500">*</span></label>
                  <input required type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">Reminder Time <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white" />
                  <p className="text-xs text-sky-600 mt-1">You'll get a browser notification at this time on the due date.</p>
                </div>
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-all disabled:opacity-70">
                {submitting ? 'Creating...' : 'Create Reminder'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Reminders */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Active Reminders</h2>
        {active.length === 0 ? (
          <div className="glass-panel p-8 text-center text-muted-foreground border border-dashed border-border">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
            No active reminders. Click "+ Add Reminder" to create one!
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {active.map(r => {
                const status = getStatus(r);
                return (
                  <motion.div key={r._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    className="glass-panel p-4 flex items-center gap-4 border border-border/50 hover:border-primary/30 transition-colors"
                  >
                    <div className="text-3xl flex-shrink-0">{getCategoryEmoji(r.category)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[status]}`}>{status}</span>
                        <span className="text-xs font-medium text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">{r.category}</span>
                      </div>
                      <h4 className="font-semibold text-foreground text-sm">{r.title}</h4>
                      {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        {r.reminderTime && <span className="flex items-center gap-1 text-primary font-medium"><Clock className="w-3 h-3" /> {r.reminderTime}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button onClick={() => handleComplete(r._id)}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </button>
                      <button onClick={() => handleDelete(r._id)}
                        className="p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Completed Reminders */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Completed
          </h2>
          <div className="space-y-3 opacity-70">
            {completed.map(r => (
              <div key={r._id} className="glass-panel p-4 flex items-center gap-4 border border-border/30">
                <div className="text-3xl flex-shrink-0">{getCategoryEmoji(r.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES['Done']}`}>Done</span>
                    <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">{r.category}</span>
                  </div>
                  <h4 className="font-semibold text-muted-foreground text-sm line-through">{r.title}</h4>
                </div>
                <button onClick={() => handleDelete(r._id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
