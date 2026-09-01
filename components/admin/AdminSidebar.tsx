'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  Users,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Tables } from '@/types/database';

interface AdminSidebarProps {
  userEmail: string;
  profile: Tables<'profiles'> | null;
}

export function AdminSidebar({ userEmail, profile }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
    },
    {
      href: '/eventos',
      label: 'Eventos & Tarjetas',
      icon: Calendar,
      active: pathname.startsWith('/eventos'),
    },
    {
      href: '/plantillas',
      label: 'Catálogo de Diseños',
      icon: Layers,
      active: pathname.startsWith('/plantillas'),
    },
    {
      href: '/clientes',
      label: 'Clientes',
      icon: Users,
      active: pathname.startsWith('/clientes'),
    },
    {
      href: '/configuracion',
      label: 'Configuración Web & Landing',
      icon: Settings,
      active: pathname.startsWith('/configuracion'),
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-neutral-900/70 border-r border-neutral-800/80 p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/10">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent tracking-tight">
                Ariel Producciones
              </h2>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">
                Panel de Control
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  item.active
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                    : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${item.active ? 'text-amber-400' : 'text-neutral-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Links */}
        <div className="pt-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 text-[11px] font-medium text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 rounded-lg transition-colors"
          >
            <span>Ver Sitio Web Público</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
        </div>
      </div>

      {/* User Footer Card */}
      <div className="pt-4 border-t border-neutral-800/80 mt-6">
        <div className="flex items-center justify-between px-2 py-1 rounded-xl bg-neutral-950/40 border border-neutral-800/60">
          <div className="truncate pr-2">
            <p className="text-xs font-semibold text-neutral-200 truncate">
              {profile?.full_name || userEmail}
            </p>
            <p className="text-[10px] text-amber-400 uppercase tracking-widest font-mono font-bold">
              {profile?.role || 'Superadmin'}
            </p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="p-2 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800/80 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
