import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { Database, Tables } from '@/types/database';
import { createAdminClient } from '@/lib/supabase/admin';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only admin dashboard and administrative management routes are protected
  const protectedPaths = [
    '/admin',
    '/dashboard',
    '/eventos',
    '/clientes',
    '/configuracion',
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  );

  if (isProtectedPath) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', request.nextUrl.pathname === '/admin' ? '/dashboard' : request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Fast track superadmin by email
    let isSuperadmin = user.email === 'arielgorjonproducciones@gmail.com';

    if (!isSuperadmin) {
      try {
        const admin = createAdminClient();
        const { data } = await admin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const profile = data as Pick<Tables<'profiles'>, 'role'> | null;
        if (profile?.role === 'superadmin') {
          isSuperadmin = true;
        }
      } catch (err) {
        console.error('Middleware profile lookup error:', err);
      }
    }

    if (!isSuperadmin) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated superadmin away from login
  if (request.nextUrl.pathname === '/login' && user) {
    let isSuperadmin = user.email === 'arielgorjonproducciones@gmail.com';

    if (!isSuperadmin) {
      try {
        const admin = createAdminClient();
        const { data } = await admin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        const profile = data as Pick<Tables<'profiles'>, 'role'> | null;
        if (profile?.role === 'superadmin') {
          isSuperadmin = true;
        }
      } catch (err) {
        console.error('Middleware login redirect error:', err);
      }
    }

    if (isSuperadmin) {
      const next = request.nextUrl.searchParams.get('next') || '/dashboard';
      const url = request.nextUrl.clone();
      url.pathname = next.startsWith('/') ? next : '/dashboard';
      url.searchParams.delete('next');
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
