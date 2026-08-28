import { InvitationTheme } from '@/types/domain';

export const neonFiestaV1: InvitationTheme = {
  slug: 'neon-fiesta-v1',
  name: 'Neon — Cyber',
  family: 'neon-fiesta',
  variant: 'v1',
  palette: {
    primary: '#8B5CF6',
    secondary: '#22D3EE',
    bg: '#0B0F1A',
    text: '#F0F6FC',
    accent: '#F472B6',
  },
  fonts: {
    heading: 'var(--font-orbitron), sans-serif',
    body: 'var(--font-rajdhani), sans-serif',
  },
  animations: 'glow',
  ornaments: 'neon-lines',
  cssVars: {
    '--theme-primary': '#8B5CF6',
    '--theme-secondary': '#22D3EE',
    '--theme-bg': '#0B0F1A',
    '--theme-text': '#F0F6FC',
    '--theme-accent': '#F472B6',
    '--theme-font-heading': 'var(--font-orbitron), sans-serif',
    '--theme-font-body': 'var(--font-rajdhani), sans-serif',
  },
  backgroundClass: 'bg-[#0B0F1A]',
};

export const neonFiestaV2: InvitationTheme = {
  slug: 'neon-fiesta-v2',
  name: 'Neon — Retro 80s',
  family: 'neon-fiesta',
  variant: 'v2',
  palette: {
    primary: '#F472B6',
    secondary: '#8B5CF6',
    bg: '#1A0B2E',
    text: '#F0F6FC',
    accent: '#22D3EE',
  },
  fonts: {
    heading: 'var(--font-press-start-2p), monospace',
    body: 'var(--font-vt323), monospace',
  },
  animations: 'scanlines',
  ornaments: 'retro-grid',
  cssVars: {
    '--theme-primary': '#F472B6',
    '--theme-secondary': '#8B5CF6',
    '--theme-bg': '#1A0B2E',
    '--theme-text': '#F0F6FC',
    '--theme-accent': '#22D3EE',
    '--theme-font-heading': 'var(--font-press-start-2p), monospace',
    '--theme-font-body': 'var(--font-vt323), monospace',
  },
  backgroundClass: 'bg-[#1A0B2E]',
};

export const neonFiestaV3: InvitationTheme = {
  slug: 'neon-fiesta-v3',
  name: 'Neon — Neon Blanco',
  family: 'neon-fiesta',
  variant: 'v3',
  palette: {
    primary: '#FFFFFF',
    secondary: '#1F2937',
    bg: '#0A0A0A',
    text: '#FFFFFF',
    accent: '#22D3EE',
  },
  fonts: {
    heading: 'var(--font-bebas-neue), sans-serif',
    body: 'var(--font-inter), sans-serif',
  },
  animations: 'flicker',
  ornaments: 'neon-tubes',
  cssVars: {
    '--theme-primary': '#FFFFFF',
    '--theme-secondary': '#1F2937',
    '--theme-bg': '#0A0A0A',
    '--theme-text': '#FFFFFF',
    '--theme-accent': '#22D3EE',
    '--theme-font-heading': 'var(--font-bebas-neue), sans-serif',
    '--theme-font-body': 'var(--font-inter), sans-serif',
  },
  backgroundClass: 'bg-[#0A0A0A]',
};
