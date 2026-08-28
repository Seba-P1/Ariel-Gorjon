'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';
import { verifySuperadmin } from '@/lib/supabase/auth-guard';

const createClientSchema = z.object({
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

export async function createClientRecord(input: z.infer<typeof createClientSchema>) {
  await verifySuperadmin();
  const result = createClientSchema.safeParse(input);

  if (!result.success) {
    return { ok: false, error: 'Datos inválidos' };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('clients')
    .insert({
      full_name: result.data.full_name,
      email: result.data.email,
      phone: result.data.phone || null,
      notes: result.data.notes || null,
    })
    .select()
    .single();

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/clientes');
  return { ok: true, client: data };
}

export async function deleteClientRecord(clientId: string) {
  await verifySuperadmin();
  const admin = createAdminClient();
  const { error } = await admin.from('clients').delete().eq('id', clientId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath('/clientes');
  return { ok: true };
}
