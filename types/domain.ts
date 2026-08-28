import { Tables, TemplateFamily } from './database';

export type Profile = Tables<'profiles'>;
export type Client = Tables<'clients'>;
export type Template = Tables<'templates'>;
export type Event = Tables<'events'>;
export type Guest = Tables<'guests'>;
export type Rsvp = Tables<'rsvps'>;
export type Photo = Tables<'photos'>;
export type SongRequest = Tables<'song_requests'>;
export type PortfolioItem = Tables<'portfolio_items'>;
export type ContactRequest = Tables<'contact_requests'>;

export interface ThemePalette {
  primary: string;
  secondary: string;
  bg: string;
  text: string;
  accent: string;
}

export interface ThemeFonts {
  heading: string;
  body: string;
}

export interface InvitationTheme {
  slug: string;
  name: string;
  family: TemplateFamily;
  variant: string;
  palette: ThemePalette;
  fonts: ThemeFonts;
  animations: string;
  ornaments: string;
  cssVars?: Record<string, string>;
  backgroundClass?: string;
}

export type SectionType =
  | 'hero'
  | 'countdown'
  | 'event-details'
  | 'location'
  | 'dress-code'
  | 'story'
  | 'photo-album'
  | 'rsvp'
  | 'gifts'
  | 'music'
  | 'song-requests'
  | 'instagram-wall'
  | 'godparents'
  | 'accommodation'
  | 'trivia'
  | 'live-album-qr';

export interface SectionConfig {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  data?: Record<string, any>;
}
