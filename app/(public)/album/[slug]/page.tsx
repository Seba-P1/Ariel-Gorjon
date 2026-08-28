import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { LiveAlbumView } from '@/components/album/LiveAlbumView';
import { APP_CONFIG } from '@/lib/constants';

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: event } = await admin
    .from('events')
    .select('title, cover_image_url')
    .eq('slug', slug)
    .single();

  if (!event) {
    return {
      title: 'Álbum en vivo no encontrado',
    };
  }

  return {
    title: `📸 Álbum en Vivo — ${event.title}`,
    description: `Subí tus fotos y compartí los mejores momentos de ${event.title} en tiempo real.`,
    openGraph: {
      title: `Álbum en Vivo — ${event.title}`,
      description: `Subí tus fotos y compartí los mejores momentos en tiempo real.`,
      images: event.cover_image_url ? [{ url: event.cover_image_url }] : [],
      url: `${APP_CONFIG.url}/album/${slug}`,
    },
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
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

  return <LiveAlbumView event={event} initialPhotos={photos || []} />;
}
