import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Server-side guard to ensure the calling user is authenticated and has superadmin privileges.
 * Uses admin client to check roles so Row Level Security (RLS) policies don't falsely reject superadmins.
 */
export async function verifySuperadmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('No autenticado');
  }

  // Fast path for platform owner
  if (user.email === 'arielgorjonproducciones@gmail.com') {
    return user;
  }

  // Check role in profiles via service role
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'superadmin') {
    throw new Error('Acceso no autorizado: se requiere rol de superadmin');
  }

  return user;
}
