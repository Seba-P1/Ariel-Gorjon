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
  const rawThemeConfig = (event.theme_config as Record<string, any>) || (template?.default_theme as Record<string, any>) || {};

  const theme = React.useMemo(() => {
    const templateSlug = template?.slug || (event as any).template_slug;
    return resolveTheme(templateSlug, rawThemeConfig);
  }, [template, rawThemeConfig]);

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

  // Merge theme_config custom section data with section.data
  const getSectionData = (type: SectionType, explicitData: Record<string, any> = {}) => {
    switch (type) {
      case 'dress-code':
        return {
          type: rawThemeConfig.dress_code_type || rawThemeConfig.dress_code?.type,
          description: rawThemeConfig.dress_code_description || rawThemeConfig.dress_code?.description,
          colors: rawThemeConfig.dress_code_colors || rawThemeConfig.dress_code?.colors,
          notes: rawThemeConfig.dress_code_notes || rawThemeConfig.dress_code?.notes,
          ...explicitData,
        };
      case 'event-details':
        return {
          ceremonyTitle: rawThemeConfig.ceremony_title || rawThemeConfig.event_details?.ceremonyTitle,
          ceremonyTime: rawThemeConfig.ceremony_time || rawThemeConfig.event_details?.ceremonyTime,
          ceremonyAddress: rawThemeConfig.ceremony_address || rawThemeConfig.event_details?.ceremonyAddress,
          partyTitle: rawThemeConfig.party_title || rawThemeConfig.event_details?.partyTitle,
          partyTime: rawThemeConfig.party_time || rawThemeConfig.event_details?.partyTime,
          partyAddress: rawThemeConfig.party_address || rawThemeConfig.event_details?.partyAddress,
          ...explicitData,
        };
      case 'gifts':
        return {
          title: rawThemeConfig.gift_title || rawThemeConfig.gifts?.title,
          description: rawThemeConfig.gift_description || rawThemeConfig.gifts?.description,
          cbu: rawThemeConfig.cbu_cvu || rawThemeConfig.gifts?.cbu,
          alias: rawThemeConfig.alias || rawThemeConfig.gifts?.alias,
          bankName: rawThemeConfig.bank_name || rawThemeConfig.gifts?.bankName,
          holderName: rawThemeConfig.account_holder || rawThemeConfig.gifts?.holderName,
          externalRegistryUrl: rawThemeConfig.gift_registry_url || rawThemeConfig.gifts?.externalRegistryUrl,
          ...explicitData,
        };
      case 'story':
        return {
          title: rawThemeConfig.story_title || rawThemeConfig.story?.title,
          subtitle: rawThemeConfig.story_subtitle || rawThemeConfig.story?.subtitle,
          milestones: rawThemeConfig.story_milestones || rawThemeConfig.story?.milestones,
          ...explicitData,
        };
      case 'photo-album':
        return {
          title: rawThemeConfig.album_title || rawThemeConfig.photo_album?.title,
          photos: rawThemeConfig.gallery_photos || rawThemeConfig.photo_album?.photos,
          ...explicitData,
        };
      case 'music':
        return {
          musicUrl: event.music_url || rawThemeConfig.music_url || rawThemeConfig.music?.musicUrl,
          songTitle: rawThemeConfig.music_title || rawThemeConfig.music?.songTitle,
          ...explicitData,
        };
      case 'hero':
        return {
          customTitle: rawThemeConfig.hero_title || rawThemeConfig.hero?.customTitle,
          customSubtitle: rawThemeConfig.hero_subtitle || rawThemeConfig.hero?.customSubtitle,
          videoUrl: rawThemeConfig.hero_video_url || rawThemeConfig.hero?.videoUrl,
          ...explicitData,
        };
      case 'godparents':
        return {
          title: rawThemeConfig.godparents_title || rawThemeConfig.godparents?.title,
          members: rawThemeConfig.godparents_members || rawThemeConfig.godparents?.members,
          ...explicitData,
        };
      case 'accommodation':
        return {
          title: rawThemeConfig.accommodation_title || rawThemeConfig.accommodation?.title,
          hotels: rawThemeConfig.accommodation_hotels || rawThemeConfig.accommodation?.hotels,
          ...explicitData,
        };
      case 'trivia':
        return {
          title: rawThemeConfig.trivia_title || rawThemeConfig.trivia?.title,
          questions: rawThemeConfig.trivia_questions || rawThemeConfig.trivia?.questions,
          ...explicitData,
        };
      default:
        return { ...(rawThemeConfig[type] || {}), ...explicitData };
    }
  };

  // Render individual section by type
  const renderSection = (section: SectionConfig) => {
    const data = getSectionData(section.type, section.data);

    switch (section.type) {
      case 'hero':
        return <Hero key={section.id} theme={theme} event={event} guest={guest} data={data} />;
      case 'countdown':
        return <Countdown key={section.id} theme={theme} event={event} data={data} />;
      case 'event-details':
        return <EventDetails key={section.id} theme={theme} event={event} data={data} />;
      case 'location':
        return <LocationMap key={section.id} theme={theme} event={event} data={data} />;
      case 'dress-code':
        return <DressCode key={section.id} theme={theme} event={event} data={data} />;
      case 'story':
        return <Story key={section.id} theme={theme} data={data} />;
      case 'photo-album':
        return <PhotoAlbum key={section.id} theme={theme} data={data} />;
      case 'rsvp':
        return <RsvpForm key={section.id} theme={theme} event={event} guest={guest} data={data} />;
      case 'gifts':
        return <Gifts key={section.id} theme={theme} data={data} />;
      case 'music':
        // Rendered as floating ambient overlay outside the in-flow sections
        return null;
      case 'song-requests':
        return <SongRequests key={section.id} theme={theme} event={event} data={data} />;
      case 'instagram-wall':
        return <InstagramWall key={section.id} theme={theme} event={event} data={data} />;
      case 'godparents':
        return <Godparents key={section.id} theme={theme} data={data} />;
      case 'accommodation':
        return <Accommodation key={section.id} theme={theme} data={data} />;
      case 'trivia':
        return <Trivia key={section.id} theme={theme} data={data} />;
      case 'live-album-qr':
        return <LiveAlbumQr key={section.id} theme={theme} event={event} data={data} />;
      default:
        return null;
    }
  };

  // Determine if floating music player should be active
  const musicSection = sections.find((s: SectionConfig) => s.type === 'music');
  const hasMusicUrl = Boolean(event.music_url || rawThemeConfig.music_url || rawThemeConfig.music?.musicUrl);
  const isMusicActive = musicSection ? musicSection.enabled !== false : hasMusicUrl;
  const musicData = getSectionData('music', musicSection?.data || {});

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

      {/* Floating Ambient Music Player */}
      {isMusicActive && (
        <MusicPlayer theme={theme} event={event} data={musicData} />
      )}

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
