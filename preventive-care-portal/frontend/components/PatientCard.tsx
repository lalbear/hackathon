"use client";

import { motion } from 'framer-motion';
import { User, Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PatientCardProps {
  patient: {
    _id: string;
    name: string;
    email: string;
  };
  status: 'Good' | 'Needs Attention' | 'Critical';
  lastActive: string;
  onClick: () => void;
}

export default function PatientCard({ patient, status, lastActive, onClick }: PatientCardProps) {
  
  const statusColors = {
    'Good': 'text-emerald-500 bg-emerald-50 border-emerald-100',
    'Needs Attention': 'text-amber-500 bg-amber-50 border-amber-100',
    'Critical': 'text-rose-500 bg-rose-50 border-rose-100'
  };

  const StatusIcon = {
    'Good': CheckCircle2,
    'Needs Attention': AlertCircle,
    'Critical': Activity
  }[status];

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={onClick}
      className="bg-white p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{patient.name}</h3>
          <p className="text-sm text-muted-foreground">{patient.email}</p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-1/2">
        <div className="text-sm">
          <p className="text-muted-foreground mb-1">Last Active</p>
          <p className="font-medium">{lastActive}</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 text-xs font-medium ${statusColors[status]}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status}
        </div>
      </div>
    </motion.div>
  );
}
