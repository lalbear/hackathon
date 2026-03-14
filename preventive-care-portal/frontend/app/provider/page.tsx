"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, Search, Filter, Stethoscope, PlusCircle } from 'lucide-react';
import axios from 'axios';
import PatientCard from '../../components/PatientCard';

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // MOCK DATA for New Registrations / Recommendations
  const [recommendedPatients, setRecommendedPatients] = useState([
    { _id: 'r1', name: 'James Wilson', email: 'j.wilson@demo.com', status: 'Pending' },
    { _id: 'r2', name: 'Sarah Connor', email: 's.connor@demo.com', status: 'Pending' }
  ]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!token || !userStr) {
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(userStr);
      if (userData.role !== 'Provider') {
        router.push('/dashboard');
        return;
      }
      
      setUser(userData);
      fetchPatients(token);
    };

    checkAuth();
  }, [router]);

  const fetchPatients = async (token: string) => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/provider/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleConnect = (id: string) => {
    // Simulated connection to a patient
    setRecommendedPatients(prev => prev.map(p => p._id === id ? { ...p, status: 'Connected' } : p));
    setTimeout(() => {
      setRecommendedPatients(prev => prev.filter(p => p._id !== id));
      // In a real app, this would refresh the `patients` list from the backend
    }, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Activity className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
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
            <input type="text" placeholder="Search patients..." className="pl-9 pr-4 py-2 rounded-full border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-primary w-full md:w-64" />
          </div>
          <button className="p-2 border border-border rounded-full bg-white hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-panel p-6 shadow-sm border border-border/50">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">Total Patients Assigned</h3>
          <p className="text-3xl font-bold">{patients.length}</p>
        </div>
        <div className="glass-panel p-6 shadow-sm border border-border/50">
          <h3 className="text-muted-foreground text-sm font-medium mb-1">High Risk / Critical</h3>
          <p className="text-3xl font-bold text-rose-500">0</p>
        </div>
        <div className="glass-panel p-6 shadow-sm border border-border/50 bg-primary/5 border-primary/20">
          <h3 className="text-primary text-sm font-medium mb-1 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Platform Registrations
          </h3>
          <p className="text-3xl font-bold text-primary">{recommendedPatients.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Patient Directory */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Your Patient Directory</h2>
          <div className="space-y-4">
            {patients.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center bg-white rounded-2xl border border-dashed border-border px-4">
                No patients assigned yet. Connect with newly registered users to add them to your directory.
              </p>
            ) : (
              patients.map((patient) => (
                <PatientCard 
                  key={patient._id}
                  patient={patient}
                  status="Good" // Placeholder logic
                  lastActive="Today" // Placeholder logic
                  onClick={() => { alert(`Viewing detailed charts for ${patient.name} (Simulation)`) }}
                />
              ))
            )}
          </div>
        </div>

        {/* Recommendations Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">Patient Recommendations</h2>
          <div className="space-y-4">
            {recommendedPatients.length === 0 ? (
               <p className="text-sm text-muted-foreground py-6 text-center glass-panel">No new recommendations at this time.</p>
            ) : (
              recommendedPatients.map((rec) => (
                <motion.div 
                  key={rec._id} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-panel p-4 border border-primary/20 bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-sm">{rec.name}</h4>
                      <p className="text-xs text-muted-foreground">{rec.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleConnect(rec._id)}
                    disabled={rec.status === 'Connected'}
                    className={`w-full py-2 rounded-lg text-xs font-semibold transition-all ${
                      rec.status === 'Connected' 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                    }`}
                  >
                    {rec.status === 'Connected' ? '✓ Request Sent' : 'Connect with Patient'}
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
