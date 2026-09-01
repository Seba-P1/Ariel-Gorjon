import { InvitationTheme } from '@/types/domain';

export const eleganteClasicaV1: InvitationTheme = {
  slug: 'elegante-clasica-v1',
  name: 'Elegante Clásica — Marfil & Oro',
  family: 'elegante-clasica',
  variant: 'v1',
  palette: {
    primary: '#C5A059',
    secondary: '#F8F4EC',
    bg: '#FFFDF9',
    text: '#2C2216',
    accent: '#8C6D37',
  },
  fonts: {
    heading: 'var(--font-cormorant), serif',
    body: 'var(--font-lato), sans-serif',
  },
  animations: 'fade-up',
  ornaments: 'classic-frames',
  cssVars: {
    '--theme-primary': '#C5A059',
    '--theme-secondary': '#F8F4EC',
    '--theme-bg': '#FFFDF9',
    '--theme-text': '#2C2216',
    '--theme-accent': '#8C6D37',
    '--theme-font-heading': 'var(--font-cormorant), serif',
    '--theme-font-body': 'var(--font-lato), sans-serif',
  },
  backgroundClass: 'bg-[#FFFDF9]',
};

export const eleganteClasicaV2: InvitationTheme = {
  slug: 'elegante-clasica-v2',
  name: 'Elegante Clásica — Black & Gold Gala',
  family: 'elegante-clasica',
  variant: 'v2',
  palette: {
    primary: '#D4AF37',
    secondary: '#171717',
    bg: '#080808',
    text: '#FAF6F0',
    accent: '#F3E5AB',
  },
  fonts: {
    heading: 'var(--font-playfair), serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'fade',
  ornaments: 'gold-lines',
  cssVars: {
    '--theme-primary': '#D4AF37',
    '--theme-secondary': '#171717',
    '--theme-bg': '#080808',
    '--theme-text': '#FAF6F0',
    '--theme-accent': '#F3E5AB',
    '--theme-font-heading': 'var(--font-playfair), serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-[#080808]',
};

export const eleganteClasicaV3: InvitationTheme = {
  slug: 'elegante-clasica-v3',
  name: 'Elegante Clásica — Manuscrito Royal',
  family: 'elegante-clasica',
  variant: 'v3',
  palette: {
    primary: '#8A5A36',
    secondary: '#F1E5D1',
    bg: '#FAF4E8',
    text: '#342214',
    accent: '#C59B27',
  },
  fonts: {
    heading: 'var(--font-great-vibes), cursive',
    body: 'var(--font-lora), serif',
  },
  animations: 'typewriter',
  ornaments: 'vintage-borders',
  cssVars: {
    '--theme-primary': '#8A5A36',
    '--theme-secondary': '#F1E5D1',
    '--theme-bg': '#FAF4E8',
    '--theme-text': '#342214',
    '--theme-accent': '#C59B27',
    '--theme-font-heading': 'var(--font-great-vibes), cursive',
    '--theme-font-body': 'var(--font-lora), serif',
  },
  backgroundClass: 'bg-[#FAF4E8]',
};
