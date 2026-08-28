import { InvitationTheme } from '@/types/domain';

export const glamourDoradaV1: InvitationTheme = {
  slug: 'glamour-dorada-v1',
  name: 'Glamour — Oro & Blanco',
  family: 'glamour-dorada',
  variant: 'v1',
  palette: {
    primary: '#D4AF37',
    secondary: '#FFFFFF',
    bg: '#FFFDF7',
    text: '#2A2312',
    accent: '#B8935A',
  },
  fonts: {
    heading: 'var(--font-allura), cursive',
    body: 'var(--font-montserrat), sans-serif',
  },
  animations: 'shimmer',
  ornaments: 'glitter',
  cssVars: {
    '--theme-primary': '#D4AF37',
    '--theme-secondary': '#FFFFFF',
    '--theme-bg': '#FFFDF7',
    '--theme-text': '#2A2312',
    '--theme-accent': '#B8935A',
    '--theme-font-heading': 'var(--font-allura), cursive',
    '--theme-font-body': 'var(--font-montserrat), sans-serif',
  },
  backgroundClass: 'bg-[#FFFDF7]',
};

export const glamourDoradaV2: InvitationTheme = {
  slug: 'glamour-dorada-v2',
  name: 'Glamour — Rosa Champagne',
  family: 'glamour-dorada',
  variant: 'v2',
  palette: {
    primary: '#C9A27E',
    secondary: '#F7E8D9',
    bg: '#FFFAF3',
    text: '#3A2E22',
    accent: '#E4C6A6',
  },
  fonts: {
    heading: 'var(--font-sacramento), cursive',
    body: 'var(--font-poppins), sans-serif',
  },
  animations: 'fade-up',
  ornaments: 'pearls',
  cssVars: {
    '--theme-primary': '#C9A27E',
    '--theme-secondary': '#F7E8D9',
    '--theme-bg': '#FFFAF3',
    '--theme-text': '#3A2E22',
    '--theme-accent': '#E4C6A6',
    '--theme-font-heading': 'var(--font-sacramento), cursive',
    '--theme-font-body': 'var(--font-poppins), sans-serif',
  },
  backgroundClass: 'bg-[#FFFAF3]',
};

export const glamourDoradaV3: InvitationTheme = {
  slug: 'glamour-dorada-v3',
  name: 'Glamour — Cumple 15 Real',
  family: 'glamour-dorada',
  variant: 'v3',
  palette: {
    primary: '#E0A6C6',
    secondary: '#F9E6F0',
    bg: '#FFF7FB',
    text: '#3F1F32',
    accent: '#D4AF37',
  },
  fonts: {
    heading: 'var(--font-great-vibes), cursive',
    body: 'var(--font-poppins), sans-serif',
  },
  animations: 'sparkle',
  ornaments: 'tiara',
  cssVars: {
    '--theme-primary': '#E0A6C6',
    '--theme-secondary': '#F9E6F0',
    '--theme-bg': '#FFF7FB',
    '--theme-text': '#3F1F32',
    '--theme-accent': '#D4AF37',
    '--theme-font-heading': 'var(--font-great-vibes), cursive',
    '--theme-font-body': 'var(--font-poppins), sans-serif',
  },
  backgroundClass: 'bg-[#FFF7FB]',
};
