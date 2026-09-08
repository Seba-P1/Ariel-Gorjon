import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import { APP_CONFIG } from '@/lib/constants';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface InvitationPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string }>;
}

export async function generateMetadata({
  params,
}: InvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: event } = await admin
    .from('events')
    .select('title, cover_image_url, event_date, location_name')
    .eq('slug', slug)
    .single();

  if (!event) {
    return {
      title: 'Invitación no encontrada',
    };
  }

  const dateStr = event.event_date
    ? format(new Date(event.event_date), "d 'de' MMMM, yyyy", { locale: es })
    : '';

  const description = dateStr
    ? `Te invitamos a celebrar el ${dateStr}. Confirmá tu asistencia y compartí tus fotos.`
    : `Invitación digital para ${event.title}`;

  return {
    title: event.title,
    description,
    openGraph: {
      title: event.title,
      description,
      images: event.cover_image_url ? [{ url: event.cover_image_url }] : [],
      url: `${APP_CONFIG.url}/invitacion/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: event.cover_image_url ? [event.cover_image_url] : [],
    },
  };
}

export default async function InvitationPage({
  params,
  searchParams,
}: InvitationPageProps) {
  const { slug } = await params;
  const { g: personalSlug } = await searchParams;

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

  // 2. Fetch Template if configured
  let template = null;
  if (event.template_id) {
    const { data: templateData } = await admin
      .from('templates')
      .select('*')
      .eq('id', event.template_id)
      .single();
    template = templateData;
  }

  // 3. Fetch Guest if personal_slug provided
  let guest = null;
  if (personalSlug) {
    const { data: guestData } = await admin
      .from('guests')
      .select('*')
      .eq('event_id', event.id)
      .eq('personal_slug', personalSlug)
      .single();
    guest = guestData;
  }

  return (
    <>
      <link rel="preconnect" href="https://www.youtube.com" />
      <link rel="preconnect" href="https://www.youtube-nocookie.com" />
      <link rel="preconnect" href="https://i.ytimg.com" />
      <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
      <InvitationRenderer
        event={event}
        template={template}
        guest={guest}
      />
    </>
  );
}
