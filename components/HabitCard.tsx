
import React from 'react';
import { Check, Flame, Trophy, Trash2, Info } from 'lucide-react';
import { Habit, Language } from '../types';
import { CATEGORIES, CATEGORY_COLORS, TRANSLATIONS } from '../constants';

interface HabitCardProps {
  habit: Habit;
  completedToday: boolean;
  lang: Language;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDetails: (habit: Habit) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, completedToday, lang, onToggle, onDelete, onViewDetails }) => {
  const categoryInfo = CATEGORIES.find(c => c.type === habit.category);
  const color = CATEGORY_COLORS[habit.category];
  const t = TRANSLATIONS[lang];

  return (
    <div className="relative group bg-zinc-900/40 backdrop-blur-md border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/50 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div 
          className="p-2 rounded-xl"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          {categoryInfo?.icon}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onViewDetails(habit)}
            title={t.viewDetails}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-all"
          >
            <Info size={16} />
          </button>
          <button 
            onClick={() => onDelete(habit.id)}
            title={t.deleteHabit}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => onToggle(habit.id)}
            className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-500 transform ${
              completedToday 
                ? 'bg-emerald-500 border-emerald-400 text-white scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:border-zinc-500'
            }`}
          >
            <Check size={20} className={completedToday ? 'scale-110' : ''} />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-1">{habit.name}</h3>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          {t.categories[habit.category]}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-6">
        <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/30">
          <div className="flex items-center gap-1.5 text-orange-400 mb-1">
            <Flame size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.streakLabel}</span>
          </div>
          <p className="text-xl font-bold mono">{habit.streak}{t.daysSuffix}</p>
        </div>
        <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/30">
          <div className="flex items-center gap-1.5 text-amber-400 mb-1">
            <Trophy size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">{t.bestLabel}</span>
          </div>
          <p className="text-xl font-bold mono">{habit.bestStreak}{t.daysSuffix}</p>
        </div>
      </div>

      <div className="mt-4 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${Math.min((habit.streak / 30) * 100, 100)}%`,
            backgroundColor: color,
            boxShadow: `0 0 8px ${color}`
          }}
        />
      </div>
    </div>
  );
};

export default HabitCard;
