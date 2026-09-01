import * as React from 'react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSiteConfig } from '@/lib/site-config';
import { SiteConfigManager } from '@/components/admin/SiteConfigManager';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const siteConfig = await getSiteConfig();

  return (
    <div className="space-y-8">
      <SiteConfigManager initialConfig={siteConfig} />
    </div>
  );
}
