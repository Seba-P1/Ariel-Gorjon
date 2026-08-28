import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { RsvpForm } from '@/components/invitations/sections/RsvpForm';
import { resolveTheme } from '@/components/invitations/themes';
import { themeFontsVariables } from '@/lib/fonts';

interface RsvpStandalonePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ g?: string }>;
}

export async function generateMetadata({
  params,
}: RsvpStandalonePageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: event } = await admin
    .from('events')
    .select('title')
    .eq('slug', slug)
    .single();

  return {
    title: event ? `Confirmar Asistencia — ${event.title}` : 'Confirmar Asistencia',
  };
}

export default async function RsvpStandalonePage({
  params,
  searchParams,
}: RsvpStandalonePageProps) {
  const { slug } = await params;
  const { g: personalSlug } = await searchParams;

  const admin = createAdminClient();

  const { data: event, error } = await admin
    .from('events')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !event) {
    notFound();
  }

  let template = null;
  if (event.template_id) {
    const { data: templateData } = await admin
      .from('templates')
      .select('*')
      .eq('id', event.template_id)
      .single();
    template = templateData;
  }

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

  const theme = resolveTheme(
    template?.slug || (event as any).template_slug,
    event.theme_config as any
  );

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${themeFontsVariables}`}
      style={{
        backgroundColor: theme.palette.bg,
        color: theme.palette.text,
        ...(theme.cssVars as React.CSSProperties),
      }}
    >
      <div className="w-full max-w-3xl">
        <RsvpForm theme={theme} event={event} guest={guest} />
      </div>
    </div>
  );
}
