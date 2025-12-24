
export type CategoryType = 'Health' | 'Work' | 'Mind' | 'Finance' | 'Social';

export type Language = 'en' | 'pt';

export type ViewType = 'dashboard' | 'milestones' | 'settings';

export interface Habit {
  id: string;
  name: string;
  category: CategoryType;
  color: string;
  startDate: string; // ISO String
  streak: number;
  bestStreak: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface Stats {
  totalCompletions: number;
  activeStreaks: number;
  successRate: number;
  bestHabit: string;
}

export interface Milestone {
  id: string;
  icon: any;
  titleKey: string;
  descKey: string;
  condition: (habits: Habit[], logs: HabitLog[]) => boolean;
}
