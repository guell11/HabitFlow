
import React from 'react';
import { Medal, Zap, Calendar, TrendingUp, Layers, CheckCircle2, Lock } from 'lucide-react';
import { Habit, HabitLog, Language, Milestone } from '../types';
import { TRANSLATIONS } from '../constants';

interface MilestonesViewProps {
  habits: Habit[];
  logs: HabitLog[];
  lang: Language;
}

const MILESTONES_DEF: Milestone[] = [
  {
    id: 'first_step',
    icon: CheckCircle2,
    titleKey: 'firstStep',
    descKey: 'firstStepDesc',
    condition: (_, logs) => logs.length >= 1
  },
  {
    id: 'week_warrior',
    icon: Zap,
    titleKey: 'weekWarrior',
    descKey: 'weekWarriorDesc',
    condition: (habits) => habits.some(h => h.streak >= 7)
  },
  {
    id: 'month_master',
    icon: Calendar,
    titleKey: 'monthMaster',
    descKey: 'monthMasterDesc',
    condition: (habits) => habits.some(h => h.streak >= 30)
  },
  {
    id: 'century_club',
    icon: TrendingUp,
    titleKey: 'centuryClub',
    descKey: 'centuryClubDesc',
    condition: (_, logs) => logs.length >= 100
  },
  {
    id: 'diversity',
    icon: Layers,
    titleKey: 'diversity',
    descKey: 'diversityDesc',
    condition: (habits) => {
      const categories = new Set(habits.map(h => h.category));
      return categories.size >= 3;
    }
  }
];

const MilestonesView: React.FC<MilestonesViewProps> = ({ habits, logs, lang }) => {
  const t = TRANSLATIONS[lang];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {MILESTONES_DEF.map((m) => {
        const isUnlocked = m.condition(habits, logs);
        const Icon = m.icon;

        return (
          <div 
            key={m.id}
            className={`relative p-6 rounded-3xl border transition-all duration-300 ${
              isUnlocked 
                ? 'bg-gradient-to-br from-zinc-900 to-zinc-900/50 border-emerald-500/30 shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)]' 
                : 'bg-zinc-950/30 border-zinc-800 grayscale opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-600'}`}>
                <Icon size={24} />
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                isUnlocked ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {isUnlocked ? t.milestoneUnlocked : t.milestoneLocked}
              </div>
            </div>
            
            <h3 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-zinc-500'}`}>
              {(t.badges as any)[m.titleKey]}
            </h3>
            <p className="text-sm text-zinc-500">
              {(t.badges as any)[m.descKey]}
            </p>

            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/20 backdrop-blur-[1px] rounded-3xl">
                <Lock className="text-zinc-700" size={32} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MilestonesView;
