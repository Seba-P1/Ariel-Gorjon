import * as React from 'react';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { Tables } from '@/types/database';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let profile: Tables<'profiles'> | null = null;
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profile = data;
  } catch (e) {
    console.error('Error fetching admin profile:', e);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col md:flex-row antialiased">
      {/* Sidebar */}
      <AdminSidebar userEmail={user.email || ''} profile={profile} />

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto min-w-0">
        <div className="max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
