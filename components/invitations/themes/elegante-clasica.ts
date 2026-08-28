import { InvitationTheme } from '@/types/domain';

export const eleganteClasicaV1: InvitationTheme = {
  slug: 'elegante-clasica-v1',
  name: 'Elegante Clásica — Marfil',
  family: 'elegante-clasica',
  variant: 'v1',
  palette: {
    primary: '#B8935A',
    secondary: '#F5EFE4',
    bg: '#FFFDF8',
    text: '#3A2F22',
    accent: '#8A6A3F',
  },
  fonts: {
    heading: 'var(--font-cormorant), serif',
    body: 'var(--font-lato), sans-serif',
  },
  animations: 'fade-up',
  ornaments: 'classic-frames',
  cssVars: {
    '--theme-primary': '#B8935A',
    '--theme-secondary': '#F5EFE4',
    '--theme-bg': '#FFFDF8',
    '--theme-text': '#3A2F22',
    '--theme-accent': '#8A6A3F',
    '--theme-font-heading': 'var(--font-cormorant), serif',
    '--theme-font-body': 'var(--font-lato), sans-serif',
  },
  backgroundClass: 'bg-[#FFFDF8]',
};

export const eleganteClasicaV2: InvitationTheme = {
  slug: 'elegante-clasica-v2',
  name: 'Elegante Clásica — Negro & Oro',
  family: 'elegante-clasica',
  variant: 'v2',
  palette: {
    primary: '#D4AF37',
    secondary: '#1A1A1A',
    bg: '#0B0B0B',
    text: '#F5EFE4',
    accent: '#C9A227',
  },
  fonts: {
    heading: 'var(--font-playfair), serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'fade',
  ornaments: 'gold-lines',
  cssVars: {
    '--theme-primary': '#D4AF37',
    '--theme-secondary': '#1A1A1A',
    '--theme-bg': '#0B0B0B',
    '--theme-text': '#F5EFE4',
    '--theme-accent': '#C9A227',
    '--theme-font-heading': 'var(--font-playfair), serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-[#0B0B0B]',
};

export const eleganteClasicaV3: InvitationTheme = {
  slug: 'elegante-clasica-v3',
  name: 'Elegante Clásica — Vintage',
  family: 'elegante-clasica',
  variant: 'v3',
  palette: {
    primary: '#7A5C3E',
    secondary: '#EDE0C8',
    bg: '#F7EFDD',
    text: '#3A2F22',
    accent: '#B8935A',
  },
  fonts: {
    heading: 'var(--font-great-vibes), cursive',
    body: 'var(--font-cormorant), serif',
  },
  animations: 'typewriter',
  ornaments: 'vintage-borders',
  cssVars: {
    '--theme-primary': '#7A5C3E',
    '--theme-secondary': '#EDE0C8',
    '--theme-bg': '#F7EFDD',
    '--theme-text': '#3A2F22',
    '--theme-accent': '#B8935A',
    '--theme-font-heading': 'var(--font-great-vibes), cursive',
    '--theme-font-body': 'var(--font-cormorant), serif',
  },
  backgroundClass: 'bg-[#F7EFDD]',
};
