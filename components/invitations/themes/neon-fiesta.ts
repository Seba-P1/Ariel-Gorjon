import { InvitationTheme } from '@/types/domain';

export const neonFiestaV1: InvitationTheme = {
  slug: 'neon-fiesta-v1',
  name: 'Neón Fiesta — Cyber Violet',
  family: 'neon-fiesta',
  variant: 'v1',
  palette: {
    primary: '#A855F7',
    secondary: '#06B6D4',
    bg: '#090514',
    text: '#F8FAFC',
    accent: '#EC4899',
  },
  fonts: {
    heading: 'var(--font-orbitron), sans-serif',
    body: 'var(--font-rajdhani), sans-serif',
  },
  animations: 'glow',
  ornaments: 'neon-lines',
  cssVars: {
    '--theme-primary': '#A855F7',
    '--theme-secondary': '#06B6D4',
    '--theme-bg': '#090514',
    '--theme-text': '#F8FAFC',
    '--theme-accent': '#EC4899',
    '--theme-font-heading': 'var(--font-orbitron), sans-serif',
    '--theme-font-body': 'var(--font-rajdhani), sans-serif',
  },
  backgroundClass: 'bg-[#090514]',
};

export const neonFiestaV2: InvitationTheme = {
  slug: 'neon-fiesta-v2',
  name: 'Neón Fiesta — Synthwave 80s',
  family: 'neon-fiesta',
  variant: 'v2',
  palette: {
    primary: '#F43F5E',
    secondary: '#8B5CF6',
    bg: '#12072B',
    text: '#FFF1F2',
    accent: '#38BDF8',
  },
  fonts: {
    heading: 'var(--font-bebas-neue), sans-serif',
    body: 'var(--font-rajdhani), sans-serif',
  },
  animations: 'scanlines',
  ornaments: 'retro-grid',
  cssVars: {
    '--theme-primary': '#F43F5E',
    '--theme-secondary': '#8B5CF6',
    '--theme-bg': '#12072B',
    '--theme-text': '#FFF1F2',
    '--theme-accent': '#38BDF8',
    '--theme-font-heading': 'var(--font-bebas-neue), sans-serif',
    '--theme-font-body': 'var(--font-rajdhani), sans-serif',
  },
  backgroundClass: 'bg-[#12072B]',
};

export const neonFiestaV3: InvitationTheme = {
  slug: 'neon-fiesta-v3',
  name: 'Neón Fiesta — Electric Gold & Noir',
  family: 'neon-fiesta',
  variant: 'v3',
  palette: {
    primary: '#FACC15',
    secondary: '#18181B',
    bg: '#050505',
    text: '#FFFFFF',
    accent: '#38BDF8',
  },
  fonts: {
    heading: 'var(--font-orbitron), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'flicker',
  ornaments: 'neon-tubes',
  cssVars: {
    '--theme-primary': '#FACC15',
    '--theme-secondary': '#18181B',
    '--theme-bg': '#050505',
    '--theme-text': '#FFFFFF',
    '--theme-accent': '#38BDF8',
    '--theme-font-heading': 'var(--font-orbitron), sans-serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-[#050505]',
};
