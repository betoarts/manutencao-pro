
import {
  LayoutDashboard,
  HardHat,
  CalendarCheck,
  ClipboardList,
  Archive,
  BarChart3,
  Settings,
} from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Ativos', href: '/assets', icon: HardHat },
  { name: 'Planos de Manutenção', href: '/maintenance-plans', icon: CalendarCheck },
  { name: 'Ordens de Serviço', href: '/work-orders', icon: ClipboardList },
  { name: 'Inventário', href: '/inventory', icon: Archive },
  { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  { name: 'Configurações', href: '/settings', icon: Settings },
];
  