import { InvitationTheme } from '@/types/domain';

export const modernaMinimalV1: InvitationTheme = {
  slug: 'moderna-minimal-v1',
  name: 'Moderna Minimal — Blanco',
  family: 'moderna-minimal',
  variant: 'v1',
  palette: {
    primary: '#111827',
    secondary: '#F3F4F6',
    bg: '#FFFFFF',
    text: '#111827',
    accent: '#6B7280',
  },
  fonts: {
    heading: 'var(--font-inter), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'slide-up',
  ornaments: 'none',
  cssVars: {
    '--theme-primary': '#111827',
    '--theme-secondary': '#F3F4F6',
    '--theme-bg': '#FFFFFF',
    '--theme-text': '#111827',
    '--theme-accent': '#6B7280',
    '--theme-font-heading': 'var(--font-inter), sans-serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-white',
};

export const modernaMinimalV2: InvitationTheme = {
  slug: 'moderna-minimal-v2',
  name: 'Moderna Minimal — Sage',
  family: 'moderna-minimal',
  variant: 'v2',
  palette: {
    primary: '#6B7F6A',
    secondary: '#EFF2EC',
    bg: '#FAFBF8',
    text: '#22302A',
    accent: '#A8B8A0',
  },
  fonts: {
    heading: 'var(--font-fraunces), serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'fade-up',
  ornaments: 'soft-shapes',
  cssVars: {
    '--theme-primary': '#6B7F6A',
    '--theme-secondary': '#EFF2EC',
    '--theme-bg': '#FAFBF8',
    '--theme-text': '#22302A',
    '--theme-accent': '#A8B8A0',
    '--theme-font-heading': 'var(--font-fraunces), serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-[#FAFBF8]',
};

export const modernaMinimalV3: InvitationTheme = {
  slug: 'moderna-minimal-v3',
  name: 'Moderna Minimal — Tipográfica',
  family: 'moderna-minimal',
  variant: 'v3',
  palette: {
    primary: '#000000',
    secondary: '#F5F5F5',
    bg: '#FFFFFF',
    text: '#000000',
    accent: '#FF3B30',
  },
  fonts: {
    heading: 'var(--font-archivo-black), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'reveal',
  ornaments: 'stripes',
  cssVars: {
    '--theme-primary': '#000000',
    '--theme-secondary': '#F5F5F5',
    '--theme-bg': '#FFFFFF',
    '--theme-text': '#000000',
    '--theme-accent': '#FF3B30',
    '--theme-font-heading': 'var(--font-archivo-black), sans-serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-white',
};
