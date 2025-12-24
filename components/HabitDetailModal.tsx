
import React from 'react';
import { X, Calendar as CalendarIcon, Flame } from 'lucide-react';
import { Habit, HabitLog, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HabitDetailModalProps {
  habit: Habit | null;
  logs: HabitLog[];
  lang: Language;
  onClose: () => void;
}

const HabitDetailModal: React.FC<HabitDetailModalProps> = ({ habit, logs, lang, onClose }) => {
  if (!habit) return null;

  const t = TRANSLATIONS[lang];
  const habitLogs = logs.filter(l => l.habitId === habit.id);
  
  // Generate last 30 days
  const dates = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    return d;
  });

  const isCompleted = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return habitLogs.some(l => l.date === dateStr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${habit.color}20`, color: habit.color }}>
                <CalendarIcon size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold">{habit.name}</h2>
                <div className="flex items-center gap-2 text-zinc-400 text-sm mt-1">
                    <Flame size={14} className="text-orange-500" fill="currentColor" />
                    <span className="font-mono">{habit.streak} {t.daysSuffix} Streak</span>
                </div>
            </div>
        </div>

        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">{t.calendarHistory}</h3>
        
        <div className="grid grid-cols-7 gap-2">
            {['S','M','T','W','T','F','S'].map((d, i) => (
                <div key={i} className="text-center text-xs font-bold text-zinc-600 py-2">{d}</div>
            ))}
            
            {dates.map((date, i) => {
                const completed = isCompleted(date);
                const isToday = new Date().toDateString() === date.toDateString();
                
                return (
                    <div 
                        key={i} 
                        className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium border transition-all ${
                            completed 
                                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                                : isToday 
                                    ? 'bg-zinc-800 border-zinc-600 text-zinc-300' 
                                    : 'bg-zinc-900/50 border-zinc-800/50 text-zinc-600'
                        }`}
                    >
                        {date.getDate()}
                    </div>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default HabitDetailModal;
