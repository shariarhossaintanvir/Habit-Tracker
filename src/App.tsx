import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Settings, 
  ChevronLeft, 
  X, 
  Check, 
  Play,
  ArrowRight,
  User,
  Home,
  Zap,
  Music,
  TrendingUp,
  Award,
  Activity
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
import { Habit, HABIT_COLORS, HABIT_ICONS } from './types';

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

const Dashboard = React.memo(({ habits, userName, selectedDate, onDateSelect, onAdd, onToggle, onDelete, onSelect, onOpenCalendar, onOpenSettings, onViewChange }: { 
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
  key?: string
}) => {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);
  
  const days = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - 7 + i);
    return d;
  }), [today]);

  return (
    <div className="min-h-screen pb-24 max-w-screen-xl mx-auto">
      <header className="p-6 flex justify-between items-center">
        <div>
          <p className="text-slate-500 dark:text-zinc-400 font-medium">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},
          </p>
          <h2 className="text-3xl font-black dark:text-white">{userName}</h2>
        </div>
        <div className="flex gap-3">
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

      {/* Bento Grid */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(selectedDate);
          const IconComp = HABIT_ICONS.find(i => i.name === habit.icon)?.component || Zap;
          const today = new Date().toISOString().split('T')[0];
          const isFuture = selectedDate > today;

          return (
            <motion.div 
              key={habit.id}
              layoutId={habit.id}
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
                    if (confirm('Delete this habit?')) onDelete(habit.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-black/10 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
              </div>
              <h3 className="font-bold text-lg leading-tight mb-1">{habit.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full">
                  {habit.duration} min
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded-full">
                  {habit.interval}
                </span>
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
    </div>
  );
});

const AddHabitModal = React.memo(({ onClose, onSave }: { onClose: () => void, onSave: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [interval, setInterval] = useState<Habit['interval']>('Every day');
  const [duration, setDuration] = useState(25);
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(HABIT_ICONS[0].name);

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
              if (name) onSave({ name, description, interval, duration, color: selectedColor, icon: selectedIcon });
            }}
            className="w-full bg-brand-blue text-white font-bold py-5 rounded-3xl text-xl mt-8 hover:bg-brand-blue/90 active:scale-95 transition-all"
          >
            Create Habit
          </button>
        </div>
      </motion.div>
    </div>
  );
});

const FocusMode = React.memo(({ habit, onClose, onComplete }: { habit: Habit, onClose: () => void, onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(habit.duration * 60);
  const [isActive, setIsActive] = useState(true);
  
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
        className="w-full max-w-2xl rounded-[48px] shadow-2xl p-8 sm:p-12 relative z-10 flex flex-col items-center border border-white/20"
        style={{ backgroundColor: habit.color }}
      >
        <button onClick={onClose} className="absolute top-8 left-8 p-2 hover:bg-black/10 rounded-full transition-colors"><X size={24} /></button>
        
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          <h2 className="text-4xl sm:text-5xl font-black mb-8 text-center">{habit.name}</h2>
          <Mascot state={timeLeft === 0 ? "success" : "meditating"} className="mb-12 scale-110 sm:scale-125" />
          
          <div className="text-center mb-12">
            <div className="text-6xl sm:text-8xl font-black flex items-baseline gap-2">
              {m} <span className="text-xl sm:text-2xl opacity-60">min</span> {s < 10 ? `0${s}` : s} <span className="text-xl sm:text-2xl opacity-60">s</span>
            </div>
          </div>

          <div className="w-full max-w-md space-y-3">
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
              <Music size={20} />
              <span className="font-medium">Calm music can help you</span>
            </div>
            <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3">
              <Zap size={20} />
              <span className="font-medium">Mindful breathing helps you relax</span>
            </div>
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

const SettingsModal = React.memo(({ userName, isDarkMode, onToggleDarkMode, onUpdateName, onReset, onClose }: { 
  userName: string, 
  isDarkMode: boolean,
  onToggleDarkMode: () => void,
  onUpdateName: (name: string) => void, 
  onReset: () => void, 
  onClose: () => void 
}) => {
  const [name, setName] = useState(userName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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

const ProfileView = React.memo(({ habits, userName, onViewChange }: { 
  habits: Habit[], 
  userName: string, 
  onViewChange: (view: 'dashboard' | 'profile') => void,
  key?: string
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'distribution' | 'calendar'>('weekly');
  
  const totalCompletions = useMemo(() => habits.reduce((acc, h) => acc + h.completedDates.length, 0), [habits]);
  
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

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
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
          <p className="text-2xl font-black dark:text-white">{totalCompletions}</p>
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
          <div className="w-10 h-10 bg-pink-100 dark:bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mb-4">
            <Award size={20} />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-black dark:text-white">Lvl {Math.floor(totalCompletions / 10) + 1}</p>
            <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase">({totalCompletions % 10}/10)</p>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full mt-2 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(totalCompletions % 10) * 10}%` }}
              className="h-full bg-pink-500"
            />
          </div>
          <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase mt-1">Next Lvl in {10 - (totalCompletions % 10)} pts</p>
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
                    <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase">{habit.completedDates.length} completions</span>
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
        <div className="w-14 h-14 bg-slate-100 dark:bg-zinc-800 text-slate-300 dark:text-zinc-600 rounded-full flex items-center justify-center cursor-not-allowed">
          <Plus size={28} />
        </div>
        <button onClick={() => onViewChange('profile')} className="text-black dark:text-white"><User size={24} /></button>
      </div>
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [toast, setToast] = useState<{ show: boolean, message: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved === 'true';
  });

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
    const newHabit: Habit = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    const newHabits = [...habits, newHabit];
    setHabits(newHabits);
    saveHabits(newHabits);
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
            habits={habits} 
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
          />
        ) : (
          <ProfileView 
            key="profile"
            habits={habits}
            userName={userName}
            onViewChange={setView}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdding && (
          <AddHabitModal 
            onClose={() => setIsAdding(false)} 
            onSave={handleAddHabit} 
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
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onUpdateName={handleUpdateName}
            onReset={handleReset}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        {selectedHabit && (
          <FocusMode 
            habit={selectedHabit} 
            onClose={() => setSelectedHabit(null)} 
            onComplete={() => handleToggleHabit(selectedHabit.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
