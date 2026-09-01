import * as React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { InvitationTheme, Event } from '@/types/domain';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import { Button } from '@/components/ui/button';
import { Layers, ArrowLeft } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { themeFontsVariables } from '@/lib/fonts';

interface DemoTemplatePageProps {
  params: Promise<{ slug: string }>;
}

export default async function DemoTemplatePage({ params }: DemoTemplatePageProps) {
  const { slug } = await params;
  const admin = createAdminClient();

  // 1. Fetch Template
  const { data: template, error } = await admin
    .from('templates')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !template) {
    notFound();
  }

  // 2. Build mock event and sections
  const mockTheme = (template.default_theme as unknown as InvitationTheme) || {
    palette: {
      primary: '#F59E0B',
      secondary: '#171717',
      bg: '#0B0B0B',
      text: '#FFFFFF',
      accent: '#FBBF24',
    },
    fonts: {
      heading: 'serif',
      body: 'sans-serif',
    },
  };

  const mockEvent: Event = {
    id: 'demo-event-id',
    client_id: null,
    slug: template.slug,
    title: `Boda Sofía & Mateo (${template.name})`,
    event_type: 'boda',
    event_date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
    location_name: 'Estancia La Candelaria',
    location_address: 'Ruta Provincial 205 Km 114.5, Lobos, Prov. de Buenos Aires',
    location_lat: -35.185,
    location_lng: -59.083,
    cover_image_url:
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop',
    status: 'active',
    template_id: template.id,
    theme_config: mockTheme as any,
    sections_config: template.default_sections as any,
    music_url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3',
    hashtag: '#BodaSofiYMateo',
    instagram_handle: '@sofiaymateo.boda',
    album_enabled: true,
    album_manual_approval: false,
    album_slide_duration_ms: 4000,
    album_transition: 'fade',
    album_show_captions: true,
    album_watermark_url: null,
    album_retention_days: 90,
    screen_token: 'demo-screen-token',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockSections = [
    {
      id: 'sec-hero',
      type: 'hero',
      order: 1,
      is_enabled: true,
      data: {
        title: 'Sofía & Mateo',
        subtitle: '¡Nos Casamos!',
        dateText: 'Sábado 14 de Noviembre, 2026',
        videoBackgroundUrl: '',
      },
    },
    {
      id: 'sec-countdown',
      type: 'countdown',
      order: 2,
      is_enabled: true,
      data: {
        title: 'Faltan muy pocos días',
      },
    },
    {
      id: 'sec-details',
      type: 'details',
      order: 3,
      is_enabled: true,
      data: {
        ceremonyTitle: 'Ceremonia Religiosa',
        ceremonyTime: '18:30 hs',
        ceremonyAddress: 'Capilla Santa Teresita - Lobos',
        partyTitle: 'Fiesta & Recepción',
        partyTime: '20:30 hs en adelante',
        partyAddress: 'Salón Principal Estancia La Candelaria',
      },
    },
    {
      id: 'sec-location',
      type: 'location',
      order: 4,
      is_enabled: true,
      data: {
        customAddress: 'Estancia La Candelaria, Lobos, Buenos Aires',
        instructions: 'Contamos con estacionamiento privado con seguridad en el predio.',
      },
    },
    {
      id: 'sec-dresscode',
      type: 'dresscode',
      order: 5,
      is_enabled: true,
      data: {
        type: 'Elegante / Black Tie Optional',
        description: 'Vení listo para celebrar y brillar en una noche única.',
        notes: 'Sugerimos calzado cómodo para el jardín.',
      },
    },
    {
      id: 'sec-album',
      type: 'album',
      order: 6,
      is_enabled: true,
      data: {
        title: 'Nuestra Historia en Fotos',
      },
    },
    {
      id: 'sec-gifts',
      type: 'gifts',
      order: 7,
      is_enabled: true,
      data: {
        title: 'Luna de Miel & Regalos',
        description: 'Tu presencia es lo más importante. Si deseás hacernos un presente, podés colaborar con nuestro viaje:',
        alias: 'SOFI.Y.MATEO.2026',
        cbu: '0000003100012345678901',
        bankName: 'Mercado Pago / Banco Galicia',
        holderName: 'Sofía Rossi y Mateo Gorjón',
      },
    },
    {
      id: 'sec-rsvp',
      type: 'rsvp',
      order: 8,
      is_enabled: true,
      data: {
        customMessage: 'Por favor confirmanos tu asistencia antes del 1 de Octubre para organizar los lugares.',
        deadlineText: 'Límite de confirmación: 1 de Octubre',
      },
    },
  ];

  const whatsappMessage = encodeURIComponent(
    `¡Hola Ariel! Estuve viendo la demo del modelo "${template.name}" (${template.slug}) en tu página y quiero contratar este diseño para mi evento.`
  );

  return (
    <div className={`relative ${themeFontsVariables}`}>
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
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-400">Modelo:</span>
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
                className="bg-[#25D366] hover:bg-[#20bd5a] text-neutral-950 font-bold text-xs rounded-full px-4 h-8 shadow-md flex items-center gap-1.5"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                <span>Quiero este diseño</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Actual Rendered Invitation Demo */}
      <main>
        <InvitationRenderer
          event={mockEvent}
          template={template as any}
          guest={null}
        />
      </main>
    </div>
  );
}
