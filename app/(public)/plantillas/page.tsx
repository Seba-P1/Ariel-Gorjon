import * as React from 'react';
import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { PublicTemplatesCatalog } from '@/components/templates/PublicTemplatesCatalog';

export const metadata: Metadata = {
  title: 'Catálogo de 18 Plantillas de Invitaciones Digitales — Ariel Producciones',
  description:
    'Explorá nuestras 18 plantillas de invitaciones digitales interactivas en 6 familias de diseño: Elegante Clásica, Moderna Minimal, Floral Romántica, Glamour Dorada, Neón Fiesta y Rústica Boho.',
};

export default async function PublicPlantillasPage() {
  const admin = createAdminClient();

  const { data: templates } = await admin
    .from('templates')
    .select('*')
    .eq('is_active', true)
    .order('family', { ascending: true });

  return <PublicTemplatesCatalog initialTemplates={templates || []} />;
}
