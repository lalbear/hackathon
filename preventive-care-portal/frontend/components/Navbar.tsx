"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, UserCircle, LogOut, LayoutDashboard, Bell, BellRing } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const getStatus = (reminder: any) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const due = new Date(reminder.date); due.setHours(0,0,0,0);
  if (due < today) return 'Overdue';
  if (due.getTime() === today.getTime()) return 'Due Today';
  return 'Upcoming';
};

const STATUS_BADGE: Record<string, string> = {
  'Overdue':   'bg-rose-100 text-rose-700',
  'Due Today': 'bg-amber-100 text-amber-700',
  'Upcoming':  'bg-sky-100 text-sky-700',
};

export default function Navbar() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [reminders, setReminders] = useState<any[]>([]);
  const [showBell, setShowBell] = useState(false);
  const [duePopup, setDuePopup] = useState<any | null>(null);
  const firedRef = useRef<Set<string>>(new Set());
  const bellRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getUserDetails = () => {
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('user');
      return userRaw ? JSON.parse(userRaw) : null;
    }
    return null;
  };

  const user = isClient ? getUserDetails() : null;

  // Fetch active reminders for bell
  useEffect(() => {
    if (!user || user.role === 'Provider') return;
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('http://localhost:5000/api/reminders', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(({ data }) => {
      setReminders(data.filter((r: any) => r.status !== 'Completed'));
    }).catch(() => {});
  }, [isClient]);

  // Close bell dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBell(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Global reminder due-time check — runs every 30s on every page
  useEffect(() => {
    if (reminders.length === 0) return;
    const checkDue = () => {
      const now = new Date();
      // Build LOCAL date string (fixes IST/UTC timezone offset bug)
      const localDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      for (const r of reminders) {
        if (!r.reminderTime || firedRef.current.has(r._id)) continue;

        // Build LOCAL date from the reminder's stored date
        const rDateObj = new Date(r.date);
        const rLocalDate = `${rDateObj.getFullYear()}-${String(rDateObj.getMonth()+1).padStart(2,'0')}-${String(rDateObj.getDate()).padStart(2,'0')}`;

        if (rLocalDate !== localDate) continue; // not today

        // Parse reminder HH:MM into total minutes
        const [rH, rM] = r.reminderTime.split(':').map(Number);
        const reminderMinutes = rH * 60 + rM;

        // Fire if we're within a 5-minute window AFTER the reminder time (handles page reload / missed ticks)
        const diff = nowMinutes - reminderMinutes;
        if (diff >= 0 && diff <= 5) {
          firedRef.current.add(r._id);
          setDuePopup(r);
          break; // show one at a time
        }
      }
    };
    checkDue(); // check immediately when reminders load
    const interval = setInterval(checkDue, 30000); // every 30s
    return () => clearInterval(interval);
  }, [reminders]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Count urgent: overdue + due today
  const urgentCount = reminders.filter(r => {
    const s = getStatus(r);
    return s === 'Overdue' || s === 'Due Today';
  }).length;

  const dropdownReminders = reminders.slice(0, 8);

  return (
    <>
    {/* Global Reminder Due Popup - shown on ALL pages */}
    <AnimatePresence>
      {duePopup && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setDuePopup(null)}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 relative"
          >
            {/* Pulsing ring */}
            <div className="absolute -top-3 -right-3 w-12 h-12 bg-primary rounded-full animate-ping opacity-20" />
            <div className="flex flex-col items-center text-center gap-3">
              <div className="text-5xl mb-1">
                {duePopup.category === 'Medicine' ? '💊' : duePopup.category === 'Water Intake' ? '💧' : duePopup.category === 'Exercise' ? '🏃' : duePopup.category === 'Checkup' ? '🩺' : duePopup.category === 'Vaccination' ? '💉' : duePopup.category === 'Sleep' ? '😴' : duePopup.category === 'Nutrition' ? '🥗' : '🔔'}
              </div>
              <div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary">{duePopup.category}</span>
              </div>
              <h2 className="text-xl font-bold text-foreground mt-1">⏰ Reminder!</h2>
              <h3 className="text-lg font-semibold text-foreground">{duePopup.title}</h3>
              {duePopup.description && (
                <p className="text-sm text-muted-foreground">{duePopup.description}</p>
              )}
              <p className="text-xs text-muted-foreground bg-slate-50 rounded-lg px-3 py-1.5 border border-border mt-1">
                Scheduled for {new Date(duePopup.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at <strong>{duePopup.reminderTime}</strong>
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDuePopup(null)}
                className="flex-1 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors shadow-sm"
              >
                Got it! ✓
              </button>
              <a href="/reminders"
                onClick={() => setDuePopup(null)}
                className="flex-1 py-2.5 border border-border rounded-xl font-semibold text-center text-foreground hover:bg-slate-50 transition-colors text-sm"
              >
                View Reminders
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
              <HeartPulse className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Nova<span className="text-primary">Care</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/public-health" className={`text-sm font-medium hover:text-primary transition-colors ${pathname === '/public-health' ? 'text-primary' : 'text-muted-foreground'}`}>
              Health Insights
            </Link>
            
            {user ? (
              <>
                <Link href={user.role === 'Provider' ? '/provider' : '/dashboard'} 
                      className={`flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors ${pathname.includes('dashboard') || pathname.includes('provider') ? 'text-primary' : 'text-muted-foreground'}`}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                {user.role !== 'Provider' && (
                  <Link href="/reminders"
                    className={`flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors ${pathname === '/reminders' ? 'text-primary' : 'text-muted-foreground'}`}>
                    <Bell className="h-4 w-4" />
                    Reminders
                  </Link>
                )}

                <Link href="/profile" className={`flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors ${pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}>
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Link>

                {/* Bell Icon with Dropdown */}
                {user.role !== 'Provider' && (
                  <div ref={bellRef} className="relative">
                    <button
                      onClick={() => setShowBell(s => !s)}
                      className="relative p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
                      title="Reminders"
                    >
                      {urgentCount > 0 ? <BellRing className="h-5 w-5 text-amber-500 animate-pulse" /> : <Bell className="h-5 w-5" />}
                      {urgentCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                          {urgentCount}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {showBell && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <span className="font-bold text-sm text-foreground">Reminders</span>
                            {urgentCount > 0 && (
                              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-semibold">{urgentCount} urgent</span>
                            )}
                          </div>
                          <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                            {dropdownReminders.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-6">All caught up! 🎉</p>
                            ) : (
                              dropdownReminders.map(r => {
                                const st = getStatus(r);
                                return (
                                  <div key={r._id} className="px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3">
                                    <span className="text-xl flex-shrink-0 mt-0.5">
                                      {r.category === 'Medicine' ? '💊' : r.category === 'Water Intake' ? '💧' : r.category === 'Exercise' ? '🏃' : r.category === 'Checkup' ? '🩺' : r.category === 'Vaccination' ? '💉' : r.category === 'Sleep' ? '😴' : r.category === 'Nutrition' ? '🥗' : '🔔'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-foreground truncate">{r.title}</p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_BADGE[st] || 'bg-slate-100 text-slate-600'}`}>{st}</span>
                                        <span className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                          <Link href="/reminders" onClick={() => setShowBell(false)}
                            className="flex items-center justify-center py-3 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors border-t border-border">
                            View all reminders →
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button onClick={logout} className="p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-full transition-colors ml-2" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Log in
                </Link>
                <Link href="/signup" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full shadow-sm shadow-primary/30 hover:bg-primary/90 transition-all hover:shadow-md hover:-translate-y-0.5">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
