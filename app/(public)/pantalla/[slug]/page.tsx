import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { LiveSlideshow } from '@/components/slideshow/LiveSlideshow';

interface SlideshowPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SlideshowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: event } = await admin
    .from('events')
    .select('title')
    .eq('slug', slug)
    .single();

  if (!event) {
    return {
      title: 'Pantalla no encontrada',
    };
  }

  return {
    title: `📺 Pantalla en Vivo — ${event.title}`,
    description: `Proyección en tiempo real de fotos para ${event.title}.`,
  };
}

export default async function SlideshowPage({ params }: SlideshowPageProps) {
  const { slug } = await params;
  const admin = createAdminClient();

  // 1. Fetch Event
  const { data: event, error: eventError } = await admin
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (eventError || !event) {
    notFound();
  }

  // 2. Fetch Initial Approved Photos
  const { data: photos } = await admin
    .from('photos')
    .select('*')
    .eq('event_id', event.id)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return <LiveSlideshow event={event} initialPhotos={photos || []} />;
}
