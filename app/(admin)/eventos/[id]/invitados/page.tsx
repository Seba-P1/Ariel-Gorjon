import * as React from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { GuestsTable } from '@/components/admin/GuestsTable';

interface EventGuestsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventGuestsPage({ params }: EventGuestsPageProps) {
  const { id: eventId } = await params;
  const admin = createAdminClient();

  // 1. Fetch Event
  const { data: event, error: eventError } = await admin
    .from('events')
    .select('id, title, slug')
    .eq('id', eventId)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // 2. Fetch Guests
  const { data: guests } = await admin
    .from('guests')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Lista de Invitados
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Evento: <strong className="text-amber-400">{event.title}</strong> — Cada invitado recibe un link
          personalizado con QR.
        </p>
      </div>

      <GuestsTable
        eventId={event.id}
        eventSlug={event.slug}
        initialGuests={guests || []}
      />
    </div>
  );
}
