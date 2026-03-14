"use client";

import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ProgressChartProps {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
}

export default function ProgressChart({ data, dataKey, color, title }: ProgressChartProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
