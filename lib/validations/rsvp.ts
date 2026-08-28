import { z } from 'zod';

export const rsvpSchema = z.object({
  event_id: z.string().uuid(),
  guest_id: z.string().uuid().nullable().optional(),
  full_name: z.string().min(2, 'Por favor ingresá tu nombre completo'),
  email: z.string().email('Ingresá un email válido').optional().or(z.literal('')),
  phone: z.string().min(6, 'Ingresá un teléfono válido').optional().or(z.literal('')),
  attendees_count: z.number().int().min(1).max(20).default(1),
  status: z.enum(['pending', 'confirmed', 'declined']).default('confirmed'),
  dietary_notes: z.string().max(500).optional().or(z.literal('')),
  song_request: z.string().max(200).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
});

export type RsvpFormData = z.infer<typeof rsvpSchema>;
