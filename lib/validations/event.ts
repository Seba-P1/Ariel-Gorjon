import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones').optional(),
  event_type: z.enum(['boda', 'cumple15', 'cumpleanos', 'bautismo', 'comunion', 'corporativo', 'otro']),
  event_date: z.string().nullable().optional(),
  location_name: z.string().nullable().optional(),
  location_address: z.string().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  template_id: z.string().uuid().nullable().optional(),
  cover_image_url: z.string().url().nullable().optional(),
  hashtag: z.string().nullable().optional(),
  instagram_handle: z.string().nullable().optional(),
  music_url: z.string().url().nullable().optional(),
  album_enabled: z.boolean().default(true),
  album_manual_approval: z.boolean().default(false),
  album_slide_duration_ms: z.number().min(1500).max(15000).default(3000),
  album_transition: z.enum(['fade', 'slide', 'zoom']).default('fade'),
  album_show_captions: z.boolean().default(true),
  album_watermark_url: z.string().url().nullable().optional(),
  album_retention_days: z.number().min(7).max(365).default(90),
});

export type EventFormData = z.infer<typeof eventSchema>;
