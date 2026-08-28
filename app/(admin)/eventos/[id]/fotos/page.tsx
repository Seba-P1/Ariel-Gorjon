import * as React from 'react';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { PhotosModeration } from '@/components/admin/PhotosModeration';

interface EventPhotosPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPhotosPage({ params }: EventPhotosPageProps) {
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

  // 2. Fetch Photos
  const { data: photos } = await admin
    .from('photos')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Moderación y Descarga de Fotos
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Evento: <strong className="text-amber-400">{event.title}</strong> — Moderá qué fotos aparecen en pantalla y descargá el álbum completo en ZIP.
        </p>
      </div>

      <PhotosModeration
        eventId={event.id}
        eventSlug={event.slug}
        eventTitle={event.title}
        initialPhotos={photos || []}
      />
    </div>
  );
}
