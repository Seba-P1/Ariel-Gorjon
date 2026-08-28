'use client';

import * as React from 'react';
import { Event, Template, Guest, SectionType, SectionConfig } from '@/types/domain';
import { resolveTheme } from './themes';
import { themeFontsVariables } from '@/lib/fonts';
import {
  Hero,
  Countdown,
  EventDetails,
  LocationMap,
  DressCode,
  Story,
  PhotoAlbum,
  RsvpForm,
  Gifts,
  MusicPlayer,
  SongRequests,
  InstagramWall,
  Godparents,
  Accommodation,
  Trivia,
  LiveAlbumQr,
} from './sections';

interface InvitationRendererProps {
  event: Event;
  template?: Template | null;
  guest?: Guest | null;
}

export function InvitationRenderer({ event, template, guest }: InvitationRendererProps) {
  // 1. Resolve active theme
  const theme = React.useMemo(() => {
    const templateSlug = template?.slug || (event as any).template_slug;
    const rawThemeConfig = (event.theme_config as Record<string, any>) || (template?.default_theme as Record<string, any>);
    return resolveTheme(templateSlug, rawThemeConfig);
  }, [template, event.theme_config]);

  // 2. Resolve active sections and their order
  const sections = React.useMemo(() => {
    // If event has custom sections_config array, use it; otherwise fallback to template.default_sections or standard defaults
    let rawSections: any = event.sections_config;
    if (!Array.isArray(rawSections) || rawSections.length === 0) {
      rawSections = template?.default_sections;
    }

    if (!Array.isArray(rawSections) || rawSections.length === 0) {
      rawSections = [
        'hero',
        'countdown',
        'event-details',
        'location',
        'dress-code',
        'photo-album',
        'rsvp',
        'gifts',
        'live-album-qr',
        'music',
      ];
    }

    // Normalize sections format: string[] or SectionConfig[]
    return rawSections.map((item: string | SectionConfig, index: number) => {
      if (typeof item === 'string') {
        return {
          id: `${item}-${index}`,
          type: item as SectionType,
          enabled: true,
          order: index,
          data: {},
        };
      }
      return {
        id: item.id || `${item.type}-${index}`,
        type: item.type,
        enabled: item.enabled !== false,
        order: item.order ?? index,
        data: item.data || {},
      };
    }).filter((s: SectionConfig) => s.enabled);
  }, [event.sections_config, template?.default_sections]);

  // Render individual section by type
  const renderSection = (section: SectionConfig) => {
    switch (section.type) {
      case 'hero':
        return <Hero key={section.id} theme={theme} event={event} guest={guest} data={section.data} />;
      case 'countdown':
        return <Countdown key={section.id} theme={theme} event={event} data={section.data} />;
      case 'event-details':
        return <EventDetails key={section.id} theme={theme} event={event} data={section.data} />;
      case 'location':
        return <LocationMap key={section.id} theme={theme} event={event} data={section.data} />;
      case 'dress-code':
        return <DressCode key={section.id} theme={theme} event={event} data={section.data} />;
      case 'story':
        return <Story key={section.id} theme={theme} data={section.data} />;
      case 'photo-album':
        return <PhotoAlbum key={section.id} theme={theme} data={section.data} />;
      case 'rsvp':
        return <RsvpForm key={section.id} theme={theme} event={event} guest={guest} data={section.data} />;
      case 'gifts':
        return <Gifts key={section.id} theme={theme} data={section.data} />;
      case 'music':
        return <MusicPlayer key={section.id} theme={theme} event={event} data={section.data} />;
      case 'song-requests':
        return <SongRequests key={section.id} theme={theme} event={event} data={section.data} />;
      case 'instagram-wall':
        return <InstagramWall key={section.id} theme={theme} event={event} data={section.data} />;
      case 'godparents':
        return <Godparents key={section.id} theme={theme} data={section.data} />;
      case 'accommodation':
        return <Accommodation key={section.id} theme={theme} data={section.data} />;
      case 'trivia':
        return <Trivia key={section.id} theme={theme} data={section.data} />;
      case 'live-album-qr':
        return <LiveAlbumQr key={section.id} theme={theme} event={event} data={section.data} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen w-full relative transition-colors duration-500 ${themeFontsVariables}`}
      style={{
        backgroundColor: theme.palette.bg,
        color: theme.palette.text,
        fontFamily: theme.fonts.body,
        ...(theme.cssVars as React.CSSProperties),
      }}
    >
      {/* Decorative Ornaments / Ambient Glow */}
      <div
        className="pointer-events-none fixed inset-0 opacity-15"
        style={{
          background: `radial-gradient(ellipse at 50% 10%, ${theme.palette.primary} 0%, transparent 60%)`,
        }}
      />

      <main id="invitation-content" className="relative z-10 space-y-8 pb-20">
        {sections.map((section: SectionConfig) => renderSection(section))}
      </main>

      {/* Footer / Branding */}
      <footer className="relative z-10 border-t py-10 px-6 text-center text-xs space-y-2 opacity-75" style={{ borderColor: `${theme.palette.primary}20` }}>
        <p style={{ color: theme.palette.text }}>
          {event.title} • {new Date().getFullYear()}
        </p>
        <p className="text-[11px] opacity-60">
          Diseñado con ❤️ por{' '}
          <span className="font-semibold text-[var(--theme-primary)]">Ariel Producciones</span>
        </p>
      </footer>
    </div>
  );
}
