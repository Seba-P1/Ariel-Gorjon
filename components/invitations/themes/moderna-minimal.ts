import { InvitationTheme } from '@/types/domain';

export const modernaMinimalV1: InvitationTheme = {
  slug: 'moderna-minimal-v1',
  name: 'Moderna Minimal — Blanco Puro',
  family: 'moderna-minimal',
  variant: 'v1',
  palette: {
    primary: '#0F172A',
    secondary: '#F8FAFC',
    bg: '#FFFFFF',
    text: '#0F172A',
    accent: '#475569',
  },
  fonts: {
    heading: 'var(--font-montserrat), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'slide-up',
  ornaments: 'clean-lines',
  cssVars: {
    '--theme-primary': '#0F172A',
    '--theme-secondary': '#F8FAFC',
    '--theme-bg': '#FFFFFF',
    '--theme-text': '#0F172A',
    '--theme-accent': '#475569',
    '--theme-font-heading': 'var(--font-montserrat), sans-serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-white',
};

export const modernaMinimalV2: InvitationTheme = {
  slug: 'moderna-minimal-v2',
  name: 'Moderna Minimal — Verde Salvia',
  family: 'moderna-minimal',
  variant: 'v2',
  palette: {
    primary: '#4A6B53',
    secondary: '#F0F4EE',
    bg: '#FBFDF9',
    text: '#1C2E21',
    accent: '#8DA68B',
  },
  fonts: {
    heading: 'var(--font-fraunces), serif',
    body: 'var(--font-nunito), sans-serif',
  },
  animations: 'fade-up',
  ornaments: 'soft-shapes',
  cssVars: {
    '--theme-primary': '#4A6B53',
    '--theme-secondary': '#F0F4EE',
    '--theme-bg': '#FBFDF9',
    '--theme-text': '#1C2E21',
    '--theme-accent': '#8DA68B',
    '--theme-font-heading': 'var(--font-fraunces), serif',
    '--theme-font-body': 'var(--font-nunito), sans-serif',
  },
  backgroundClass: 'bg-[#FBFDF9]',
};

export const modernaMinimalV3: InvitationTheme = {
  slug: 'moderna-minimal-v3',
  name: 'Moderna Minimal — Editorial Noir',
  family: 'moderna-minimal',
  variant: 'v3',
  palette: {
    primary: '#000000',
    secondary: '#F4F4F5',
    bg: '#FAFAFA',
    text: '#09090B',
    accent: '#E11D48',
  },
  fonts: {
    heading: 'var(--font-bebas-neue), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'reveal',
  ornaments: 'editorial-lines',
  cssVars: {
    '--theme-primary': '#000000',
    '--theme-secondary': '#F4F4F5',
    '--theme-bg': '#FAFAFA',
    '--theme-text': '#09090B',
    '--theme-accent': '#E11D48',
    '--theme-font-heading': 'var(--font-bebas-neue), sans-serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-[#FAFAFA]',
};
