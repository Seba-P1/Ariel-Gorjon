'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifySuperadmin } from '@/lib/supabase/auth-guard';
import crypto from 'crypto';

// 1. Create Guest
const createGuestSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  slots: z.number().int().min(1).max(20).default(1),
});

export async function createGuest(eventId: string, input: z.infer<typeof createGuestSchema>) {
  await verifySuperadmin();
  const result = createGuestSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, error: 'Datos inválidos' };
  }

  const personalSlug = crypto.randomBytes(4).toString('hex'); // 8 hex chars
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('guests')
    .insert({
      event_id: eventId,
      full_name: result.data.full_name.trim(),
      slots: result.data.slots,
      personal_slug: personalSlug,
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/eventos/${eventId}/invitados`);
  revalidatePath(`/eventos/${eventId}/rsvp`);
  return { ok: true, data };
}

// 2. Bulk Create Guests
export async function bulkCreateGuests(eventId: string, rawText: string) {
  await verifySuperadmin();

  if (!rawText || !rawText.trim()) {
    return { ok: false, error: 'La lista de invitados está vacía' };
  }

  const lines = rawText.split('\n');
  const guestsToInsert: {
    event_id: string;
    full_name: string;
    slots: number;
    personal_slug: string;
  }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Supports: "Familia Perez, 4" or "Juan Gomez; 2" or "Maria Lopez" (default 1)
    const parts = trimmed.split(/[,;\t]/);
    const fullName = parts[0]?.trim();
    let slots = 1;

    if (parts.length > 1) {
      const parsedSlots = parseInt(parts[1]?.trim(), 10);
      if (!isNaN(parsedSlots) && parsedSlots >= 1) {
        slots = Math.min(parsedSlots, 20);
      }
    }

    if (fullName && fullName.length >= 2) {
      guestsToInsert.push({
        event_id: eventId,
        full_name: fullName,
        slots,
        personal_slug: crypto.randomBytes(4).toString('hex'),
      });
    }
  }

  if (guestsToInsert.length === 0) {
    return { ok: false, error: 'No se encontraron registros válidos para importar' };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('guests')
    .insert(guestsToInsert)
    .select();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/eventos/${eventId}/invitados`);
  return { ok: true, count: data.length };
}

// 3. Delete Guest
export async function deleteGuest(guestId: string, eventId: string) {
  await verifySuperadmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from('guests')
    .delete()
    .eq('id', guestId)
    .eq('event_id', eventId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/eventos/${eventId}/invitados`);
  return { ok: true };
}

// 4. Update RSVP
const updateRsvpSchema = z.object({
  full_name: z.string().min(2).optional(),
  email: z.string().email().nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional().or(z.literal('')),
  attendees_count: z.number().int().min(1).max(20).optional(),
  status: z.enum(['pending', 'confirmed', 'declined']).optional(),
  dietary_notes: z.string().nullable().optional(),
  song_request: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
});

export async function updateRsvp(
  rsvpId: string,
  eventId: string,
  input: z.infer<typeof updateRsvpSchema>
) {
  await verifySuperadmin();
  const result = updateRsvpSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, error: 'Datos inválidos' };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('rsvps')
    .update(result.data)
    .eq('id', rsvpId)
    .eq('event_id', eventId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/eventos/${eventId}/rsvp`);
  return { ok: true };
}

// 5. Delete RSVP
export async function deleteRsvp(rsvpId: string, eventId: string) {
  await verifySuperadmin();
  const admin = createAdminClient();

  const { error } = await admin
    .from('rsvps')
    .delete()
    .eq('id', rsvpId)
    .eq('event_id', eventId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/eventos/${eventId}/rsvp`);
  return { ok: true };
}
