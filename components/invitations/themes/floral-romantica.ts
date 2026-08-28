import { InvitationTheme } from '@/types/domain';

export const floralRomanticaV1: InvitationTheme = {
  slug: 'floral-romantica-v1',
  name: 'Floral Romántica — Rosa',
  family: 'floral-romantica',
  variant: 'v1',
  palette: {
    primary: '#D48CA0',
    secondary: '#FDECEE',
    bg: '#FFF7F8',
    text: '#4B2C36',
    accent: '#C6708B',
  },
  fonts: {
    heading: 'var(--font-parisienne), cursive',
    body: 'var(--font-lato), sans-serif',
  },
  animations: 'petals',
  ornaments: 'watercolor-flowers',
  cssVars: {
    '--theme-primary': '#D48CA0',
    '--theme-secondary': '#FDECEE',
    '--theme-bg': '#FFF7F8',
    '--theme-text': '#4B2C36',
    '--theme-accent': '#C6708B',
    '--theme-font-heading': 'var(--font-parisienne), cursive',
    '--theme-font-body': 'var(--font-lato), sans-serif',
  },
  backgroundClass: 'bg-[#FFF7F8]',
};

export const floralRomanticaV2: InvitationTheme = {
  slug: 'floral-romantica-v2',
  name: 'Floral Romántica — Botánica',
  family: 'floral-romantica',
  variant: 'v2',
  palette: {
    primary: '#6A8A6D',
    secondary: '#EDF2E9',
    bg: '#F8FAF5',
    text: '#2E3D2F',
    accent: '#B0C5A1',
  },
  fonts: {
    heading: 'var(--font-cormorant), serif',
    body: 'var(--font-lato), sans-serif',
  },
  animations: 'leaves',
  ornaments: 'botanical',
  cssVars: {
    '--theme-primary': '#6A8A6D',
    '--theme-secondary': '#EDF2E9',
    '--theme-bg': '#F8FAF5',
    '--theme-text': '#2E3D2F',
    '--theme-accent': '#B0C5A1',
    '--theme-font-heading': 'var(--font-cormorant), serif',
    '--theme-font-body': 'var(--font-lato), sans-serif',
  },
  backgroundClass: 'bg-[#F8FAF5]',
};

export const floralRomanticaV3: InvitationTheme = {
  slug: 'floral-romantica-v3',
  name: 'Floral Romántica — Dusty Blue',
  family: 'floral-romantica',
  variant: 'v3',
  palette: {
    primary: '#7C9CB3',
    secondary: '#EAF1F5',
    bg: '#F6FAFB',
    text: '#25384A',
    accent: '#B4C8D6',
  },
  fonts: {
    heading: 'var(--font-playfair), serif',
    body: 'var(--font-nunito), sans-serif',
  },
  animations: 'fade',
  ornaments: 'floral-corners',
  cssVars: {
    '--theme-primary': '#7C9CB3',
    '--theme-secondary': '#EAF1F5',
    '--theme-bg': '#F6FAFB',
    '--theme-text': '#25384A',
    '--theme-accent': '#B4C8D6',
    '--theme-font-heading': 'var(--font-playfair), serif',
    '--theme-font-body': 'var(--font-nunito), sans-serif',
  },
  backgroundClass: 'bg-[#F6FAFB]',
};
