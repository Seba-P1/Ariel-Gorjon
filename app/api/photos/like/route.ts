import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { photo_id } = await request.json();

    if (!photo_id) {
      return NextResponse.json({ error: 'Falta photo_id' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: photo, error: fetchError } = await supabase
      .from('photos')
      .select('id')
      .eq('id', photo_id)
      .single();

    if (fetchError || !photo) {
      return NextResponse.json({ error: 'Foto no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, photo_id });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
