
import React, { useRef } from 'react';
import { Download, Upload, Trash2, Database, AlertCircle } from 'lucide-react';
import { Habit, HabitLog, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SettingsViewProps {
  habits: Habit[];
  logs: HabitLog[];
  lang: Language;
  onImport: (habits: Habit[], logs: HabitLog[]) => void;
  onReset: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ habits, logs, lang, onImport, onReset }) => {
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { habits, logs, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json.habits) && Array.isArray(json.logs)) {
          onImport(json.habits, json.logs);
          alert(t.importSuccess);
        } else {
          alert(t.importError);
        }
      } catch (err) {
        alert(t.importError);
      }
    };
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    if (window.confirm(t.confirmReset)) {
      onReset();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Database size={24} />
          </div>
          <h2 className="text-xl font-bold">{t.dataManagement}</h2>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleExport}
            className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-indigo-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-indigo-400">
                <Download size={20} />
              </div>
              <span className="font-medium">{t.exportData}</span>
            </div>
            <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">.json</span>
          </button>

          <div className="relative">
             <input 
              ref={fileInputRef}
              type="file" 
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-emerald-400">
                  <Upload size={20} />
                </div>
                <span className="font-medium">{t.importData}</span>
              </div>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded">.json</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-8">
         <div className="flex items-center gap-3 mb-4 text-red-400">
            <AlertCircle size={20} />
            <h3 className="font-bold">Danger Zone</h3>
         </div>
         <p className="text-zinc-500 text-sm mb-6">{t.confirmReset}</p>
         <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition-colors"
         >
           <Trash2 size={18} />
           {t.resetData}
         </button>
      </div>

    </div>
  );
};

export default SettingsView;
