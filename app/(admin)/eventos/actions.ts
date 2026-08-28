'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifySuperadmin } from '@/lib/supabase/auth-guard';
import { EventType } from '@/types/database';

const createEventSchema = z.object({
  title: z.string().min(2, 'El título debe tener al menos 2 caracteres'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones'),
  event_type: z.enum(['boda', 'cumple15', 'cumpleanos', 'bautismo', 'comunion', 'corporativo', 'otro']).default('boda'),
  template_id: z.string().uuid().nullable().optional(),
  client_id: z.string().uuid().nullable().optional(),
  event_date: z.string().optional(),
  location_name: z.string().optional(),
  location_address: z.string().optional(),
  hashtag: z.string().optional(),
  instagram_handle: z.string().optional(),
});

export async function createEvent(input: {
  title: string;
  slug: string;
  event_type?: string;
  template_id?: string | null;
  client_id?: string | null;
  event_date?: string;
  location_name?: string;
  location_address?: string;
  hashtag?: string;
  instagram_handle?: string;
}) {
  await verifySuperadmin();

  let mappedType: EventType = 'boda';
  if (input.event_type === 'xv' || input.event_type === 'cumple15') mappedType = 'cumple15';
  else if (input.event_type === 'cumpleanos') mappedType = 'cumpleanos';
  else if (input.event_type === 'bautismo') mappedType = 'bautismo';
  else if (input.event_type === 'comunion') mappedType = 'comunion';
  else if (input.event_type === 'corporativo') mappedType = 'corporativo';
  else if (input.event_type === 'otro') mappedType = 'otro';

  const result = createEventSchema.safeParse({
    ...input,
    event_type: mappedType,
  });

  if (!result.success) {
    return { ok: false, error: 'Datos de evento inválidos' };
  }

  const admin = createAdminClient();

  // Check unique slug
  const { data: existing } = await admin
    .from('events')
    .select('id')
    .eq('slug', result.data.slug)
    .single();

  if (existing) {
    return { ok: false, error: 'Ya existe un evento con este slug o link' };
  }

  const { data, error } = await admin
    .from('events')
    .insert({
      title: result.data.title,
      slug: result.data.slug,
      event_type: mappedType,
      template_id: result.data.template_id || null,
      client_id: result.data.client_id || null,
      event_date: result.data.event_date ? new Date(result.data.event_date).toISOString() : null,
      location_name: result.data.location_name || null,
      location_address: result.data.location_address || null,
      hashtag: result.data.hashtag || null,
      instagram_handle: result.data.instagram_handle || null,
      status: 'active',
      theme_config: {},
      sections_config: [
        'hero',
        'countdown',
        'event-details',
        'location',
        'dress-code',
        'photo-album',
        'rsvp',
        'gifts',
        'live-album-qr',
        'music',
      ],
    })
    .select()
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || 'Error al insertar evento' };
  }

  revalidatePath('/eventos');
  revalidatePath('/dashboard');
  return { ok: true, event: data };
}

export async function deleteEvent(eventId: string) {
  await verifySuperadmin();
  const admin = createAdminClient();

  const { error } = await admin.from('events').delete().eq('id', eventId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/eventos');
  revalidatePath('/dashboard');
  return { ok: true };
}
