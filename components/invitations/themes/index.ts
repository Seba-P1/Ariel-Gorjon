import { InvitationTheme } from '@/types/domain';
import { eleganteClasicaV1, eleganteClasicaV2, eleganteClasicaV3 } from './elegante-clasica';
import { modernaMinimalV1, modernaMinimalV2, modernaMinimalV3 } from './moderna-minimal';
import { floralRomanticaV1, floralRomanticaV2, floralRomanticaV3 } from './floral-romantica';
import { glamourDoradaV1, glamourDoradaV2, glamourDoradaV3 } from './glamour-dorada';
import { neonFiestaV1, neonFiestaV2, neonFiestaV3 } from './neon-fiesta';
import { rusticaBohoV1, rusticaBohoV2, rusticaBohoV3 } from './rustica-boho';

export const INVITATION_THEMES: Record<string, InvitationTheme> = {
  'elegante-clasica-v1': eleganteClasicaV1,
  'elegante-clasica-v2': eleganteClasicaV2,
  'elegante-clasica-v3': eleganteClasicaV3,

  'moderna-minimal-v1': modernaMinimalV1,
  'moderna-minimal-v2': modernaMinimalV2,
  'moderna-minimal-v3': modernaMinimalV3,

  'floral-romantica-v1': floralRomanticaV1,
  'floral-romantica-v2': floralRomanticaV2,
  'floral-romantica-v3': floralRomanticaV3,

  'glamour-dorada-v1': glamourDoradaV1,
  'glamour-dorada-v2': glamourDoradaV2,
  'glamour-dorada-v3': glamourDoradaV3,

  'neon-fiesta-v1': neonFiestaV1,
  'neon-fiesta-v2': neonFiestaV2,
  'neon-fiesta-v3': neonFiestaV3,

  'rustica-boho-v1': rusticaBohoV1,
  'rustica-boho-v2': rusticaBohoV2,
  'rustica-boho-v3': rusticaBohoV3,
};

export const DEFAULT_THEME = eleganteClasicaV1;

/**
 * Resolves an InvitationTheme given a template slug and event custom theme overrides.
 */
export function resolveTheme(
  templateSlug?: string | null,
  themeConfig?: Record<string, any> | null
): InvitationTheme {
  const baseTheme = (templateSlug && INVITATION_THEMES[templateSlug]) || DEFAULT_THEME;

  if (!themeConfig || Object.keys(themeConfig).length === 0) {
    return baseTheme;
  }

  const mergedPalette = {
    ...baseTheme.palette,
    ...(themeConfig.palette || {}),
  };

  const mergedFonts = {
    ...baseTheme.fonts,
    ...(themeConfig.fonts || {}),
  };

  const cssVars: Record<string, string> = {
    ...baseTheme.cssVars,
    '--theme-primary': mergedPalette.primary,
    '--theme-secondary': mergedPalette.secondary,
    '--theme-bg': mergedPalette.bg,
    '--theme-text': mergedPalette.text,
    '--theme-accent': mergedPalette.accent,
  };

  return {
    ...baseTheme,
    palette: mergedPalette,
    fonts: mergedFonts,
    animations: themeConfig.animations || baseTheme.animations,
    ornaments: themeConfig.ornaments || baseTheme.ornaments,
    cssVars,
  };
}
