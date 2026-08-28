import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import { Tables } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { INVITATION_THEMES } from '@/components/invitations/themes';

interface DemoPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DemoPageProps): Promise<Metadata> {
  const { slug } = await params;
  const admin = createAdminClient();

  const { data: template } = await admin
    .from('templates')
    .select('name, description')
    .eq('slug', slug)
    .single();

  const title = template ? `Demo en Vivo: ${template.name}` : 'Demo de Invitación';
  return {
    title,
    description: template?.description || 'Vista previa interactiva de plantilla de invitación digital.',
  };
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { slug } = await params;
  const admin = createAdminClient();

  // 1. Fetch Template from DB or fallback
  const { data: dbTemplate } = await admin
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .single();

  let template: Tables<'templates'> | null = dbTemplate;

  if (!template && INVITATION_THEMES[slug]) {
    // Generate fallback template definition
    const theme = INVITATION_THEMES[slug];
    template = {
      id: `fallback-${slug}`,
      slug,
      name: theme.name || slug,
      family: theme.family,
      variant: theme.variant,
      description: `Plantilla interactiva con temática ${theme.name}`,
      preview_url: null,
      default_theme: theme as any,
      default_sections: [
        'hero',
        'countdown',
        'event-details',
        'location',
        'dress-code',
        'story',
        'photo-album',
        'trivia',
        'godparents',
        'gifts',
        'song-requests',
        'instagram-wall',
        'accommodation',
        'live-album-qr',
        'rsvp',
        'music',
      ],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  if (!template) {
    notFound();
  }

  const isXv = slug.includes('cumple') || slug.includes('15') || slug.includes('neon');
  const demoDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString();

  // 2. Build Realistic Demo Event
  const demoEvent: Tables<'events'> = {
    id: 'demo-event-id',
    client_id: null,
    slug: `demo-${template.slug}`,
    title: isXv ? 'Mis 15 Valentina' : 'Boda Sofía & Mateo',
    event_type: isXv ? 'cumple15' : 'boda',
    event_date: demoDate,
    location_name: 'Palacio Sans Souci',
    location_address: 'Paz 461, B1644 Victoria, Provincia de Buenos Aires',
    location_lat: -34.4533,
    location_lng: -58.5472,
    cover_image_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    status: 'active',
    template_id: template.id,
    theme_config: (template.default_theme as any) || {},
    sections_config: (template.default_sections as any) || [
      'hero',
      'countdown',
      'event-details',
      'location',
      'dress-code',
      'story',
      'photo-album',
      'trivia',
      'godparents',
      'gifts',
      'song-requests',
      'instagram-wall',
      'accommodation',
      'live-album-qr',
      'rsvp',
      'music',
    ],
    music_url: 'https://assets.mixkit.co/music/preview/mixkit-romantic-wedding-violin-and-piano-126.mp3',
    hashtag: isXv ? '#Mis15Valen' : '#BodaSofiYMateo',
    instagram_handle: '@arielproducciones',
    album_enabled: true,
    album_manual_approval: false,
    album_slide_duration_ms: 6000,
    album_transition: 'kenburns',
    album_show_captions: true,
    album_watermark_url: null,
    album_retention_days: 30,
    screen_token: 'demo-token',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Ariel! Estuve viendo la demo de la plantilla "${template.name}" (${template.slug}) y me gustaría contratarla para mi evento.`
  );

  return (
    <div className="relative">
      {/* Floating Demo Top Bar */}
      <div className="fixed top-4 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto max-w-2xl w-full bg-neutral-950/90 backdrop-blur-xl border border-amber-500/40 rounded-full px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3 text-neutral-100">
          <div className="flex items-center gap-2">
            <Link href="/plantillas">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs text-neutral-300 hover:text-amber-400 rounded-full"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Catálogo
              </Button>
            </Link>

            <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-400">Demo:</span>
              <span className="text-amber-300 truncate max-w-[180px]">{template.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/5491100000000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-neutral-950 font-bold text-xs rounded-full px-4 h-8 shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Quiero este diseño
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Render Invitation */}
      <InvitationRenderer event={demoEvent as any} template={template} />
    </div>
  );
}
