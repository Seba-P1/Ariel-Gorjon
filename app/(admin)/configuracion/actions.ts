'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { SiteConfig, invalidateSiteConfigCache } from '@/lib/site-config';
import { revalidatePath } from 'next/cache';

export async function saveSiteConfig(config: SiteConfig) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, error: 'No autorizado' };
    }

    const admin = createAdminClient();

    // Verify superadmin
    const { data: profile } = await admin
      .from('profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'superadmin') {
      return { ok: false, error: 'Permisos insuficientes' };
    }

    const jsonString = JSON.stringify(config);

    // Upsert a special row in clients table to store site config
    const { data: existing } = await admin
      .from('clients')
      .select('id')
      .eq('full_name', '__SITE_CONFIG__')
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await admin
        .from('clients')
        .update({
          notes: jsonString,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);

      if (updateError) {
        return { ok: false, error: 'Error al guardar: ' + updateError.message };
      }
    } else {
      const { error: insertError } = await admin
        .from('clients')
        .insert({
          full_name: '__SITE_CONFIG__',
          notes: jsonString,
        });

      if (insertError) {
        return { ok: false, error: 'Error al crear configuración: ' + insertError.message };
      }
    }

    invalidateSiteConfigCache();
    revalidatePath('/', 'page');
    revalidatePath('/configuracion', 'page');

    return { ok: true };
  } catch (err: any) {
    console.error('saveSiteConfig error:', err);
    return { ok: false, error: err.message || 'Error inesperado' };
  }
}
