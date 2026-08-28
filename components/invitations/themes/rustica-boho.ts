import { InvitationTheme } from '@/types/domain';

export const rusticaBohoV1: InvitationTheme = {
  slug: 'rustica-boho-v1',
  name: 'Rústica Boho — Kraft',
  family: 'rustica-boho',
  variant: 'v1',
  palette: {
    primary: '#8B6B3D',
    secondary: '#E8D5B7',
    bg: '#F5EBD6',
    text: '#3A2712',
    accent: '#B48A5C',
  },
  fonts: {
    heading: 'var(--font-amatic-sc), cursive',
    body: 'var(--font-merriweather), serif',
  },
  animations: 'fade',
  ornaments: 'kraft-texture',
  cssVars: {
    '--theme-primary': '#8B6B3D',
    '--theme-secondary': '#E8D5B7',
    '--theme-bg': '#F5EBD6',
    '--theme-text': '#3A2712',
    '--theme-accent': '#B48A5C',
    '--theme-font-heading': 'var(--font-amatic-sc), cursive',
    '--theme-font-body': 'var(--font-merriweather), serif',
  },
  backgroundClass: 'bg-[#F5EBD6]',
};

export const rusticaBohoV2: InvitationTheme = {
  slug: 'rustica-boho-v2',
  name: 'Rústica Boho — Terracota',
  family: 'rustica-boho',
  variant: 'v2',
  palette: {
    primary: '#C97B5A',
    secondary: '#F3E1D0',
    bg: '#FDF6EE',
    text: '#4A2A1A',
    accent: '#8B5A3C',
  },
  fonts: {
    heading: 'var(--font-playfair), serif',
    body: 'var(--font-lora), serif',
  },
  animations: 'fade-up',
  ornaments: 'pampas',
  cssVars: {
    '--theme-primary': '#C97B5A',
    '--theme-secondary': '#F3E1D0',
    '--theme-bg': '#FDF6EE',
    '--theme-text': '#4A2A1A',
    '--theme-accent': '#8B5A3C',
    '--theme-font-heading': 'var(--font-playfair), serif',
    '--theme-font-body': 'var(--font-lora), serif',
  },
  backgroundClass: 'bg-[#FDF6EE]',
};

export const rusticaBohoV3: InvitationTheme = {
  slug: 'rustica-boho-v3',
  name: 'Rústica Boho — Desert',
  family: 'rustica-boho',
  variant: 'v3',
  palette: {
    primary: '#D97757',
    secondary: '#F5D3B0',
    bg: '#FEF3E2',
    text: '#3E2418',
    accent: '#8AA26F',
  },
  fonts: {
    heading: 'var(--font-fraunces), serif',
    body: 'var(--font-nunito), sans-serif',
  },
  animations: 'sun-rise',
  ornaments: 'cactus',
  cssVars: {
    '--theme-primary': '#D97757',
    '--theme-secondary': '#F5D3B0',
    '--theme-bg': '#FEF3E2',
    '--theme-text': '#3E2418',
    '--theme-accent': '#8AA26F',
    '--theme-font-heading': 'var(--font-fraunces), serif',
    '--theme-font-body': 'var(--font-nunito), sans-serif',
  },
  backgroundClass: 'bg-[#FEF3E2]',
};
