import * as React from 'react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Globe } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user?.id || '')
      .single();
    profile = data;
  } catch (e) {
    console.error('Config profile fetch error:', e);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Configuración del Sistema
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Ajustes generales, seguridad y estado de la plataforma Ariel Producciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Admin Profile */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-200">
              Perfil de Administrador
            </CardTitle>
            <Shield className="w-4 h-4 text-amber-400" />
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-xs">
            <div>
              <span className="text-neutral-500 block">Email de Acceso:</span>
              <span className="font-mono text-neutral-200">{user?.email}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Rol del Sistema:</span>
              <Badge
                variant="outline"
                className="mt-1 bg-amber-500/10 text-amber-400 border-amber-500/30 font-mono text-[10px]"
              >
                {profile?.role || 'superadmin'}
              </Badge>
            </div>
            <div>
              <span className="text-neutral-500 block">ID de Usuario:</span>
              <code className="text-[10px] text-neutral-400 font-mono bg-neutral-950 p-1 rounded block truncate">
                {user?.id}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Database & Supabase */}
        <Card className="bg-neutral-900/60 border-neutral-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-200">
              Infraestructura & Cloud
            </CardTitle>
            <Database className="w-4 h-4 text-sky-400" />
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-xs">
            <div>
              <span className="text-neutral-500 block">Motor de Base de Datos:</span>
              <span className="text-neutral-200 font-semibold">PostgreSQL (Supabase Cloud)</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Storage Bucket:</span>
              <span className="text-emerald-400 font-mono">event-photos (Público)</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Realtime Subscriptions:</span>
              <Badge variant="outline" className="mt-1 bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                Activo (WebSocket)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* App Config */}
        <Card className="bg-neutral-900/60 border-neutral-800 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-neutral-200">
              Parámetros de la Aplicación
            </CardTitle>
            <Globe className="w-4 h-4 text-violet-400" />
          </CardHeader>
          <CardContent className="space-y-2 pt-2 text-xs text-neutral-400">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-neutral-500 block">Versión:</span>
                <span className="text-neutral-200 font-mono">1.0.0 (Next.js 16)</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Motor CSS:</span>
                <span className="text-neutral-200 font-mono">Tailwind CSS v4</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Total Plantillas:</span>
                <span className="text-amber-400 font-bold">18 Diseños</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Secciones Modulares:</span>
                <span className="text-emerald-400 font-bold">16 Módulos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
