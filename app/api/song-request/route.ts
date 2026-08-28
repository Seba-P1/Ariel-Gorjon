import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const songRequestSchema = z.object({
  event_id: z.string().uuid(),
  song_title: z.string().min(1).max(200),
  artist: z.string().max(200).nullable().optional(),
  requester: z.string().max(100).nullable().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = songRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: result.error.format() },
        { status: 400 }
      );
    }

    const { event_id, song_title, artist, requester } = result.data;
    const supabase = createAdminClient();

    // Verify active event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('id, status')
      .eq('id', event_id)
      .single();

    if (eventError || !event || event.status !== 'active') {
      return NextResponse.json(
        { error: 'El evento no existe o no está activo.' },
        { status: 404 }
      );
    }

    const { error: insertError } = await supabase.from('song_requests').insert({
      event_id,
      song_title,
      artist: artist || null,
      requester: requester || null,
    });

    if (insertError) {
      return NextResponse.json(
        { error: 'Error al registrar la canción: ' + insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
