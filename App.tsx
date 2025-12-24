
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutGrid, Zap, Flame, Globe, Target, Edit2, Settings } from 'lucide-react';
import { Habit, HabitLog, CategoryType, Language, ViewType } from './types';
import HabitCard from './components/HabitCard';
import Heatmap from './components/Heatmap';
import AddHabitModal from './components/AddHabitModal';
import MilestonesView from './components/MilestonesView';
import SettingsView from './components/SettingsView';
import HabitDetailModal from './components/HabitDetailModal';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lang, setLang] = useState<Language>('en');
  const [userName, setUserName] = useState('Alex Rivard');
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const t = TRANSLATIONS[lang];

  // Load from LocalStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('habitflow_habits');
    const savedLogs = localStorage.getItem('habitflow_logs');
    const savedLang = localStorage.getItem('habitflow_lang') as Language;
    const savedName = localStorage.getItem('habitflow_username');
    
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedLang) setLang(savedLang);
    if (savedName) setUserName(savedName);

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('habitflow_habits', JSON.stringify(habits));
    localStorage.setItem('habitflow_logs', JSON.stringify(logs));
    localStorage.setItem('habitflow_lang', lang);
    localStorage.setItem('habitflow_username', userName);
  }, [habits, logs, lang, userName]);

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'pt' : 'en');
  };

  const handleEditName = () => {
    const newName = prompt(t.enterName, userName);
    if (newName && newName.trim() !== "") {
      setUserName(newName.trim());
    }
  };

  // Data Management
  const handleImport = (newHabits: Habit[], newLogs: HabitLog[]) => {
    setHabits(newHabits);
    setLogs(newLogs);
  };

  const handleReset = () => {
    setHabits([]);
    setLogs([]);
  };

  const addHabit = (name: string, category: CategoryType) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      category,
      color: '#4f46e5',
      startDate: new Date().toISOString(),
      streak: 0,
      bestStreak: 0,
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setLogs(logs.filter(l => l.habitId !== id));
  };

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    const existingLogIndex = logs.findIndex(l => l.habitId === id && l.date === today);

    if (existingLogIndex >= 0) {
      // Uncheck
      const newLogs = [...logs];
      newLogs.splice(existingLogIndex, 1);
      setLogs(newLogs);
      
      // Update streak
      setHabits(prev => prev.map(h => {
        if (h.id === id) {
          const newStreak = Math.max(0, h.streak - 1);
          return { ...h, streak: newStreak };
        }
        return h;
      }));
    } else {
      // Check
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habitId: id,
        date: today,
        completed: true
      };
      setLogs([...logs, newLog]);

      // Update streak
      setHabits(prev => prev.map(h => {
        if (h.id === id) {
          const newStreak = h.streak + 1;
          const newBest = Math.max(h.bestStreak, newStreak);
          return { ...h, streak: newStreak, bestStreak: newBest };
        }
        return h;
      }));
    }
  };

  const stats = useMemo(() => {
    const activeStreaks = habits.reduce((acc, h) => acc + h.streak, 0);
    const actual = logs.filter(l => {
      const logDate = new Date(l.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return logDate >= thirtyDaysAgo;
    }).length;

    return {
      activeStreaks,
      successRate: habits.length ? Math.round((actual / (habits.length * 30 || 1)) * 100) : 0,
      totalCompletions: logs.length,
      topCategory: habits.length ? habits[0].category : 'N/A'
    };
  }, [habits, logs]);

  const todayStr = new Date().toISOString().split('T')[0];
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-20 lg:w-64 border-r border-zinc-800 hidden md:flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <Zap className="text-white" size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-bold hidden lg:block">HabitFlow</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'dashboard' ? 'bg-zinc-900 text-indigo-400 font-semibold' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
          >
            <LayoutGrid size={20} />
            <span className="hidden lg:block text-sm">{t.dashboard}</span>
          </button>
          <button 
            onClick={() => setCurrentView('milestones')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'milestones' ? 'bg-zinc-900 text-indigo-400 font-semibold' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
          >
            <Target size={20} />
            <span className="hidden lg:block text-sm">{t.milestones}</span>
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${currentView === 'settings' ? 'bg-zinc-900 text-indigo-400 font-semibold' : 'text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300'}`}
          >
            <Settings size={20} />
            <span className="hidden lg:block text-sm">{t.settings}</span>
          </button>
        </nav>

        <div className="lg:bg-zinc-900/50 rounded-2xl p-4 lg:p-6 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <div className="flex items-center gap-2 group cursor-pointer" onClick={handleEditName}>
                 <p className="text-sm font-bold truncate group-hover:text-indigo-400 transition-colors">{userName}</p>
                 <Edit2 size={12} className="opacity-0 group-hover:opacity-100 text-zinc-500" />
              </div>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{t.active}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto custom-scrollbar">
        {/* Header */}
        <header className="px-6 lg:px-12 py-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentView === 'dashboard' && t.performanceDeck}
              {currentView === 'milestones' && t.milestones}
              {currentView === 'settings' && t.settings}
            </h1>
            <p className="text-zinc-500 mt-1 font-medium capitalize">
                {currentTime.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', dateOptions)}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors bg-zinc-900/50 px-3 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700"
            >
                <Globe size={16} />
                <span className="text-sm font-bold uppercase">{lang}</span>
            </button>
            {currentView === 'dashboard' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
              >
                <Plus size={18} />
                {t.newHabit}
              </button>
            )}
          </div>
        </header>

        <div className="px-6 lg:px-12 pb-12">
          
          {/* VIEW: DASHBOARD */}
          {currentView === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min">
              {/* KPI Cards */}
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-zinc-800/20 group-hover:scale-110 transition-transform duration-500">
                  <Flame size={80} fill="currentColor" />
                </div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{t.totalStreaks}</p>
                <p className="text-4xl font-black mono">{stats.activeStreaks}</p>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-zinc-800/20 group-hover:scale-110 transition-transform duration-500">
                  <Target size={80} fill="currentColor" />
                </div>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{t.consistencyScore}</p>
                <p className="text-4xl font-black mono">{stats.successRate}%</p>
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden group md:col-span-1 lg:col-span-2">
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4">{t.yearlyHeatmap}</p>
                <Heatmap logs={logs} lang={lang} />
              </div>

              {/* Main Habits List */}
              <div className="md:col-span-3 lg:col-span-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {t.activeProtocols}
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-full">{habits.length}</span>
                  </h2>
                </div>

                {habits.length === 0 ? (
                  <div className="border-2 border-dashed border-zinc-800 rounded-3xl p-12 text-center">
                    <p className="text-zinc-500 font-medium">{t.noHabits}</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="mt-6 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
                    >
                      {t.initFirstHabit}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habits.map(habit => (
                      <HabitCard 
                        key={habit.id} 
                        habit={habit}
                        lang={lang}
                        completedToday={logs.some(l => l.habitId === habit.id && l.date === todayStr)}
                        onToggle={toggleHabit}
                        onDelete={deleteHabit}
                        onViewDetails={setSelectedHabit}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: MILESTONES */}
          {currentView === 'milestones' && (
             <MilestonesView habits={habits} logs={logs} lang={lang} />
          )}

          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
             <SettingsView habits={habits} logs={logs} lang={lang} onImport={handleImport} onReset={handleReset} />
          )}

        </div>
      </main>

      <AddHabitModal 
        isOpen={isModalOpen} 
        lang={lang}
        onClose={() => setIsModalOpen(false)} 
        onAdd={addHabit} 
      />

      <HabitDetailModal
        habit={selectedHabit}
        logs={logs}
        lang={lang}
        onClose={() => setSelectedHabit(null)}
      />
    </div>
  );
};

export default App;
