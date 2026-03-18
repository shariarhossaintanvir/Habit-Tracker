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
}

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
