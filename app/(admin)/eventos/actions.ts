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

export async function updateEvent(eventId: string, input: Record<string, any>) {
  await verifySuperadmin();
  const admin = createAdminClient();

  // Clean payload
  const updateData: Record<string, any> = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.event_type !== undefined) updateData.event_type = input.event_type;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.template_id !== undefined) updateData.template_id = input.template_id || null;
  if (input.client_id !== undefined) updateData.client_id = input.client_id || null;
  if (input.event_date !== undefined) updateData.event_date = input.event_date ? new Date(input.event_date).toISOString() : null;
  if (input.location_name !== undefined) updateData.location_name = input.location_name || null;
  if (input.location_address !== undefined) updateData.location_address = input.location_address || null;
  if (input.location_lat !== undefined) updateData.location_lat = input.location_lat ? parseFloat(input.location_lat) : null;
  if (input.location_lng !== undefined) updateData.location_lng = input.location_lng ? parseFloat(input.location_lng) : null;
  if (input.cover_image_url !== undefined) updateData.cover_image_url = input.cover_image_url || null;
  if (input.music_url !== undefined) updateData.music_url = input.music_url || null;
  if (input.hashtag !== undefined) updateData.hashtag = input.hashtag || null;
  if (input.instagram_handle !== undefined) updateData.instagram_handle = input.instagram_handle || null;
  if (input.theme_config !== undefined) updateData.theme_config = input.theme_config;
  if (input.sections_config !== undefined) updateData.sections_config = input.sections_config;
  if (input.album_enabled !== undefined) updateData.album_enabled = Boolean(input.album_enabled);
  if (input.album_manual_approval !== undefined) updateData.album_manual_approval = Boolean(input.album_manual_approval);
  if (input.album_slide_duration_ms !== undefined) updateData.album_slide_duration_ms = Number(input.album_slide_duration_ms);
  if (input.album_transition !== undefined) updateData.album_transition = input.album_transition;
  if (input.album_show_captions !== undefined) updateData.album_show_captions = Boolean(input.album_show_captions);
  if (input.album_watermark_url !== undefined) updateData.album_watermark_url = input.album_watermark_url || null;

  updateData.updated_at = new Date().toISOString();

  const { data, error } = await admin
    .from('events')
    .update(updateData as any)
    .eq('id', eventId)
    .select()
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message || 'Error al actualizar evento' };
  }

  revalidatePath(`/eventos/${eventId}`);
  revalidatePath('/eventos');
  revalidatePath('/dashboard');
  if (data.slug) {
    revalidatePath(`/invitacion/${data.slug}`);
    revalidatePath(`/album/${data.slug}`);
    revalidatePath(`/pantalla/${data.slug}`);
  }

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
