import {
  UtensilsCrossed, ChefHat, Image as ImageIcon, Leaf, Languages, Palette, Info,
  QrCode, Bell, CreditCard, LayoutGrid, Table, Star, Camera, Megaphone, Clock,
  MapPin, Sparkles, BookOpen, Smartphone, BarChart3, Globe, Tag, Wine, Coffee,
  Salad, Gift, ShieldCheck, type LucideIcon,
} from "lucide-react";

// Navbar/dropdown için seçilebilir ikon kümesi (lucide — ücretsiz, modern).
export const NAV_ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed, ChefHat, Image: ImageIcon, Leaf, Languages, Palette, Info,
  QrCode, Bell, CreditCard, LayoutGrid, Table, Star, Camera, Megaphone, Clock,
  MapPin, Sparkles, BookOpen, Smartphone, BarChart3, Globe, Tag, Wine, Coffee,
  Salad, Gift, ShieldCheck,
};

export const NAV_ICON_NAMES = Object.keys(NAV_ICONS);

export default function NavIcon({ name, className, size = 20 }: { name?: string | null; className?: string; size?: number }) {
  if (!name) return null;
  const Icon = NAV_ICONS[name];
  if (!Icon) return null;
  return <Icon className={className} size={size} aria-hidden strokeWidth={1.8} />;
}
