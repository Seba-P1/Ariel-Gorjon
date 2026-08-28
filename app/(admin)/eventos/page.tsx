import * as React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { EventsManager } from '@/components/admin/EventsManager';

export default async function EventsAdminPage() {
  const admin = createAdminClient();

  // 1. Fetch Events with template details
  const { data: events } = await admin
    .from('events')
    .select('*, templates(name, slug)')
    .order('created_at', { ascending: false });

  // 2. Fetch Templates for dropdown
  const { data: templates } = await admin
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Gestión de Eventos
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Creá, editá y supervisá todas las invitaciones, álbumes y pantallas en tiempo real.
        </p>
      </div>

      <EventsManager
        initialEvents={(events as any) || []}
        templates={templates || []}
      />
    </div>
  );
}
