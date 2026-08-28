import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Layers, Users, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { Tables } from '@/types/database';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let profile: Tables<'profiles'> | null = null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  } catch (e) {
    console.error('Error fetching admin profile:', e);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900/60 border-r border-neutral-800/80 p-5 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Ariel Producciones
              </h2>
              <p className="text-[11px] text-neutral-400">Panel Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/eventos"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Eventos
            </Link>
            <Link
              href="/plantillas"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
            >
              <Layers className="w-4 h-4" />
              Plantillas
            </Link>
            <Link
              href="/clientes"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
            >
              <Users className="w-4 h-4" />
              Clientes
            </Link>
            <Link
              href="/configuracion"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Configuración
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-neutral-800/80">
          <div className="flex items-center justify-between px-2">
            <div className="truncate">
              <p className="text-xs font-semibold text-neutral-200 truncate">
                {profile?.full_name || user.email}
              </p>
              <p className="text-[10px] text-amber-400 uppercase tracking-wider font-mono">
                {profile?.role || 'superadmin'}
              </p>
            </div>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
