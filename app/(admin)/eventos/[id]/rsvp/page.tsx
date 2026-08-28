import * as React from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { RsvpTable } from '@/components/admin/RsvpTable';

interface EventRsvpPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventRsvpPage({ params }: EventRsvpPageProps) {
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

  // 2. Fetch Initial RSVPs
  const { data: rsvps } = await admin
    .from('rsvps')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Confirmaciones de Asistencia (RSVP)
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Evento: <strong className="text-amber-400">{event.title}</strong> (`{event.slug}`)
        </p>
      </div>

      <RsvpTable
        eventId={event.id}
        eventTitle={event.title}
        initialRsvps={rsvps || []}
      />
    </div>
  );
}
