import { 
  Book, 
  Code, 
  DollarSign, 
  Dumbbell, 
  Heart, 
  Home, 
  Moon, 
  Music, 
  Palette, 
  Smile, 
  Sun, 
  Utensils, 
  Zap,
  Coffee,
  Bike,
  Camera,
  Cloud,
  Flame,
  Crown,
  Gamepad2,
  Gift,
  Glasses,
  GraduationCap,
  Languages,
  Leaf,
  Library,
  Map,
  MessageCircle,
  Mic,
  Mountain,
  Pencil,
  Phone,
  Plane,
  Rocket,
  Scissors,
  Search,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  Speaker,
  Star,
  Target,
  Timer,
  Trash2,
  Trophy,
  Truck,
  Tv,
  Umbrella,
  Video,
  Wallet,
  Watch,
  Waves,
  Wifi,
  Wind,
  Wine
} from 'lucide-react';

export type SortOption = 'Most Recent' | 'Alphabetical' | 'Completion Rate';

export interface HabitGoal {
  type: 'daily' | 'weekly';
  target: number;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  interval: 'Every day' | 'Weekly' | 'Monthly';
  duration: number; // in minutes
  color: string;
  icon: string;
  completedDates: string[]; // ISO strings
  createdAt: string;
  reminderTime?: string; // HH:mm format
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any; // Lucide icon component
  color: string;
  requirement: (habits: Habit[], stats: { totalCompletions: number, maxStreak: number, currentStreak: number }) => boolean;
}

export const BADGES: Badge[] = [
  {
    id: 'first-habit',
    name: 'First Step',
    description: 'Complete your first habit session',
    icon: Zap,
    color: '#FDE047',
    requirement: (_, stats) => stats.totalCompletions >= 1
  },
  {
    id: 'habit-novice',
    name: 'Habit Novice',
    description: 'Complete 10 habit sessions',
    icon: Smile,
    color: '#4ADE80',
    requirement: (_, stats) => stats.totalCompletions >= 10
  },
  {
    id: 'habit-apprentice',
    name: 'Habit Apprentice',
    description: 'Complete 25 habit sessions',
    icon: Pencil,
    color: '#FB923C',
    requirement: (_, stats) => stats.totalCompletions >= 25
  },
  {
    id: 'habit-expert',
    name: 'Habit Expert',
    description: 'Complete 50 habit sessions',
    icon: Star,
    color: '#38BDF8',
    requirement: (_, stats) => stats.totalCompletions >= 50
  },
  {
    id: 'habit-warrior',
    name: 'Habit Warrior',
    description: 'Complete 250 habit sessions',
    icon: Shield,
    color: '#6366F1',
    requirement: (_, stats) => stats.totalCompletions >= 250
  },
  {
    id: 'habit-master',
    name: 'Habit Master',
    description: 'Complete 100 habit sessions',
    icon: Trophy,
    color: '#BEF264',
    requirement: (_, stats) => stats.totalCompletions >= 100
  },
  {
    id: 'habit-legend',
    name: 'Habit Legend',
    description: 'Complete 500 habit sessions',
    icon: Crown,
    color: '#A78BFA',
    requirement: (_, stats) => stats.totalCompletions >= 500
  },
  {
    id: 'habit-god',
    name: 'Habit God',
    description: 'Complete 1000 habit sessions',
    icon: Rocket,
    color: '#F87171',
    requirement: (_, stats) => stats.totalCompletions >= 1000
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: Flame,
    color: '#FB923C',
    requirement: (_, stats) => stats.maxStreak >= 7
  },
  {
    id: 'fortnight-fighter',
    name: 'Fortnight Fighter',
    description: 'Maintain a 14-day streak',
    icon: Shield,
    color: '#6366F1',
    requirement: (_, stats) => stats.maxStreak >= 14
  },
  {
    id: 'month-monarch',
    name: 'Month Monarch',
    description: 'Maintain a 30-day streak',
    icon: Crown,
    color: '#A78BFA',
    requirement: (_, stats) => stats.maxStreak >= 30
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 60-day streak',
    icon: Target,
    color: '#F87171',
    requirement: (_, stats) => stats.maxStreak >= 60
  },
  {
    id: 'quarterly-champion',
    name: 'Quarterly Champion',
    description: 'Maintain a 90-day streak',
    icon: Mountain,
    color: '#0F172A',
    requirement: (_, stats) => stats.maxStreak >= 90
  },
  {
    id: 'streak-legend',
    name: 'Streak Legend',
    description: 'Maintain a 180-day streak',
    icon: Trophy,
    color: '#FDE047',
    requirement: (_, stats) => stats.maxStreak >= 180
  },
  {
    id: 'year-legend',
    name: 'Year Legend',
    description: 'Maintain a 365-day streak',
    icon: Sun,
    color: '#FDE047',
    requirement: (_, stats) => stats.maxStreak >= 365
  },
  {
    id: 'habit-enthusiast',
    name: 'Habit Enthusiast',
    description: 'Have 3 active habits',
    icon: Heart,
    color: '#F87171',
    requirement: (habits) => habits.length >= 3
  },
  {
    id: 'variety-king',
    name: 'Variety King',
    description: 'Have 5 active habits',
    icon: Palette,
    color: '#F9A8D4',
    requirement: (habits) => habits.length >= 5
  },
  {
    id: 'habit-pro',
    name: 'Habit Pro',
    description: 'Have 7 active habits',
    icon: Zap,
    color: '#BEF264',
    requirement: (habits) => habits.length >= 7
  },
  {
    id: 'collector',
    name: 'Collector',
    description: 'Have 10 active habits',
    icon: Library,
    color: '#2DD4BF',
    requirement: (habits) => habits.length >= 10
  },
  {
    id: 'perfect-week',
    name: 'Perfect Week',
    description: 'Complete all habits for 7 days straight',
    icon: Star,
    color: '#FDE047',
    requirement: (habits, stats) => stats.maxStreak >= 7 && habits.length >= 3
  },
  {
    id: 'consistency-king',
    name: 'Consistency King',
    description: 'Complete 20 sessions of a single habit',
    icon: Target,
    color: '#F87171',
    requirement: (habits) => habits.some(h => h.completedDates.length >= 20)
  },
  {
    id: 'marathoner',
    name: 'Marathoner',
    description: 'Maintain a 100-day streak',
    icon: Mountain,
    color: '#0F172A',
    requirement: (_, stats) => stats.maxStreak >= 100
  }
];

export const HABIT_COLORS = [
  '#FDE047', // Yellow
  '#BEF264', // Green
  '#F9A8D4', // Pink
  '#4F46E5', // Blue
  '#FB923C', // Orange
  '#38BDF8', // Sky
  '#A78BFA', // Purple
  '#F87171', // Red
  '#4ADE80', // Light Green
  '#2DD4BF', // Teal
];

export const HABIT_ICONS = [
  { name: 'Book', component: Book },
  { name: 'Code', component: Code },
  { name: 'DollarSign', component: DollarSign },
  { name: 'Dumbbell', component: Dumbbell },
  { name: 'Heart', component: Heart },
  { name: 'Home', component: Home },
  { name: 'Moon', component: Moon },
  { name: 'Music', component: Music },
  { name: 'Palette', component: Palette },
  { name: 'Smile', component: Smile },
  { name: 'Sun', component: Sun },
  { name: 'Utensils', component: Utensils },
  { name: 'Zap', component: Zap },
  { name: 'Coffee', component: Coffee },
  { name: 'Bike', component: Bike },
  { name: 'Camera', component: Camera },
  { name: 'Cloud', component: Cloud },
  { name: 'Flame', component: Flame },
  { name: 'Gamepad2', component: Gamepad2 },
  { name: 'Gift', component: Gift },
  { name: 'Glasses', component: Glasses },
  { name: 'GraduationCap', component: GraduationCap },
  { name: 'Languages', component: Languages },
  { name: 'Leaf', component: Leaf },
  { name: 'Library', component: Library },
  { name: 'Map', component: Map },
  { name: 'MessageCircle', component: MessageCircle },
  { name: 'Mic', component: Mic },
  { name: 'Mountain', component: Mountain },
  { name: 'Pencil', component: Pencil },
  { name: 'Phone', component: Phone },
  { name: 'Plane', component: Plane },
  { name: 'Rocket', component: Rocket },
  { name: 'Scissors', component: Scissors },
  { name: 'Search', component: Search },
  { name: 'Settings', component: Settings },
  { name: 'ShoppingBag', component: ShoppingBag },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Speaker', component: Speaker },
  { name: 'Star', component: Star },
  { name: 'Target', component: Target },
  { name: 'Timer', component: Timer },
  { name: 'Trash2', component: Trash2 },
  { name: 'Trophy', component: Trophy },
  { name: 'Truck', component: Truck },
  { name: 'Tv', component: Tv },
  { name: 'Umbrella', component: Umbrella },
  { name: 'Video', component: Video },
  { name: 'Wallet', component: Wallet },
  { name: 'Watch', component: Watch },
  { name: 'Waves', component: Waves },
  { name: 'Wifi', component: Wifi },
  { name: 'Wind', component: Wind },
  { name: 'Wine', component: Wine },
];
