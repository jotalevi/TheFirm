"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building2, 
  Ticket, 
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-accent text-accent-foreground font-medium" 
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { isAdmin, isModerator } = useAuth();
  if (!isAdmin && !isModerator) return null;
  return (
    <aside className="w-64 h-screen bg-card border-r border-border fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold">TheFirm Admin</h1>
      </div>
      <nav className="mt-2 px-3 space-y-1">
        <NavItem 
          href="/dashboard" 
          icon={<LayoutDashboard className="h-4 w-4" />} 
          label="Dashboard" 
        />
        <NavItem 
          href="/events" 
          icon={<Calendar className="h-4 w-4" />} 
          label="Eventos" 
        />
        {isAdmin && (
          <NavItem 
            href="/users" 
            icon={<Users className="h-4 w-4" />} 
            label="Usuarios" 
          />
        )}
        <NavItem 
          href="/companies" 
          icon={<Building2 className="h-4 w-4" />} 
          label="Empresas" 
        />
        <NavItem 
          href="/tickets" 
          icon={<Ticket className="h-4 w-4" />} 
          label="Tickets" 
        />
        {isAdmin && (
          <NavItem 
            href="/analytics" 
            icon={<BarChart3 className="h-4 w-4" />} 
            label="Analíticas" 
          />
        )}
      </nav>
    </aside>
  );
};

export default Sidebar; 