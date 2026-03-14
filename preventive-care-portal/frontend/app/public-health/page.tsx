"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  Droplets, ShieldCheck, Moon, HeartPulse, Sun, 
  Rss, AlertTriangle, TrendingUp, CheckCircle2, CalendarDays, ExternalLink, Lightbulb
} from 'lucide-react';

const HEALTH_TIPS = [
  {
    title: "Neuroplasticity & Movement",
    body: "Learning a new physical skill (like dancing) creates denser neural connections than puzzles. Combine physical AND mental challenges to protect against cognitive decline.",
    color: "amber"
  },
  {
    title: "The 10-3-2-1-0 Sleep Rule",
    body: "No caffeine 10 hrs before bed. No food 3 hrs before. No work 2 hrs before. No screens 1 hr before. Zero snooze hits in the morning. Try it for 1 week!",
    color: "indigo"
  },
  {
    title: "Hydration Timing Matters",
    body: "Drinking 500ml of water 30 minutes before each meal improves digestion by 22% and reduces caloric intake. Start your morning with a full glass before coffee.",
    color: "sky"
  },
  {
    title: "Zone 2 Cardio is the Longevity Secret",
    body: "150 minutes/week at a 'conversational pace' heart rate builds mitochondria and is the single best-studied predictor of long-term metabolic health. Walk fast, cycle slow.",
    color: "emerald"
  },
  {
    title: "Sunlight in the First Hour",
    body: "15 minutes of direct morning sunlight sets your circadian rhythm, boosts cortisol at the right time, and improves sleep quality that same night by up to 83%.",
    color: "orange"
  }
];

const TIP_COLOR_MAP: Record<string, { bg: string; border: string; icon: string; title: string; body: string }> = {
  amber:   { bg: 'bg-amber-500/10 from-amber-500/10',   border: 'border-amber-400',   icon: 'bg-amber-100 text-amber-600',   title: 'text-amber-900', body: 'text-amber-800/80' },
  indigo:  { bg: 'bg-indigo-500/10 from-indigo-500/10', border: 'border-indigo-400',  icon: 'bg-indigo-100 text-indigo-600', title: 'text-indigo-900', body: 'text-indigo-800/80' },
  sky:     { bg: 'bg-sky-500/10 from-sky-500/10',       border: 'border-sky-400',     icon: 'bg-sky-100 text-sky-600',       title: 'text-sky-900',    body: 'text-sky-800/80'   },
  emerald: { bg: 'bg-emerald-500/10 from-emerald-500/10', border: 'border-emerald-400', icon: 'bg-emerald-100 text-emerald-600', title: 'text-emerald-900', body: 'text-emerald-800/80' },
  orange:  { bg: 'bg-orange-500/10 from-orange-500/10', border: 'border-orange-400',  icon: 'bg-orange-100 text-orange-600', title: 'text-orange-900', body: 'text-orange-800/80' },
};

export default function PublicHealth() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % HEALTH_TIPS.length);
    }, 30000); // 30 seconds
    return () => clearInterval(timer);
  }, []);

  const currentTip = HEALTH_TIPS[tipIndex];
  const colors = TIP_COLOR_MAP[currentTip.color];

  // MOCK RSS FEED DATA (Sentiment Highlighted)
  const mockNews = [
    {
      id: 1,
      source: "World Health Organization (WHO)",
      title: "Global Surge in Seasonal Influenza Strains Reported",
      snippet: "New data indicates a 40% increase in early-season influenza A cases across northern hemisphere monitoring stations.",
      time: "2 hours ago",
      sentiment: "negative",
      link: "#"
    },
    {
      id: 2,
      source: "CDC Health Alert Network",
      title: "Breakthrough in Preventive Cardiology Screenings",
      snippet: "A new non-invasive biomarker test shows 92% accuracy in predicting arterial plaque formation 5 years earlier than traditional lipid panels.",
      time: "5 hours ago",
      sentiment: "positive",
      link: "#"
    },
    {
      id: 3,
      source: "National Institutes of Health (NIH)",
      title: "Updated Guidelines for Adult Sleep Duration Unveiled",
      snippet: "Experts now recommend focusing on deep-sleep cycle continuity rather than strictly 8-hour blocks for cognitive preservation.",
      time: "1 day ago",
      sentiment: "neutral",
      link: "#"
    },
    {
      id: 4,
      source: "Global Health Observatory",
      title: "Hydration Deficits Linked to Acute Kidney Events in Aging Populations",
      snippet: "Longitudinal study reveals that chronic mild dehydration increases risk factors by 30% in adults over 60.",
      time: "1 day ago",
      sentiment: "negative",
      link: "#"
    }
  ];

  const getSentimentStyle = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return { icon: <TrendingUp className="w-3 h-3" />, color: "text-emerald-700 bg-emerald-100 border-emerald-200" };
      case 'negative': return { icon: <AlertTriangle className="w-3 h-3" />, color: "text-rose-700 bg-rose-100 border-rose-200" };
      default: return { icon: <CheckCircle2 className="w-3 h-3" />, color: "text-slate-700 bg-slate-100 border-slate-200" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Health Intelligence</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real-time global health advisories and daily preventive care strategies powered by sentiment analysis.
        </p>
      </div>

      {/* Rotating Tips Banner */}
      <div className="mb-12 relative min-h-[110px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={tipIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className={`glass-panel p-6 border-l-4 ${colors.border} bg-gradient-to-r ${colors.bg} to-transparent flex flex-col md:flex-row gap-6 items-start`}
          >
            <div className={`${colors.icon} p-4 rounded-full flex-shrink-0`}>
              <Lightbulb className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className={`text-lg font-bold ${colors.title}`}>Tip of the Day: {currentTip.title}</h2>
                <div className="ml-auto flex gap-1.5">
                  {HEALTH_TIPS.map((_, i) => (
                    <button key={i} onClick={() => setTipIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === tipIndex ? `opacity-100 scale-125` : 'opacity-30 bg-slate-400'} bg-current`} />
                  ))}
                </div>
              </div>
              <p className={`${colors.body} text-sm leading-relaxed`}>
                {currentTip.body}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: RSS News Feed */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
            <Rss className="text-primary w-5 h-5" />
            <h2 className="text-2xl font-bold">Live Health Radar</h2>
            <span className="ml-auto text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span> Live
            </span>
          </div>

          <div className="space-y-4">
            {mockNews.map((news, idx) => {
              const style = getSentimentStyle(news.sentiment);
              return (
                <motion.div 
                  key={news.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-5 border border-border/50 hover:border-primary/30 transition-colors group relative overflow-hidden"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                    news.sentiment === 'positive' ? 'bg-emerald-400' : 
                    news.sentiment === 'negative' ? 'bg-rose-400' : 'bg-slate-300'
                  }`} />
                  
                  <div className="pl-3">
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {news.time}
                      </span>
                      <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded-md bg-primary/5">
                        {news.source}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ml-auto ${style.color}`}>
                        {style.icon} {news.sentiment}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-foreground mb-2 pr-6 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {news.snippet}
                    </p>
                    
                    <a href={news.link} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                      Read full advisory <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Evergreen Insights (Quick Cards) */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-2">
            <HeartPulse className="text-rose-500 w-5 h-5" />
            <h2 className="text-xl font-bold">Core Protocols</h2>
          </div>

          <div className="grid gap-4">
            <div className="glass-panel p-4 border border-border/50 flex gap-4 items-center hover:-translate-y-1 transition-transform">
              <div className="bg-secondary/10 p-3 rounded-xl text-secondary"><Droplets className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Hydration Baseline</h4>
                <p className="text-xs text-muted-foreground">Target: 30ml per kg of bodyweight daily.</p>
              </div>
            </div>

            <div className="glass-panel p-4 border border-border/50 flex gap-4 items-center hover:-translate-y-1 transition-transform">
              <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-500"><Moon className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Sleep Hygiene</h4>
                <p className="text-xs text-muted-foreground">No screens 60 mins before bed for melatonin.</p>
              </div>
            </div>

            <div className="glass-panel p-4 border border-border/50 flex gap-4 items-center hover:-translate-y-1 transition-transform">
              <div className="bg-primary/10 p-3 rounded-xl text-primary"><ShieldCheck className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Annual Screening</h4>
                <p className="text-xs text-muted-foreground">Basic metabolic panels every 12 months over 30.</p>
              </div>
            </div>

            <div className="glass-panel p-4 border border-border/50 flex gap-4 items-center hover:-translate-y-1 transition-transform">
              <div className="bg-amber-500/10 p-3 rounded-xl text-amber-500"><Sun className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Vitamin D Protocol</h4>
                <p className="text-xs text-muted-foreground">15 mins direct morning sunlight sets circadian rhythm.</p>
              </div>
            </div>
            
            <div className="glass-panel p-4 border border-border/50 flex gap-4 items-center hover:-translate-y-1 transition-transform">
              <div className="bg-rose-500/10 p-3 rounded-xl text-rose-500"><HeartPulse className="w-6 h-6" /></div>
              <div>
                <h4 className="font-bold text-sm">Zone 2 Cardio</h4>
                <p className="text-xs text-muted-foreground">150 mins/week at a conversational pace.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
