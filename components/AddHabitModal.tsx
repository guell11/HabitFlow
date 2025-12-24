
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, TRANSLATIONS } from '../constants';
import { CategoryType, Language } from '../types';

interface AddHabitModalProps {
  isOpen: boolean;
  lang: Language;
  onClose: () => void;
  onAdd: (name: string, category: CategoryType) => void;
}

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, lang, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<CategoryType>('Health');
  const t = TRANSLATIONS[lang];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name, category);
      setName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6">{t.createHabit}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-400 mb-2">{t.habitName}</label>
            <input 
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Meditation"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-400 mb-2">{t.category}</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => setCategory(cat.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                    category === cat.type 
                      ? 'bg-zinc-800 border-indigo-500 text-white shadow-lg' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  <span className="mb-1">{cat.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-tight">{t.categories[cat.type]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {t.startHabit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitModal;
