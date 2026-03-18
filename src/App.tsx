import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  X, 
  Check, 
  Play,
  ArrowRight,
  User,
  Home,
  Zap,
  Flame,
  Music,
  TrendingUp,
  Award,
  Activity,
  Filter,
  Target,
  Trophy,
  Timer,
  Trash2,
  History,
  Edit
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Habit, HABIT_COLORS, HABIT_ICONS, SortOption, HabitGoal, BADGES, Badge } from './types';

// --- Local Storage Helper ---
const STORAGE_KEY = 'habitly_data';

const loadHabits = (): Habit[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

const saveHabits = (habits: Habit[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
};

// --- Components ---

const Mascot = React.memo(({ state = 'happy', className = "" }: { state?: 'happy' | 'meditating' | 'success', className?: string }) => {
  return (
    <div className={`relative w-48 h-48 flex items-center justify-center ${className}`}>
      {/* Simple 2D Mascot Implementation */}
      <motion.div 
        animate={state === 'meditating' ? { y: [0, -10, 0] } : { scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-40 h-40 bg-orange-500 rounded-full border-4 border-black dark:border-white/20 relative flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)]"
      >
        {/* Eyes */}
        <div className="absolute top-12 flex gap-8">
          <div className="w-10 h-10 bg-black dark:bg-zinc-950 rounded-sm transform rotate-12 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <div className="w-10 h-10 bg-black dark:bg-zinc-950 rounded-sm transform -rotate-12 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
        {/* Mouth */}
        <div className="absolute bottom-10 w-12 h-2 bg-black dark:bg-zinc-950 rounded-full"></div>
        {/* Hands */}
        <div className="absolute -left-6 top-20 w-8 h-8 bg-white dark:bg-zinc-200 border-2 border-black dark:border-white/20 rounded-full"></div>
        <div className="absolute -right-6 top-20 w-8 h-8 bg-white dark:bg-zinc-200 border-2 border-black dark:border-white/20 rounded-full"></div>
      </motion.div>
      {/* Sparkles */}
      <motion.div 
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute top-0 right-0 text-yellow-400"
      >
        ✦
      </motion.div>
    </div>
  );
});

const SplashScreen = React.memo(({ onComplete }: { onComplete: (nextStep: 'onboarding' | 'dashboard') => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedName = localStorage.getItem('user_name');
      onComplete(savedName ? 'dashboard' : 'onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
      className="fixed inset-0 bg-black flex items-center justify-center z-[200]"
    >
      <div className="flex flex-col items-center">
        <div className="flex gap-2">
          {["S", "H", "T"].map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 40, opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.15, 
                duration: 0.8, 
                type: "spring", 
                stiffness: 200, 
                damping: 12 
              }}
              className="text-8xl font-black text-white tracking-tighter inline-block"
            >
              {char}
            </motion.span>
          ))}
        </div>
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 120, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="h-1 bg-white/20 mt-8 rounded-full overflow-hidden relative"
        >
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-white"
          />
        </motion.div>
      </div>
    </motion.div>
  );
});

const Onboarding = React.memo(({ onFinish }: { onFinish: (name: string) => void, key?: string }) => {
  const [name, setName] = useState('');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
      className="fixed inset-0 bg-brand-blue dark:bg-zinc-950 flex flex-col items-center justify-center p-8 text-white z-[100] transition-colors duration-500"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="max-w-md w-full flex flex-col items-center"
      >
        <Mascot className="mb-12" />
        <h1 className="text-5xl font-black text-center mb-4 leading-tight">
          Build healthy<br />habits with us
        </h1>
        <p className="text-white/80 dark:text-zinc-400 text-center mb-8 max-w-xs">
          Track your daily progress and achieve your goals with a smile.
        </p>
        
        <div className="w-full max-w-xs mb-8">
          <label className="block text-sm font-bold mb-2 text-white/70 dark:text-zinc-500">What's your name?</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-full bg-white/20 dark:bg-white/5 border-2 border-white/30 dark:border-white/10 focus:border-white rounded-2xl px-6 py-4 outline-none transition-all font-medium text-white placeholder:text-white/40 dark:placeholder:text-zinc-600"
          />
        </div>

        <button 
          onClick={() => name.trim() && onFinish(name.trim())}
          disabled={!name.trim()}
          className="w-full max-w-xs bg-white dark:bg-white text-black font-bold py-5 rounded-3xl text-xl shadow-[0_8px_0_0_rgba(0,0,0,0.2)] dark:shadow-[0_8px_0_0_rgba(255,255,255,0.1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Get started
        </button>
      </motion.div>
    </motion.div>
  );
});

const BadgeUnlockModal = React.memo(({ badge, onClose }: { badge: Badge, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[40px] p-8 text-center shadow-2xl border border-slate-100 dark:border-white/5"
      >
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <motion.div 
          animate={{ 
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-32 h-32 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-2xl"
          style={{ backgroundColor: badge.color }}
        >
          {React.createElement(badge.icon, { size: 64, color: 'white' })}
        </motion.div>

        <h2 className="text-3xl font-black mb-2 dark:text-white">Badge Unlocked!</h2>
        <h3 className="text-xl font-bold text-slate-800 dark:text-zinc-200 mb-4">{badge.name}</h3>
        <p className="text-slate-500 dark:text-zinc-400 mb-8 leading-relaxed">
          {badge.description}
        </p>

        <button 
          onClick={onClose}
          className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
        >
          Awesome!
        </button>
      </motion.div>
    </div>
  );
});

const Dashboard = React.memo(({ habits, userName, selectedDate, onDateSelect, onAdd, onToggle, onDelete, onSelect, onOpenCalendar, onOpenSettings, onViewChange, sortOption, onSortChange, stats, earnedBadges }: { 
  habits: Habit[], 
  userName: string,
  selectedDate: string,
  onDateSelect: (date: string) => void,
  onAdd: () => void, 
  onToggle: (id: string) => void,
  onDelete: (id: string) => void,
  onSelect: (habit: Habit) => void,
  onOpenCalendar: () => void,
  onOpenSettings: () => void,
  onViewChange: (view: 'dashboard' | 'profile') => void,
  sortOption: SortOption,
  onSortChange: (sort: SortOption) => void,
  stats: { totalCompletions: number, maxStreak: number, currentStreak: number },
  earnedBadges: Badge[],
  key?: string
}) => {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 7 + i);
    return d;
  }), [today]);

  const mostFrequentHabit = useMemo(() => {
    if (habits.length === 0) return null;
    const sorted = [...habits].sort((a, b) => b.completedDates.length - a.completedDates.length);
    const topCount = sorted[0].completedDates.length;
    if (topCount === 0) return null;
    
    // Check if there's a tie for the top spot
    const winners = sorted.filter(h => h.completedDates.length === topCount);
    return winners.length === 1 ? winners[0] : null;
  }, [habits]);

  const displayTitle = useMemo(() => {
    if (!mostFrequentHabit) return userName;
    const name = mostFrequentHabit.name;
    if (name.toLowerCase().endsWith('ing')) {
      return name.slice(0, -3) + 'er';
    }
    return name;
  }, [mostFrequentHabit, userName]);

  return (
    <div className="min-h-screen pb-24 max-w-screen-xl mx-auto">
      <header className="p-6 flex justify-between items-center">
        <div>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},
          </p>
          <h2 className="text-3xl font-black dark:text-white">{displayTitle}</h2>
        </div>
        <div className="flex gap-3">
          {stats.currentStreak > 0 && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-500/20"
            >
              <Flame size={18} className="fill-current" />
              <span className="font-black text-lg">{stats.currentStreak}</span>
            </motion.div>
          )}
          <button 
            onClick={onOpenCalendar}
            className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors dark:text-white"
          >
            <CalendarIcon size={20} />
          </button>
          <button 
            onClick={onOpenSettings}
            className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 relative hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors dark:text-white"
          >
            <Settings size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white dark:border-zinc-900"></span>
          </button>
        </div>
      </header>
      
      {/* Badge Progress */}
      <div className="px-6 mb-8">
        <motion.div 
          onClick={() => onViewChange('profile')}
          className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-white/5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-black dark:text-white">Achievements</h4>
              <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">{stats.totalCompletions} Total Completions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-lg font-black dark:text-white">{earnedBadges.length} / {BADGES.length}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase">Badges</p>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-300">
              <ChevronRight size={20} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Calendar Strip */}
      <div className="px-6 mb-8 flex justify-start overflow-x-auto no-scrollbar gap-2 scroll-smooth">
        {days.map((day, i) => {
          const dateStr = day.toISOString().split('T')[0];
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          
          return (
            <button 
              key={i} 
              onClick={() => onDateSelect(dateStr)}
              className={`calendar-pill flex-shrink-0 border-2 transition-all ${isSelected ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white scale-105' : isToday ? 'bg-brand-green/30 dark:bg-brand-green/20 border-brand-green text-black dark:text-brand-green' : 'bg-white dark:bg-zinc-900 border-transparent text-slate-400 dark:text-zinc-500'}`}
            >
              <span className={`text-xs font-bold uppercase ${isSelected ? 'opacity-60' : 'opacity-40'}`}>
                {day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 3)}
              </span>
              <span className="text-xl font-black">{day.getDate()}</span>
            </button>
          );
        })}
      </div>

      {/* Sort Options */}
      <div className="px-6 mb-4 flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <Filter size={12} /> Sort
        </h3>
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {(['Most Recent', 'Alphabetical', 'Completion Rate'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => onSortChange(option)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${sortOption === option ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => {
            const isCompleted = habit.completedDates.includes(selectedDate);
            const IconComp = HABIT_ICONS.find(i => i.name === habit.icon)?.component || Zap;
            const today = new Date().toISOString().split('T')[0];
            const isFuture = selectedDate > today;

            return (
              <motion.div 
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20, transition: { duration: 0.2 } }}
                onClick={() => onSelect(habit)}
                className="bento-card relative overflow-hidden cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform group"
                style={{ backgroundColor: habit.color }}
              >
              <div className="mb-4 flex justify-between items-start">
                <div className="p-2 bg-white/20 rounded-xl">
                  <IconComp size={24} />
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setHabitToDelete(habit);
                  }}
                  className="p-2 bg-white/40 hover:bg-white/60 text-black rounded-full transition-all shadow-sm"
                  title="Delete Habit"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-1">{habit.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1 bg-black/10 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  <Flame size={10} className="fill-current" />
                  <span>{(() => {
                    const sortedDates = [...habit.completedDates].sort().reverse();
                    if (sortedDates.length === 0) return 0;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const todayStr = today.toISOString().split('T')[0];
                    const yesterdayStr = yesterday.toISOString().split('T')[0];
                    const lastDateStr = sortedDates[0].split('T')[0];
                    if (lastDateStr !== todayStr && lastDateStr !== yesterdayStr) return 0;
                    let streak = 1;
                    for (let i = 0; i < sortedDates.length - 1; i++) {
                      const curr = new Date(sortedDates[i]);
                      const next = new Date(sortedDates[i+1]);
                      const diffDays = Math.ceil(Math.abs(curr.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
                      if (diffDays === 1) streak++; else break;
                    }
                    return streak;
                  })()} day streak</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full">
                  {habit.duration} min
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full">
                  {habit.interval}
                </span>
                {habit.reminderTime && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Timer size={10} /> {habit.reminderTime}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-70 line-clamp-2">{habit.description}</p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(habit.id);
                }}
                disabled={isFuture}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full border-2 border-black flex items-center justify-center transition-all ${isFuture ? 'opacity-30 cursor-not-allowed' : ''} ${isCompleted ? 'bg-black text-white' : 'bg-white/30 backdrop-blur-sm'}`}
              >
                {isCompleted ? <Check size={20} /> : <div className="w-4 h-4 rounded-full border-2 border-black/20" />}
              </button>
            </motion.div>
          );
        })}
        </AnimatePresence>

        {/* Empty State / Add Card */}
        {habits.length === 0 && (
          <div className="col-span-2 py-12 flex flex-col items-center text-slate-400 dark:text-zinc-600">
            <Mascot className="scale-75 opacity-50 mb-4" />
            <p className="font-medium">No habits yet. Let's start one!</p>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 px-6 py-4 rounded-[40px] shadow-2xl flex items-center gap-12 z-40">
        <button onClick={() => onViewChange('dashboard')} className="text-black dark:text-white"><Home size={24} /></button>
        <button 
          onClick={onAdd}
          className="w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-blue/30 active:scale-90 transition-transform"
        >
          <Plus size={28} />
        </button>
        <button onClick={() => onViewChange('profile')} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors"><User size={24} /></button>
      </div>

      <AnimatePresence>
        {habitToDelete && (
          <DeleteHabitConfirmationModal 
            habitName={habitToDelete.name}
            onConfirm={() => {
              onDelete(habitToDelete.id);
              setHabitToDelete(null);
            }}
            onCancel={() => setHabitToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

const AddHabitModal = React.memo(({ onClose, onSave, habitToEdit }: { 
  onClose: () => void, 
  onSave: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void,
  habitToEdit?: Habit 
}) => {
  const [name, setName] = useState(habitToEdit?.name || '');
  const [description, setDescription] = useState(habitToEdit?.description || '');
  const [interval, setInterval] = useState<Habit['interval']>(habitToEdit?.interval || 'Every day');
  const [duration, setDuration] = useState(habitToEdit?.duration || 25);
  const [reminderTime, setReminderTime] = useState(habitToEdit?.reminderTime || '');
  const [selectedColor, setSelectedColor] = useState(habitToEdit?.color || HABIT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(habitToEdit?.icon || HABIT_ICONS[0].name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
      />
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh] p-6 sm:p-8 relative z-10 border border-transparent dark:border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors dark:text-white"><X size={24} /></button>
          <h2 className="text-xl font-black dark:text-white">Let's start a new habit</h2>
          <div className="w-10"></div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Name</label>
            <input 
              type="text" 
              placeholder="Type habit name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none transition-all font-medium dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Description</label>
            <textarea 
              placeholder="Describe a habit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none transition-all font-medium h-32 resize-none dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Intervals</label>
              <select 
                value={interval}
                onChange={(e) => setInterval(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none transition-all font-medium appearance-none dark:text-white"
              >
                <option>Every day</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Duration (mins)</label>
              <input 
                type="number" 
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none transition-all font-medium dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Reminder Time (Optional)</label>
              <input 
                type="time" 
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue rounded-2xl px-6 py-4 outline-none transition-all font-medium dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Color</label>
            <div className="flex flex-wrap gap-2">
              {HABIT_COLORS.map((color) => (
                <button 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-4 ${selectedColor === color ? 'border-black dark:border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-zinc-400">Icon</label>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
              {HABIT_ICONS.map((icon) => {
                const IconComp = icon.component;
                const isSelected = selectedIcon === icon.name;
                return (
                  <button 
                    key={icon.name}
                    onClick={() => setSelectedIcon(icon.name)}
                    className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${isSelected ? 'bg-black dark:bg-white text-white dark:text-black scale-110' : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 hover:bg-slate-200 dark:hover:bg-zinc-700'}`}
                  >
                    <IconComp size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => {
              if (name) onSave({ name, description, interval, duration, color: selectedColor, icon: selectedIcon, reminderTime: reminderTime || undefined });
            }}
            className="w-full bg-brand-blue text-white font-bold py-5 rounded-3xl text-xl mt-8 hover:bg-brand-blue/90 active:scale-95 transition-all"
          >
            {habitToEdit ? 'Update Habit' : 'Create Habit'}
          </button>
        </div>
      </motion.div>
    </div>
  );
});

const HabitHistory = React.memo(({ habit }: { habit: Habit }) => {
  const history = useMemo(() => {
    const start = new Date(habit.createdAt);
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const items = [];
    const current = new Date(start);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      items.push({
        date: new Date(current),
        dateStr,
        isCompleted: habit.completedDates.includes(dateStr)
      });
      current.setDate(current.getDate() + 1);
    }
    
    return items.reverse();
  }, [habit]);

  const stats = useMemo(() => {
    const completed = history.filter(h => h.isCompleted).length;
    const total = history.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, rate };
  }, [history]);

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl text-center">
          <p className="text-2xl font-black">{stats.completed}</p>
          <p className="text-[10px] font-bold uppercase opacity-60">Done</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl text-center">
          <p className="text-2xl font-black">{stats.total - stats.completed}</p>
          <p className="text-[10px] font-bold uppercase opacity-60">Missed</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-3xl text-center">
          <p className="text-2xl font-black">{stats.rate}%</p>
          <p className="text-[10px] font-bold uppercase opacity-60">Rate</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {history.map((item) => (
          <div 
            key={item.dateStr}
            className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl flex items-center justify-between border border-white/5"
          >
            <div>
              <p className="font-bold">
                {item.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-xs opacity-60">
                {item.isCompleted ? 'Completed' : 'Missed'}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.isCompleted ? 'bg-white text-black' : 'bg-black/20 text-white/40'}`}>
              {item.isCompleted ? <Check size={20} /> : <X size={20} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const BreatheText = () => {
  const [text, setText] = useState('Inhale');
  useEffect(() => {
    const interval = setInterval(() => {
      setText(prev => prev === 'Inhale' ? 'Exhale' : 'Inhale');
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return <>{text}</>;
};

const FocusMode = React.memo(({ habit, onClose, onComplete, onDelete, onEdit }: { habit: Habit, onClose: () => void, onComplete: () => void, onDelete: (id: string) => void, onEdit: (habit: Habit) => void }) => {
  const [mode, setMode] = useState<'focus' | 'history' | 'breathe'>('focus');
  const [timeLeft, setTimeLeft] = useState(habit.duration * 60);
  const [isActive, setIsActive] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (isMusicPlaying) {
      if (!audioRef.current) {
        audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        audioRef.current.loop = true;
      }
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    } else {
      audioRef.current?.pause();
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [isMusicPlaying]);

  useEffect(() => {
    let timer: any;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return { m, s };
  };

  const { m, s } = formatTime(timeLeft);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-md dark:bg-black/80"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-2xl h-[80vh] rounded-[48px] shadow-2xl p-8 sm:p-12 relative z-10 flex flex-col items-center border border-white/20 overflow-hidden"
        style={{ backgroundColor: habit.color }}
      >
        <div className="absolute top-8 left-8 right-8 flex justify-between items-center">
          <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X size={24} /></button>
          
          <div className="bg-black/10 p-1 rounded-2xl flex gap-1">
            <button 
              onClick={() => setMode('focus')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'focus' ? 'bg-white text-black shadow-sm' : 'text-black/60'}`}
            >
              <Timer size={16} /> Session
            </button>
            <button 
              onClick={() => setMode('breathe')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'breathe' ? 'bg-white text-black shadow-sm' : 'text-black/60'}`}
            >
              <Activity size={16} /> Breathe
            </button>
            <button 
              onClick={() => setMode('history')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${mode === 'history' ? 'bg-white text-black shadow-sm' : 'text-black/60'}`}
            >
              <History size={16} /> History
            </button>
          </div>

          <button onClick={() => onEdit(habit)} className="p-2 hover:bg-black/10 rounded-full transition-colors"><Edit size={24} /></button>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-12 overflow-hidden">
          <AnimatePresence mode="wait">
            {mode === 'focus' ? (
              <motion.div 
                key="focus"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col items-center justify-center w-full"
              >
                <h2 className="text-4xl sm:text-5xl font-black mb-8 text-center">{habit.name}</h2>
                <Mascot state={timeLeft === 0 ? "success" : "meditating"} className="mb-12 scale-110 sm:scale-125" />
                
                <div className="text-center mb-12">
                  <div className="text-6xl sm:text-8xl font-black flex items-baseline gap-2">
                    {m} <span className="text-xl sm:text-2xl opacity-60">min</span> {s < 10 ? `0${s}` : s} <span className="text-xl sm:text-2xl opacity-60">s</span>
                  </div>
                </div>

                <div className="w-full max-w-md space-y-3">
                  <button 
                    onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                    className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${isMusicPlaying ? 'bg-white text-black shadow-lg' : 'bg-white/30 text-black'}`}
                  >
                    <Music size={20} className={isMusicPlaying ? 'animate-pulse' : ''} />
                    <span className="font-bold">{isMusicPlaying ? 'Stop Ambient Music' : 'Play Ambient Music'}</span>
                  </button>
                  <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
                    <Zap size={20} />
                    <span className="font-medium">Mindful breathing helps you relax</span>
                  </div>
                </div>

                <div className="w-full max-w-md flex gap-4 mt-12">
                  <button 
                    onClick={() => setIsActive(!isActive)}
                    className="flex-1 bg-white/20 text-black font-bold py-5 rounded-3xl text-xl hover:bg-white/30 transition-all"
                  >
                    {isActive ? 'Pause' : 'Resume'}
                  </button>
                  <button 
                    onClick={() => {
                      onComplete();
                      onClose();
                    }}
                    className="flex-1 bg-white text-black font-bold py-5 rounded-3xl text-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  >
                    {timeLeft === 0 ? 'Finish' : 'Done Early'}
                  </button>
                </div>
              </motion.div>
            ) : mode === 'breathe' ? (
              <motion.div 
                key="breathe"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex-1 flex flex-col items-center justify-center w-full"
              >
                <h2 className="text-3xl font-black mb-12">Breathe Deeply</h2>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="w-48 h-48 bg-white/40 rounded-full flex items-center justify-center border-4 border-white"
                >
                  <motion.div 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="text-2xl font-black"
                  >
                    <BreatheText />
                  </motion.div>
                </motion.div>
                <p className="mt-12 text-xl font-bold opacity-80">Follow the circle</p>
              </motion.div>
            ) : (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 w-full flex flex-col overflow-hidden"
              >
                <h2 className="text-3xl font-black mb-8 text-center">{habit.name} History</h2>
                <HabitHistory habit={habit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="mt-6 text-black/40 hover:text-black/60 font-bold text-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Trash2 size={14} /> Delete Habit
        </button>

        <AnimatePresence>
          {showDeleteConfirm && (
            <DeleteHabitConfirmationModal 
              habitName={habit.name}
              onConfirm={() => {
                onDelete(habit.id);
                onClose();
              }}
              onCancel={() => setShowDeleteConfirm(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
});

const CalendarOverview = React.memo(({ habits, onClose }: { habits: Habit[], onClose: () => void }) => {
  const today = useMemo(() => new Date(), []);
  const last30Days = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 29 + i);
    return d;
  }), [today]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
        onClick={onClose}
      />
      <motion.div 
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[40px] shadow-2xl p-8 relative z-10 max-h-[80vh] overflow-y-auto border border-transparent dark:border-white/10"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black dark:text-white">Calendar Overview</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full dark:text-white"><X size={24} /></button>
        </div>

        <div className="space-y-8">
          {habits.map(habit => (
            <div key={habit.id} className="bg-slate-50 dark:bg-zinc-800 p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: habit.color }}>
                    {React.createElement(HABIT_ICONS.find(i => i.name === habit.icon)?.component || Zap, { size: 20 })}
                  </div>
                  <h3 className="font-bold text-lg dark:text-white">{habit.name}</h3>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black dark:text-white">{habit.completedDates.length}</span>
                  <p className="text-[10px] font-bold uppercase opacity-40 dark:text-zinc-500">Total</p>
                </div>
              </div>
              
              <div className="grid grid-cols-10 gap-2">
                {last30Days.map((day, i) => {
                  const dateStr = day.toISOString().split('T')[0];
                  const isCompleted = habit.completedDates.includes(dateStr);
                  return (
                    <div 
                      key={i}
                      title={dateStr}
                      className={`aspect-square rounded-md transition-all ${isCompleted ? 'scale-110 shadow-sm' : 'opacity-20 dark:opacity-5'}`}
                      style={{ backgroundColor: isCompleted ? habit.color : '#cbd5e1' }}
                    />
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-4 font-medium">Last 30 days activity</p>
            </div>
          ))}
          {habits.length === 0 && <p className="text-center text-slate-400 dark:text-zinc-600 py-12">No habits to track yet.</p>}
        </div>
      </motion.div>
    </div>
  );
});

const ResetConfirmationModal = React.memo(({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[40px] shadow-2xl p-8 relative z-10 border border-transparent dark:border-white/10 text-center"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Zap size={40} />
        </div>
        <h2 className="text-2xl font-black mb-2 dark:text-white">Reset All Data?</h2>
        <p className="text-slate-500 dark:text-zinc-400 mb-8">
          This action is permanent. All your habits and progress will be deleted in <span className="text-red-500 font-bold">{countdown}s</span>.
        </p>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            disabled={countdown > 0}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600"
          >
            {countdown > 0 ? `Wait ${countdown}s` : 'Allow Reset'}
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
          >
            Deny / Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
});

const SettingsModal = React.memo(({ userName, isDarkMode, habitGoal, onToggleDarkMode, onUpdateName, onUpdateGoal, onReset, onClose }: { 
  userName: string, 
  isDarkMode: boolean,
  habitGoal: HabitGoal,
  onToggleDarkMode: () => void,
  onUpdateName: (name: string) => void, 
  onUpdateGoal: (goal: HabitGoal) => void,
  onReset: () => void, 
  onClose: () => void 
}) => {
  const [name, setName] = useState(userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [notifPermission, setNotifPermission] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');

  const requestPermission = async () => {
    if (typeof Notification !== 'undefined') {
      const permission = await Notification.requestPermission();
      setNotifPermission(permission);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/60"
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-[40px] shadow-2xl p-8 relative z-10 border border-transparent dark:border-white/10"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black dark:text-white">Settings</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors dark:text-white"><X size={24} /></button>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-500 dark:text-zinc-400">Your Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 bg-slate-100 dark:bg-zinc-800 border-2 border-transparent focus:border-brand-blue rounded-2xl px-4 py-3 outline-none transition-all font-medium dark:text-white"
                />
                <button 
                  onClick={() => onUpdateName(name)}
                  className="bg-black dark:bg-white dark:text-black text-white px-4 py-3 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Switch between light and dark theme</p>
                </div>
                <button 
                  onClick={onToggleDarkMode}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-brand-blue' : 'bg-slate-200'}`}
                >
                  <motion.div 
                    animate={{ x: isDarkMode ? 24 : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold dark:text-white">Notifications</h3>
                  <p className="text-sm text-slate-500 dark:text-zinc-400">Get reminded to complete your habits</p>
                </div>
                <button 
                  onClick={requestPermission}
                  disabled={notifPermission === 'denied'}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${notifPermission === 'granted' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' : notifPermission === 'denied' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400 opacity-50 cursor-not-allowed' : 'bg-brand-blue text-white'}`}
                >
                  {notifPermission === 'granted' ? 'Enabled' : notifPermission === 'denied' ? 'Blocked' : 'Enable'}
                </button>
              </div>
              {notifPermission === 'granted' && (
                <button 
                  onClick={() => {
                    new Notification("Habitly Test", { body: "Notifications are working! 🚀" });
                  }}
                  className="mt-2 w-full text-xs font-bold text-brand-blue hover:underline"
                >
                  Send Test Notification
                </button>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <label className="block text-sm font-bold mb-4 text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Habit Goals</label>
              <div className="space-y-4">
                <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl">
                  <button 
                    onClick={() => onUpdateGoal({ ...habitGoal, type: 'daily' })}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${habitGoal.type === 'daily' ? 'bg-white dark:bg-zinc-700 shadow-sm dark:text-white' : 'text-slate-500'}`}
                  >
                    Daily
                  </button>
                  <button 
                    onClick={() => onUpdateGoal({ ...habitGoal, type: 'weekly' })}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${habitGoal.type === 'weekly' ? 'bg-white dark:bg-zinc-700 shadow-sm dark:text-white' : 'text-slate-500'}`}
                  >
                    Weekly
                  </button>
                </div>
                <div className="flex items-center justify-between bg-slate-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl">
                  <span className="text-sm font-bold dark:text-white">Target Habits</span>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => onUpdateGoal({ ...habitGoal, target: Math.max(1, habitGoal.target - 1) })}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-lg shadow-sm text-lg font-bold dark:text-white"
                    >
                      -
                    </button>
                    <span className="text-lg font-black dark:text-white min-w-[20px] text-center">{habitGoal.target}</span>
                    <button 
                      onClick={() => onUpdateGoal({ ...habitGoal, target: habitGoal.target + 1 })}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-700 rounded-lg shadow-sm text-lg font-bold dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <h3 className="text-sm font-bold mb-4 text-red-500 uppercase tracking-wider">Danger Zone</h3>
              <button 
                onClick={() => setShowResetConfirm(true)}
                className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={18} /> Reset All Data
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <ResetConfirmationModal 
            onConfirm={() => {
              onReset();
              onClose();
            }}
            onCancel={() => setShowResetConfirm(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
});

const DeleteHabitConfirmationModal = React.memo(({ habitName, onConfirm, onCancel }: { habitName: string, onConfirm: () => void, onCancel: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[40px] shadow-2xl p-8 relative z-10 border border-transparent dark:border-white/10 text-center"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={40} />
        </div>
        <h2 className="text-2xl font-black mb-2 dark:text-white">Delete Habit?</h2>
        <p className="text-slate-500 dark:text-zinc-400 mb-8">
          Are you sure you want to delete <span className="font-bold text-black dark:text-white">"{habitName}"</span>? This action cannot be undone.
        </p>
        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-all"
          >
            Delete Habit
          </button>
          <button 
            onClick={onCancel}
            className="w-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold py-4 rounded-2xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
});

const ProfileView = React.memo(({ habits, userName, habitGoal, onViewChange, onDelete, onAdd, stats, earnedBadges }: { 
  habits: Habit[], 
  userName: string, 
  habitGoal: HabitGoal,
  onViewChange: (view: 'dashboard' | 'profile') => void,
  onDelete: (id: string) => void,
  onAdd: () => void,
  stats: { totalCompletions: number, maxStreak: number, currentStreak: number },
  earnedBadges: Badge[],
  key?: string
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'distribution' | 'calendar' | 'badges'>('weekly');
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  
  const points = useMemo(() => {
    const completionPoints = stats.totalCompletions * 10;
    const streakBonus = Math.floor(stats.maxStreak / 7) * 50;
    const badgeBonus = earnedBadges.length * 100;
    return completionPoints + streakBonus + badgeBonus;
  }, [stats.totalCompletions, stats.maxStreak, earnedBadges]);

  const level = useMemo(() => Math.floor(points / 500) + 1, [points]);
  const nextLevelPoints = level * 500;
  const levelProgress = (points % 500) / 500 * 100;

  const last7Days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d.toISOString().split('T')[0];
  }), []);

  const chartData = useMemo(() => last7Days.map(date => {
    const count = habits.reduce((acc, h) => acc + (h.completedDates.includes(date) ? 1 : 0), 0);
    return {
      name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      count
    };
  }), [habits, last7Days]);

  const distributionData = useMemo(() => habits.map(h => ({
    name: h.name,
    value: h.completedDates.length,
    color: h.color
  })).filter(h => h.value > 0), [habits]);

  const last30Days = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    return d;
  }), []);

  const mostConsistentHabit = useMemo(() => [...habits].sort((a, b) => b.completedDates.length - a.completedDates.length)[0], [habits]);

  const goalProgress = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    if (habitGoal.type === 'daily') {
      const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
      return {
        current: completedToday,
        target: habitGoal.target,
        percentage: Math.min(100, (completedToday / habitGoal.target) * 100)
      };
    } else {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      });
      const completedThisWeek = habits.reduce((acc, h) => {
        const count = h.completedDates.filter(d => last7Days.includes(d)).length;
        return acc + count;
      }, 0);
      return {
        current: completedThisWeek,
        target: habitGoal.target,
        percentage: Math.min(100, (completedThisWeek / habitGoal.target) * 100)
      };
    }
  }, [habits, habitGoal]);

  return (
    <div className="min-h-screen pb-32 max-w-screen-xl mx-auto px-6 pt-12">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-black dark:text-white">My Progress</h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">Keep going, {userName}!</p>
        </div>
        <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-blue/20">
          <User size={32} />
        </div>
      </header>

      {/* Goal Progress */}
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black dark:text-white flex items-center gap-2">
              <Target size={24} className="text-brand-blue" />
              {habitGoal.type === 'daily' ? 'Daily' : 'Weekly'} Goal
            </h3>
            <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">
              Complete {habitGoal.target} habits {habitGoal.type === 'daily' ? 'today' : 'this week'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black dark:text-white">{Math.round(goalProgress.percentage)}%</span>
            <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Progress</p>
          </div>
        </div>
        
        <div className="w-full h-4 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${goalProgress.percentage}%` }}
            className="h-full bg-brand-blue shadow-[0_0_20px_rgba(79,70,229,0.3)]"
          />
        </div>
        
        <div className="flex justify-between mt-4">
          <span className="text-sm font-bold text-slate-500 dark:text-zinc-400">
            {goalProgress.current} / {goalProgress.target} completed
          </span>
          {goalProgress.percentage >= 100 && (
            <span className="text-sm font-bold text-brand-green flex items-center gap-1">
              <Trophy size={14} /> Goal Reached!
            </span>
          )}
        </div>
      </div>

      {/* Streak Hero Section */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 rounded-[40px] shadow-xl shadow-orange-500/20 mb-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Zap size={28} className="text-white" />
            </div>
            <h3 className="text-2xl font-black">Best Streak</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black">{stats.maxStreak}</span>
            <span className="text-2xl font-bold opacity-80">Days</span>
          </div>
          <p className="mt-4 text-white/80 font-medium">
            Your longest consecutive sequence of habit completions. Keep it up!
          </p>
        </div>
        {/* Background Decoration */}
        <div className="absolute -right-8 -bottom-8 opacity-10">
          <Zap size={200} />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <div 
          onClick={() => setActiveTab('distribution')}
          className={`p-6 rounded-[32px] shadow-sm border transition-all cursor-pointer ${activeTab === 'distribution' ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/5'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activeTab === 'distribution' ? 'bg-white/20 text-white' : 'bg-brand-blue/10 text-brand-blue'}`}>
            <Activity size={20} />
          </div>
          <p className="text-2xl font-black dark:text-white">{habits.length}</p>
          <p className={`text-xs font-bold uppercase ${activeTab === 'distribution' ? 'text-white/60' : 'text-slate-400 dark:text-zinc-500'}`}>Total Habits</p>
        </div>
        <div 
          onClick={() => setActiveTab('calendar')}
          className={`p-6 rounded-[32px] shadow-sm border transition-all cursor-pointer ${activeTab === 'calendar' ? 'bg-brand-green text-white border-brand-green' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/5'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activeTab === 'calendar' ? 'bg-white/20 text-white' : 'bg-brand-green/10 text-brand-green'}`}>
            <Check size={20} />
          </div>
          <p className="text-2xl font-black dark:text-white">{stats.totalCompletions}</p>
          <p className={`text-xs font-bold uppercase ${activeTab === 'calendar' ? 'text-white/60' : 'text-slate-400 dark:text-zinc-500'}`}>Completions</p>
        </div>
        <div 
          onClick={() => setActiveTab('weekly')}
          className={`p-6 rounded-[32px] shadow-sm border transition-all cursor-pointer ${activeTab === 'weekly' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/5'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activeTab === 'weekly' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-500'}`}>
            <TrendingUp size={20} />
          </div>
          <p className="text-2xl font-black dark:text-white">{mostConsistentHabit?.completedDates.length || 0}</p>
          <p className={`text-xs font-bold uppercase ${activeTab === 'weekly' ? 'text-white/60' : 'text-slate-400 dark:text-zinc-500'}`}>Best Habit</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-white/5">
          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center mb-4">
            <Zap size={20} />
          </div>
          <p className="text-2xl font-black dark:text-white">{stats.currentStreak} Days</p>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">Current Streak</p>
        </div>
        <div 
          onClick={() => setActiveTab('badges')}
          className={`p-6 rounded-[32px] shadow-sm border transition-all cursor-pointer ${activeTab === 'badges' ? 'bg-pink-500 text-white border-pink-500' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/5'}`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${activeTab === 'badges' ? 'bg-white/20 text-white' : 'bg-pink-100 text-pink-500'}`}>
            <Award size={20} />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black dark:text-white">Lvl {level}</p>
            <p className={`text-[10px] font-bold uppercase ${activeTab === 'badges' ? 'text-white/60' : 'text-slate-400 dark:text-zinc-500'}`}>({points}/{nextLevelPoints})</p>
          </div>
          <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${activeTab === 'badges' ? 'bg-white/20' : 'bg-slate-100 dark:bg-zinc-800'}`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${levelProgress}%` }}
              className={`h-full ${activeTab === 'badges' ? 'bg-white' : 'bg-pink-500'}`}
            />
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] shadow-sm border border-slate-100 dark:border-white/5">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-4">
            <Trophy size={20} />
          </div>
          <p className="text-2xl font-black dark:text-white">{earnedBadges.length}</p>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase">Badges</p>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <AnimatePresence mode="wait">
        {activeTab === 'weekly' && (
          <motion.div 
            key="weekly"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 mb-8"
          >
            <h3 className="text-xl font-black mb-8 dark:text-white">Weekly Activity</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', opacity: 0.05 }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#18181b', color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#4F46E5' : '#e2e8f0'} opacity={entry.count > 0 ? 1 : 0.2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {activeTab === 'distribution' && (
          <motion.div 
            key="distribution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 mb-8"
          >
            <h3 className="text-xl font-black mb-4 dark:text-white">Habit Distribution</h3>
            {distributionData.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: '#18181b', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full mt-8">
                  {habits.map((h, i) => (
                    <div key={i} className={`flex items-center gap-2 ${h.completedDates.length === 0 ? 'opacity-30' : ''}`}>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className="text-xs font-bold text-slate-600 dark:text-zinc-400 truncate">{h.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center text-slate-400 font-medium">
                <Mascot className="scale-75 opacity-50 mb-4" />
                <p>No completion data yet.<br/>Start tracking to see your distribution!</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'calendar' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 mb-8"
          >
            <h3 className="text-xl font-black mb-6 dark:text-white">Last 30 Days Overview</h3>
            <div className="space-y-8">
              {habits.map(habit => (
                <div key={habit.id}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                      <span className="text-sm font-bold truncate dark:text-white">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase">{habit.completedDates.length} completions</span>
                      <button 
                        onClick={() => setHabitToDelete(habit)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all rounded-lg"
                        title="Delete Habit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-10 gap-2">
                    {last30Days.map((day, i) => {
                      const dateStr = day.toISOString().split('T')[0];
                      const isCompleted = habit.completedDates.includes(dateStr);
                      return (
                        <div 
                          key={i} 
                          title={dateStr}
                          className={`aspect-square rounded-md transition-all ${isCompleted ? 'scale-110 shadow-sm' : 'opacity-10 dark:opacity-5'}`}
                          style={{ backgroundColor: isCompleted ? habit.color : '#cbd5e1' }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
              {habits.length === 0 && (
                <div className="py-12 text-center text-slate-400 font-medium">
                  Add some habits to see your progress!
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div 
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black dark:text-white">Badges & Achievements</h3>
              <span className="bg-pink-100 dark:bg-pink-500/10 text-pink-500 px-4 py-1 rounded-full text-xs font-bold">
                {earnedBadges.length} / {BADGES.length} Unlocked
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {BADGES.map(badge => {
                const isEarned = earnedBadges.some(b => b.id === badge.id);
                const Icon = badge.icon;
                return (
                  <div 
                    key={badge.id}
                    className={`p-6 rounded-[32px] border flex flex-col items-center text-center transition-all ${isEarned ? 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-white/5 shadow-sm' : 'bg-slate-50 dark:bg-zinc-950/50 border-dashed border-slate-200 dark:border-white/5 opacity-40 grayscale'}`}
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                      style={{ backgroundColor: isEarned ? badge.color : '#e2e8f0', color: isEarned ? 'white' : '#94a3b8' }}
                    >
                      <Icon size={32} />
                    </div>
                    <h4 className="font-black text-sm mb-1 dark:text-white">{badge.name}</h4>
                    <p className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 leading-tight">{badge.description}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Most Consistent Habit Detail */}
      {mostConsistentHabit && activeTab === 'weekly' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black dark:bg-zinc-900 text-white p-8 rounded-[40px] shadow-xl flex items-center justify-between border border-transparent dark:border-white/10"
        >
          <div>
            <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">Most Consistent</p>
            <h3 className="text-2xl font-black mb-1">{mostConsistentHabit.name}</h3>
            <p className="text-white/40 text-sm">{mostConsistentHabit.completedDates.length} days completed</p>
          </div>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center" style={{ backgroundColor: mostConsistentHabit.color }}>
            {React.createElement(HABIT_ICONS.find(i => i.name === mostConsistentHabit.icon)?.component || Zap, { size: 32, color: 'black' })}
          </div>
        </motion.div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 px-6 py-4 rounded-[40px] shadow-2xl flex items-center gap-12 z-40">
        <button onClick={() => onViewChange('dashboard')} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors"><Home size={24} /></button>
        <button 
          onClick={onAdd}
          className="w-14 h-14 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-blue/30 active:scale-90 transition-transform"
        >
          <Plus size={28} />
        </button>
        <button onClick={() => onViewChange('profile')} className="text-black dark:text-white"><User size={24} /></button>
      </div>

      <AnimatePresence>
        {habitToDelete && (
          <DeleteHabitConfirmationModal 
            habitName={habitToDelete.name}
            onConfirm={() => {
              onDelete(habitToDelete.id);
              setHabitToDelete(null);
            }}
            onCancel={() => setHabitToDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
});

export default function App() {
  const [step, setStep] = useState<'splash' | 'onboarding' | 'dashboard'>(() => {
    const splashShown = sessionStorage.getItem('splash_shown');
    if (splashShown) {
      const savedName = localStorage.getItem('user_name');
      return savedName ? 'dashboard' : 'onboarding';
    }
    return 'splash';
  });
  const [view, setView] = useState<'dashboard' | 'profile'>('dashboard');
  const [userName, setUserName] = useState('User');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([]);
  const [currentUnlock, setCurrentUnlock] = useState<Badge | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [habitGoal, setHabitGoal] = useState<HabitGoal>(() => {
    const saved = localStorage.getItem('habit_goal');
    return saved ? JSON.parse(saved) : { type: 'daily', target: 3 };
  });
  const [sortOption, setSortOption] = useState<SortOption>('Most Recent');
  const [toast, setToast] = useState<{ show: boolean, message: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved === 'true';
  });

  const totalCompletions = useMemo(() => habits.reduce((acc, h) => acc + h.completedDates.length, 0), [habits]);
  
  const maxStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    let overallMax = 0;
    habits.forEach(habit => {
      if (habit.completedDates.length === 0) return;
      const sortedDates = [...habit.completedDates].sort();
      let currentStreak = 1;
      let habitMax = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prev = new Date(sortedDates[i-1]);
        const curr = new Date(sortedDates[i]);
        const diffTime = Math.abs(curr.getTime() - prev.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
        if (currentStreak > habitMax) habitMax = currentStreak;
      }
      if (habitMax > overallMax) overallMax = habitMax;
    });
    return overallMax;
  }, [habits]);

  const currentStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    let maxCurrent = 0;
    habits.forEach(habit => {
      const sortedDates = [...habit.completedDates].sort().reverse();
      if (sortedDates.length === 0) return;
      const lastDateStr = sortedDates[0].split('T')[0];
      if (lastDateStr !== todayStr && lastDateStr !== yesterdayStr) return;
      let streak = 1;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const curr = new Date(sortedDates[i]);
        const next = new Date(sortedDates[i+1]);
        const diffTime = Math.abs(curr.getTime() - next.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          streak++;
        } else if (diffDays > 1) {
          break;
        }
      }
      if (streak > maxCurrent) maxCurrent = streak;
    });
    return maxCurrent;
  }, [habits]);

  const stats = useMemo(() => ({
    totalCompletions,
    maxStreak,
    currentStreak
  }), [totalCompletions, maxStreak, currentStreak]);

  const earnedBadges = useMemo(() => {
    return BADGES.filter(badge => badge.requirement(habits, stats));
  }, [habits, stats]);

  // --- Badge Notifications ---
  useEffect(() => {
    const savedUnlocked = localStorage.getItem('unlocked_badges');
    const previouslyUnlockedIds = savedUnlocked ? JSON.parse(savedUnlocked) : [];
    
    const newlyEarned = earnedBadges.filter(badge => !previouslyUnlockedIds.includes(badge.id));
    
    if (newlyEarned.length > 0) {
      const newIds = [...previouslyUnlockedIds, ...newlyEarned.map(b => b.id)];
      localStorage.setItem('unlocked_badges', JSON.stringify(newIds));
      
      // Queue up the unlocks
      setUnlockedBadges(prev => [...prev, ...newlyEarned]);
    }
  }, [earnedBadges]);

  useEffect(() => {
    if (unlockedBadges.length > 0 && !currentUnlock) {
      setCurrentUnlock(unlockedBadges[0]);
      setUnlockedBadges(prev => prev.slice(1));
    }
  }, [unlockedBadges, currentUnlock]);

  useEffect(() => {
    if (step !== 'splash') {
      sessionStorage.setItem('splash_shown', 'true');
    }
  }, [step]);

  useEffect(() => {
    localStorage.setItem('dark_mode', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Check for existing user on mount
    const savedName = localStorage.getItem('user_name');
    if (savedName && step !== 'splash') {
      setUserName(savedName);
      setHabits(loadHabits());
    }
  }, [step]);

  useEffect(() => {
    localStorage.setItem('habit_goal', JSON.stringify(habitGoal));
  }, [habitGoal]);

  // --- Notification System ---
  useEffect(() => {
    if (typeof Notification === 'undefined') return;

    const lastNotified = new Map<string, string>(); // habitId -> lastNotifiedTime (HH:mm)

    const interval = setInterval(() => {
      if (Notification.permission !== "granted") return;

      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      habits.forEach(habit => {
        if (habit.reminderTime === currentTime && lastNotified.get(habit.id) !== currentTime) {
          new Notification(`Time for ${habit.name}!`, {
            body: habit.description || `Don't forget to complete your habit: ${habit.name}`,
            icon: '/favicon.ico'
          });
          lastNotified.set(habit.id, currentTime);
        }
      });
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [habits]);

  const sortedHabits = useMemo(() => {
    const sorted = [...habits];
    switch (sortOption) {
      case 'Alphabetical':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Completion Rate':
        return sorted.sort((a, b) => b.completedDates.length - a.completedDates.length);
      case 'Most Recent':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [habits, sortOption]);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    // Clear existing timeout if any
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  };

  const handleToggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate > today) {
      showToast("You can't complete habits for future dates! ⏳");
      return;
    }

    let completed = false;
    const newHabits = habits.map(h => {
      if (h.id === id) {
        const isAlreadyCompleted = h.completedDates.includes(selectedDate);
        const newCompletedDates = isAlreadyCompleted
          ? h.completedDates.filter(d => d !== selectedDate)
          : [...h.completedDates, selectedDate];
        
        if (!isAlreadyCompleted) completed = true;
        
        return { ...h, completedDates: newCompletedDates };
      }
      return h;
    });
    setHabits(newHabits);
    saveHabits(newHabits);

    if (completed) {
      const habit = habits.find(h => h.id === id);
      showToast(`Great job! You completed "${habit?.name}"! 🎉`);
    }
  };

  const handleDeleteHabit = (id: string) => {
    const habit = habits.find(h => h.id === id);
    const newHabits = habits.filter(h => h.id !== id);
    setHabits(newHabits);
    saveHabits(newHabits);
    showToast(`Habit "${habit?.name}" deleted.`);
  };

  const handleAddHabit = (data: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => {
    if (habitToEdit) {
      const newHabits = habits.map(h => h.id === habitToEdit.id ? { ...h, ...data } : h);
      setHabits(newHabits);
      saveHabits(newHabits);
      setHabitToEdit(null);
      showToast(`Habit "${data.name}" updated!`);
    } else {
      const newHabit: Habit = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      const newHabits = [...habits, newHabit];
      setHabits(newHabits);
      saveHabits(newHabits);
      showToast(`Habit "${data.name}" created!`);
    }
    setIsAdding(false);
  };

  const finishOnboarding = (name: string) => {
    localStorage.setItem('user_name', name);
    setUserName(name);
    setStep('dashboard');
  };

  const handleUpdateName = (name: string) => {
    localStorage.setItem('user_name', name);
    setUserName(name);
    setIsSettingsOpen(false);
  };

  const handleReset = () => {
    localStorage.clear();
    sessionStorage.removeItem('splash_shown');
    setUserName('');
    setHabits([]);
    setStep('splash');
    setView('dashboard');
  };

  return (
    <div className="bg-[#FBFBF9] dark:bg-zinc-950 min-h-screen relative overflow-x-hidden transition-colors duration-500">
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ y: 100, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 100, x: '-50%', opacity: 0 }}
            className="fixed bottom-12 left-1/2 z-[99999] bg-zinc-900 text-white px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4 whitespace-nowrap border border-white/10"
          >
            <div className="w-10 h-10 bg-brand-blue rounded-2xl flex items-center justify-center shadow-lg">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === 'splash' ? (
          <SplashScreen key="splash" onComplete={(next) => setStep(next)} />
        ) : step === 'onboarding' ? (
          <Onboarding key="onboarding" onFinish={finishOnboarding} />
        ) : view === 'dashboard' ? (
          <Dashboard 
            key="dashboard"
            habits={sortedHabits} 
            userName={userName}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onAdd={() => setIsAdding(true)}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
            onSelect={setSelectedHabit}
            onOpenCalendar={() => setIsCalendarOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onViewChange={setView}
            sortOption={sortOption}
            onSortChange={setSortOption}
            stats={stats}
            earnedBadges={earnedBadges}
          />
        ) : (
          <ProfileView 
            key="profile"
            habits={habits}
            userName={userName}
            habitGoal={habitGoal}
            onViewChange={setView}
            onDelete={handleDeleteHabit}
            onAdd={() => setIsAdding(true)}
            stats={stats}
            earnedBadges={earnedBadges}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <AddHabitModal 
            onClose={() => {
              setIsAdding(false);
              setHabitToEdit(null);
            }} 
            onSave={handleAddHabit}
            habitToEdit={habitToEdit || undefined}
          />
        )}
        {isCalendarOpen && (
          <CalendarOverview 
            habits={habits} 
            onClose={() => setIsCalendarOpen(false)} 
          />
        )}
        {isSettingsOpen && (
          <SettingsModal 
            userName={userName}
            isDarkMode={isDarkMode}
            habitGoal={habitGoal}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onUpdateName={handleUpdateName}
            onUpdateGoal={setHabitGoal}
            onReset={handleReset}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        {selectedHabit && (
          <FocusMode 
            habit={selectedHabit} 
            onClose={() => setSelectedHabit(null)} 
            onComplete={() => handleToggleHabit(selectedHabit.id)}
            onDelete={handleDeleteHabit}
            onEdit={(h) => {
              setHabitToEdit(h);
              setIsAdding(true);
              setSelectedHabit(null);
            }}
          />
        )}
        {currentUnlock && (
          <BadgeUnlockModal 
            badge={currentUnlock} 
            onClose={() => setCurrentUnlock(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
