"use client";

import { motion } from 'framer-motion';

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: React.ReactNode;
  colorClass: string;
}

export default function GoalCard({ title, current, target, unit, icon, colorClass }: GoalCardProps) {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
      className={`glass-panel p-6 relative overflow-hidden`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${colorClass}`} />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-3 rounded-2xl bg-${colorClass}/10 text-${colorClass}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">
            {current} <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between text-xs mb-2 font-medium">
          <span className="text-muted-foreground">Progress</span>
          <span className={`text-${colorClass}`}>{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2.5 rounded-full bg-${colorClass}`} 
          />
        </div>
        <p className="text-xs text-muted-foreground mt-3 text-right">Target: {target} {unit}</p>
      </div>
    </motion.div>
  );
}
