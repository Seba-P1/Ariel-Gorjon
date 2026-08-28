import { NextRequest, NextResponse } from 'next/server';
import { rsvpSchema } from '@/lib/validations/rsvp';
import { createAdminClient } from '@/lib/supabase/admin';
import { LIMITS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = rsvpSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Datos de formulario inválidos', details: result.error.format() },
        { status: 400 }
      );
    }

    const {
      event_id,
      guest_id,
      full_name,
      email,
      phone,
      attendees_count,
      status,
      dietary_notes,
      song_request,
      message,
    } = result.data;

    const supabaseAdmin = createAdminClient();

    // 1. Verify Event exists and is active
    const { data: event, error: eventError } = await supabaseAdmin
      .from('events')
      .select('id, status')
      .eq('id', event_id)
      .single();

    if (eventError || !event || event.status !== 'active') {
      return NextResponse.json(
        { error: 'El evento no existe o no se encuentra activo.' },
        { status: 404 }
      );
    }

    // 2. IP Rate Limiting check
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const rateKey = `rsvp:${event_id}:${ip}`;
    const { data: isAllowed, error: rateError } = await supabaseAdmin.rpc(
      'check_rate_limit',
      {
        p_key: rateKey,
        p_max: LIMITS.RSVP_RATE_LIMIT_PER_HOUR,
        p_window_seconds: 3600,
      }
    );

    if (rateError) {
      console.warn('Rate limit RPC error:', rateError.message);
    } else if (isAllowed === false) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de confirmaciones por hora. Por favor intentá más tarde.' },
        { status: 429 }
      );
    }

    // 3. Optional: Check guest slots limit if guest_id is provided
    if (guest_id) {
      const { data: guest } = await supabaseAdmin
        .from('guests')
        .select('slots')
        .eq('id', guest_id)
        .eq('event_id', event_id)
        .single();

      if (guest && attendees_count > guest.slots) {
        return NextResponse.json(
          { error: `El número máximo de acompañantes permitidos para tu invitación es ${guest.slots}.` },
          { status: 400 }
        );
      }
    }

    // 4. Insert RSVP record
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const { data: insertedRsvp, error: insertError } = await supabaseAdmin
      .from('rsvps')
      .insert({
        event_id,
        guest_id: guest_id || null,
        full_name,
        email: email || null,
        phone: phone || null,
        attendees_count,
        status,
        dietary_notes: dietary_notes || null,
        song_request: song_request || null,
        message: message || null,
        user_agent: userAgent,
      })
      .select('id')
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: 'Error al registrar la confirmación: ' + insertError.message },
        { status: 500 }
      );
    }

    // 5. If song_request is provided, also insert into song_requests
    if (song_request && song_request.trim()) {
      await supabaseAdmin.from('song_requests').insert({
        event_id,
        requester: full_name,
        song_title: song_request.trim(),
      });
    }

    return NextResponse.json({ ok: true, id: insertedRsvp.id }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
