import * as React from 'react';
import { createAdminClient } from '@/lib/supabase/admin';
import { ClientsManager } from '@/components/admin/ClientsManager';

export default async function ClientsAdminPage() {
  const admin = createAdminClient();

  const { data: clients } = await admin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">
          Directorio de Clientes
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Gestioná la cartera de clientes y anfitriones de Ariel Producciones.
        </p>
      </div>

      <ClientsManager initialClients={clients || []} />
    </div>
  );
}
