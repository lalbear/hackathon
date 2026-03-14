"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Footprints, Droplets, Moon, Activity, BarChart3, TrendingUp, Bell, CheckCircle2, Settings } from 'lucide-react';
import axios from 'axios';
import GoalCard from '../../components/GoalCard';
import ProgressChart from '../../components/ProgressChart';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState('');
  const [sleep, setSleep] = useState('');
  
  // Target Configurations (User Requested)
  const [targetSteps, setTargetSteps] = useState(10000);
  const [targetWater, setTargetWater] = useState(2500);
  const [targetSleep, setTargetSleep] = useState(8);
  
  // UI States
  const [chartType, setChartType] = useState<'area' | 'bar'>('area');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) {
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(userStr);
      if (userData.role !== 'Patient') {
        router.push('/provider');
        return;
      }
      
      setUser(userData);
      fetchData(token);
    };

    checkAuth();
  }, [router]);

  // Aggressive 1 Minute Reminder Loop for Water
  useEffect(() => {
    if (loading || goals.length === 0) return;
    
    const interval = setInterval(() => {
      const latestGoal = goals[0];
      // Only pop up if water is 0 or undefined for today
      if (!latestGoal || !latestGoal.waterIntake || latestGoal.waterIntake === 0) {
        showToast("💧 You haven't logged any water today! Hydration is critical.");
      }
    }, 60000); // exactly 1 minute

    return () => clearInterval(interval);
  }, [loading, goals]);

  const fetchData = async (token: string) => {
    try {
      const [goalsRes, remindersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/goals', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/reminders', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setGoals(goalsRes.data);
      setReminders(remindersRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    // Only send values that were actually filled in.
    const payload: any = {};
    if (steps) payload.steps = Number(steps);
    if (water) payload.waterIntake = Number(water);
    if (sleep) payload.sleepHours = Number(sleep);

    // If nothing was filled, don't submit
    if (Object.keys(payload).length === 0) {
      setShowAddForm(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/goals', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowAddForm(false);
      fetchData(token!);
      setSteps(''); setWater(''); setSleep('');
    } catch (err) {
      console.error('Failed to add goal', err);
    }
  };

  const completeReminder = async (id: string) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/reminders/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(token!);
    } catch (err) {
      console.error('Failed to complete reminder', err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Activity className="animate-spin h-8 w-8 text-primary" /></div>;

  const todayGoal = goals.length > 0 ? goals[0] : { steps: 0, waterIntake: 0, sleepHours: 0 };
  
  // Format data for chart
  const chartData = [...goals].reverse().slice(-7).map(g => ({
    name: new Date(g.date).toLocaleDateString('en-US', { weekday: 'short' }),
    steps: g.steps,
    water: g.waterIntake,
    sleep: g.sleepHours
  }));

  const CustomBarChart = ({ data, dataKey, color, title }: { data: any[], dataKey: string, color: string, title: string }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }} barSize={30}>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* In-app Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-full"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-border flex items-start gap-3 p-4 pr-5">
              <div className="text-2xl flex-shrink-0">💧</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Hydration Reminder</p>
                <p className="text-xs text-muted-foreground mt-0.5">You haven&apos;t logged any water today! Please log your water intake now.</p>
              </div>
              <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground ml-auto flex-shrink-0 mt-0.5 text-lg leading-none">×</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here is your wellness summary for today.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-primary text-white px-4 py-2 rounded-full font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          {showAddForm ? <Settings className="h-4 w-4" /> : <Plus className="h-4 w-4" />} 
          {showAddForm ? 'Hide Form' : 'Log Activity & Set Targets'}
        </button>
      </div>

      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="glass-panel p-6 mb-10 border border-primary/20 bg-primary/5"
        >
          <form onSubmit={handleAddGoal}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2"><Plus className="w-4 h-4 text-primary" /> Log Today's Metrics</h3>
              <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded-full border border-border">Inputs are Optional</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium mb-1 pl-1 text-muted-foreground">Daily Steps</label>
                <input type="number" value={steps} onChange={e => setSteps(e.target.value)} className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="e.g. 5000" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 pl-1 text-muted-foreground">Water Intake (ml)</label>
                <input type="number" value={water} onChange={e => setWater(e.target.value)} className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="e.g. 2000" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 pl-1 text-muted-foreground">Sleep (Hours)</label>
                <input type="number" step="0.5" value={sleep} onChange={e => setSleep(e.target.value)} className="w-full p-3 rounded-xl border border-border outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="e.g. 7.5" />
              </div>
            </div>
            
            <div className="border-t border-primary/10 pt-4 mb-4">
               <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Settings className="w-4 h-4 text-secondary" /> Personal Wellness Targets</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 ml-1 block">Step Goal</label>
                    <input type="number" value={targetSteps} onChange={e => setTargetSteps(Number(e.target.value) || 10000)} className="w-full p-2 text-sm rounded-lg border border-border bg-white outline-none" placeholder="Target Steps" />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 ml-1 block">Water Goal (ml)</label>
                    <input type="number" value={targetWater} onChange={e => setTargetWater(Number(e.target.value) || 2500)} className="w-full p-2 text-sm rounded-lg border border-border bg-white outline-none" placeholder="Target Water (ml)" />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 ml-1 block">Sleep Goal (hrs)</label>
                    <input type="number" value={targetSleep} onChange={e => setTargetSleep(Number(e.target.value) || 8)} className="w-full p-2 text-sm rounded-lg border border-border bg-white outline-none" placeholder="Target Sleep (hrs)" />
                 </div>
               </div>
            </div>

            <div className="mt-4 flex justify-end gap-3 border-t border-primary/10 pt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-5 py-2 rounded-xl border border-border font-medium hover:bg-slate-50 bg-white transition-colors text-sm">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-primary text-white rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-colors text-sm">Save Log</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main Grid: Goal Cards and Reminders */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
          <GoalCard 
            title="Daily Steps" 
            current={todayGoal.steps || 0} 
            target={targetSteps} 
            unit="steps" 
            icon={<Footprints className="h-6 w-6" />} 
            colorClass="primary" 
          />
          <GoalCard 
            title="Water Intake" 
            current={todayGoal.waterIntake || 0} 
            target={targetWater} 
            unit="ml" 
            icon={<Droplets className="h-6 w-6" />} 
            colorClass="secondary" 
          />
          <GoalCard 
            title="Sleep" 
            current={todayGoal.sleepHours || 0} 
            target={targetSleep} 
            unit="hours" 
            icon={<Moon className="h-6 w-6" />} 
            colorClass="accent" 
          />
        </div>
        
        {/* Reminders Panel */}
        <div className="glass-panel p-6 border-l-4 border-l-secondary bg-secondary/5 xl:col-span-1">
          <div className="flex items-center gap-2 mb-4 border-b border-border/50 pb-2">
            <Bell className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-lg">Action Items</h3>
            <span className="ml-auto bg-secondary/20 text-secondary text-xs font-bold px-2 py-1 rounded-full">{reminders.filter(r => r.status === 'Pending').length} Pending</span>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {reminders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4 bg-white rounded-xl border border-dashed border-border">No action items right now.</p>
              ) : (
                reminders.map((reminder) => (
                  <motion.div 
                    key={reminder._id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    className={`p-3 rounded-xl border flex gap-3 items-start transition-colors ${reminder.status === 'Completed' ? 'bg-slate-50 border-border/50 opacity-60' : 'bg-white border-secondary/20 hover:border-secondary shadow-sm'}`}
                  >
                    <button 
                      onClick={() => reminder.status === 'Pending' && completeReminder(reminder._id)}
                      disabled={reminder.status === 'Completed'}
                      className={`mt-0.5 rounded-full flex-shrink-0 transition-colors ${reminder.status === 'Completed' ? 'text-emerald-500' : 'text-slate-200 hover:text-secondary'}`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div>
                      <h4 className={`text-sm font-semibold ${reminder.status === 'Completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{reminder.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{new Date(reminder.date).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Activity History</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-border">
          <button 
            onClick={() => setChartType('area')}
            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${chartType === 'area' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            title="Area Chart"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-md flex items-center justify-center transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            title="Bar Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {chartType === 'area' ? (
          <>
            <ProgressChart data={chartData} dataKey="steps" color="#0F766E" title="Step History (Last 7 Logs)" />
            <ProgressChart data={chartData} dataKey="water" color="#5EEAD4" title="Hydration History (Last 7 Logs)" />
          </>
        ) : (
          <>
            <CustomBarChart data={chartData} dataKey="steps" color="#0F766E" title="Step History (Last 7 Logs)" />
            <CustomBarChart data={chartData} dataKey="water" color="#5EEAD4" title="Hydration History (Last 7 Logs)" />
          </>
        )}
      </div>
    </div>
  );
}
