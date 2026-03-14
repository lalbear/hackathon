"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Users, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-background">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-3xl w-64 h-64" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto mt-16"
      >
        <span className="inline-block py-1.5 px-4 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-semibold mb-6 border border-secondary/30">
          Modern Preventive Healthcare
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 leading-tight">
          Your Wellness Journey, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Proactively Monitored.
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          NovaCare connects patients and providers in real-time. Track daily wellness goals, stay compliant with care plans, and prevent health issues before they start.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="group flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-semibold shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1">
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white text-foreground border border-border rounded-full font-semibold hover:bg-gray-50 transition-all">
            Provider Login
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full mb-16"
      >
        <FeatureCard 
          icon={<Activity className="w-8 h-8 text-primary" />}
          title="Daily Tracking"
          desc="Log steps, water intake, and sleep to maintain a healthy baseline."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-8 h-8 text-secondary-foreground" />}
          title="Preventive Care"
          desc="Stay ahead with personalized health tips and preventive checkup reminders."
        />
        <FeatureCard 
          icon={<Users className="w-8 h-8 text-accent" />}
          title="Provider Sync"
          desc="Your doctors get real-time insights to ensure you are meeting your wellness goals."
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300">
      <div className="mb-6 inline-block p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
