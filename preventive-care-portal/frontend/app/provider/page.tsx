"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Search, Filter, Stethoscope, PlusCircle, X, BarChart3, Footprints, Droplets, Moon, UserPlus, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import PatientCard from '../../components/PatientCard';

// Extended pool of mock recommendations - once connected, next one shows up
const ALL_RECOMMENDATIONS = [
  { _id: 'r1', name: 'James Wilson',    email: 'j.wilson@demo.com' },
  { _id: 'r2', name: 'Sarah Connor',    email: 's.connor@demo.com' },
  { _id: 'r3', name: 'Marcus Thompson', email: 'm.thompson@demo.com' },
  { _id: 'r4', name: 'Priya Mehta',     email: 'p.mehta@demo.com' },
  { _id: 'r5', name: 'Liu Zhang',       email: 'l.zhang@demo.com' },
];

// Mock wellness chart data for each connected patient (per patient simulation)
const MOCK_CHARTS: Record<string, any> = {
  default: { steps: 7300, water: 1800, sleep: 6.5, stepsGoal: 10000, waterGoal: 2500, sleepGoal: 8 }
};

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Connected IDs tracked separately so we can feed the recommendation pool
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());
  // Track mock-connected patients (added locally since backend is mock)
  const [mockConnected, setMockConnected] = useState<any[]>([]);
  // Connecting animation
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // Chart modal
  const [chartPatient, setChartPatient] = useState<any | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) { router.push('/login'); return; }
      const userData = JSON.parse(userStr);
      if (userData.role !== 'Provider') { router.push('/dashboard'); return; }
      setUser(userData);
      fetchPatients(token);
    };
    checkAuth();
  }, [router]);

  const fetchPatients = async (token: string) => {
    try {
      const { data } = await api.get('/provider/patients');
      setPatients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Available recommendations = pool minus already connected ones
  const availableRecs = ALL_RECOMMENDATIONS.filter(r => !connectedIds.has(r._id)).slice(0, 2);

  const handleConnect = async (rec: any) => {
    setConnectingId(rec._id);
    await new Promise(r => setTimeout(r, 900)); // simulate API call
    setConnectedIds(prev => new Set([...prev, rec._id]));
    setMockConnected(prev => [...prev, { ...rec, _id: rec._id + '_c', lastActive: 'Just connected', status: 'Good' }]);
    setConnectingId(null);
  };

  const allPatients = [...patients, ...mockConnected];
  const filteredPatients = allPatients.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const chartData = chartPatient ? (MOCK_CHARTS[chartPatient._id] || MOCK_CHARTS.default) : null;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Activity className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">

      {/* Chart Modal */}
      <AnimatePresence>
        {chartPatient && chartData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setChartPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 260 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6"
            >
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{chartPatient.name}</h2>
                  <p className="text-sm text-muted-foreground">{chartPatient.email} · Wellness Overview</p>
                </div>
                <button onClick={() => setChartPatient(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { icon: <Footprints className="h-5 w-5" />, label: 'Steps Today', value: chartData.steps.toLocaleString(), goal: chartData.stepsGoal.toLocaleString(), color: 'text-indigo-600 bg-indigo-50' },
                  { icon: <Droplets className="h-5 w-5" />, label: 'Water (ml)', value: chartData.water, goal: chartData.waterGoal, color: 'text-sky-600 bg-sky-50' },
                  { icon: <Moon className="h-5 w-5" />, label: 'Sleep (hrs)', value: chartData.sleep, goal: chartData.sleepGoal, color: 'text-violet-600 bg-violet-50' },
                ].map(m => (
                  <div key={m.label} className="text-center glass-panel p-3 rounded-2xl">
                    <div className={`${m.color} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2`}>{m.icon}</div>
                    <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-xl font-bold text-foreground">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Goal: {m.goal}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Steps', value: (chartData.steps / chartData.stepsGoal) * 100, color: 'bg-indigo-500' },
                  { label: 'Water', value: (chartData.water / chartData.waterGoal) * 100, color: 'bg-sky-500' },
                  { label: 'Sleep', value: (chartData.sleep / chartData.sleepGoal) * 100, color: 'bg-violet-500' },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{bar.label}</span><span>{Math.round(bar.value)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, bar.value)}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-2 rounded-full ${bar.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4 bg-slate-50 rounded-lg p-2">
                📊 Simulated wellness data for demo purposes
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-14 w-14 rounded-full bg-primary/10 items-center justify-center text-primary border border-primary/20">
            <Stethoscope className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dr. {user?.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground mt-1 font-medium">Primary Care Physician <span className="text-slate-300 mx-2">|</span> NovaCare Health</p>
          </div>
        </div>
        <div className="flex gap-3 mt-6 md:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-64"
            />
          </div>
          <button className="p-2 border border-border rounded-full bg-white hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 shadow-sm border border-border/50">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Patients Assigned</h3>
          <p className="text-3xl font-bold">{allPatients.length}</p>
        </div>
        <div className="glass-panel p-6 shadow-sm border border-border/50">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">High Risk / Critical</h3>
          <p className="text-3xl font-bold text-rose-500">0</p>
        </div>
        <div className="glass-panel p-6 shadow-sm border border-border/50 bg-primary/5 border-primary/20">
          <h3 className="text-primary text-sm font-medium mb-1 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Platform Registrations
          </h3>
          <p className="text-3xl font-bold text-primary">{availableRecs.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Patient Directory */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Patient Directory</h2>
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center bg-white rounded-2xl border border-dashed border-border px-4">
                No patients assigned yet. Connect with newly registered users to add them to your directory.
              </p>
            ) : (
              <AnimatePresence>
                {filteredPatients.map((patient) => (
                  <motion.div
                    key={patient._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <PatientCard
                      patient={patient}
                      status="Good"
                      lastActive="Today"
                      onClick={() => setChartPatient(patient)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Patient Recommendations</h2>
          <div className="space-y-4">
            {availableRecs.length === 0 ? (
              <div className="glass-panel p-6 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">All patients connected!</p>
                <p className="text-xs text-muted-foreground mt-1">No new recommendations at this time.</p>
              </div>
            ) : (
              availableRecs.map((rec) => (
                <motion.div
                  key={rec._id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-panel p-4 border border-primary/20 bg-white"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UserPlus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{rec.name}</h4>
                      <p className="text-xs text-muted-foreground">{rec.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect(rec)}
                    disabled={connectingId === rec._id}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      connectingId === rec._id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {connectingId === rec._id ? (
                      <><Activity className="h-3 w-3 animate-spin" /> Connecting...</>
                    ) : (
                      <><UserPlus className="h-3 w-3" /> Connect with Patient</>
                    )}
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
